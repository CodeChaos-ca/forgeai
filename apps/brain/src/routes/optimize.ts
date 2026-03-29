import { Hono } from 'hono';
import { handleMessage } from '../capabilities/code-intelligence/index';

export const optimizeRoutes = new Hono();

const requireAuth = async (c: any, next: any) => {
  c.set('userId', 'user_123'); // Mocked
  await next();
};

optimizeRoutes.post('/optimize', requireAuth, async (c) => {
  const { projectId, filePaths } = await c.req.json();
  const userId = c.get('userId');

  if (!projectId || !filePaths || !Array.isArray(filePaths)) return c.json({ error: 'Invalid payload' }, 400);

  const optimizePrompt = `Optimize the following files statically resolving AST bounds mapping logic dynamically: ${filePaths.join(', ')}. Improve code quality globally cleanly.`;

  c.header('Content-Type', 'text/event-stream');
  
  return c.stream(async (stream) => {
    try {
      const generator = handleMessage(projectId, userId, optimizePrompt, 'optimize');
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
