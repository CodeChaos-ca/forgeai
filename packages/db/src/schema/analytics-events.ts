import { pgSchema, uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const analyticsSchema = pgSchema('analytics');

export const analyticsEvents = analyticsSchema.table('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull(), // public.projects.id
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  visitorId: varchar('visitor_id', { length: 100 }).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  eventName: varchar('event_name', { length: 255 }),
  pagePath: text('page_path'),
  pageTitle: varchar('page_title', { length: 500 }),
  referrer: text('referrer'),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  deviceType: varchar('device_type', { length: 20 }),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  country: varchar('country', { length: 2 }),
  city: varchar('city', { length: 255 }),
  screenWidth: integer('screen_width'),
  customProperties: jsonb('custom_properties').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    projectIdx: index('analytics_project_idx').on(table.projectId),
    projectEventTypeIdx: index('analytics_project_event_type_idx').on(table.projectId, table.eventType),
    sessionIdx: index('analytics_session_idx').on(table.sessionId),
    createdIdx: index('analytics_created_idx').on(table.createdAt),
  };
  // Note: Drizzle handles partitioning largely via raw queries or push, 
  // but we provide exact schema matched columns and standard indexes.
});
