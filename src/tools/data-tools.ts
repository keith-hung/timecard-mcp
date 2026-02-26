import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';
import {
  parseActivityList,
  parseTimearray,
  buildIndexMapping,
} from '../parser/html-parser.js';

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

    try {
      const projects = await session.getProjectOptions();

      return {
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.name
        })),
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

    const safeArgs = args || {};
    const { project_id } = safeArgs;

    try {
      const allActivities = await session.getActivityList();

      // Filter to leaf activities (isBottom='true') for the specified project
      const activities = allActivities
        .filter(a => a.projectId === project_id && a.isBottom === 'true')
        .map(a => ({
          id: a.uid,
          name: a.name.replace(/<<.*?>>/, '').trim(),
          description: a.name.replace(/<<.*?>>/, '').trim(),
          value: `${a.isBottom}$${a.uid}$${a.projectId}$${a.progress}`
        }));

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

    const safeArgs = args || {};
    const { date } = safeArgs;

    try {
      // Fetch the page (also sets session attributes for save)
      const html = await session.fetchTimesheetPage(date);

      // Calculate week boundaries
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();
      const monday = new Date(targetDate);
      monday.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);

      const weekStart = monday.toISOString().split('T')[0];
      const weekEnd = saturday.toISOString().split('T')[0];

      // Parse data from HTML
      const activities = parseActivityList(html);
      const timeEntries = parseTimearray(html);
      const mapping = buildIndexMapping(activities);

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      // Group time entries by (projectIndex, activityIndex)
      const entryGroups = new Map<string, {
        projectIndex: number;
        activityIndex: number;
        entries: typeof timeEntries;
      }>();

      for (const entry of timeEntries) {
        const key = `${entry.projectIndex}_${entry.activityIndex}`;
        if (!entryGroups.has(key)) {
          entryGroups.set(key, {
            projectIndex: entry.projectIndex,
            activityIndex: entry.activityIndex,
            entries: [],
          });
        }
        entryGroups.get(key)!.entries.push(entry);
      }

      // Build output entries
      const entriesWithStatus: Array<{
        index: number;
        project: { id: string; name: string };
        activity: { id: string; name: string };
        daily_hours: Record<string, number>;
        daily_status: Record<string, string>;
        daily_notes: Record<string, string>;
      }> = [];

      // Get project names from project options
      const projectOptions = await session.getProjectOptions(date);
      const projectNameMap = new Map(projectOptions.map(p => [p.id, p.name]));

      let entryIndex = 0;
      for (const [key, group] of entryGroups) {
        const projectId = mapping.projectIndexToId.get(group.projectIndex) || '';
        const actEntry = mapping.activityByIndex.get(key);

        const projectName = projectNameMap.get(projectId) || `Project ${projectId}`;
        const activityId = actEntry?.uid || '';
        const activityName = actEntry
          ? actEntry.name.replace(/<<.*?>>/, '').trim()
          : '';

        const dailyHours: Record<string, number> = {};
        const dailyStatus: Record<string, string> = {};
        const dailyNotes: Record<string, string> = {};

        // Initialize all days
        for (let d = 0; d < 6; d++) {
          dailyHours[days[d]] = 0;
          dailyStatus[days[d]] = 'draft';
          dailyNotes[days[d]] = '';
        }

        // Fill in data from timearray entries
        for (const entry of group.entries) {
          if (entry.dayIndex >= 0 && entry.dayIndex < 6) {
            const dayName = days[entry.dayIndex];
            dailyHours[dayName] = parseFloat(entry.duration) || 0;
            dailyNotes[dayName] = entry.note;

            // Map status values
            if (entry.status === 'approve') {
              dailyStatus[dayName] = 'approved';
            } else if (entry.status === 'submit') {
              dailyStatus[dayName] = 'submitted';
            } else if (entry.status === 'reject') {
              dailyStatus[dayName] = 'rejected';
            } else {
              dailyStatus[dayName] = 'draft';
            }
          }
        }

        entriesWithStatus.push({
          index: entryIndex++,
          project: { id: projectId, name: projectName },
          activity: { id: activityId, name: activityName },
          daily_hours: dailyHours,
          daily_status: dailyStatus,
          daily_notes: dailyNotes,
        });
      }

      // Determine overall status
      let overallStatus = 'draft';
      const statusPriority: Record<string, number> = {
        'draft': 0, 'approved': 1, 'submitted': 2, 'rejected': 3
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

    try {
      const today = new Date().toISOString().split('T')[0];
      const htmlContent = await session.fetchTimesheetPage(today);

      const hasActAppend = htmlContent.includes('act.append');

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
