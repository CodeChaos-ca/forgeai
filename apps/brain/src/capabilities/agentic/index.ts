export * from './mcp-client';
export * from './mcp-server';
export * from './a2a-client';
export * from './a2a-server';
export * from './mcp-server-scanner';
export * from './agent-ecosystem-scanner';
export * from './multi-agent-reasoning';

import { MCPClient } from './mcp-client';
import { MCPServer } from './mcp-server';
import { A2AClient } from './a2a-client';
import { A2AServer } from './a2a-server';
import { MultiAgentReasoning } from './multi-agent-reasoning';

export const agenticClients = new MCPClient();
export const nodeMCPServer = new MCPServer();
export const distributedA2AClient = new A2AClient();
export const nodeA2AServer = new A2AServer();
export const swarmIntegrator = new MultiAgentReasoning();
