#!/usr/bin/env node

// Simple test script to verify MCP functionality
// This script tests the MCP server by sending test messages

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mcpServerPath = join(__dirname, 'dist', 'index.js');

async function testMCP() {
  console.log('Starting TimeCard MCP Server test...');

  const mcp = spawn('node', [mcpServerPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      TIMECARD_BASE_URL: 'http://localhost:8080'
    }
  });

  // Test 1: Initialize request
  console.log('Test 1: Sending initialize request...');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  mcp.stdin.write(JSON.stringify(initRequest) + '\n');

  // Test 2: List tools request
  console.log('Test 2: Requesting available tools...');
  const toolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  };

  mcp.stdin.write(JSON.stringify(toolsRequest) + '\n');

  // Listen for responses
  let responseCount = 0;
  mcp.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());

    lines.forEach(line => {
      try {
        const response = JSON.parse(line);
        responseCount++;

        console.log(`Response ${responseCount}:`, JSON.stringify(response, null, 2));

        if (responseCount >= 2) {
          console.log('\n✅ MCP Server basic functionality test completed successfully!');
          console.log('\nAvailable tools should be listed above.');
          console.log('\nTo use this MCP server:');
          console.log('1. Add it to your MCP client configuration');
          console.log('2. Use the tools listed above for TimeCard automation');

          mcp.kill();
          process.exit(0);
        }
      } catch (e) {
        console.log('Non-JSON output:', line);
      }
    });
  });

  mcp.stderr.on('data', (data) => {
    console.log('Server stderr:', data.toString());
  });

  mcp.on('close', (code) => {
    console.log(`\nMCP server exited with code ${code}`);
  });

  // Set a timeout
  setTimeout(() => {
    console.log('\n⏰ Test timeout - killing server');
    mcp.kill();
    process.exit(1);
  }, 10000);
}

testMCP().catch(console.error);