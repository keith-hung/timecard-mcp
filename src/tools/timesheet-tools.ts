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
  description: `Set project and activity for a specific timesheet entry.

⚠️ CRITICAL PRINCIPLE: Entry Immutability
Once an entry is configured with a project/activity, NEVER change it during the same week. Changing project OR activity will CLEAR ALL hours for that entry for the entire week. If you need a different project/activity combination, use a different entry index (0-9).

⚠️ RECOMMENDED WORKFLOW: Batch Operations
When filling multiple entries/days, use this order:
1. FIRST: Configure ALL entries you need (call this tool for each entry 0-9)
2. THEN: Set ALL hours using timecard_set_daily_hours (for all entries and days)
3. NEXT: Set ALL notes using timecard_set_daily_note (if needed)
4. FINALLY: Call timecard_save_timesheet ONCE
5. VERIFY: Call timecard_get_timesheet to verify saved data

WHY this order?
- Prevents UI synchronization issues
- More efficient (one save operation)
- Clear, predictable workflow

Example - CORRECT batch approach:
  # Configure all entries first
  set_timesheet_entry(0, "17647", "9")   # Communication
  set_timesheet_entry(1, "17647", "5")   # Meeting
  set_timesheet_entry(2, "17647", "12")  # Development

  # Then fill all hours
  set_daily_hours(0, "monday", 1.5)
  set_daily_hours(1, "monday", 2)
  set_daily_hours(2, "monday", 4.5)
  # ... continue for all days

  # Save once
  save_timesheet()

Example - WRONG approach (causes failures):
  set_timesheet_entry(0, "17647", "9")
  set_daily_hours(0, "monday", 1.5)  # May fail - UI not ready
  set_timesheet_entry(1, "17647", "5")
  set_daily_hours(1, "monday", 2)    # May fail - UI sync issues

Incremental filling (adding more days):
- If Entry 0-2 are already configured, you can directly add hours to new days
- Only configure NEW entries (e.g., Entry 3, 4) if needed
- No need to re-configure existing entries (though safe if same project/activity)

IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Use timecard_get_timesheet to see saved data.`,
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

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { entry_index, project_id, activity_id } = safeArgs;

    if (entry_index < 0 || entry_index > 9) {
      throw new Error('Entry index must be between 0 and 9');
    }

    try {
      // Step 1: Get the correct activity UID from the act object
      const activityUID = await page.evaluate((args: { projectId: string; activityId: string }) => {
        // @ts-ignore - act is a global variable in the browser context
        if (typeof act === 'undefined' || !act.collect) {
          return null;
        }

        // Find the activity with matching project ID and activity ID
        // Activities have bottom = 'true'
        // @ts-ignore
        for (let i = 0; i <= act.cnt; i++) {
          // @ts-ignore
          const item = act.collect[i];
          if (item && item.pid === args.projectId && item.uid === args.activityId && item.bottom === 'true') {
            // Return the formatted UID: true$uid$pid$0
            return `true$${item.uid}$${item.pid}$0`;
          }
        }

        return null;
      }, { projectId: project_id, activityId: activity_id });

      if (!activityUID) {
        throw new Error(`Could not find activity with ID "${activity_id}" for project "${project_id}"`);
      }

      // Step 2: Select project
      await page.locator(`select[name="project${entry_index}"]`).selectOption(project_id);

      // Step 3: Wait for activity dropdown to populate with actual options
      await page.waitForFunction(
        (idx) => {
          const select = document.querySelector(`select[name="activity${idx}"]`) as HTMLSelectElement;
          if (!select) return false;

          // Count non-empty options (exclude the "-- select activity --" option)
          const validOptions = Array.from(select.options).filter(opt =>
            opt.value !== '' && opt.value !== 'false$-1$-1$0'
          );

          return validOptions.length > 0;
        },
        entry_index,
        { timeout: 10000 }
      );

      // Step 4: Select activity using the correct UID format
      await page.locator(`select[name="activity${entry_index}"]`).selectOption(activityUID);

      // Step 5: Wait for hour selectors to become enabled
      // This is crucial to prevent "selector disabled" errors when immediately calling set_daily_hours
      await page.waitForFunction(
        (idx) => {
          const hourSelect = document.querySelector(`select[name="record${idx}_0"]`) as HTMLSelectElement;
          return hourSelect && !hourSelect.disabled;
        },
        entry_index,
        { timeout: 5000 }
      );

      // Step 6: Get the selected names for confirmation
      const projectName = await page.locator(`select[name="project${entry_index}"] option:checked`).textContent() || '';
      const activityName = await page.locator(`select[name="activity${entry_index}"] option:checked`).textContent() || '';

      return {
        success: true,
        entry_index,
        project_name: projectName.trim().replace(/<<.*?>>/, '').trim(),
        activity_name: activityName.trim().replace(/<<.*?>>/, '').trim()
      };
    } catch (error) {
      throw new Error(`Failed to set timesheet entry ${entry_index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardSetDailyHours: MCPTool = {
  name: 'timecard_set_daily_hours',
  description: `Set daily hours for a specific entry and day.

⚠️ PREREQUISITES (Must do FIRST):
- Project and activity MUST be set using timecard_set_timesheet_entry BEFORE calling this tool
- If you get "hour selector is disabled" error, the entry is not configured yet

⚠️ RECOMMENDED WORKFLOW: Batch Operations
When filling multiple entries/days:
1. Configure ALL entries FIRST (using timecard_set_timesheet_entry)
2. Then set ALL hours in batch (using this tool)
3. This approach prevents UI synchronization issues

Example - CORRECT workflow:
  # Step 1: Configure all entries
  set_timesheet_entry(0, "17647", "9")
  set_timesheet_entry(1, "17647", "5")
  set_timesheet_entry(2, "17647", "12")

  # Step 2: Fill all hours (batch)
  set_daily_hours(0, "monday", 1.5)
  set_daily_hours(0, "tuesday", 1.5)
  set_daily_hours(1, "monday", 2)
  set_daily_hours(1, "tuesday", 3)
  set_daily_hours(2, "monday", 4.5)
  # ... continue for all entries and days

  # Step 3: Save
  save_timesheet()

Adding hours to NEW days on existing entries:
- ✅ Safe: Directly add hours to days that don't have hours yet
- ⚠️ Modify existing day: Must use timecard_clear_daily_hours first, then save, then re-fill

Example - Adding Thursday/Friday to existing Mon-Wed data:
  # Entries 0-2 already configured with Mon-Wed hours
  # Just add new days directly (no clear needed)
  set_daily_hours(0, "thursday", 1.5)
  set_daily_hours(0, "friday", 1.5)
  save_timesheet()

Example - Modifying existing Monday hours:
  # Must clear first
  clear_daily_hours("monday")
  save_timesheet()
  # Then re-fill Monday
  set_daily_hours(0, "monday", 2)  # New hours
  save_timesheet()

Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week. For clearing hours (setting to 0), consider using timecard_clear_daily_hours for better efficiency when clearing an entire day.

IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Use timecard_get_timesheet to see saved data.`,
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

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { entry_index, day, hours } = safeArgs;

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
  description: `Set daily note for a specific entry and day.

⚠️ RECOMMENDED WORKFLOW: Batch Operations
When setting notes for multiple entries/days:
1. Configure ALL entries first (using timecard_set_timesheet_entry)
2. Fill ALL hours (using timecard_set_daily_hours)
3. Then set ALL notes in batch (using this tool)
4. Save once (using timecard_save_timesheet)

Example:
  # After configuring entries and filling hours...
  set_daily_note(0, "monday", "Team meeting")
  set_daily_note(1, "monday", "Code review")
  set_daily_note(2, "tuesday", "Bug fixing")
  # ... continue for all notes
  save_timesheet()

Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week.

IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Notes are not visible in timecard_get_timesheet until saved.

WARNING: Note cannot contain special characters: #$%^&*=+{}[]|?\'"`,
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

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { entry_index, day, note } = safeArgs;

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
      
      // Set up popup listener BEFORE clicking
      const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
      
      await noteLink.click();
      
      // Wait for popup to open
      const popup = await popupPromise;
      
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

const timecardSetDailyNoteFast: MCPTool = {
  name: 'timecard_set_daily_note_fast',
  description: `Set daily note by directly manipulating hidden field (faster alternative to timecard_set_daily_note).

This tool bypasses the popup window and directly sets the hidden field value, providing significantly better performance:
- 80% faster than popup method (2-3 seconds vs 10-15 seconds)
- No popup timeout issues
- More reliable operation

⚠️ IMPORTANT: This is an experimental optimization. If it fails, the tool will automatically fall back to the standard popup method.

WORKFLOW: Same as timecard_set_daily_note
1. Configure entries first (timecard_set_timesheet_entry)
2. Fill hours (timecard_set_daily_hours)
3. Set notes (this tool)
4. Save (timecard_save_timesheet)

WARNING: Note cannot contain special characters: #$%^&*=+{}[]|?'"`,
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
      },
      use_popup_fallback: {
        type: 'boolean',
        description: 'If direct field method fails, automatically try popup method (default: true)',
        default: true
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

    const safeArgs = args || {};
    const { entry_index, day, note, use_popup_fallback = true } = safeArgs;

    if (entry_index < 0 || entry_index > 9) {
      throw new Error('Entry index must be between 0 and 9');
    }

    // Validate note content
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
          throw new Error(`Date ${day} is not in the current week (${weekRange.startDate} to ${weekRange.endDate}). Please use timecard_get_timesheet to navigate to the target week first.`);
        }
      }

      const dayIndex = getDayIndex(day);

      // Try direct field manipulation first
      try {
        const result = await page.evaluate(
          ({ idx, dayIdx, noteText }) => {
            // 1. Update hidden field
            const hiddenField = document.querySelector(
              `input[name="note${idx}_${dayIdx}"]`
            ) as HTMLInputElement;

            if (!hiddenField) {
              return { success: false, error: 'Hidden field not found' };
            }

            hiddenField.value = noteText;

            // 2. Update timearray for consistency (optional but recommended)
            try {
              const projectSelect = document.querySelector(
                `select[name="project${idx}"]`
              ) as HTMLSelectElement;
              const activitySelect = document.querySelector(
                `select[name="activity${idx}"]`
              ) as HTMLSelectElement;

              if (projectSelect && activitySelect) {
                const projectIdx = projectSelect.selectedIndex - 1;
                const activityIdx = activitySelect.selectedIndex - 1;

                if (projectIdx >= 0 && activityIdx >= 0 &&
                    (window as any).timearray &&
                    (window as any).timearray[projectIdx] &&
                    (window as any).timearray[projectIdx][activityIdx] &&
                    (window as any).timearray[projectIdx][activityIdx][dayIdx]) {

                  const parts = (window as any).timearray[projectIdx][activityIdx][dayIdx].split('$');
                  parts[2] = noteText; // Update note part
                  (window as any).timearray[projectIdx][activityIdx][dayIdx] = parts.join('$');
                }
              }
            } catch (timearrayError) {
              // timearray update failed, but hidden field is set (acceptable)
              console.warn('[Direct Note] timearray update failed:', timearrayError);
            }

            // 3. Update note icon if exists
            try {
              const noteImg = document.querySelector(`img[name="note${idx}_${dayIdx}"]`) as HTMLImageElement;
              if (noteImg && noteText) {
                noteImg.src = 'img/updateNote.png';
                noteImg.alt = noteText;
              }
            } catch (iconError) {
              console.warn('[Direct Note] Icon update failed:', iconError);
            }

            return { success: true, field: `note${idx}_${dayIdx}` };
          },
          { idx: entry_index, dayIdx: dayIndex, noteText: note }
        );

        if (!result.success) {
          throw new Error(result.error || 'Direct field manipulation failed');
        }

        return {
          success: true,
          entry_index,
          day,
          day_index: dayIndex,
          note,
          method: 'direct_field'
        };
      } catch (directFieldError) {
        // If direct field failed and fallback is enabled, try popup method
        if (use_popup_fallback) {
          console.log(`[Direct Note] Failed, falling back to popup method: ${directFieldError}`);

          // Use the original popup method
          const noteSelector = `#weekrecord${entry_index} > td:nth-child(${dayIndex + 4}) > div:nth-child(2) > a`;
          const noteLink = page.locator(noteSelector);

          if (await noteLink.count() === 0) {
            throw new Error(`Note link not found for entry ${entry_index}, day ${day}. Make sure the timesheet entry is set up first.`);
          }

          const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
          await noteLink.click();

          const popup = await popupPromise;
          await popup.waitForLoadState('domcontentloaded');

          const textbox = popup.getByRole('textbox');
          await textbox.waitFor({ timeout: 5000 });
          await textbox.fill(note);

          const updateButton = popup.getByRole('button', { name: 'update' });
          await updateButton.waitFor({ timeout: 5000 });
          await updateButton.click();

          try {
            if (!popup.isClosed()) {
              await popup.waitForTimeout(1500);
            }
          } catch (timeoutError) {
            // Popup might have closed already
          }

          try {
            if (!popup.isClosed()) {
              await popup.close();
            }
          } catch (closeError) {
            // Ignore close errors
          }

          return {
            success: true,
            entry_index,
            day,
            day_index: dayIndex,
            note,
            method: 'popup_fallback'
          };
        } else {
          throw directFieldError;
        }
      }
    } catch (error) {
      throw new Error(`Failed to set daily note for entry ${entry_index}, day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardClearDailyHours: MCPTool = {
  name: 'timecard_clear_daily_hours',
  description: 'Efficiently clear all hours for a specific day across all entries that have project and activity set. This is the required first step when modifying existing timesheet configurations for a day. After clearing, you must call timecard_save_timesheet to save changes and unlock entries for modification, then use timecard_set_daily_hours to set new hours, followed by timecard_save_timesheet again. Recommended over multiple timecard_set_daily_hours calls with hours=0. Works only with the currently displayed week. For cross-week operations, use timecard_get_timesheet first to navigate to the target week. IMPORTANT: This only updates the UI temporarily. You must call timecard_save_timesheet afterwards to permanently save changes. Strongly recommended to call timecard_get_timesheet after saving to verify the changes.',
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

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { day } = safeArgs;

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
  timecardSetDailyNoteFast,
  timecardClearDailyHours
];