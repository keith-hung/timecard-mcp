import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

    const page = session.getPage();
    if (!page) {
      throw new Error('Browser page not available');
    }

    // Ensure args is not null/undefined
    const safeArgs = args || {};
    const { date } = safeArgs;

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
  timecardVersion,
  timecardGetSummary
];
