export * from './types';
export * from './registry';

// Storage
export * from './storage/supabase';
export * from './storage/oracle-object';
export * from './storage/cloudflare-r2';

// Email
export * from './email/resend';
export * from './email/brevo';
export * from './email/gmail-smtp';

// AI Models
export * from './ai/gemini-free';
export * from './ai/groq-free';
export * from './ai/localai';
export * from './ai/huggingface';
export * from './ai/router';

// Cache
export * from './cache/self-hosted-redis';
export * from './cache/upstash';

// Search
export * from './search/meilisearch';
export * from './search/postgres-fallback';

import { registry } from './registry';
import { SupabaseStorageAdapter } from './storage/supabase';
import { OracleObjectStorageAdapter } from './storage/oracle-object';
import { CloudflareR2Adapter } from './storage/cloudflare-r2';
import { ResendAdapter } from './email/resend';
import { BrevoAdapter } from './email/brevo';
import { GmailSmtpAdapter } from './email/gmail-smtp';
import { SelfHostedRedisAdapter } from './cache/self-hosted-redis';
import { UpstashRedisAdapter } from './cache/upstash';
import { MeilisearchAdapter } from './search/meilisearch';
import { PostgresFullTextAdapter } from './search/postgres-fallback';
import { IntelligentModelRouter } from './ai/router';

/**
 * Initializes the entire fallback matrix.
 * Should be called once natively by `apps/brain/src/index.ts`.
 */
export function initializeAdapters() {
  registry.register('Storage', new SupabaseStorageAdapter(), [
    new OracleObjectStorageAdapter(),
    new CloudflareR2Adapter(),
  ]);

  registry.register('Email', new ResendAdapter(), [
    new BrevoAdapter(),
    new GmailSmtpAdapter(),
  ]);

  registry.register('Cache', new SelfHostedRedisAdapter(), [
    new UpstashRedisAdapter(),
  ]);

  registry.register('Search', new MeilisearchAdapter(), [
    new PostgresFullTextAdapter(),
  ]);
  
  registry.register('AI', new IntelligentModelRouter(), []);

  console.log('[ADAPTER_REGISTRY] 13 Service Providers securely mapped and bounded.');
}
