// ─── Types ─────────────────────────────────────────────────────────────────

export interface ActivityListEntry {
  projectId: string;
  name: string;
  isBottom: string;       // "true" or "false"
  uid: string;
  progress: string;
  activityId: string | null;
}

export interface TimearrayEntry {
  projectIndex: number;
  activityIndex: number;
  dayIndex: number;
  duration: string;
  status: string;
  note: string;
  progress: string;
}

export interface ProjectOption {
  id: string;
  name: string;
}

export interface ErrorInfo {
  isError: true;
  mainMessage: string;
  exceptionType: string;
  exceptionMessage: string;
}

// ─── Activity List Parser ──────────────────────────────────────────────────

/**
 * Parse activity list from HTML.
 * Supports both 5-param `act.append()` (live server) and
 * 6-param `activityList.append()` (JSP source) formats.
 */
export function parseActivityList(html: string): ActivityListEntry[] {
  const results: ActivityListEntry[] = [];

  // 5-param format: act.append(projectId, name, isBottom, uid, progress)
  const regex5 = /act\.append\(\s*'([^']*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g;
  let match;
  while ((match = regex5.exec(html)) !== null) {
    results.push({
      projectId: match[1],
      name: match[2].replace(/\\'/g, "'"),
      isBottom: match[3],
      uid: match[4],
      progress: match[5],
      activityId: null,
    });
  }

  // Fall back to 6-param format: activityList.append(projectId, name, isBottom, uid, progress, activityId)
  if (results.length === 0) {
    const regex6 = /activityList\.append\(\s*'([^']*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g;
    while ((match = regex6.exec(html)) !== null) {
      results.push({
        projectId: match[1],
        name: match[2].replace(/\\'/g, "'"),
        isBottom: match[3],
        uid: match[4],
        progress: match[5],
        activityId: match[6],
      });
    }
  }

  return results;
}

// ─── Timearray Parser ──────────────────────────────────────────────────────

/**
 * Parse timearray[projectIndex][activityIndex][dayIndex] = "duration$status$note$progress"
 */
export function parseTimearray(html: string): TimearrayEntry[] {
  const results: TimearrayEntry[] = [];
  const regex = /timearray\[(\d+)\]\[(\d+)\]\[(\d+)\]\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const parts = match[4].split('$');
    results.push({
      projectIndex: parseInt(match[1]),
      activityIndex: parseInt(match[2]),
      dayIndex: parseInt(match[3]),
      duration: parts[0] || '',
      status: parts[1] || '',
      note: (parts[2] || '').replace(/\\n/g, '\n'),
      progress: parts[3] || '',
    });
  }
  return results;
}

/**
 * Parse overtimeArray (same format as timearray).
 */
export function parseOvertimeArray(html: string): TimearrayEntry[] {
  const results: TimearrayEntry[] = [];
  const regex = /overtimeArray\[(\d+)\]\[(\d+)\]\[(\d+)\]\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const parts = match[4].split('$');
    results.push({
      projectIndex: parseInt(match[1]),
      activityIndex: parseInt(match[2]),
      dayIndex: parseInt(match[3]),
      duration: parts[0] || '',
      status: parts[1] || '',
      note: (parts[2] || '').replace(/\\n/g, '\n'),
      progress: parts[3] || '',
    });
  }
  return results;
}

// ─── Project Options Parser ────────────────────────────────────────────────

/**
 * Parse <option> tags from the project0 select element.
 */
export function parseProjectOptions(html: string): ProjectOption[] {
  const selectMatch = html.match(/name='project0'[^>]*>([\s\S]*?)<\/select>/);
  if (!selectMatch) return [];

  const results: ProjectOption[] = [];
  const optionRegex = /<option\s+value='(\d+)'[^>]*>([^<]+)<\/option>/g;
  let match;
  while ((match = optionRegex.exec(selectMatch[1])) !== null) {
    results.push({ id: match[1], name: match[2].trim() });
  }
  return results;
}

// ─── Hidden Inputs Parser ──────────────────────────────────────────────────

/**
 * Parse all <input type="hidden"> fields within the weekly_info form.
 */
