import { eq, desc } from 'drizzle-orm';
import { db } from '../client';
import { workflows, workflowRuns } from '../schema';

export async function createWorkflow(data: typeof workflows.$inferInsert) {
  const [workflow] = await db.insert(workflows).values(data).returning();
  return workflow;
}

export async function getProjectWorkflows(projectId: string) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.projectId, projectId))
    .orderBy(desc(workflows.createdAt));
}

export async function updateWorkflow(id: string, data: Partial<typeof workflows.$inferInsert>) {
  const [workflow] = await db
    .update(workflows)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(workflows.id, id))
    .returning();
  return workflow;
}

export async function getWorkflowRuns(workflowId: string) {
  return db
    .select()
    .from(workflowRuns)
    .where(eq(workflowRuns.workflowId, workflowId))
    .orderBy(desc(workflowRuns.startedAt));
}

export async function createWorkflowRun(data: typeof workflowRuns.$inferInsert) {
  const [run] = await db.insert(workflowRuns).values(data).returning();
  return run;
}
