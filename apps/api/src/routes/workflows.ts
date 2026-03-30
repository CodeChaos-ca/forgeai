import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const workflowsRoutes = new Hono();
workflowsRoutes.use('*', requireAuth);

workflowsRoutes.get('/', async (c) => {
  return c.json({ success: true, data: [] });
});

export default workflowsRoutes;
