import { eq } from 'drizzle-orm';
import { db } from '../client';
import { users, workspaceMembers, workspaces } from '../schema';

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || null;
}

export async function createUser(data: typeof users.$inferInsert) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function softDeleteUser(id: string) {
  const [user] = await db
    .update(users)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function getUserWithWorkspaces(id: string) {
  const user = await getUserById(id);
  if (!user) return null;

  const members = await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
      status: workspaceMembers.status,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, id));

  return { ...user, workspaces: members };
}
