import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const analyticsRoutes = new Hono();
analyticsRoutes.use('*', requireAuth);

analyticsRoutes.get('/', async (c) => {
  return c.json({ success: true, data: { totalProjects: 15, activeDeployments: 2 } });
});

export default analyticsRoutes;
