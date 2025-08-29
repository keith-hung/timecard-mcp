import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
}

const timecardGetProjects: MCPTool = {
  name: 'timecard_get_projects',
  description: 'Get list of available projects for the user',
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
      // Navigate to timesheet page to access project dropdown
      const today = new Date().toISOString().split('T')[0];
      await session.navigateToTimesheet(today);

      // Get all project options from the first project dropdown
      const projectOptions = await page.locator('select[name="project0"] option').all();
      const projects: Project[] = [];

      for (const option of projectOptions) {
        const value = await option.getAttribute('value');
        const text = await option.textContent();
        
        if (value && text && value !== '' && text.trim() !== '') {
          projects.push({
            id: value,
            name: text.trim(),
            description: text.trim()
          });
        }
      }

      return {
        projects,
        count: projects.length
      };
    } catch (error) {
      throw new Error(`Failed to get projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardGetActivities: MCPTool = {
  name: 'timecard_get_activities',
  description: 'Get list of activities for a specific project',
  inputSchema: {
    type: 'object',
    properties: {
      project_id: {
        type: 'string',
        description: 'Project ID to get activities for'
      }
    },
    required: ['project_id']
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
    const { project_id } = safeArgs;

    try {
      // Navigate to timesheet page
      const today = new Date().toISOString().split('T')[0];
      await session.navigateToTimesheet(today);

      // Select the project to populate activities
      await page.locator('select[name="project0"]').selectOption(project_id);
      
      // Wait for activities to load
      await page.waitForTimeout(1000);

      // Get all activity options
      const activityOptions = await page.locator('select[name="activity0"] option').all();
      const activities: Activity[] = [];

      for (const option of activityOptions) {
        const value = await option.getAttribute('value');
        const text = await option.textContent();
        
        if (value && text && value !== '' && text.trim() !== '') {
          activities.push({
            id: value,
            name: text.trim(),
            description: text.trim()
          });
        }
      }

      return {
        project_id,
        activities,
        count: activities.length
      };
    } catch (error) {
      throw new Error(`Failed to get activities for project ${project_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardGetTimesheet: MCPTool = {
  name: 'timecard_get_timesheet',
  description: 'Get timesheet data for a specific week (includes automatic navigation). IMPORTANT: This only shows SAVED data. Recent changes made with set_timesheet_entry/set_daily_hours/set_daily_note are NOT visible until you call timecard_save_timesheet first.',
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

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { date } = safeArgs;

    try {
      // Navigate to the specific week's timesheet
      await session.navigateToTimesheet(date);

      // Calculate week start and end dates
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();
      const monday = new Date(targetDate);
      monday.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);

      const weekStart = monday.toISOString().split('T')[0];
      const weekEnd = saturday.toISOString().split('T')[0];

      // Extract existing timesheet entries
      const entries = [];
      
      for (let i = 0; i < 10; i++) {
        try {
          const projectSelect = page.locator(`select[name="project${i}"]`);
          const activitySelect = page.locator(`select[name="activity${i}"]`);
          
          if (await projectSelect.count() === 0) continue;

          const projectValue = await projectSelect.inputValue();
          const activityValue = await activitySelect.inputValue();
          
          if (!projectValue || !activityValue) continue;

          const projectText = await projectSelect.locator('option:checked').textContent() || '';
          const activityText = await activitySelect.locator('option:checked').textContent() || '';

          // Get daily hours
          const dailyHours: Record<string, number> = {};
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          
          for (let d = 0; d < 6; d++) {
            const hourSelect = page.locator(`select[name="record${i}_${d}"]`);
            if (await hourSelect.count() > 0) {
              const hourValue = await hourSelect.inputValue();
              dailyHours[days[d]] = hourValue ? parseFloat(hourValue) : 0;
            }
          }

          entries.push({
            index: i,
            project: {
              id: projectValue,
              name: projectText.trim()
            },
            activity: {
              id: activityValue,
              name: activityText.trim()
            },
            daily_hours: dailyHours
          });
        } catch (error) {
          // Skip entries that can't be read
        }
      }

      return {
        week_start: weekStart,
        week_end: weekEnd,
        entries,
        status: 'draft' // TimeCard doesn't provide status info easily
      };
    } catch (error) {
      throw new Error(`Failed to get timesheet for ${date}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const dataTools: MCPTool[] = [
  timecardGetProjects,
  timecardGetActivities,
  timecardGetTimesheet
];