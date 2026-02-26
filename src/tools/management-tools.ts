import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  parseActivityList,
  parseTimearray,
  buildIndexMapping,
  parseProjectOptions,
} from '../parser/html-parser.js';

// Read version info generated during build
function getVersionInfo() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const versionPath = join(__dirname, '..', 'version.json');
    const versionData = readFileSync(versionPath, 'utf8');
    return JSON.parse(versionData);
  } catch {
    return {
      commit: 'unknown',
      branch: 'unknown',
      buildDate: 'unknown'
    };
  }
}

const timecardVersion: MCPTool = {
  name: 'timecard_version',
  description: `Get TimeCard MCP version information.

Returns:
- commit: Git commit hash (e.g., "801fd99" or "801fd99-dirty" if has uncommitted changes)
- branch: Git branch name (e.g., "v2-batch-operations")
- buildDate: ISO timestamp when the MCP was built

Use this to verify which version of TimeCard MCP is running.`,
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  },
  handler: async (_args, _session: TimeCardSession) => {
    return getVersionInfo();
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

    const safeArgs = args || {};
    const { date } = safeArgs;

    try {
      // Fetch the page
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

      // Parse data
      const activities = parseActivityList(html);
      const timeEntries = parseTimearray(html);
      const projectOptions = parseProjectOptions(html);
      const mapping = buildIndexMapping(activities);
      const projectNameMap = new Map(projectOptions.map(p => [p.id, p.name]));

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      const dailyTotals: Record<string, number> = {
        monday: 0, tuesday: 0, wednesday: 0,
        thursday: 0, friday: 0, saturday: 0
      };

      const projectBreakdown: Record<string, number> = {};
      let totalHours = 0;

      // Group entries by (projectIndex, activityIndex)
      const entryGroups = new Map<string, {
        projectIndex: number;
        entries: typeof timeEntries;
      }>();

      for (const entry of timeEntries) {
        const key = `${entry.projectIndex}_${entry.activityIndex}`;
        if (!entryGroups.has(key)) {
          entryGroups.set(key, { projectIndex: entry.projectIndex, entries: [] });
        }
        entryGroups.get(key)!.entries.push(entry);
      }

      const activeEntries = entryGroups.size;

      for (const [, group] of entryGroups) {
        const projectId = mapping.projectIndexToId.get(group.projectIndex) || '';
        const projectName = projectNameMap.get(projectId) || `Project ${projectId}`;

        if (!projectBreakdown[projectName]) {
          projectBreakdown[projectName] = 0;
        }

        for (const entry of group.entries) {
          if (entry.dayIndex >= 0 && entry.dayIndex < 6) {
            const hours = parseFloat(entry.duration) || 0;
            if (hours > 0) {
              dailyTotals[days[entry.dayIndex]] += hours;
              totalHours += hours;
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
  timecardVersion,
  timecardGetSummary
];
