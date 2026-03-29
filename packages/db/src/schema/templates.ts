import { pgTable, uuid, varchar, text, jsonb, boolean, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'), // markdown
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags').array().default([]), // TEXT[] 
  previewUrl: text('preview_url'),
  thumbnailUrl: text('thumbnail_url').notNull(),
  screenshots: jsonb('screenshots').default([]),
  fileTree: jsonb('file_tree').notNull(),
  databaseSchema: jsonb('database_schema'),
  features: jsonb('features').default([]),
  isOfficial: boolean('is_official').default(false),
  isFeatured: boolean('is_featured').default(false),
  authorId: uuid('author_id').references(() => users.id),
  priceCents: integer('price_cents').default(0),
  installCount: integer('install_count').default(0),
  ratingAvg: decimal('rating_avg', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
