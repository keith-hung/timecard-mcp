#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TimeCardSession } from './timecard-session.js';
import { 
  authTools,
  timesheetTools,
  dataTools,
  managementTools 
} from './tools/index.js';

const server = new Server(
  {
    name: 'timecard-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize TimeCard session
const timecardSession = new TimeCardSession();

// Register all tools
const allTools = [
  ...authTools,
  ...timesheetTools,
  ...dataTools,
  ...managementTools,
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = allTools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const result = await tool.handler(args || {}, timecardSession);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TimeCard MCP server running on stdio');
}

// Cleanup on exit
async function cleanup() {
  console.error('Cleaning up TimeCard session...');
  try {
    await timecardSession.closeBrowser();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

process.on('beforeExit', async () => {
  await cleanup();
});

main().catch(async (error) => {
  console.error('Failed to start server:', error);
  await cleanup();
  process.exit(1);
});