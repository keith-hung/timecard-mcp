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
      // Navigate to timesheet page to access JavaScript source
      const today = new Date().toISOString().split('T')[0];
      await session.navigateToTimesheet(today);

      // Extract project data directly from the 'act' object in browser context
      const projectsData = await page.evaluate(() => {
        // @ts-ignore - act is a global variable in the browser context
        if (typeof act === 'undefined' || !act.collect) {
          return null;
        }

        const projectMap = new Map();
        // @ts-ignore - act is a global variable in the browser context
        for (let i = 0; i <= act.cnt; i++) {
          // @ts-ignore - act is a global variable in the browser context
          const item = act.collect[i];
          if (!item) continue;

          // Only process top-level projects (is_bottom = false and no leading spaces)
          if (item.bottom === 'false' && !item.name.startsWith(' ')) {
            const cleanName = item.name.replace(/<<.*?>>/, '').trim();

            if (!projectMap.has(item.pid)) {
              projectMap.set(item.pid, {
                id: item.pid,
                name: cleanName,
                description: cleanName
              });
            }
          }
        }

        return Array.from(projectMap.values());
      });

      if (!projectsData) {
        throw new Error('Could not access act object in browser context');
      }

      const projects = projectsData;

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
      // Navigate to timesheet page to access JavaScript source
      const today = new Date().toISOString().split('T')[0];
      await session.navigateToTimesheet(today);

      // Extract activities data directly from the 'act' object in browser context
      const activitiesData = await page.evaluate((projectId) => {
        // @ts-ignore - act is a global variable in the browser context
        if (typeof act === 'undefined' || !act.collect) {
          return null;
        }

        const activities = [];
        // @ts-ignore - act is a global variable in the browser context
        for (let i = 0; i <= act.cnt; i++) {
          // @ts-ignore - act is a global variable in the browser context
          const item = act.collect[i];
          if (!item) continue;

          // Only process activities for the specified project
          // Activities are marked with is_bottom = 'true'
          if (item.pid === projectId && item.bottom === 'true') {
            const cleanName = item.name.replace(/<<.*?>>/, '').trim();

            activities.push({
              id: item.uid,
              name: cleanName,
              description: cleanName,
              value: item.bottom + '$' + item.uid + '$' + item.pid + '$' + item.progress
            });
          }
        }

        return activities;
      }, project_id);

      if (!activitiesData) {
        throw new Error('Could not access act object in browser context');
      }

      return {
        project_id,
        activities: activitiesData,
        count: activitiesData.length
      };
    } catch (error) {
      throw new Error(`Failed to get activities for project ${project_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

const timecardGetTimesheet: MCPTool = {
  name: 'timecard_get_timesheet',
  description: `Get timesheet data for a specific week (includes automatic navigation).

⚠️ CRITICAL: Data Visibility - This retrieves SAVED data from server only!

Understanding the data flow:
┌───────────────────┐
│ set_* tools       │ → Queue updates in memory (temporary, not saved)
└───────────────────┘
         ↓
┌───────────────────┐
│ save              │ → Sends queued data to server (permanent save)
└───────────────────┘
         ↓
┌───────────────────┐
│ get_timesheet     │ → Retrieves saved data from server (this tool)
└───────────────────┘

Common mistake - DON'T do this:
  set_hours([...])
  data = get_timesheet("2025-11-05")  # ❌ Won't see the change yet!

Correct approach - DO this:
  set_hours([...])
  save()                              # ✅ Save first
  data = get_timesheet("2025-11-05")  # ✅ Now you'll see the change

When to use this tool:
- BEFORE making changes: To see what's currently saved and load page for set_entries
- AFTER save: To verify your changes were saved correctly
- NOT between set_* and save: You won't see pending changes

IMPORTANT: Recent changes made with set_entries/set_hours/set_notes are NOT visible until you call save first.`,
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

const timecardDebugPageContent: MCPTool = {
  name: 'timecard_debug_page_content',
  description: 'Debug tool to check page content',
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
      const today = new Date().toISOString().split('T')[0];
      await session.navigateToTimesheet(today);

      const htmlContent = await page.content();

      // Check if act.append exists in raw HTML
      const hasActAppend = htmlContent.includes('act.append');

      // Get first 1000 chars of each script
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
      const scripts = [...htmlContent.matchAll(scriptRegex)];

      const scriptInfo = scripts.map((s, idx) => ({
        index: idx,
        hasActAppend: s[1].includes('act.append'),
        preview: s[1].substring(0, 200)
      }));

      return {
        hasActAppend,
        totalScripts: scripts.length,
        scripts: scriptInfo
      };
    } catch (error) {
      throw new Error(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const dataTools: MCPTool[] = [
  timecardGetProjects,
  timecardGetActivities,
  timecardGetTimesheet,
  timecardDebugPageContent
];