/**
 * Inspect actual HTML from daychoose.jsp to understand activityList format
 */

const BASE_URL = process.env.TIMECARD_BASE_URL;
const cookies = new Map();

async function login() {
  const resp = await fetch(BASE_URL + 'servlet/VerifController', {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'method=login&name=' + process.env.TIMECARD_USERNAME + '&pw=' + encodeURIComponent(process.env.TIMECARD_PASSWORD)
  });
  for (const sc of resp.headers.getSetCookie()) {
    const [kv] = sc.split(';');
    const [k, ...v] = kv.split('=');
    cookies.set(k.trim(), v.join('=').trim());
  }
  console.log('Logged in, JSESSIONID:', cookies.get('JSESSIONID')?.substring(0, 16) + '...');
}

async function getPage(date) {
  const cookieStr = Array.from(cookies.entries()).map(([k, v]) => k + '=' + v).join('; ');
  const resp = await fetch(BASE_URL + 'Timecard/timecard_week/daychoose.jsp?cho_date=' + date, {
    headers: { Cookie: cookieStr }
  });
  return resp.text();
}

await login();
const html = await getPage('2026-02-26');

console.log('HTML length:', html.length, 'bytes\n');

// Search for key patterns
const patterns = [
  'activityList',
  'act.append',
  'act.collect',
  '.append(',
  'new unit(',
  'function unit(',
  'function appendUnit(',
  'timearray',
  'overtimeArray',
];

console.log('=== Pattern Search ===');
for (const p of patterns) {
  const idx = html.indexOf(p);
  const count = html.split(p).length - 1;
  console.log(`  ${p.padEnd(25)} ${idx === -1 ? 'NOT FOUND' : `FOUND (${count}x) first at index ${idx}`}`);
}

// Extract around 'function unit(' if found
const unitIdx = html.indexOf('function unit(');
if (unitIdx > -1) {
  console.log('\n=== Around function unit() ===');
  console.log(html.substring(unitIdx, unitIdx + 500));
}

// Look for .append( calls and what variable they belong to
const appendRegex = /(\w+)\.append\(/g;
let match;
const appendVarNames = new Set();
while ((match = appendRegex.exec(html)) !== null) {
  appendVarNames.add(match[1]);
}
console.log('\n=== Variables with .append() ===');
console.log([...appendVarNames]);

// If activityList.append not found, look for the actual append calls
const firstAppendIdx = html.indexOf('.append(');
if (firstAppendIdx > -1) {
  console.log('\n=== First .append() context (500 chars before and after) ===');
  const start = Math.max(0, firstAppendIdx - 200);
  const end = Math.min(html.length, firstAppendIdx + 500);
  console.log(html.substring(start, end));
}

// Also look for the variable that holds activity data
// Maybe it's called 'act' not 'activityList'?
const actVarIdx = html.indexOf('var act');
if (actVarIdx > -1) {
  console.log('\n=== Around "var act" ===');
  console.log(html.substring(actVarIdx, actVarIdx + 300));
}

// Also check 'var activityList'
const actListIdx = html.indexOf('var activityList');
if (actListIdx > -1) {
  console.log('\n=== Around "var activityList" ===');
  console.log(html.substring(actListIdx, actListIdx + 300));
}

// Dump a portion of script tags
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let scriptMatch;
let scriptNum = 0;
while ((scriptMatch = scriptRegex.exec(html)) !== null) {
  scriptNum++;
  const content = scriptMatch[1].trim();
  if (content.length > 50) {
    console.log(`\n=== Script #${scriptNum} (${content.length} chars) ===`);
    // Show first 300 chars
    console.log(content.substring(0, 300));
    if (content.length > 300) console.log('... [truncated]');
  }
}
