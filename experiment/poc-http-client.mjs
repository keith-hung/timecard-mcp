/**
 * POC: Replace Playwright with pure HTTP requests
 *
 * Tests:
 *   1. Login via POST /servlet/VerifController
 *   2. Fetch timesheet page (daychoose.jsp) and parse HTML
 *   3. Parse activityList.append() → projects/activities
 *   4. Parse timearray[x][y][z] → timesheet data
 *   5. Parse form state (hidden inputs, select options)
 *   6. Save via POST weekinfo_deal.jsp (dry-run: build form data but don't POST)
 *   7. Logout via GET /logout.jsp
 *
 * Usage:
 *   node experiment/poc-http-client.mjs
 *
 * Requires .env with TIMECARD_BASE_URL, TIMECARD_USERNAME, TIMECARD_PASSWORD
 */

import fs from 'fs';
import path from 'path';

// ─── Load .env ──────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
    console.log('[env] Loaded .env file');
  } else {
    console.log('[env] No .env file, using exported environment variables');
  }
}

loadEnv();

const BASE_URL = (process.env.TIMECARD_BASE_URL || '').replace(/\/$/, '') + '/';
const USERNAME = process.env.TIMECARD_USERNAME;
const PASSWORD = process.env.TIMECARD_PASSWORD;

if (!BASE_URL || !USERNAME || !PASSWORD) {
  console.error('ERROR: Missing TIMECARD_BASE_URL, TIMECARD_USERNAME, or TIMECARD_PASSWORD');
  process.exit(1);
}

console.log(`\n=== POC: HTTP-based TimeCard Client ===`);
console.log(`Server: ${BASE_URL}`);
console.log(`User:   ${USERNAME}\n`);

// ─── Minimal HTTP Client with Cookie Jar ────────────────────────────────────

class SimpleHttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cookies = new Map();
  }

  _parseCookies(headers) {
    const setCookies = headers.getSetCookie?.() || [];
    for (const sc of setCookies) {
      const parts = sc.split(';')[0].split('=');
      if (parts.length >= 2) {
        this.cookies.set(parts[0].trim(), parts.slice(1).join('=').trim());
      }
    }
  }

  _cookieHeader() {
    if (this.cookies.size === 0) return {};
    const cookieStr = Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    return { Cookie: cookieStr };
  }

  _resolveUrl(urlOrPath) {
    if (urlOrPath.startsWith('http')) return urlOrPath;
    // Handle relative paths
    if (urlOrPath.startsWith('/')) return new URL(urlOrPath, this.baseUrl).href;
    return this.baseUrl + urlOrPath;
  }

  async get(urlOrPath) {
    const url = this._resolveUrl(urlOrPath);
    console.log(`  [GET] ${url}`);
    const resp = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: { ...this._cookieHeader() }
    });
    this._parseCookies(resp.headers);

    const body = await resp.text();
    const location = resp.headers.get('location') || '';

    return { status: resp.status, body, location, url, headers: resp.headers };
  }

  async post(urlOrPath, formData) {
    const url = this._resolveUrl(urlOrPath);
    const encodedBody = Object.entries(formData)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    console.log(`  [POST] ${url}  (${Object.keys(formData).length} fields, ${encodedBody.length} bytes)`);
    const resp = await fetch(url, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        ...this._cookieHeader()
      },
      body: encodedBody
    });
    this._parseCookies(resp.headers);

    const body = await resp.text();
    const location = resp.headers.get('location') || '';

    return { status: resp.status, body, location, url, headers: resp.headers };
  }

  /** Follow a chain of redirects */
  async followRedirects(resp, maxRedirects = 5) {
    let current = resp;
    let count = 0;
    while ((current.status === 301 || current.status === 302) && current.location && count < maxRedirects) {
      count++;
      current = await this.get(current.location);
    }
    return current;
  }

  getSessionCookie() {
    return this.cookies.get('JSESSIONID');
  }

  getCookiesJson() {
    return Object.fromEntries(this.cookies);
  }
}

// ─── HTML Parsers ───────────────────────────────────────────────────────────

