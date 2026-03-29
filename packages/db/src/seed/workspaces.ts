import { db } from '../client';
import { workspaces, workspaceMembers } from '../schema';

export async function seedWorkspaces(userIds: string[]): Promise<string[]> {
  const [adminId, editorId, viewerId] = userIds;

  const createdWorkspaces = await db.insert(workspaces).values([
    {
      name: 'ForgeAI Core Team',
      slug: 'forgeai-core',
      isPersonal: false,
    },
    {
      name: 'Elena Personal',
      slug: 'elena-personal',
      isPersonal: true,
    }
  ]).returning({ id: workspaces.id });

  const [coreWorkspaceId, personalWorkspaceId] = createdWorkspaces.map(w => w.id);

  await db.insert(workspaceMembers).values([
    // Core Team Members
    { workspaceId: coreWorkspaceId, userId: adminId, role: 'owner', status: 'active' },
    { workspaceId: coreWorkspaceId, userId: editorId, role: 'member', status: 'active' },
    { workspaceId: coreWorkspaceId, userId: viewerId, role: 'viewer', status: 'active' },
    
    // Personal Workspace
    { workspaceId: personalWorkspaceId, userId: editorId, role: 'owner', status: 'active' },
  ]);

  return [coreWorkspaceId, personalWorkspaceId];
}
