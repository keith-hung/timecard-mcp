#!/usr/bin/env node

// Test script to verify URL handling logic

const testCases = [
  { input: 'http://example.com', expected: 'http://example.com/TimeCard/' },
  { input: 'http://example.com/', expected: 'http://example.com/TimeCard/' },
  { input: 'http://example.com/TimeCard', expected: 'http://example.com/TimeCard/' },
  { input: 'http://example.com/TimeCard/', expected: 'http://example.com/TimeCard/' },
  { input: 'https://myserver:8080', expected: 'https://myserver:8080/TimeCard/' },
  { input: 'https://myserver:8080/TimeCard', expected: 'https://myserver:8080/TimeCard/' },
];

// Simulate the URL processing logic
function processUrl(baseUrl) {
  let fullUrl = baseUrl;
  if (!fullUrl.includes('/TimeCard')) {
    fullUrl = fullUrl.endsWith('/') ? fullUrl + 'TimeCard/' : fullUrl + '/TimeCard/';
  } else {
    fullUrl = fullUrl.endsWith('/') ? fullUrl : fullUrl + '/';
  }
  return fullUrl;
}

console.log('Testing TIMECARD_BASE_URL processing logic:\n');


let allPassed = true;
testCases.forEach((test, index) => {
  const result = processUrl(test.input);
  const passed = result === test.expected;
  console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'}`);
  console.log(`  Input:    ${test.input}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Got:      ${result}`);
  console.log();
  
  if (!passed) allPassed = false;
});

console.log(allPassed ? '🎉 All tests passed!' : '❌ Some tests failed!');
process.exit(allPassed ? 0 : 1);