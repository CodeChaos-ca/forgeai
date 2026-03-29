import 'dotenv/config';
import { db } from '../client';
import { seedUsers } from './users';
import { seedWorkspaces } from './workspaces';
import { seedProjects } from './projects';
import { seedTemplates } from './templates';
import { seedConversations } from './conversations';
import { seedCredits } from './credits';
import { seedCognitive } from './cognitive-seed';

async function main() {
  console.log('🌱 Starting database seed...');
  
  try {
    const userIds = await seedUsers();
    console.log(`✅ Seeded ${userIds.length} users`);

    const workspaceIds = await seedWorkspaces(userIds);
    console.log(`✅ Seeded ${workspaceIds.length} workspaces`);

    const projectIds = await seedProjects(workspaceIds, userIds);
    console.log(`✅ Seeded ${projectIds.length} projects with files`);

    await seedTemplates(userIds[0]); // Admin is author
    console.log(`✅ Seeded templates`);

    const convIds = await seedConversations(projectIds[0], userIds[0]);
    console.log(`✅ Seeded ${convIds.length} conversations`);

    await seedCredits(userIds, workspaceIds);
    console.log(`✅ Seeded credits`);

    await seedCognitive();
    console.log(`✅ Seeded cognitive engine (skills, prompts, knowledge, benchmarks)`);

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
