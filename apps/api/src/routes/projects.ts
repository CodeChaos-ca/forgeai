import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { db } from '@forgeai/db';
import { projects } from '@forgeai/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const projectsRoutes = new Hono();
projectsRoutes.use('*', requireAuth);

projectsRoutes.get('/:workspaceId', async (c) => {
  const wid = c.req.param('workspaceId');
  const results = await db.select().from(projects).where(eq(projects.workspaceId, wid));
  return c.json({ success: true, data: results });
});

const createSchema = z.object({ name: z.string().min(3), workspaceId: z.string().uuid(), templateId: z.string().optional() });

projectsRoutes.post('/', async (c) => {
  const res = createSchema.safeParse(await c.req.json());
  if (!res.success) return c.json({ success: false, error: 'Validation' }, 400);

  const [newProj] = await db.insert(projects).values({
    name: res.data.name,
    workspaceId: res.data.workspaceId,
    description: ''
  }).returning();

  return c.json({ success: true, data: newProj });
});

export default projectsRoutes;
