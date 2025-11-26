import { TimeCardSession } from '../timecard-session.js';
import { MCPTool } from './index.js';

// Helper function to convert day name/index to numeric index
function getDayIndex(day: string): number {
  if (/^\d+$/.test(day)) {
    const index = parseInt(day);
    if (index >= 0 && index <= 6) {
      return index;
    }
  }

  const dayMap: Record<string, number> = {
    'monday': 0,
    'tuesday': 1,
    'wednesday': 2,
    'thursday': 3,
    'friday': 4,
    'saturday': 5,
    'sunday': 6
  };

  const dayLower = day.toLowerCase();
  if (dayLower in dayMap) {
    return dayMap[dayLower];
  }

  // Check if it's a YYYY-MM-DD date format
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const date = new Date(day);
    const dayOfWeek = date.getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  throw new Error(`Invalid day format: ${day}. Use monday-saturday, 0-5, or YYYY-MM-DD`);
}

const timecardSetHours: MCPTool = {
  name: 'timecard_set_hours',
  description: `Queue multiple hour records for submission.

This tool QUEUES hour updates in memory without triggering any UI operations. Updates are submitted together when you call timecard_save.

⚠️ CRITICAL WORKFLOW:
1. Navigate to correct week with timecard_get_timesheet (REQUIRED - loads page)
2. Configure ALL entries with timecard_set_entries
3. Queue ALL hour updates with this tool
4. Queue ALL note updates with timecard_set_notes (if needed)
5. Submit everything with timecard_save

Performance benefits:
- NO UI operations (instant queuing)
- Single form POST for all changes

Example usage:
  set_hours([
    { entry_index: 0, day: "monday", hours: 8.0 },
    { entry_index: 0, day: "tuesday", hours: 8.0 },
    { entry_index: 0, day: "wednesday", hours: 8.0 }
  ])
  save()  // Submit all at once

IMPORTANT: This only queues updates. You MUST call timecard_save to actually save changes.`,
  inputSchema: {
    type: 'object',
    properties: {
      updates: {
        type: 'array',
        description: 'Array of hour updates to queue',
        items: {
          type: 'object',
          properties: {
            entry_index: {
              type: 'integer',
              description: 'Entry index (0-9)',
              minimum: 0,
              maximum: 9
            },
            day: {
              type: 'string',
              description: 'Day (monday-saturday, 0-5, or YYYY-MM-DD)'
            },
            hours: {
              type: 'number',
              description: 'Hours to set'
            }
          },
          required: ['entry_index', 'day', 'hours']
        }
      }
    },
    required: ['updates']
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const { updates } = args;

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required and must not be empty');
    }

    try {
      const queuedUpdates: string[] = [];

      for (const update of updates) {
        const { entry_index, day, hours } = update;

        if (entry_index < 0 || entry_index > 9) {
          throw new Error(`Invalid entry_index ${entry_index}: must be between 0 and 9`);
        }

        const dayIndex = getDayIndex(day);
        const fieldName = `record${entry_index}_${dayIndex}`;
        const value = hours === 0 ? '' : hours.toString();

        session.queueFormUpdate(fieldName, value);
        queuedUpdates.push(`${fieldName}=${value}`);
      }

      const pendingCount = session.getPendingUpdateCount();

      return {
        success: true,
        queued_updates: queuedUpdates.length,
        total_pending: pendingCount,
        updates: queuedUpdates,
        message: `Queued ${queuedUpdates.length} hour updates. Total pending: ${pendingCount}. Call timecard_batch_save to submit.`
      };
    } catch (error) {
      throw new Error(`Failed to queue hour updates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSetNotes: MCPTool = {
  name: 'timecard_set_notes',
  description: `Queue multiple note records for submission.

This tool QUEUES note updates in memory without triggering any UI operations or popup windows. Updates are submitted together when you call timecard_save.

⚠️ CRITICAL WORKFLOW:
1. Configure entries and set hours first
2. Queue ALL note updates with this tool
3. Submit everything with timecard_save

Performance benefits:
- NO popup windows
- NO UI operations

Example usage:
  set_notes([
    { entry_index: 0, day: "monday", note: "Development work" },
    { entry_index: 0, day: "tuesday", note: "Code review" }
  ])
  save()  // Submit all at once

WARNING: Note cannot contain special characters: #$%^&*=+{}[]|?'"

IMPORTANT: This only queues updates. You MUST call timecard_save to actually save changes.`,
  inputSchema: {
    type: 'object',
    properties: {
      updates: {
        type: 'array',
        description: 'Array of note updates to queue',
        items: {
          type: 'object',
          properties: {
            entry_index: {
              type: 'integer',
              description: 'Entry index (0-9)',
              minimum: 0,
              maximum: 9
            },
            day: {
              type: 'string',
              description: 'Day (monday-saturday, 0-5, or YYYY-MM-DD)'
            },
            note: {
              type: 'string',
              description: 'Note content (cannot contain: #$%^&*=+{}[]|?\'")'
            }
          },
          required: ['entry_index', 'day', 'note']
        }
      }
    },
    required: ['updates']
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const { updates } = args;

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required and must not be empty');
    }

    // Validate all notes first
    const forbiddenChars = /[#$%^&*=+{}[\]|?'"]/;
    for (const update of updates) {
      if (forbiddenChars.test(update.note)) {
        const foundChars = update.note.match(/[#$%^&*=+{}[\]|?'"]/g);
        throw new Error(`Note for entry ${update.entry_index}, day ${update.day} contains forbidden characters: ${foundChars?.join(', ')}. Cannot use: #$%^&*=+{}[]|?'"`);
      }
    }

    try {
      const queuedUpdates: string[] = [];

      for (const update of updates) {
        const { entry_index, day, note } = update;

        if (entry_index < 0 || entry_index > 9) {
          throw new Error(`Invalid entry_index ${entry_index}: must be between 0 and 9`);
        }

        const dayIndex = getDayIndex(day);
        const fieldName = `note${entry_index}_${dayIndex}`;

        session.queueFormUpdate(fieldName, note);
        queuedUpdates.push(`${fieldName}=${note.substring(0, 30)}${note.length > 30 ? '...' : ''}`);
      }

      const pendingCount = session.getPendingUpdateCount();

      return {
        success: true,
        queued_updates: queuedUpdates.length,
        total_pending: pendingCount,
        updates: queuedUpdates,
        message: `Queued ${queuedUpdates.length} note updates. Total pending: ${pendingCount}. Call timecard_batch_save to submit.`
      };
    } catch (error) {
      throw new Error(`Failed to queue note updates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSave: MCPTool = {
  name: 'timecard_save',
  description: `Submit all queued updates via direct form POST.

This tool submits ALL queued updates (entries, hours, and notes) in a single operation by directly POSTing to the server, completely bypassing UI operations.

⚠️ IMPORTANT: This submits ALL pending updates queued by:
- timecard_set_entries
- timecard_set_hours
- timecard_set_notes

After submission, all pending updates are cleared.

Example complete workflow:
  # 1. Queue all updates
  set_entries([...])
  set_hours([...])
  set_notes([...])

  # 2. Submit everything at once
  save()

  # 3. Verify (optional)
  get_timesheet(date)

NOTE: Only 'save' (draft) is supported. 'submit' (for approval) is strictly prohibited.`,
  inputSchema: {
    type: 'object',
    properties: {}
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    try {
      const pendingCount = session.getPendingUpdateCount();

      if (pendingCount === 0) {
        return {
          success: true,
          saved_updates: 0,
          message: 'No pending updates to save'
        };
      }

      console.log(`[Batch Save] Saving ${pendingCount} pending updates`);

      const result = await session.batchSave();

      return {
        success: result.success,
        saved_updates: pendingCount,
        message: result.message
      };
    } catch (error) {
      throw new Error(`Failed to batch save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSetEntries: MCPTool = {
  name: 'timecard_set_entries',
  description: `Queue project/activity settings for submission.

This tool QUEUES project and activity settings in memory without triggering any UI operations.
Updates are submitted together when you call timecard_save.

⚠️ CRITICAL: You must call timecard_get_timesheet FIRST to load the page and establish session data.

Example usage:
  # 1. Load the page first (REQUIRED)
  get_timesheet("2025-01-06")

  # 2. Queue entries
  set_entries([
    { entry_index: 0, project_id: "17647", activity_id: "9" },
    { entry_index: 1, project_id: "17647", activity_id: "5" }
  ])

  # 3. Queue hours
  set_hours([...])

  # 4. Submit all at once
  save()

IMPORTANT: This only queues updates. You MUST call timecard_save to actually save changes.`,
  inputSchema: {
    type: 'object',
    properties: {
      updates: {
        type: 'array',
        description: 'Array of entry configurations to queue',
        items: {
          type: 'object',
          properties: {
            entry_index: {
              type: 'integer',
              description: 'Entry index (0-9)',
              minimum: 0,
              maximum: 9
            },
            project_id: {
              type: 'string',
              description: 'Project ID'
            },
            activity_id: {
              type: 'string',
              description: 'Activity ID'
            }
          },
          required: ['entry_index', 'project_id', 'activity_id']
        }
      }
    },
    required: ['updates']
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    // Check if we're on a valid timesheet page (daychoose.jsp or timecard_weekly.jsp)
    const currentUrl = page.url();
    const isValidTimesheetPage = currentUrl.includes('daychoose.jsp') || currentUrl.includes('timecard_weekly.jsp');
    if (!isValidTimesheetPage) {
      throw new Error('Must navigate to timesheet page first using timecard_get_timesheet. The page must be loaded to read activity data.');
    }

    const { updates } = args;

    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Updates array is required and must not be empty');
    }

    try {
      const queuedUpdates: string[] = [];

      for (const update of updates) {
        const { entry_index, project_id, activity_id } = update;

        if (entry_index < 0 || entry_index > 9) {
          throw new Error(`Invalid entry_index ${entry_index}: must be between 0 and 9`);
        }

        // Read activity value from act.collect (same logic as fill() function in JSP)
        const activityValue = await page.evaluate(
          ({ pid, aid }: { pid: string; aid: string }) => {
            // @ts-ignore - act is a global variable in the browser context
            if (typeof act === 'undefined' || !act.collect) {
              return { error: 'act object not found on page' };
            }

            // @ts-ignore
            for (let i = 0; i <= act.cnt; i++) {
              // @ts-ignore
              const item = act.collect[i];
              if (item && item.pid === pid && item.uid === aid && item.bottom === 'true') {
                // Use the same format as fill() function
                return {
                  value: item.bottom + '$' + item.uid + '$' + item.pid + '$' + item.progress
                };
              }
            }
            return { error: `Activity ${aid} not found for project ${pid}` };
          },
          { pid: project_id, aid: activity_id }
        );

        if ('error' in activityValue) {
          throw new Error(activityValue.error as string);
        }

        // Queue project and activity updates
        session.queueFormUpdate(`project${entry_index}`, project_id);
        session.queueFormUpdate(`activity${entry_index}`, activityValue.value as string);
        queuedUpdates.push(`entry${entry_index}: project=${project_id}, activity=${activity_id}`);
      }

      const pendingCount = session.getPendingUpdateCount();

      return {
        success: true,
        queued_entries: queuedUpdates.length,
        total_pending: pendingCount,
        entries: queuedUpdates,
        message: `Queued ${queuedUpdates.length} entry configurations. Total pending: ${pendingCount}. Call timecard_batch_save to submit.`
      };
    } catch (error) {
      throw new Error(`Failed to queue entry configurations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardDiscard: MCPTool = {
  name: 'timecard_discard',
  description: `Discard all pending updates without submitting.

Use this tool if you want to discard queued updates without saving them.

This will clear all updates queued by:
- timecard_set_entries
- timecard_set_hours
- timecard_set_notes

After discarding, you can queue new updates.`,
  inputSchema: {
    type: 'object',
    properties: {}
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const clearedCount = session.getPendingUpdateCount();
    session.clearPendingUpdates();

    return {
      success: true,
      cleared_updates: clearedCount,
      message: `Cleared ${clearedCount} pending updates`
    };
  }
};

export const batchOperationTools: MCPTool[] = [
  timecardSetEntries,
  timecardSetHours,
  timecardSetNotes,
  timecardSave,
  timecardDiscard
];
