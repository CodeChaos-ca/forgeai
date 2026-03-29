import { uuid, varchar, text, decimal, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { cognitiveSchema, vectorType } from './index';

export const knowledgeBase = cognitiveSchema.table('knowledge_base', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceType: varchar('source_type', { length: 30 }), // CHECK IN ('official_docs',...)
  sourceUrl: text('source_url'),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  contentSummary: text('content_summary').notNull(),
  technology: varchar('technology', { length: 100 }),
  versionRange: varchar('version_range', { length: 50 }),
  relevanceScore: decimal('relevance_score', { precision: 5, scale: 2 }).default('50'),
  timesRetrieved: integer('times_retrieved').default(0),
  timesHelpful: integer('times_helpful').default(0),
  isOutdated: boolean('is_outdated').default(false),
  outdatedReason: text('outdated_reason'),
  supersededBy: uuid('superseded_by'), // FK to self handled in relations.ts or lazily: references(()=>knowledgeBase.id)
  embedding: vectorType('embedding', { dimensions: 1536 }),
  tags: text('tags').array().default([]), // TEXT[]
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    sourceTypeIdx: index('knowledge_source_type_idx').on(table.sourceType),
    technologyIdx: index('knowledge_technology_idx').on(table.technology),
    relevanceScoreIdx: index('knowledge_relevance_score_idx').on(table.relevanceScore),
  };
});
