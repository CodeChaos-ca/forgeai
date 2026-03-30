import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const notificationsRoutes = new Hono();
notificationsRoutes.use('*', requireAuth);

notificationsRoutes.get('/', async (c) => {
  return c.json({ success: true, data: [] });
});

export default notificationsRoutes;
