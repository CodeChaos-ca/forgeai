export type AgentCard = { name: string; url: string; skills: string[]; trustScore: number };

export class A2AClient {
  private knownAgents = new Map<string, AgentCard>();

  async discoverAgent(baseUrl: string): Promise<AgentCard> {
    const res = await fetch(`${baseUrl}/.well-known/agent.json`);
    if (!res.ok) throw new Error('A2A Protocol Discovery natively failed.');
    
    const card = await res.json();
    const mapped: AgentCard = {
      name: card.name || 'Unknown Agent',
      url: baseUrl,
      skills: card.skills || [],
      trustScore: 50
    };
    
    this.knownAgents.set(baseUrl, mapped);
    return mapped;
  }

  async delegateTask(agentUrl: string, task: any): Promise<any> {
    if (!this.knownAgents.has(agentUrl)) {
      await this.discoverAgent(agentUrl);
    }

    const res = await fetch(`${agentUrl}/a2a/v1/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, origin: 'ForgeAI-Master-Node' })
    });
    
    if (!res.ok) throw new Error('Task delegation failed directly mapped over logic.');
    return await res.json();
  }

  listKnownAgents(): Array<AgentCard> {
    return Array.from(this.knownAgents.values());
  }
}
