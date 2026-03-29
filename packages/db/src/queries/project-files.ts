import { eq, and } from 'drizzle-orm';
import { db } from '../client';
import { projectFiles } from '../schema';

export async function getFilesByProject(projectId: string) {
  return db.select().from(projectFiles).where(eq(projectFiles.projectId, projectId));
}

export async function getFileByPath(projectId: string, filePath: string) {
  const [file] = await db
    .select()
    .from(projectFiles)
    .where(and(eq(projectFiles.projectId, projectId), eq(projectFiles.filePath, filePath)))
    .limit(1);
  return file || null;
}

export async function createFile(data: typeof projectFiles.$inferInsert) {
  const [file] = await db
    .insert(projectFiles)
    .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
    .returning();
  return file;
}

export async function updateFile(id: string, data: Partial<typeof projectFiles.$inferInsert>) {
  const [file] = await db
    .update(projectFiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projectFiles.id, id))
    .returning();
  return file;
}

export async function deleteFile(id: string) {
  const [deleted] = await db.delete(projectFiles).where(eq(projectFiles.id, id)).returning();
  return deleted;
}

export async function getFileTree(projectId: string) {
  return db
    .select({
      id: projectFiles.id,
      filePath: projectFiles.filePath,
      fileName: projectFiles.fileName,
      isDirectory: projectFiles.isDirectory,
      sizeBytes: projectFiles.sizeBytes,
    })
    .from(projectFiles)
    .where(eq(projectFiles.projectId, projectId));
}
