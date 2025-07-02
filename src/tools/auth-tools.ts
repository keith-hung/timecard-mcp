import { MCPTool } from './index.js';
import { TimeCardSession } from '../timecard-session.js';

const timecardLogin: MCPTool = {
  name: 'timecard_login',
  description: 'Login to TimeCard system and establish a session. Uses environment variables TIMECARD_USERNAME and TIMECARD_PASSWORD if not provided.',
  inputSchema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'TimeCard username (optional if TIMECARD_USERNAME env var is set)'
      },
      password: {
        type: 'string',
        description: 'TimeCard password (optional if TIMECARD_PASSWORD env var is set)'
      }
    },
    required: []
  },
  handler: async (args, session: TimeCardSession) => {
    // Try to get credentials from arguments first, then environment variables
    const username = args.username || process.env.TIMECARD_USERNAME;
    const password = args.password || process.env.TIMECARD_PASSWORD;

    if (!username || !password) {
      return {
        success: false,
        message: 'Username and password are required. Set TIMECARD_USERNAME and TIMECARD_PASSWORD environment variables or provide them as arguments.',
        missing_credentials: {
          username: !username,
          password: !password
        }
      };
    }

    return await session.login(username, password);
  }
};

const timecardLogout: MCPTool = {
  name: 'timecard_logout',
  description: 'Logout from TimeCard system and clear session',
  inputSchema: {
    type: 'object',
    properties: {}
  },
  handler: async (args, session: TimeCardSession) => {
    return await session.logout();
  }
};

const timecardCheckSession: MCPTool = {
  name: 'timecard_check_session',
  description: 'Check current TimeCard session status. RECOMMENDED: Call this after agent restart, MCP restart, or 10+ minutes of inactivity to ensure session validity.',
  inputSchema: {
    type: 'object',
    properties: {}
  },
  handler: async (args, session: TimeCardSession) => {
    const sessionInfo = session.getSessionInfo();
    const sessionTime = sessionInfo.sessionStartTime 
      ? Math.floor((Date.now() - sessionInfo.sessionStartTime.getTime()) / 1000) 
      : 0;
    
    return {
      authenticated: sessionInfo.authenticated,
      username: sessionInfo.username || null,
      session_time: sessionTime > 0 ? `${sessionTime} seconds` : null,
      current_url: sessionInfo.currentUrl || null
    };
  }
};

export const authTools: MCPTool[] = [
  timecardLogin,
  timecardLogout,
  timecardCheckSession
];