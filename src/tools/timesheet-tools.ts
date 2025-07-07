import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';

// Helper function to convert day string to index
function getDayIndex(day: string): number {
  const dayMapping: Record<string, number> = {
    'monday': 0, 'tuesday': 1, 'wednesday': 2, 
    'thursday': 3, 'friday': 4, 'saturday': 5,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
  };
  
  // Handle full date format (YYYY-MM-DD)
  if (day.includes('-')) {
    const date = new Date(day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6, Monday = 0
  }
  
  const normalizedDay = day.toLowerCase();
  if (normalizedDay in dayMapping) {
    return dayMapping[normalizedDay];
  }
  
  throw new Error(`Invalid day format: ${day}. Use monday-saturday, 0-5, or YYYY-MM-DD format.`);
}

const timecardSetTimesheetEntry: MCPTool = {
  name: 'timecard_set_timesheet_entry',
  description: 'Set project and activity for a specific timesheet entry. IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Use timecard_get_timesheet to see saved data.',
  inputSchema: {
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
  },
  handler: async (args, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    const { entry_index, project_id, activity_id } = args;

    if (entry_index < 0 || entry_index > 9) {
      throw new Error('Entry index must be between 0 and 9');
    }

    try {
      // Select project
      await page.locator(`select[name="project${entry_index}"]`).selectOption(project_id);
      
      // Wait for activity dropdown to populate
      await page.waitForTimeout(1000);
      
      // Select activity
      await page.locator(`select[name="activity${entry_index}"]`).selectOption(activity_id);

      // Get the selected names for confirmation
      const projectName = await page.locator(`select[name="project${entry_index}"] option:checked`).textContent() || '';
      const activityName = await page.locator(`select[name="activity${entry_index}"] option:checked`).textContent() || '';

      return {
        success: true,
        entry_index,
        project_name: projectName.trim(),
        activity_name: activityName.trim()
      };
    } catch (error) {
      throw new Error(`Failed to set timesheet entry ${entry_index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSetDailyHours: MCPTool = {
  name: 'timecard_set_daily_hours',
  description: 'Set daily hours for a specific entry and day. Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week. For clearing hours (setting to 0), consider using timecard_clear_daily_hours for better efficiency when clearing an entire day. IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Use timecard_get_timesheet to see saved data.',
  inputSchema: {
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
        description: 'Day (monday-saturday, 0-5, or YYYY-MM-DD). If using YYYY-MM-DD, the date must be in the currently displayed week.'
      },
      hours: {
        type: 'number',
        description: 'Hours to set'
      }
    },
    required: ['entry_index', 'day', 'hours']
  },
  handler: async (args, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    const { entry_index, day, hours } = args;

    if (entry_index < 0 || entry_index > 9) {
      throw new Error('Entry index must be between 0 and 9');
    }

    try {
      // Check if date is in current week when using YYYY-MM-DD format
      if (day.includes('-')) {
        const weekRange = await session.getCurrentWeekRange();
        if (!weekRange.dates.includes(day)) {
          throw new Error(`Date ${day} is not in the current week (${weekRange.startDate} to ${weekRange.endDate}). Please use timecard_get_timesheet to navigate to the target week first, or use day names (monday-saturday) or indices (0-5) to work with the current week.`);
        }
      }

      const dayIndex = getDayIndex(day);
      // Use empty string for 0 hours, otherwise convert to string
      const hoursString = hours === 0 ? '' : hours.toString();
      
      const hourSelector = page.locator(`select[name="record${entry_index}_${dayIndex}"]`);
      
      // Check if the select element exists and is enabled
      if (await hourSelector.count() === 0) {
        throw new Error(`Hour selector not found for entry ${entry_index}, day ${day}. Make sure the timesheet entry is set up first.`);
      }
      
      const isEnabled = await hourSelector.isEnabled();
      if (!isEnabled) {
        throw new Error(`Hour selector for entry ${entry_index}, day ${day} is disabled. Make sure the project and activity are set first.`);
      }
      
      await hourSelector.selectOption(hoursString);
      
      // Wait a bit for the UI to update
      await page.waitForTimeout(200);

      return {
        success: true,
        entry_index,
        day,
        day_index: dayIndex,
        hours
      };
    } catch (error) {
      throw new Error(`Failed to set daily hours for entry ${entry_index}, day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSetDailyNote: MCPTool = {
  name: 'timecard_set_daily_note',
  description: 'Set daily note for a specific entry and day. Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week. IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Notes are not visible in timecard_get_timesheet until saved. WARNING: Note cannot contain special characters: #$%^&*=+{}[]|?\'"',
  inputSchema: {
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
        description: 'Day (monday-saturday, 0-5, or YYYY-MM-DD). If using YYYY-MM-DD, the date must be in the currently displayed week.'
      },
      note: {
        type: 'string',
        description: 'Note content (cannot contain: #$%^&*=+{}[]|?\'")'
      }
    },
    required: ['entry_index', 'day', 'note']
  },
  handler: async (args, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    const { entry_index, day, note } = args;

    if (entry_index < 0 || entry_index > 9) {
      throw new Error('Entry index must be between 0 and 9');
    }

    // Validate note content - check for forbidden characters
    const forbiddenChars = /[#$%^&*=+{}[\]|?'"]/;
    if (forbiddenChars.test(note)) {
      const foundChars = note.match(/[#$%^&*=+{}[\]|?'"]/g);
      throw new Error(`Note contains forbidden characters: ${foundChars?.join(', ')}. Cannot use: #$%^&*=+{}[]|?'"`);
    }

    try {
      // Check if date is in current week when using YYYY-MM-DD format
      if (day.includes('-')) {
        const weekRange = await session.getCurrentWeekRange();
        if (!weekRange.dates.includes(day)) {
          throw new Error(`Date ${day} is not in the current week (${weekRange.startDate} to ${weekRange.endDate}). Please use timecard_get_timesheet to navigate to the target week first, or use day names (monday-saturday) or indices (0-5) to work with the current week.`);
        }
      }

      const dayIndex = getDayIndex(day);
      
      // Check if page is still alive
      if (page.isClosed()) {
        throw new Error('Page has been closed. Please check session status and try again.');
      }
      
      // Click the note link to open popup
      const noteSelector = `#weekrecord${entry_index} > td:nth-child(${dayIndex + 4}) > div:nth-child(2) > a`;
      
      // Check if the note link exists
      const noteLink = page.locator(noteSelector);
      if (await noteLink.count() === 0) {
        throw new Error(`Note link not found for entry ${entry_index}, day ${day}. Make sure the timesheet entry is set up first.`);
      }
      
      await noteLink.click();
      
      // Wait for popup to open with timeout
      const popup = await page.waitForEvent('popup', { timeout: 10000 });
      
      // Wait for popup to be ready
      await popup.waitForLoadState('domcontentloaded');
      
      // Find and fill the textbox
      const textbox = popup.getByRole('textbox');
      await textbox.waitFor({ timeout: 5000 });
      await textbox.fill(note);
      
      // Find and click update button
      const updateButton = popup.getByRole('button', { name: 'update' });
      await updateButton.waitFor({ timeout: 5000 });
      await updateButton.click();
      
      // Wait a bit for the operation to complete, but check if popup still exists
      try {
        if (!popup.isClosed()) {
          await popup.waitForTimeout(1500);
        }
      } catch (timeoutError) {
        // Popup might have closed already, continue
      }
      
      // Try to close the popup manually if it's still open
      try {
        if (!popup.isClosed()) {
          await popup.close();
        }
      } catch (closeError) {
        // Popup might have closed automatically, ignore close errors
      }

      return {
        success: true,
        entry_index,
        day,
        day_index: dayIndex,
        note
      };
    } catch (error) {
      throw new Error(`Failed to set daily note for entry ${entry_index}, day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardClearDailyHours: MCPTool = {
  name: 'timecard_clear_daily_hours',
  description: 'Efficiently clear all hours for a specific day across all entries that have project and activity set. Recommended over multiple timecard_set_daily_hours calls with hours=0. Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week. IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Strongly recommended to call timecard_get_timesheet after saving to verify the changes.',
  inputSchema: {
    type: 'object',
    properties: {
      day: {
        type: 'string',
        description: 'Day to clear (monday-saturday, 0-5, or YYYY-MM-DD). If using YYYY-MM-DD, the date must be in the currently displayed week.'
      }
    },
    required: ['day']
  },
  handler: async (args, session: TimeCardSession) => {
    const authResult = await session.ensureAuthenticated();
    if (!authResult.success) {
      throw new Error(authResult.message);
    }

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    const { day } = args;

    try {
      // Check if date is in current week when using YYYY-MM-DD format
      if (day.includes('-')) {
        const weekRange = await session.getCurrentWeekRange();
        if (!weekRange.dates.includes(day)) {
          throw new Error(`Date ${day} is not in the current week (${weekRange.startDate} to ${weekRange.endDate}). Please use timecard_get_timesheet to navigate to the target week first, or use day names (monday-saturday) or indices (0-5) to work with the current week.`);
        }
      }

      const dayIndex = getDayIndex(day);
      const clearedEntries: number[] = [];
      
      // Set all entries (0-9) for the specified day to 0
      for (let entryIndex = 0; entryIndex < 10; entryIndex++) {
        try {
          // Check if this entry has project and activity set (which enables the hour selector)
          const projectSelect = page.locator(`select[name="project${entryIndex}"]`);
          const activitySelect = page.locator(`select[name="activity${entryIndex}"]`);
          
          if (await projectSelect.count() > 0 && await activitySelect.count() > 0) {
            const projectValue = await projectSelect.inputValue();
            const activityValue = await activitySelect.inputValue();
            
            // Only clear hours for entries that have both project and activity set
            if (projectValue && activityValue) {
              const hourSelector = `select[name="record${entryIndex}_${dayIndex}"]`;
              const hourSelect = page.locator(hourSelector);
              
              if (await hourSelect.count() > 0 && await hourSelect.isEnabled()) {
                await hourSelect.selectOption('');
                clearedEntries.push(entryIndex);
              }
            }
          }
        } catch (error) {
          // Skip this entry if there's any error
          continue;
        }
      }

      return {
        success: true,
        day,
        day_index: dayIndex,
        cleared_entries: clearedEntries,
        message: `Cleared hours for day ${day} in ${clearedEntries.length} entries: ${clearedEntries.join(', ')}`
      };
    } catch (error) {
      throw new Error(`Failed to clear daily hours for day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const timesheetTools: MCPTool[] = [
  timecardSetTimesheetEntry,
  timecardSetDailyHours,
  timecardSetDailyNote,
  timecardClearDailyHours
];