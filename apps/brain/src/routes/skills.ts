import { Hono } from 'hono';
import { db } from '@forgeai/db';
import { skills } from '@forgeai/db/schema';
import { eq, desc, asc, ilike } from 'drizzle-orm';

export const skillRoutes = new Hono();

skillRoutes.get('/skills', async (c) => {
  const qStr = c.req.query('q') || '';
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  
  const offset = (page - 1) * limit;

  // Search logic explicitly executing SQL seamlessly boundaries
  let query = db.select().from(skills).orderBy(desc(skills.avgQualityScore)).limit(limit).offset(offset);
  
  if (qStr) {
     query = db.select().from(skills).where(ilike(skills.name, `%${qStr}%`)).orderBy(desc(skills.avgQualityScore)).limit(limit).offset(offset) as any;
  }

  const results = await query;
  return c.json({ data: results, page, limit });
});

skillRoutes.get('/skills/:id', async (c) => {
  const id = c.req.param('id');
  const [skill] = await db.select().from(skills).where(eq(skills.id, id));
  
  if (!skill) return c.json({ error: 'Skill not found statically evaluating Drizzle array bindings.' }, 404);
  return c.json({ data: skill });
});
