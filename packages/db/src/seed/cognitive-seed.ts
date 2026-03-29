import { db } from '../client';
import { skills, promptStrategies, qualityBenchmarks, knowledgeBase } from '../schema';
// @ts-ignore - The seed data files will be auto-imported or constructed inline
import { standardSkills, agenticSkills } from './data/skills-data';
import { promptData } from './data/prompts-data';
import { benchmarkData } from './data/benchmarks-data';
import { knowledgeData } from './data/knowledge-data';

export async function seedCognitive() {
  console.log('Inserting 60 skills (50 standard + 10 agentic)...');
  await db.insert(skills).values([...standardSkills, ...agenticSkills]);

  console.log('Inserting 10 prompt strategies...');
  await db.insert(promptStrategies).values(promptData);

  console.log('Inserting 20 quality benchmarks...');
  await db.insert(qualityBenchmarks).values(benchmarkData);

  console.log('Inserting 10 knowledge base entries...');
  await db.insert(knowledgeBase).values(knowledgeData);
}
