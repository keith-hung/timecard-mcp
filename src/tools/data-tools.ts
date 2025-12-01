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

Returns for each entry:
- daily_hours: Hours worked each day (monday-saturday)
- daily_status: Approval status each day (draft/submitted/approved/rejected)
- daily_notes: Notes for each day

Status values:
- draft: Saved but not submitted
- submitted: Submitted for approval (顯示藍色)
- approved: Approved by manager (顯示綠色)
- rejected: Rejected by manager (顯示紅色)

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

      // Extract existing timesheet entries directly from timearray JavaScript variable
      // timearray structure: timearray[projectIndex][activityIndex][dayIndex] = "duration$approve$note$progress"
      // This is more reliable than reading DOM elements as it's set by JSP at page load
      const entriesWithStatus = await page.evaluate(() => {
        const entries: Array<{
          index: number;
          project: { id: string; name: string };
          activity: { id: string; name: string };
          daily_hours: Record<string, number>;
          daily_status: Record<string, string>;
          daily_notes: Record<string, string>;
        }> = [];

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        // @ts-ignore - timearray is a global variable set by JSP
        if (typeof timearray === 'undefined' || !timearray) {
          return entries;
        }

        // @ts-ignore - activityList is a global variable containing project/activity info
        const actList = typeof activityList !== 'undefined' ? activityList : null;

        let entryIndex = 0;

        // Iterate through timearray to find all entries with data
        // @ts-ignore
        for (let projIdx = 0; projIdx < timearray.length; projIdx++) {
          // @ts-ignore
          if (!timearray[projIdx]) continue;

          // @ts-ignore
          for (let actIdx = 0; actIdx < timearray[projIdx].length; actIdx++) {
            // @ts-ignore
            if (!timearray[projIdx][actIdx]) continue;

            // Check if this entry has any data (any day with non-empty value)
            let hasData = false;
            // @ts-ignore
            for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
              // @ts-ignore
              if (timearray[projIdx][actIdx][dayIdx]) {
                hasData = true;
                break;
              }
            }

            if (!hasData) continue;

            // Extract project and activity info from activityList
            let projectId = '';
            let projectName = '';
            let activityId = '';
            let activityName = '';

            if (actList && actList.collect) {
              // Find matching project/activity in activityList
              let projCount = 0;
              for (let i = 0; i <= actList.cnt; i++) {
                const item = actList.collect[i];
                if (!item) continue;

                // Count projects to match projIdx
                if (item.bottom === 'false' && !item.name.startsWith(' ')) {
                  if (projCount === projIdx) {
                    projectId = item.pid;
                    projectName = item.name.replace(/<<.*?>>/, '').trim();
                  }
                  projCount++;
                }

                // Find activity at actIdx position for this project
                if (item.pid === projectId && item.bottom === 'true') {
                  // actIdx is 1-based in timearray (0 is "-- select activity --")
                  activityId = item.uid;
                  activityName = item.name.replace(/<<.*?>>/, '').trim();
                }
              }
            }

            const dailyHours: Record<string, number> = {};
            const dailyStatus: Record<string, string> = {};
            const dailyNotes: Record<string, string> = {};

            // Read data for each day (0-5 for Mon-Sat, we skip Sunday index 6)
            for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
              // @ts-ignore
              const dayData = timearray[projIdx][actIdx][dayIdx];

              if (dayData && typeof dayData === 'string') {
                // Parse "duration$approve$note$progress"
                const parts = dayData.split('$');
                const duration = parseFloat(parts[0]) || 0;
                const approve = parts[1] || 'save';
                const note = parts[2] || '';

                dailyHours[days[dayIdx]] = duration;
                dailyNotes[days[dayIdx]] = note;

                // Map approve values to status
                // TCRS uses: save, submit, approve, reject
                if (approve === 'approve') {
                  dailyStatus[days[dayIdx]] = 'approved';
                } else if (approve === 'submit') {
                  dailyStatus[days[dayIdx]] = 'submitted';
                } else if (approve === 'reject') {
                  dailyStatus[days[dayIdx]] = 'rejected';
                } else {
                  dailyStatus[days[dayIdx]] = 'draft';
                }
              } else {
                dailyHours[days[dayIdx]] = 0;
                dailyStatus[days[dayIdx]] = 'draft';
                dailyNotes[days[dayIdx]] = '';
              }
            }

            entries.push({
              index: entryIndex++,
              project: {
                id: projectId,
                name: projectName
              },
              activity: {
                id: activityId,
                name: activityName
              },
              daily_hours: dailyHours,
              daily_status: dailyStatus,
              daily_notes: dailyNotes
            });
          }
        }

        return entries;
      });

      // Determine overall timesheet status based on all entries
      // Priority: rejected > submitted > approved > draft
      let overallStatus = 'draft';
      const statusPriority: Record<string, number> = {
        'draft': 0,
        'approved': 1,
        'submitted': 2,
        'rejected': 3
      };

      for (const entry of entriesWithStatus) {
        for (const day of Object.keys(entry.daily_status)) {
          const dayStatus = entry.daily_status[day];
          if (entry.daily_hours[day] > 0 && statusPriority[dayStatus] > statusPriority[overallStatus]) {
            overallStatus = dayStatus;
          }
        }
      }

      return {
        week_start: weekStart,
        week_end: weekEnd,
        entries: entriesWithStatus,
        status: overallStatus
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