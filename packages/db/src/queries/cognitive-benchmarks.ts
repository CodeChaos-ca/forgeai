import { eq, desc, asc } from 'drizzle-orm';
import { db } from '../client';
import { qualityBenchmarks, benchmarkRuns } from '../schema';

export async function getAllBenchmarks() {
  return db
    .select()
    .from(qualityBenchmarks)
    .where(eq(qualityBenchmarks.isActive, true))
    .orderBy(qualityBenchmarks.createdAt);
}

export async function recordBenchmarkRun(data: typeof benchmarkRuns.$inferInsert) {
  const [run] = await db.insert(benchmarkRuns).values(data).returning();
  return run;
}

export async function getBenchmarkTrend(benchmarkId: string, limitCount: number = 20) {
  return db
    .select()
    .from(benchmarkRuns)
    .where(eq(benchmarkRuns.benchmarkId, benchmarkId))
    .orderBy(asc(benchmarkRuns.createdAt))
    .limit(limitCount);
}

export async function getOverallTrend(limitCount: number = 50) {
  // Can be aggregated via window functions or backend. 
  // Let's just fetch the 50 most recent combined runs.
  return db
    .select()
    .from(benchmarkRuns)
    .orderBy(desc(benchmarkRuns.createdAt))
    .limit(limitCount);
}
