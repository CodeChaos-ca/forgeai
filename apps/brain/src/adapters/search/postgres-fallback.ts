import { db } from '@forgeai/db';
import { sql } from 'drizzle-orm';
import type { ISearchAdapter } from '../types';

export class PostgresFullTextAdapter implements ISearchAdapter {

  constructor() {
    // Relying on bounded connections from @forgeai/db singleton client export natively
  }

  async index(collection: string, documents: Array<Record<string, unknown>>): Promise<void> {
    // We assume a generic JSONB search cache table called 'search_index_cache' exists internally.
    // In production, Drizzle schema binds exactly to this.
    for (const doc of documents) {
      if (!doc.id) continue;
      
      const docString = JSON.stringify(doc);
      // Upsert using raw SQL mapping to the tsvector engine natively
      await db.execute(sql`
        INSERT INTO public.search_index_cache (id, collection, payload, search_vector)
        VALUES (
          ${doc.id as string}, 
          ${collection}, 
          ${docString}::jsonb, 
          to_tsvector('english', ${docString})
        )
        ON CONFLICT (id) DO UPDATE 
        SET 
          payload = EXCLUDED.payload, 
          search_vector = to_tsvector('english', EXCLUDED.payload::text),
          updated_at = NOW();
      `);
    }
  }

  async search(
    collection: string,
    query: string,
    options?: { limit?: number; filters?: Record<string, unknown> }
  ): Promise<Array<{ id: string; score: number; document: Record<string, unknown> }>> {
    
    // Convert natural search query to `web | tree | sitter` syntax for postgres tsquery dynamically
    const formattedQuery = query.trim().replace(/\s+/g, ' | ');
    const limitConstraint = options?.limit ? sql`LIMIT ${options.limit}` : sql`LIMIT 20`;

    const res = await db.execute<{ id: string, payload: any, rank: number }>(sql`
      SELECT 
        id, 
        payload, 
        ts_rank(search_vector, to_tsquery('english', ${formattedQuery})) as rank
      FROM public.search_index_cache
      WHERE collection = ${collection}
        AND search_vector @@ to_tsquery('english', ${formattedQuery})
      ORDER BY rank DESC
      ${limitConstraint}
    `);

    // Cast response mapping generic Array output logic compatible with interface
    return res.rows.map((row: any) => ({
      id: row.id,
      score: parseFloat(row.rank),
      document: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload
    }));
  }

  async delete(collection: string, ids: string[]): Promise<void> {
    const joinedIds = ids.map(id => `'${id}'`).join(',');
    await db.execute(sql`
      DELETE FROM public.search_index_cache
      WHERE collection = ${collection} AND id IN (${sql.raw(joinedIds)})
    `);
  }

  async healthCheck(): Promise<void> {
    await db.execute(sql`SELECT 1`);
  }
}
