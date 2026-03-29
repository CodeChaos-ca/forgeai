import { Hono } from 'hono';
import { systemHealth, systemQuota } from '../capabilities/infrastructure';
import { db } from '@forgeai/db';
import { skills, knowledgeBase, learningQueue, memoryEpisodes } from '@forgeai/db/schema';
import { sql, inArray, desc } from 'drizzle-orm';
import { evoScheduler } from '../capabilities/evolution';

export const adminRoutes = new Hono();

const requireSuperAdmin = async (c: any, next: any) => {
  // Mocked role verify natively executing
  c.set('role', 'super_admin');
  await next();
};

adminRoutes.use('*', requireSuperAdmin);

adminRoutes.get('/dashboard', async (c) => {
  const hRe = await systemHealth.checkAll();
  const qSt = await systemQuota.getStatus();
  
  const skillCt = await db.select({ count: sql<number>`count(*)` }).from(skills);
  const kbCt = await db.select({ count: sql<number>`count(*)` }).from(knowledgeBase);
  const qCt = await db.select({ count: sql<number>`count(*)` }).from(learningQueue);
  
  return c.json({
    health: hRe,
    quotas: qSt,
    stats: {
       skills: Number(skillCt[0]?.count || 0),
       knowledge: Number(kbCt[0]?.count || 0),
       queue: Number(qCt[0]?.count || 0)
    }
  });
});

adminRoutes.get('/evolution-log', async (c) => {
  const logs = await db.select().from(memoryEpisodes)
    .where(inArray(memoryEpisodes.triggerEvent, ['infrastructure_healing', 'security_action']))
    .orderBy(desc(memoryEpisodes.createdAt))
    .limit(50);
  return c.json({ data: logs });
});

adminRoutes.post('/trigger/:capability/:action', async (c) => {
  const cap = c.req.param('capability');
  const act = c.req.param('action');
  
  if (cap === 'evolution' && act === 'nightly') {
     const res = await evoScheduler.triggerManual('nightly_consolidation');
     return c.json({ message: 'Triggered Nightly bounds successfully globally mapped.', result: res });
  }
  
  return c.json({ error: 'Unknown Action Native Trigger Boundary' }, 404);
});
