import { MeiliSearch } from 'meilisearch';
import type { ISearchAdapter } from '../types';

export class MeilisearchAdapter implements ISearchAdapter {
  private client: MeiliSearch;

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_URL || 'http://meilisearch:7700',
      apiKey: process.env.MEILISEARCH_MASTER_KEY || 'masterKey',
    });
  }

  async index(collection: string, documents: Array<Record<string, unknown>>): Promise<void> {
    const task = await this.client.index(collection).addDocuments(documents);
    // Explicitly waiting up to 10 seconds for the indexing task to finish asynchronously internally
    await this.client.waitForTask(task.taskUid, { timeOutMs: 10000 });
  }

  async search(
    collection: string,
    query: string,
    options?: { limit?: number; filters?: Record<string, unknown> }
  ): Promise<Array<{ id: string; score: number; document: Record<string, unknown> }>> {
    
    // Parse filters generically if they exist mapped as 'key = value' or similar logic
    let filterString: string[] = [];
    if (options?.filters) {
      for (const [key, val] of Object.entries(options.filters)) {
         filterString.push(`${key} = '${val}'`);
      }
    }

    const { hits } = await this.client.index(collection).search(query, {
      limit: options?.limit || 20,
      filter: filterString.length > 0 ? filterString : undefined,
    });

    return hits.map((h: any) => ({
      id: h.id,
      score: h._rankingScore || 1.0,
      document: h
    }));
  }

  async delete(collection: string, ids: string[]): Promise<void> {
    const task = await this.client.index(collection).deleteDocuments(ids);
    await this.client.waitForTask(task.taskUid, { timeOutMs: 10000 });
  }

  async healthCheck(): Promise<void> {
    const stats = await this.client.getStats();
    if (!stats) throw new Error('Meilisearch stats unreadable, potentially degraded.');
  }
}
