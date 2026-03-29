import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { skills, skillVersions } from '../schema';

export async function createSkill(data: typeof skills.$inferInsert) {
  return await db.transaction(async (tx) => {
    const [skill] = await tx.insert(skills).values(data).returning();
    
    // Auto map a version 1 on creation
    await tx.insert(skillVersions).values({
      skillId: skill.id,
      version: 1,
      promptStrategy: skill.promptStrategy,
      codePatterns: skill.codePatterns,
      changeReason: 'Initial setup',
    });
    
    return skill;
  });
}

export async function findMatchingSkills(embedding: number[], limitCount: number = 5) {
  const embeddingStr = `[${embedding.join(',')}]`;

  return db
    .select({
      id: skills.id,
      name: skills.name,
      description: skills.description,
      codePatterns: skills.codePatterns,
      similarity: sql<number>`1 - (${skills.embedding} <=> ${embeddingStr}::vector)`
    })
    .from(skills)
    .where(sql`${skills.isActive} = true AND ${skills.embedding} IS NOT NULL`)
    .orderBy(sql`${skills.embedding} <=> ${embeddingStr}::vector`)
    .limit(limitCount);
}

export async function updateSkillStats(id: string, isSuccess: boolean) {
  const successInc = isSuccess ? 1 : 0;
  const failInc = isSuccess ? 0 : 1;
  const [skill] = await db
    .update(skills)
    .set({
      timesUsed: sql`${skills.timesUsed} + 1`,
      successCount: sql`${skills.successCount} + ${successInc}`,
      failureCount: sql`${skills.failureCount} + ${failInc}`,
    })
    .where(eq(skills.id, id))
    .returning();
  return skill;
}

export async function createSkillVersion(data: typeof skillVersions.$inferInsert) {
  return await db.transaction(async (tx) => {
    const [version] = await tx.insert(skillVersions).values(data).returning();
    
    await tx.update(skills)
      .set({
        version: data.version,
        promptStrategy: data.promptStrategy,
        codePatterns: data.codePatterns,
        lastImprovedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(skills.id, data.skillId));
      
    return version;
  });
}

export async function getActiveSkills() {
  return db
    .select()
    .from(skills)
    .where(eq(skills.isActive, true));
}

export async function deprecateSkill(id: string) {
  return db
    .update(skills)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(skills.id, id))
    .returning();
}

export async function getTopSkills(limitCount: number = 10) {
  return db
    .select()
    .from(skills)
    .where(eq(skills.isActive, true))
    .orderBy(desc(skills.avgQualityScore), desc(skills.timesUsed))
    .limit(limitCount);
}
