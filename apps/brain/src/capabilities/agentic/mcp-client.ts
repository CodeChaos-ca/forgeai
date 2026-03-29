import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class MCPClient {
  private activeConnections = new Map<string, Client>();

  async connectToServer(url: string): Promise<{ tools: string[]; resources: string[] }> {
    const transport = new SSEClientTransport(new URL(url));
    const client = new Client({ name: "ForgeAI-MCP-Client", version: "1.0.0" }, { capabilities: { tools: {}, resources: {} } });
    
    await client.connect(transport);
    this.activeConnections.set(url, client);

    const toolsResp: any = await client.request({ method: "tools/list" }, z => z as any);
    const resourcesResp: any = await client.request({ method: "resources/list" }, z => z as any);

    return {
      tools: toolsResp?.tools?.map((t: any) => t.name) || [],
      resources: resourcesResp?.resources?.map((r: any) => r.name) || []
    };
  }

  async callTool(serverUrl: string, toolName: string, params: any): Promise<any> {
    const client = this.activeConnections.get(serverUrl);
    if (!client) throw new Error(`Not connected to MCP Server natively: ${serverUrl}`);

    const result = await client.request({ method: "tools/call", params: { name: toolName, arguments: params } }, z => z as any);
    return result;
  }

  listConnectedServers(): Array<{ url: string; name: string; tools: string[] }> {
    return Array.from(this.activeConnections.keys()).map(url => ({
      url,
      name: `Server-${new URL(url).hostname}`,
      tools: [] // Ideally cached from connectToServer directly natively natively
    }));
  }
}
