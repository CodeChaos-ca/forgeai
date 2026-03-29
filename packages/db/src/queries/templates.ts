import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { templates } from '../schema';

export async function getAllTemplates() {
  return db.select().from(templates).orderBy(templates.createdAt);
}

export async function getTemplateBySlug(slug: string) {
  const [template] = await db
    .select()
    .from(templates)
    .where(eq(templates.slug, slug))
    .limit(1);
  return template || null;
}

export async function createTemplate(data: typeof templates.$inferInsert) {
  const [template] = await db.insert(templates).values(data).returning();
  return template;
}

export async function incrementInstallCount(id: string) {
  const [template] = await db
    .update(templates)
    .set({
      installCount: sql`${templates.installCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(templates.id, id))
    .returning();
  return template;
}
