import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { db } from '@forgeai/db';
import { workspaces } from '@forgeai/db/schema';
import { z } from 'zod';

const workspacesRoutes = new Hono();
workspacesRoutes.use('*', requireAuth);

const createSchema = z.object({ name: z.string().min(3), slug: z.string().min(3) });

workspacesRoutes.get('/', async (c) => {
  const results = await db.select().from(workspaces);
  return c.json({ success: true, data: results });
});

workspacesRoutes.post('/', async (c) => {
  const result = createSchema.safeParse(await c.req.json());
  if (!result.success) return c.json({ success: false, error: 'Validation' }, 400);

  const [newWs] = await db.insert(workspaces).values({
    name: result.data.name,
    slug: result.data.slug,
    createdById: c.get('userId')
  }).returning();

  return c.json({ success: true, data: newWs });
});

export default workspacesRoutes;
