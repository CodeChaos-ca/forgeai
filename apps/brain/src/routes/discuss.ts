import { Hono } from 'hono';
import { handleMessage } from '../capabilities/code-intelligence/index';

export const discussRoutes = new Hono();

const requireAuth = async (c: any, next: any) => {
  const token = c.req.header('Authorization');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  c.set('userId', 'user_123');
  await next();
};

discussRoutes.post('/discuss', requireAuth, async (c) => {
  const { projectId, prompt } = await c.req.json();
  const userId = c.get('userId');

  if (!projectId || !prompt) return c.json({ error: 'Missing projectId or prompt' }, 400);

  // No credit check for 'discuss' mode specifically evaluating bounded logic
  
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  return c.stream(async (stream) => {
    try {
      const generator = handleMessage(projectId, userId, prompt, 'discuss');
      for await (const chunk of generator) {
        await stream.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      await stream.write(`data: [DONE]\n\n`);
    } catch (e: any) {
      await stream.write(`data: ${JSON.stringify({ type: 'error', content: e.message })}\n\n`);
      await stream.write(`data: [DONE]\n\n`);
    }
  });
});
