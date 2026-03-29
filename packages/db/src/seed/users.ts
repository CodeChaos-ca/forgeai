import { db } from '../client';
import { users } from '../schema';

export async function seedUsers(): Promise<string[]> {
  const newUsers = await db.insert(users).values([
    {
      name: 'Alice Admin',
      email: 'admin@forgeai.dev',
      role: 'super_admin',
      plan: 'enterprise',
      hasOnboarded: true,
      emailVerified: new Date(),
    },
    {
      name: 'Elena Editor',
      email: 'editor@forgeai.dev',
      role: 'user',
      plan: 'pro',
      hasOnboarded: true,
      emailVerified: new Date(),
    },
    {
      name: 'Victor Viewer',
      email: 'viewer@forgeai.dev',
      role: 'user',
      plan: 'free',
      hasOnboarded: true,
      emailVerified: new Date(),
    }
  ]).returning({ id: users.id });
  
  return newUsers.map((u) => u.id);
}
