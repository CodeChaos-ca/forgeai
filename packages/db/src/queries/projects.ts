import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../client';
import { projects, projectFiles } from '../schema';

export async function createProject(data: typeof projects.$inferInsert) {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
}

export async function getProjectById(id: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    .limit(1);
  return project || null;
}

export async function getWorkspaceProjects(workspaceId: string) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.workspaceId, workspaceId), isNull(projects.deletedAt)));
}

export async function updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
  const [project] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return project;
}

export async function getProjectWithFiles(id: string) {
  const project = await getProjectById(id);
  if (!project) return null;

  const files = await db
    .select()
    .from(projectFiles)
    .where(eq(projectFiles.projectId, id));

  return { ...project, files };
}

export async function softDeleteProject(id: string) {
  const [project] = await db
    .update(projects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return project;
}
