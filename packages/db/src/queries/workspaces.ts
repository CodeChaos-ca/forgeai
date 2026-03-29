import { eq, and } from 'drizzle-orm';
import { db } from '../client';
import { workspaces, workspaceMembers, users } from '../schema';

export async function createWorkspace(data: typeof workspaces.$inferInsert, userId: string) {
  return await db.transaction(async (tx) => {
    const [workspace] = await tx.insert(workspaces).values(data).returning();
    
    await tx.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId,
      role: 'owner',
      status: 'active',
      joinedAt: new Date(),
    });

    return workspace;
  });
}

export async function getWorkspaceBySlug(slug: string) {
  const [workspace] = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  return workspace || null;
}

export async function getUserWorkspaces(userId: string) {
  return db
    .select({
      workspace: workspaces,
      member: workspaceMembers,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userId));
}

export async function updateWorkspace(id: string, data: Partial<typeof workspaces.$inferInsert>) {
  const [workspace] = await db
    .update(workspaces)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(workspaces.id, id))
    .returning();
  return workspace;
}

export async function getWorkspaceMembers(workspaceId: string) {
  return db
    .select({
      member: workspaceMembers,
      user: users,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspaceId));
}

export async function addMember(data: typeof workspaceMembers.$inferInsert) {
  const [member] = await db.insert(workspaceMembers).values(data).returning();
  return member;
}

export async function removeMember(workspaceId: string, userId: string) {
  const [member] = await db
    .delete(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .returning();
  return member;
}

export async function updateMemberRole(workspaceId: string, userId: string, role: string) {
  const [member] = await db
    .update(workspaceMembers)
    .set({ role, updatedAt: new Date() })
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .returning();
  return member;
}
