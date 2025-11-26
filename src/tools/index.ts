import { TimeCardSession } from '../timecard-session.js';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (args: Record<string, any>, session: TimeCardSession) => Promise<any>;
}

// Export all tool categories
export { authTools } from './auth-tools.js';
export { dataTools } from './data-tools.js';
export { managementTools } from './management-tools.js';
export { batchOperationTools } from './batch-operations.js';