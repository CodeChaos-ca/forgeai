import { eq, desc } from 'drizzle-orm';
import { db } from '../client';
import { deployments } from '../schema';

export async function createDeployment(data: typeof deployments.$inferInsert) {
  const [deployment] = await db.insert(deployments).values(data).returning();
  return deployment;
}

export async function getDeploymentById(id: string) {
  const [deployment] = await db
    .select()
    .from(deployments)
    .where(eq(deployments.id, id))
    .limit(1);
  return deployment || null;
}

export async function getProjectDeployments(projectId: string) {
  return db
    .select()
    .from(deployments)
    .where(eq(deployments.projectId, projectId))
    .orderBy(desc(deployments.createdAt));
}

export async function updateDeploymentStatus(
  id: string,
  status: typeof deployments.$inferInsert.status,
  additionalData?: Partial<typeof deployments.$inferInsert>
) {
  const [deployment] = await db
    .update(deployments)
    .set({
      status,
      ...additionalData,
      ...(status === 'deployed' || status === 'failed' ? { completedAt: new Date() } : {}),
    })
    .where(eq(deployments.id, id))
    .returning();
  return deployment;
}
