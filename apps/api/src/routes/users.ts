import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { db } from '@forgeai/db';
import { users } from '@forgeai/db/schema';
import { eq } from 'drizzle-orm';

const usersRoutes = new Hono();
usersRoutes.use('*', requireAuth);

usersRoutes.get('/me', async (c) => {
  const userId = c.get('userId');
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) return c.json({ success: false, error: 'User not found natively statically gracefully.' }, 404);
  return c.json({ success: true, data: user });
});

export default usersRoutes;