export function parseHiddenInputs(html: string): Record<string, string> {
  const results: Record<string, string> = {};

  // Try to find the weekly_info form section
  const formMatch = html.match(/name="weekly_info"[\s\S]*?<\/form>/);
  const searchHtml = formMatch ? formMatch[0] : html;

  // Match hidden inputs with various attribute orders
  const regex = /<input\s+[^>]*type="hidden"[^>]*>/gi;
  let match;
  while ((match = regex.exec(searchHtml)) !== null) {
    const tag = match[0];
    const nameMatch = tag.match(/name="([^"]*)"/);
    const valueMatch = tag.match(/value="([^"]*)"/);
    if (nameMatch) {
      results[nameMatch[1]] = valueMatch ? valueMatch[1] : '';
    }
  }

  return results;
}

// ─── Week Date Parser ──────────────────────────────────────────────────────

/**
 * Parse the cdate hidden input value.
 */
export function parseWeekDate(html: string): string | null {
  const match = html.match(/name="cdate"[^>]*value="([^"]*)"/);
  return match ? match[1] : null;
}

// ─── Page Detection ────────────────────────────────────────────────────────

/**
 * Detect if the response is a login page (session expired).
 */
export function isLoginPage(html: string, finalUrl: string): boolean {
  return finalUrl.includes('login.jsp')
    || html.includes('name="userform"')
    || html.includes('<title>Login</title>');
}

/**
 * Detect if the response is an error page.
 */
export function isErrorPage(html: string): boolean {
  return html.includes('Error Page') || html.includes('/errorMsg/error.jsp');
}

/**
 * Parse error page details if it is an error page.
 */
export function parseErrorPage(html: string): ErrorInfo | null {
  if (!isErrorPage(html)) return null;

  // Extract error info from the error page HTML
  const mainMatch = html.match(/<b>([^<]*)<\/b>/);
  const typeMatch = html.match(/Exception Type:\s*<\/td>\s*<td[^>]*>([^<]*)/);
  const msgMatch = html.match(/Exception Message:\s*<\/td>\s*<td[^>]*>([^<]*)/);

  return {
    isError: true,
    mainMessage: mainMatch ? mainMatch[1].trim() : 'Unknown error',
    exceptionType: typeMatch ? typeMatch[1].trim() : '',
    exceptionMessage: msgMatch ? msgMatch[1].trim() : '',
  };
}

// ─── Index Mapping ─────────────────────────────────────────────────────────

export interface IndexMapping {
  /** Maps timearray project index → project ID */
  projectIndexToId: Map<number, string>;
  /** Maps (projectIndex, activityIndex) → activity entry */
  activityByIndex: Map<string, ActivityListEntry>;
}

/**
 * Build timearray index → project/activity mapping from activity list.
 * Activities are ordered by project (in insertion order), then by activity within project.
 * timearray[i][0] is "select activity" placeholder, so activity indices start at 1.
 */
export function buildIndexMapping(activities: ActivityListEntry[]): IndexMapping {
  const projectIds: string[] = [];
  const projectActivityMap = new Map<string, ActivityListEntry[]>();

  for (const act of activities) {
    if (!projectActivityMap.has(act.projectId)) {
      projectIds.push(act.projectId);
      projectActivityMap.set(act.projectId, []);
    }
    projectActivityMap.get(act.projectId)!.push(act);
  }

  const projectIndexToId = new Map<number, string>();
  const activityByIndex = new Map<string, ActivityListEntry>();

  projectIds.forEach((pid, i) => {
    projectIndexToId.set(i, pid);
    const acts = projectActivityMap.get(pid) || [];
    acts.forEach((act, j) => {
      // +1 because timearray[i][0] is the "select activity" placeholder
      activityByIndex.set(`${i}_${j + 1}`, act);
    });
  });

  return { projectIndexToId, activityByIndex };
}

// ─── Form State Reconstruction ─────────────────────────────────────────────

/**
 * Reconstruct the full form state as it would be after JavaScript initialization.
 * This combines hidden inputs (from HTML), timearray data, and activity list data
 * to produce the same result as reading the DOM after page load.
 */
