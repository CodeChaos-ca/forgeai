import { neon, neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// Enhance Neon connection for edge/serverless stability
// Uses WebSockets in edge environments if requested, else regular fetch
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required.');
}

// In production/serverless, use connection pooling via Neon
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

// Helper to keep connection alive or execute directly if using neon fetch
export const executeDirect = neon(connectionString);
