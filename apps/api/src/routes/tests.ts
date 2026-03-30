import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const testsRoutes = new Hono();
testsRoutes.use('*', requireAuth);

testsRoutes.post('/run', async (c) => {
  return c.json({ success: true, data: { coverage: 100, passed: true } });
});

export default testsRoutes;
