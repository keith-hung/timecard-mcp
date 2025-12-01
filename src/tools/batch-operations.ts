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
        message: `Queued ${queuedUpdates.length} hour updates. Total pending: ${pendingCount}. Call timecard_save to save.`
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
        message: `Queued ${queuedUpdates.length} note updates. Total pending: ${pendingCount}. Call timecard_save to save.`
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

⚠️ WORKFLOW:
1. Get activity data with timecard_get_activities (returns activity_value)
2. Queue entries with this tool (use activity_value from step 1)
3. Queue hours with timecard_set_hours
4. Submit all at once with timecard_save

Example usage:
  # 1. Get activities first (returns id and value)
  activities = get_activities("17647")
  # Returns: [{ id: "9", value: "true$9$17647$100", ... }, ...]

  # 2. Queue entries using the value field
  set_entries([
    { entry_index: 0, project_id: "17647", activity_value: "true$9$17647$100" },
    { entry_index: 1, project_id: "17647", activity_value: "true$5$17647$100" }
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
            activity_value: {
              type: 'string',
              description: 'Activity value from get_activities (format: bottom$uid$pid$progress)'
            }
          },
          required: ['entry_index', 'project_id', 'activity_value']
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
        const { entry_index, project_id, activity_value } = update;

        if (entry_index < 0 || entry_index > 9) {
          throw new Error(`Invalid entry_index ${entry_index}: must be between 0 and 9`);
        }

        if (!activity_value || !activity_value.includes('$')) {
          throw new Error(`Invalid activity_value for entry ${entry_index}: must be in format 'bottom$uid$pid$progress' (get this from timecard_get_activities)`);
        }

        // Queue project and activity updates
        session.queueFormUpdate(`project${entry_index}`, project_id);
        session.queueFormUpdate(`activity${entry_index}`, activity_value);
        queuedUpdates.push(`entry${entry_index}: project=${project_id}, activity_value=${activity_value}`);
      }

      const pendingCount = session.getPendingUpdateCount();

      return {
        success: true,
        queued_entries: queuedUpdates.length,
        total_pending: pendingCount,
        entries: queuedUpdates,
        message: `Queued ${queuedUpdates.length} entry configurations. Total pending: ${pendingCount}. Call timecard_save to submit.`
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
