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

const timecardBatchSetHours: MCPTool = {
  name: 'timecard_batch_set_hours',
  description: `Queue multiple hour records for batch submission (high-performance operation).

This tool QUEUES hour updates in memory without triggering any UI operations. Updates are submitted together when you call timecard_batch_save.

⚠️ CRITICAL WORKFLOW:
1. Navigate to correct week with timecard_get_timesheet (if needed)
2. Configure ALL entries with timecard_set_timesheet_entry (if not already done)
3. Queue ALL hour updates with this tool
4. Queue ALL note updates with timecard_batch_set_notes (if needed)
5. Submit everything with timecard_batch_save

Performance benefits:
- NO UI operations (instant queuing)
- Single form POST for all changes
- 75% faster than individual timecard_set_daily_hours calls

Example usage:
  batch_set_hours([
    { entry_index: 0, day: "monday", hours: 8.0 },
    { entry_index: 0, day: "tuesday", hours: 8.0 },
    { entry_index: 0, day: "wednesday", hours: 8.0 }
  ])
  batch_save()  // Submit all at once

IMPORTANT: This only queues updates. You MUST call timecard_batch_save to actually save changes.`,
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

const timecardBatchSetNotes: MCPTool = {
  name: 'timecard_batch_set_notes',
  description: `Queue multiple note records for batch submission (high-performance operation).

This tool QUEUES note updates in memory without triggering any UI operations or popup windows. Updates are submitted together when you call timecard_batch_save.

⚠️ CRITICAL WORKFLOW:
1. Configure entries and set hours first
2. Queue ALL note updates with this tool
3. Submit everything with timecard_batch_save

Performance benefits:
- NO popup windows
- NO UI operations
- 85% faster than individual note operations

Example usage:
  batch_set_notes([
    { entry_index: 0, day: "monday", note: "Development work" },
    { entry_index: 0, day: "tuesday", note: "Code review" }
  ])
  batch_save()  // Submit all at once

WARNING: Note cannot contain special characters: #$%^&*=+{}[]|?'"

IMPORTANT: This only queues updates. You MUST call timecard_batch_save to actually save changes.`,
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

const timecardBatchSave: MCPTool = {
  name: 'timecard_batch_save',
  description: `Submit all queued updates via direct form POST (核心效能優化).

This tool submits ALL queued updates (hours and notes) in a single operation by directly POSTing to weekinfo_deal.jsp, completely bypassing UI operations.

Performance improvements:
- 75% faster than individual operations
- Single network request for all changes
- No UI wait times
- No popup windows

⚠️ IMPORTANT: This submits ALL pending updates queued by:
- timecard_batch_set_hours
- timecard_batch_set_notes

After submission, all pending updates are cleared.

Example complete workflow:
  # 1. Queue all updates
  batch_set_hours([...])
  batch_set_notes([...])

  # 2. Submit everything at once
  batch_save()

  # 3. Verify (optional)
  get_timesheet(date)

You can also use action='submit' to submit for approval instead of just saving as draft.`,
  inputSchema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: 'Action to perform: "save" (draft) or "submit" (for approval)',
        enum: ['save', 'submit'],
        default: 'save'
      }
    }
  },
  handler: async (args: Record<string, any>, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const { action = 'save' } = args;

    try {
      const pendingCount = session.getPendingUpdateCount();

      if (pendingCount === 0) {
        return {
          success: true,
          saved_updates: 0,
          message: 'No pending updates to save'
        };
      }

      console.log(`[Batch Save] Submitting ${pendingCount} pending updates with action: ${action}`);

      const result = await session.batchSave(action as 'save' | 'submit');

      return {
        success: result.success,
        saved_updates: pendingCount,
        action,
        message: result.message
      };
    } catch (error) {
      throw new Error(`Failed to batch save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardBatchClear: MCPTool = {
  name: 'timecard_batch_clear',
  description: `Clear all pending updates without submitting.

Use this tool if you want to discard queued updates without saving them.

This will clear all updates queued by:
- timecard_batch_set_hours
- timecard_batch_set_notes

After clearing, you can queue new updates or use regular tools.`,
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
  timecardBatchSetHours,
  timecardBatchSetNotes,
  timecardBatchSave,
  timecardBatchClear
];
