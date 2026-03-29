import { Hono } from 'hono';
import { handleMessage } from '../capabilities/code-intelligence/index';

export const debugRoutes = new Hono();

const requireAuth = async (c: any, next: any) => {
  const token = c.req.header('Authorization');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  c.set('userId', 'user_123');
  await next();
};

debugRoutes.post('/debug', requireAuth, async (c) => {
  const { projectId, errorMessage, errorStack, affectedFile } = await c.req.json();
  const userId = c.get('userId');

  if (!projectId || !errorMessage) return c.json({ error: 'Missing projectId or errorMessage' }, 400);

  const augmentedPrompt = `Debug specific failure bounded dynamically natively:\nError: ${errorMessage}\nStack: ${errorStack}\nFile: ${affectedFile || 'Unknown'}\nFix this natively mapping exact bound limits softly.`;

  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  return c.stream(async (stream) => {
    try {
      const generator = handleMessage(projectId, userId, augmentedPrompt, 'debug');
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