function parseActivityList(html) {
  const results = [];
  // Live server uses `act.append(pid, name, isBottom, uid, progress)` — 5 params, no activityId
  // JSP source had `activityList.append(...)` with 6 params — but that's a newer build
  // Support both: try 5-param `act.append` first, fall back to 6-param `activityList.append`
  const regex5 = /act\.append\(\s*'([^']*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g;
  const regex6 = /activityList\.append\(\s*'([^']*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g;

  let match;
  // Try 5-param format first (act.append)
  while ((match = regex5.exec(html)) !== null) {
    results.push({
      projectId: match[1],
      name: match[2].replace(/\\'/g, "'"),
      isBottom: match[3],
      uid: match[4],
      progress: match[5],
      activityId: null  // not available in 5-param format
    });
  }

  // If nothing found, try 6-param format (activityList.append)
  if (results.length === 0) {
    while ((match = regex6.exec(html)) !== null) {
      results.push({
        projectId: match[1],
        name: match[2].replace(/\\'/g, "'"),
        isBottom: match[3],
        uid: match[4],
        progress: match[5],
        activityId: match[6]
      });
    }
  }

  return results;
}

function parseTimearray(html) {
  const results = [];
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
      progress: parts[3] || ''
    });
  }
  return results;
}

function parseOvertimeArray(html) {
  const results = [];
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
      progress: parts[3] || ''
    });
  }
  return results;
}

function parseProjectOptions(html) {
  // Parse from the first project select (project0)
  const selectMatch = html.match(/name='project0'[^>]*>([\s\S]*?)<\/select>/);
  if (!selectMatch) return [];

  const results = [];
  const optionRegex = /<option\s+value='(\d+)'>([^<]+)<\/option>/g;
  let match;
  while ((match = optionRegex.exec(selectMatch[1])) !== null) {
    results.push({ id: match[1], name: match[2] });
  }
  return results;
}

function parseHiddenInputs(html) {
  const results = {};
  // Match various attribute orderings for hidden inputs inside the weekly_info form
  // First, try to isolate the form content
  const formMatch = html.match(/name="weekly_info"[\s\S]*?<\/form>/);
  const formHtml = formMatch ? formMatch[0] : html;

  const regex = /<input\s+[^>]*type="hidden"[^>]*>/gi;
  let match;
  while ((match = regex.exec(formHtml)) !== null) {
    const tag = match[0];
    const nameMatch = tag.match(/name="([^"]+)"/);
    const valueMatch = tag.match(/value="([^"]*)"/);
    if (nameMatch) {
      results[nameMatch[1]] = valueMatch ? valueMatch[1] : '';
    }
  }

  // Also match name=... type="hidden" (reversed order, as seen in daychoose.jsp)
  const regex2 = /<input\s+name="([^"]+)"\s+type="hidden"\s+value="([^"]*)"[^>]*>/gi;
  let match2;
  while ((match2 = regex2.exec(formHtml)) !== null) {
    results[match2[1]] = match2[2];
  }

  return results;
}

function parseWeekDates(html) {
  // Extract from the hidden input cdate or from last_week/next_week links
  const cdateMatch = html.match(/name="cdate"\s+type="hidden"\s+value="([^"]*)"/);
  if (cdateMatch) return { cdate: cdateMatch[1] };

  // Also try reversed attribute order
  const cdateMatch2 = html.match(/type="hidden"\s+name="cdate"\s+value="([^"]*)"/);
  if (cdateMatch2) return { cdate: cdateMatch2[1] };

  return { cdate: null };
}

function isLoginPage(html, finalUrl) {
  return (finalUrl || '').includes('login.jsp')
    || html.includes('<title>Login Page</title>')
    || html.includes('name="userform"');
}

function isErrorPage(html) {
  if (html.includes('Error Page') || html.includes('error.jsp')) {
    return { isError: true, message: 'Error page detected' };
  }
  return null;
}

// ─── Index Mapping: projectIndex/activityIndex → actual IDs ─────────────────

function buildIndexMapping(activities) {
  const projectIds = [];
  const projectActivityMap = new Map();

  for (const act of activities) {
    if (!projectActivityMap.has(act.projectId)) {
      projectIds.push(act.projectId);
      projectActivityMap.set(act.projectId, []);
    }
    projectActivityMap.get(act.projectId).push(act.activityId);
  }

  const projectIndexToId = new Map();
  const activityIndexMap = new Map(); // key: `${projIdx}-${actIdx}` → activityId

  projectIds.forEach((pid, i) => {
    projectIndexToId.set(i, pid);
    const acts = projectActivityMap.get(pid) || [];
    acts.forEach((aid, j) => {
      activityIndexMap.set(`${i}-${j + 1}`, aid); // +1: index 0 = "select activity"
    });
  });

  return { projectIndexToId, activityIndexMap, projectIds };
}

