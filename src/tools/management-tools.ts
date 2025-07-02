import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';

interface ValidationError {
  type: 'error' | 'warning';
  entry_index?: number;
  day?: string;
  message: string;
}

const timecardSaveTimesheet: MCPTool = {
  name: 'timecard_save_timesheet',
  description: 'Save the current timesheet permanently. CRITICAL: You MUST call this after any set_timesheet_entry/set_daily_hours/set_daily_note operations to make changes permanent. Without saving, changes are lost and not visible in timecard_get_timesheet.',
  inputSchema: {
    type: 'object',
    properties: {}
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

    try {
      // Click the save button
      await page.locator('input[name="save2"]').click();
      
      // Wait for the save operation to complete
      await page.waitForLoadState('networkidle');
      
      // Check for any error messages or success indicators
      const currentUrl = page.url();
      const pageContent = await page.textContent('body') || '';
      
      // Look for common success/error indicators
      const hasError = pageContent.includes('error') || pageContent.includes('錯誤') || pageContent.includes('fail');
      const hasSuccess = pageContent.includes('success') || pageContent.includes('saved') || pageContent.includes('儲存');

      return {
        success: !hasError,
        message: hasError ? 'Save operation may have failed - please check the page' : 
                hasSuccess ? 'Timesheet saved successfully' : 'Save operation completed',
        timestamp: new Date().toISOString(),
        current_url: currentUrl
      };
    } catch (error) {
      throw new Error(`Failed to save timesheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardValidateTimesheet: MCPTool = {
  name: 'timecard_validate_timesheet',
  description: 'Validate the current timesheet for completeness and errors. IMPORTANT: This validates the current UI state, including unsaved changes. Use this before calling timecard_save_timesheet.',
  inputSchema: {
    type: 'object',
    properties: {}
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

    try {
      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];
      let totalHours = 0;

      // Validate each entry
      for (let i = 0; i < 10; i++) {
        const projectSelect = page.locator(`select[name="project${i}"]`);
        const activitySelect = page.locator(`select[name="activity${i}"]`);
        
        if (await projectSelect.count() === 0) continue;

        const projectValue = await projectSelect.inputValue();
        const activityValue = await activitySelect.inputValue();
        
        // Check if entry has project but no activity
        if (projectValue && !activityValue) {
          errors.push({
            type: 'error',
            entry_index: i,
            message: `Entry ${i} has project selected but no activity`
          });
        }
        
        // Check if entry has activity but no project
        if (!projectValue && activityValue) {
          errors.push({
            type: 'error',
            entry_index: i,
            message: `Entry ${i} has activity selected but no project`
          });
        }

        // If both project and activity are set, validate daily hours
        if (projectValue && activityValue) {
          let entryHours = 0;
          let hasHours = false;
          
          for (let d = 0; d < 6; d++) {
            const hourSelect = page.locator(`select[name="record${i}_${d}"]`);
            if (await hourSelect.count() > 0) {
              const hourValue = await hourSelect.inputValue();
              if (hourValue) {
                const hours = parseFloat(hourValue);
                entryHours += hours;
                totalHours += hours;
                hasHours = true;
              }
            }
          }
          
          if (!hasHours) {
            warnings.push({
              type: 'warning',
              entry_index: i,
              message: `Entry ${i} has project and activity but no hours entered`
            });
          }
          
          if (entryHours > 60) { // Weekly limit check
            warnings.push({
              type: 'warning',
              entry_index: i,
              message: `Entry ${i} has ${entryHours} hours (may exceed weekly limits)`
            });
          }
        }
      }

      // Overall validation
      if (totalHours === 0) {
        warnings.push({
          type: 'warning',
          message: 'No hours entered in timesheet'
        });
      }
      
      if (totalHours > 60) {
        warnings.push({
          type: 'warning',
          message: `Total hours (${totalHours}) may exceed weekly limits`
        });
      }

      return {
        valid: errors.length === 0,
        errors: errors.map(e => e.message),
        warnings: warnings.map(w => w.message),
        total_hours: totalHours,
        details: {
          error_count: errors.length,
          warning_count: warnings.length,
          validation_items: [...errors, ...warnings]
        }
      };
    } catch (error) {
      throw new Error(`Failed to validate timesheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardGetSummary: MCPTool = {
  name: 'timecard_get_summary',
  description: 'Get summary statistics for the current timesheet week',
  inputSchema: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        description: 'Target date in YYYY-MM-DD format'
      }
    },
    required: ['date']
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

    const { date } = args;

    try {
      // Navigate to the timesheet if needed
      await session.navigateToTimesheet(date);

      // Calculate week boundaries
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();
      const monday = new Date(targetDate);
      monday.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);

      const weekStart = monday.toISOString().split('T')[0];
      const weekEnd = saturday.toISOString().split('T')[0];

      // Collect statistics
      const dailyTotals: Record<string, number> = {
        monday: 0, tuesday: 0, wednesday: 0, 
        thursday: 0, friday: 0, saturday: 0
      };
      
      const projectBreakdown: Record<string, number> = {};
      let totalHours = 0;
      let activeEntries = 0;

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      // Process each entry
      for (let i = 0; i < 10; i++) {
        const projectSelect = page.locator(`select[name="project${i}"]`);
        const activitySelect = page.locator(`select[name="activity${i}"]`);
        
        if (await projectSelect.count() === 0) continue;

        const projectValue = await projectSelect.inputValue();
        const activityValue = await activitySelect.inputValue();
        
        if (!projectValue || !activityValue) continue;

        activeEntries++;
        const projectName = await projectSelect.locator('option:checked').textContent() || `Project ${projectValue}`;

        // Sum daily hours for this entry
        for (let d = 0; d < 6; d++) {
          const hourSelect = page.locator(`select[name="record${i}_${d}"]`);
          if (await hourSelect.count() > 0) {
            const hourValue = await hourSelect.inputValue();
            if (hourValue) {
              const hours = parseFloat(hourValue);
              dailyTotals[days[d]] += hours;
              totalHours += hours;
              
              if (!projectBreakdown[projectName]) {
                projectBreakdown[projectName] = 0;
              }
              projectBreakdown[projectName] += hours;
            }
          }
        }
      }

      return {
        week_start: weekStart,
        week_end: weekEnd,
        total_hours: totalHours,
        active_entries: activeEntries,
        daily_totals: dailyTotals,
        project_breakdown: projectBreakdown,
        average_daily_hours: totalHours / 6,
        statistics: {
          max_daily_hours: Math.max(...Object.values(dailyTotals)),
          min_daily_hours: Math.min(...Object.values(dailyTotals)),
          working_days: Object.values(dailyTotals).filter(h => h > 0).length,
          unique_projects: Object.keys(projectBreakdown).length
        }
      };
    } catch (error) {
      throw new Error(`Failed to get summary for ${date}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const managementTools: MCPTool[] = [
  timecardSaveTimesheet,
  timecardValidateTimesheet,
  timecardGetSummary
];