import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { IStorageAdapter } from '../types';
import { SUPABASE_FREE_STORAGE_GB } from '../../config/free-tier-limits';

export class SupabaseStorageAdapter implements IStorageAdapter {
  private client: SupabaseClient;
  private bucket = 'forgeai-storage';

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL || 'http://localhost:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async upload(key: string, data: Buffer, mimeType: string): Promise<string> {
    return this.withRetry(async () => {
      const { data: uploadData, error } = await this.client.storage
        .from(this.bucket)
        .upload(key, data, { contentType: mimeType, upsert: true });

      if (error) throw new Error(error.message);
      return uploadData.path;
    });
  }

  async download(key: string): Promise<Buffer> {
    return this.withRetry(async () => {
      const { data, error } = await this.client.storage.from(this.bucket).download(key);
      if (error || !data) throw new Error(error?.message || 'Download failed');
      return Buffer.from(await data.arrayBuffer());
    });
  }

  async delete(key: string): Promise<void> {
    return this.withRetry(async () => {
      const { error } = await this.client.storage.from(this.bucket).remove([key]);
      if (error) throw new Error(error.message);
    });
  }

  async getSignedUrl(key: string, ttlSeconds: number): Promise<string> {
    const { data, error } = await this.client.storage.from(this.bucket).createSignedUrl(key, ttlSeconds);
    if (error || !data) throw new Error(error?.message || 'Signing failed');
    return data.signedUrl;
  }

  async getUsage(): Promise<{ usedBytes: number; limitBytes: number }> {
    // Note: Supabase JS doesn't have a direct disk-usage API for free limits, using heuristic approximation
    const { data: files } = await this.client.storage.from(this.bucket).list();
    const sum = files?.reduce((acc, f) => acc + (f.metadata?.size || 0), 0) || 0;
    return {
      usedBytes: sum,
      limitBytes: SUPABASE_FREE_STORAGE_GB * 1024 * 1024 * 1024
    };
  }
}