// ─── Test Runner ────────────────────────────────────────────────────────────

const client = new SimpleHttpClient(BASE_URL);
let passed = 0;
let failed = 0;

function ok(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}${detail ? ' — ' + detail : ''}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function testLogin() {
  console.log('\n── Test 1: HTTP Login ──');
  const resp = await client.post('servlet/VerifController', {
    method: 'login',
    name: USERNAME,
    pw: PASSWORD
  });

  ok('Response is 302 redirect', resp.status === 302, `status=${resp.status}`);
  ok('JSESSIONID cookie set', !!client.getSessionCookie(),
    client.getSessionCookie() ? `JSESSIONID=${client.getSessionCookie().substring(0, 16)}...` : 'none');
  ok('Redirect to main page', resp.location.includes('ini_mainframe') || resp.location.includes('project'),
    `location=${resp.location}`);

  // Follow redirects to establish session fully
  if (resp.status === 302) {
    await client.followRedirects(resp);
  }

  return resp.status === 302;
}

async function testFetchTimesheet() {
  console.log('\n── Test 2: Fetch Timesheet Page ──');

  // Use today's date
  const today = new Date().toISOString().split('T')[0];
  const resp = await client.get(`Timecard/timecard_week/daychoose.jsp?cho_date=${today}`);

  // It might be a 302 first (to handle the frame layout)
  let html = resp.body;
  let finalUrl = resp.url;
  if (resp.status === 302) {
    const followed = await client.followRedirects(resp);
    html = followed.body;
    finalUrl = followed.url;
  }

  ok('Got HTML response', html.length > 0, `${html.length} bytes`);
  ok('Not redirected to login', !isLoginPage(html, finalUrl), `url=${finalUrl}`);
  ok('No error page', !isErrorPage(html));
  ok('Contains weekly_info form', html.includes('weekly_info'), '');
  ok('Contains activity data (act.append or activityList)', html.includes('act.append') || html.includes('activityList'), '');
  ok('Page title is Timecard System', html.includes('<title>Timecard System</title>'), '');

  return html;
}

async function testParseActivityList(html) {
  console.log('\n── Test 3: Parse activityList ──');

  const activities = parseActivityList(html);
  ok('Parsed activities', activities.length > 0, `count=${activities.length}`);

  if (activities.length > 0) {
    const first = activities[0];
    ok('Has projectId', !!first.projectId, `projectId=${first.projectId}`);
    ok('Has name', !!first.name, `name="${first.name}"`);
    ok('Has isBottom', first.isBottom === 'true' || first.isBottom === 'false', `isBottom=${first.isBottom}`);
    ok('Has uid', !!first.uid, `uid=${first.uid}`);

    // activityId may be null in 5-param format
    const format = first.activityId ? '6-param (with activityId)' : '5-param (no activityId)';
    ok('Detected format', true, format);

    // Group by project
    const projectIds = [...new Set(activities.map(a => a.projectId))];
    ok('Has projects', projectIds.length >= 1, `projects=${projectIds.length}`);

    console.log(`\n  Projects found:`);
    for (const pid of projectIds) {
      const acts = activities.filter(a => a.projectId === pid);
      const bottomCount = acts.filter(a => a.isBottom === 'true').length;
      console.log(`    Project ${pid}: ${acts.length} activities (${bottomCount} leaf nodes)`);
    }

    // Show activity value format (what gets put in <select> value)
    const leafActs = activities.filter(a => a.isBottom === 'true');
    if (leafActs.length > 0) {
      const a = leafActs[0];
      const selectValue = `${a.isBottom}$${a.uid}$${a.projectId}$${a.progress}`;
      console.log(`\n  Activity select value format: bottom$uid$pid$progress`);
      console.log(`  Example: "${selectValue}" for "${a.name}"`);
    }
  }

  return activities;
}

