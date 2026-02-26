/**
 * Inspect timearray and act.append format from a week with actual data
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
}

async function getPage(date) {
  const cookieStr = Array.from(cookies.entries()).map(([k, v]) => k + '=' + v).join('; ');
  const resp = await fetch(BASE_URL + 'Timecard/timecard_week/daychoose.jsp?cho_date=' + date, {
    headers: { Cookie: cookieStr }
  });
  return resp.text();
}

await login();

// Try a past week that likely has data
const testDates = ['2026-02-23', '2026-02-16', '2026-02-09'];

for (const date of testDates) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Checking week of ${date}`);
  console.log('='.repeat(60));

  const html = await getPage(date);

  // Count act.append calls
  const appendMatches = html.match(/act\.append\([^)]+\)/g) || [];
  console.log(`\nact.append() calls: ${appendMatches.length}`);

  // Show first 3 act.append calls
  if (appendMatches.length > 0) {
    console.log('\nFirst 3 act.append() calls:');
    for (let i = 0; i < Math.min(3, appendMatches.length); i++) {
      console.log(`  ${appendMatches[i]}`);
    }
  }

  // Count timearray assignments
  const timearrayMatches = html.match(/timearray\[\d+\]\[\d+\]\[\d+\]\s*=\s*"[^"]*"/g) || [];
  console.log(`\ntimearray assignments: ${timearrayMatches.length}`);

  // Show all timearray entries
  if (timearrayMatches.length > 0) {
    console.log('\nAll timearray entries:');
    for (const m of timearrayMatches) {
      console.log(`  ${m}`);
    }
  }

  // Count overtimeArray assignments
  const overtimeMatches = html.match(/overtimeArray\[\d+\]\[\d+\]\[\d+\]\s*=\s*"[^"]*"/g) || [];
  console.log(`\novertimeArray assignments: ${overtimeMatches.length}`);
  if (overtimeMatches.length > 0) {
    for (const m of overtimeMatches) {
      console.log(`  ${m}`);
    }
  }

  // Check activity select value format (from the fill() function or option values)
  const activityValueRegex = /formObject\.options\[cnt\+\+\]\s*=\s*new\s+Option\(([^)]+)\)/g;
  const fillMatch = html.match(activityValueRegex);
  if (fillMatch) {
    console.log('\nActivity option format (from fill function):');
    console.log(`  ${fillMatch[0]}`);
  }

  // Look for the fill() function to understand activity value format
  const fillFuncIdx = html.indexOf('function fill(');
  if (fillFuncIdx > -1) {
    console.log('\nfill() function:');
    console.log(html.substring(fillFuncIdx, fillFuncIdx + 600));
  }

  // If we found data, stop checking more dates
  if (timearrayMatches.length > 0) break;
}

// Also check the activity value format used in the select options
console.log('\n' + '='.repeat(60));
console.log('Checking activity select value format');
console.log('='.repeat(60));

const html = await getPage('2026-02-23');

// Find the fillActivity / fill function to understand the value format
const fillIdx = html.indexOf('function fill(');
if (fillIdx > -1) {
  const fillEnd = html.indexOf('}', fillIdx + 200);
  console.log('\n' + html.substring(fillIdx, fillEnd + 1));
}

// Check if there's a changeActivity function
const changeIdx = html.indexOf('function changeActivity(');
if (changeIdx > -1) {
  const changeEnd = html.indexOf('\n    }', changeIdx + 100);
  console.log('\n' + html.substring(changeIdx, changeEnd + 6));
}
