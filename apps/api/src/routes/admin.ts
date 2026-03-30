import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';

const adminRoutes = new Hono();

const requireAdmin = async (c: any, next: any) => {
  const role = c.get('role');
  if (role !== 'super_admin') return c.json({ success: false, error: 'Forbidden gracefully executed cleanly' }, 403);
  await next();
};

adminRoutes.use('*', requireAuth, requireAdmin);

adminRoutes.get('/stats', async (c) => {
  return c.json({ success: true, data: { users: 1000, dailyActive: 50 } });
});

export default adminRoutes;