export function reconstructFormState(
  html: string,
  activities: ActivityListEntry[],
  timeEntries: TimearrayEntry[],
  overtimeEntries: TimearrayEntry[],
): Record<string, string> {
  // Start with hidden inputs
  const form = parseHiddenInputs(html);

  // Build index mapping
  const mapping = buildIndexMapping(activities);
  const projects = parseProjectOptions(html);
  const projectNameMap = new Map(projects.map(p => [p.id, p.name]));

  // Group time entries by (projectIndex, activityIndex) to find unique rows
  const normalRows = new Map<string, { projectIndex: number; activityIndex: number; entries: TimearrayEntry[] }>();
  for (const entry of timeEntries) {
    const key = `${entry.projectIndex}_${entry.activityIndex}`;
    if (!normalRows.has(key)) {
      normalRows.set(key, { projectIndex: entry.projectIndex, activityIndex: entry.activityIndex, entries: [] });
    }
    normalRows.get(key)!.entries.push(entry);
  }

  // Fill normal rows (project, activity, record selects)
  let rowIndex = 0;
  for (const [key, row] of normalRows) {
    const projectId = mapping.projectIndexToId.get(row.projectIndex) || '';
    const actEntry = mapping.activityByIndex.get(key);

    form[`project${rowIndex}`] = projectId;

    if (actEntry) {
      form[`activity${rowIndex}`] = `${actEntry.isBottom}$${actEntry.uid}$${actEntry.projectId}$${actEntry.progress}`;
      form[`actprogress${rowIndex}`] = actEntry.progress;
    } else {
      form[`activity${rowIndex}`] = '';
      form[`actprogress${rowIndex}`] = '';
    }

    // Set record values for each day
    for (const entry of row.entries) {
      if (entry.duration) {
        form[`record${rowIndex}_${entry.dayIndex}`] = entry.duration;
      }
    }

    rowIndex++;
  }

  // Initialize remaining normal rows as empty
  for (let i = rowIndex; i < 25; i++) {
    if (!form[`project${i}`]) form[`project${i}`] = '';
    if (!form[`activity${i}`]) form[`activity${i}`] = '';
    for (let k = 0; k < 7; k++) {
      if (!form[`record${i}_${k}`]) form[`record${i}_${k}`] = '';
    }
  }

  // Handle overtime rows similarly
  const overtimeRows = new Map<string, { projectIndex: number; activityIndex: number; entries: TimearrayEntry[] }>();
  for (const entry of overtimeEntries) {
    const key = `${entry.projectIndex}_${entry.activityIndex}`;
    if (!overtimeRows.has(key)) {
      overtimeRows.set(key, { projectIndex: entry.projectIndex, activityIndex: entry.activityIndex, entries: [] });
    }
    overtimeRows.get(key)!.entries.push(entry);
  }

  let overRowIndex = 0;
  for (const [key, row] of overtimeRows) {
    const projectId = mapping.projectIndexToId.get(row.projectIndex) || '';
    const actEntry = mapping.activityByIndex.get(key);

    form[`overproject${overRowIndex}`] = projectId;
    if (actEntry) {
      form[`overactivity${overRowIndex}`] = `${actEntry.isBottom}$${actEntry.uid}$${actEntry.projectId}$${actEntry.progress}`;
    } else {
      form[`overactivity${overRowIndex}`] = '';
    }

    for (const entry of row.entries) {
      if (entry.duration) {
        form[`overrecord${overRowIndex}_${entry.dayIndex}`] = entry.duration;
      }
    }

    overRowIndex++;
  }

  // Initialize remaining overtime rows
  for (let i = overRowIndex; i < 25; i++) {
    if (!form[`overproject${i}`]) form[`overproject${i}`] = '';
    if (!form[`overactivity${i}`]) form[`overactivity${i}`] = '';
    for (let k = 0; k < 7; k++) {
      if (!form[`overrecord${i}_${k}`]) form[`overrecord${i}_${k}`] = '';
    }
  }

  return form;
}
