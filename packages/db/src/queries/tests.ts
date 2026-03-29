import { eq, desc } from 'drizzle-orm';
import { db } from '../client';
import { testSuites } from '../schema';

export async function getProjectTests(projectId: string) {
  return db
    .select()
    .from(testSuites)
    .where(eq(testSuites.projectId, projectId))
    .orderBy(desc(testSuites.createdAt));
}

export async function createTestSuite(data: typeof testSuites.$inferInsert) {
  const [suite] = await db.insert(testSuites).values(data).returning();
  return suite;
}

export async function updateTestResults(
  id: string,
  passCount: number,
  failCount: number,
  durationMs: number,
  coveragePercent: string | null
) {
  const [suite] = await db
    .update(testSuites)
    .set({
      lastRunAt: new Date(),
      lastRunStatus: failCount > 0 ? 'failed' : 'passed',
      lastRunDurationMs: durationMs,
      passCount,
      failCount,
      coveragePercent,
      updatedAt: new Date(),
    })
    .where(eq(testSuites.id, id))
    .returning();
  return suite;
}
