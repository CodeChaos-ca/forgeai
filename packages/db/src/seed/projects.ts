import { db } from '../client';
import { projects, projectFiles } from '../schema';

export async function seedProjects(workspaceIds: string[], userIds: string[]): Promise<string[]> {
  const [coreWorkspaceId, personalWorkspaceId] = workspaceIds;
  const [adminId, editorId] = userIds;

  const createdProjects = await db.insert(projects).values([
    {
      workspaceId: coreWorkspaceId,
      name: 'Prometheus Platform',
      slug: 'prometheus-platform',
      description: 'The main self-evolving AI platform orchestration engine.',
      subdomain: 'prometheus',
      createdBy: adminId,
    },
    {
      workspaceId: coreWorkspaceId,
      name: 'Marketing Site',
      slug: 'marketing-site',
      description: 'Public facing marketing and landing pages.',
      subdomain: 'marketing',
      createdBy: adminId,
    },
    {
      workspaceId: coreWorkspaceId,
      name: 'Internal Admin Dashboard',
      slug: 'admin-dash',
      description: 'Analytics and CRM for internal team.',
      subdomain: 'admin',
      createdBy: editorId,
    },
    {
      workspaceId: personalWorkspaceId,
      name: 'Personal Blog',
      slug: 'elenas-blog',
      description: 'Thoughts on AI and design.',
      subdomain: 'elenablog',
      createdBy: editorId,
    },
    {
      workspaceId: personalWorkspaceId,
      name: 'Weather Widget Tool',
      slug: 'weather-widget',
      description: 'Small embedded component project.',
      subdomain: 'weather-widget',
      createdBy: editorId,
    }
  ]).returning({ id: projects.id });

  const projectIds = createdProjects.map(p => p.id);

  // Add 3 files for each project
  for (const projectId of projectIds) {
    await db.insert(projectFiles).values([
      {
        projectId,
        filePath: 'package.json',
        fileName: 'package.json',
        fileExtension: 'json',
        content: JSON.stringify({ name: 'project', version: '1.0.0' }, null, 2),
        contentHash: 'placeholder-hash-1',
        sizeBytes: 45,
        language: 'json',
        isGenerated: false,
      },
      {
        projectId,
        filePath: 'src/index.ts',
        fileName: 'index.ts',
        fileExtension: 'ts',
        content: 'export const hello = () => console.log("Init");',
        contentHash: 'placeholder-hash-2',
        sizeBytes: 47,
        language: 'typescript',
        isGenerated: true,
      },
      {
        projectId,
        filePath: 'src/utils.ts',
        fileName: 'utils.ts',
        fileExtension: 'ts',
        content: 'export const add = (a: number, b: number) => a + b;',
        contentHash: 'placeholder-hash-3',
        sizeBytes: 51,
        language: 'typescript',
        isGenerated: true,
      }
    ]);
  }

  return projectIds;
}