async function testParseTimearray(html) {
  console.log('\n── Test 4: Parse timearray ──');

  const entries = parseTimearray(html);
  const overtimeEntries = parseOvertimeArray(html);

  console.log(`  Normal entries: ${entries.length}, Overtime entries: ${overtimeEntries.length}`);

  if (entries.length > 0) {
    ok('Parsed time entries', true, `count=${entries.length}`);
    const first = entries[0];
    ok('Has projectIndex', first.projectIndex >= 0, `projectIndex=${first.projectIndex}`);
    ok('Has activityIndex', first.activityIndex >= 0, `activityIndex=${first.activityIndex}`);
    ok('Has dayIndex', first.dayIndex >= 0 && first.dayIndex <= 6, `dayIndex=${first.dayIndex}`);
    ok('Has duration', !!first.duration, `duration=${first.duration}`);
    ok('Has status', ['approve', 'submit', 'save', 'reject'].includes(first.status), `status=${first.status}`);

    // Show summary
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyTotals = {};
    for (const e of entries) {
      dailyTotals[e.dayIndex] = (dailyTotals[e.dayIndex] || 0) + parseFloat(e.duration);
    }
    console.log(`\n  Daily totals (normal):`);
    for (const [day, total] of Object.entries(dailyTotals)) {
      console.log(`    ${dayNames[day]}: ${total}hr`);
    }
  } else {
    ok('No time entries (empty week)', true, 'This is valid for a new/empty week');
  }

  return entries;
}

async function testParseProjectOptions(html) {
  console.log('\n── Test 5: Parse Project Options ──');

  const projects = parseProjectOptions(html);
  ok('Parsed project options', projects.length > 0, `count=${projects.length}`);

  if (projects.length > 0) {
    console.log(`\n  Project options:`);
    for (const p of projects) {
      console.log(`    [${p.id}] ${p.name}`);
    }
  }

  return projects;
}

async function testParseFormState(html) {
  console.log('\n── Test 6: Parse Form State ──');

  const hiddenInputs = parseHiddenInputs(html);
  const weekDates = parseWeekDates(html);

  ok('Found hidden inputs', Object.keys(hiddenInputs).length > 0,
    `fields=${Object.keys(hiddenInputs).join(', ')}`);
  ok('Found cdate', !!weekDates.cdate, `cdate=${weekDates.cdate}`);
  ok('Found caller', !!hiddenInputs.caller, `caller=${hiddenInputs.caller}`);

  return { hiddenInputs, weekDates };
}

async function testIndexMapping(activities, timeEntries) {
  console.log('\n── Test 7: Index Mapping ──');

  const mapping = buildIndexMapping(activities);

  ok('Project index map', mapping.projectIndexToId.size > 0,
    `size=${mapping.projectIndexToId.size}`);

  console.log(`\n  Index → Project ID mapping:`);
  for (const [idx, pid] of mapping.projectIndexToId) {
    console.log(`    timearray[${idx}] → project ${pid}`);
  }

  // If we have time entries, verify the mapping resolves
  if (timeEntries.length > 0) {
    const first = timeEntries[0];
    const resolvedProject = mapping.projectIndexToId.get(first.projectIndex);
    const resolvedActivity = mapping.activityIndexMap.get(`${first.projectIndex}-${first.activityIndex}`);
    ok('Resolve project from timearray index', !!resolvedProject,
      `timearray[${first.projectIndex}] → project ${resolvedProject}`);
    ok('Resolve activity from timearray index', !!resolvedActivity,
      `timearray[${first.projectIndex}][${first.activityIndex}] → activity ${resolvedActivity}`);
  }
}

