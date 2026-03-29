import { Hono } from 'hono';
import { handleMessage } from '../code-intelligence';

export class A2AServer {
  
  getAgentCard(): any {
    return {
      name: 'ForgeAI Prometheus Node',
      version: '1.0.0',
      skills: ['code_generation', 'testing', 'deployment', 'code_review'],
      protocol: 'a2a-v1'
    };
  }

  async *handleTask(task: any): AsyncGenerator<any> {
    // Abstracting project context natively simulating standard bounds logic globally mapped
    const stream = handleMessage('auto-a2a-project', 'system', task.prompt || 'Execute designated logic boundaries natively mapped over logic loops', 'build');
    for await (const chunk of stream) {
      yield chunk;
    }
  }

  setupRoutes(app: Hono): void {
    app.get('/.well-known/agent.json', (c) => c.json(this.getAgentCard()));

    app.post('/a2a/v1/task', async (c) => {
      const body = await c.req.json();
      
      return c.streamText(async (stream) => {
        const gen = this.handleTask(body.task);
        for await (const chunk of gen) {
           await stream.write(JSON.stringify(chunk) + '\n');
        }
      });
    });
  }
}
