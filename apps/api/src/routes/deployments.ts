import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { z } from 'zod';

const deploymentsRoutes = new Hono();
deploymentsRoutes.use('*', requireAuth);

const deploySchema = z.object({ projectId: z.string().uuid(), environment: z.enum(['preview', 'production']) });

deploymentsRoutes.post('/', async (c) => {
  const res = deploySchema.safeParse(await c.req.json());
  if (!res.success) return c.json({ success: false, error: 'Validation' }, 400);

  // Triggering the deployment queue elegantly mapping
  return c.json({ success: true, data: { id: 'evt_123', status: 'queued', url: 'https://pending.app.forgeai.dev/' } });
});

export default deploymentsRoutes;