async function testBuildSaveFormData(html, activities, timeEntries) {
  console.log('\n── Test 8: Build Save Form Data (dry-run) ──');

  const hiddenInputs = parseHiddenInputs(html);
  const projects = parseProjectOptions(html);
  const mapping = buildIndexMapping(activities);

  // Build the form data that weekinfo_deal.jsp expects
  const formData = {};

  // Hidden fields
  formData['caller'] = hiddenInputs.caller || 'this_week';
  formData['cdate'] = hiddenInputs.cdate || new Date().toISOString().split('T')[0];

  // Initialize 25 empty rows
  for (let i = 0; i < 25; i++) {
    formData[`project${i}`] = '';
    formData[`activity${i}`] = '';
    formData[`actprogress${i}`] = '';
    for (let k = 0; k < 7; k++) {
      formData[`record${i}_${k}`] = '';
      formData[`note${i}_${k}`] = '';
      formData[`progress${i}_${k}`] = '';
    }
  }

  // Subtotals
  for (let k = 0; k < 7; k++) {
    formData[`norTotal${k}`] = '0';
  }

  // Save action
  formData['save'] = ' save ';

  const totalFields = Object.keys(formData).length;
  ok('Form data constructed', totalFields > 100, `${totalFields} fields`);
  ok('Has save action', formData['save'] === ' save ');
  ok('Has cdate', !!formData['cdate'], `cdate=${formData['cdate']}`);
  ok('No submit button', !formData['submit'] && !formData['submit2']);

  // Count non-empty fields
  const nonEmpty = Object.entries(formData).filter(([, v]) => v !== '').length;
  console.log(`  Total fields: ${totalFields}, Non-empty: ${nonEmpty}`);

  // Encode size check
  const encoded = Object.entries(formData)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  ok('Encoded body size reasonable', encoded.length < 50000, `${encoded.length} bytes`);

  console.log(`\n  ⚠ DRY RUN: Not actually POSTing to weekinfo_deal.jsp`);
  console.log(`  To test the actual save, use the --save flag (CAUTION: writes data!)`);

  return formData;
}

async function testSessionPersistence() {
  console.log('\n── Test 9: Session Persistence ──');

  // Save cookies to file
  const stateFile = path.join(process.cwd(), '.poc-session-state.json');
  const state = {
    cookies: client.getCookiesJson(),
    sessionInfo: {
      authenticated: true,
      username: USERNAME,
      sessionStartTime: new Date().toISOString()
    }
  };
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
  ok('Session state saved', fs.existsSync(stateFile), stateFile);

  // Create new client and restore
  const client2 = new SimpleHttpClient(BASE_URL);
  const loaded = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  for (const [k, v] of Object.entries(loaded.cookies)) {
    client2.cookies.set(k, v);
  }
  ok('Session cookies restored', !!client2.getSessionCookie());

  // Verify restored session works
  const resp = await client2.get('Timecard/timecard_week/daychoose.jsp');
  let html = resp.body;
  if (resp.status === 302) {
    const followed = await client2.followRedirects(resp);
    html = followed.body;
  }
  ok('Restored session still valid', !isLoginPage(html, resp.url));

  // Cleanup
  fs.unlinkSync(stateFile);
}

async function testLogout() {
  console.log('\n── Test 10: Logout ──');

  const resp = await client.get('logout.jsp');
  ok('Logout response', resp.status === 200 || resp.status === 302,
    `status=${resp.status}`);

  // Verify session is dead
  const resp2 = await client.get('Timecard/timecard_week/daychoose.jsp');
  let html = resp2.body;
  let finalUrl = resp2.url || '';
  if (resp2.status === 302) {
    // Follow to see where it goes
    finalUrl = resp2.location;
  }
  ok('Session invalidated (redirect to login)',
    isLoginPage(html, finalUrl) || finalUrl.includes('login'),
    `redirected to: ${finalUrl}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  try {
    // Test 1: Login
    const loginOk = await testLogin();
    if (!loginOk) {
      console.error('\n❌ Login failed, cannot proceed with remaining tests.');
      process.exit(1);
    }

    // Test 2: Fetch timesheet
    const html = await testFetchTimesheet();

    // Test 3: Parse activityList
    const activities = await testParseActivityList(html);

    // Test 4: Parse timearray
    const timeEntries = await testParseTimearray(html);

    // Test 5: Parse project options
    await testParseProjectOptions(html);

    // Test 6: Parse form state
    await testParseFormState(html);

    // Test 7: Index mapping
    await testIndexMapping(activities, timeEntries);

    // Test 8: Build save form data (dry-run)
    await testBuildSaveFormData(html, activities, timeEntries);

    // Test 9: Session persistence
    await testSessionPersistence();

    // Test 10: Logout
    await testLogout();

  } catch (error) {
    console.error(`\n❌ Unexpected error: ${error.message}`);
    console.error(error.stack);
    failed++;
  }

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`${'═'.repeat(50)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
