import { Redis } from 'ioredis';
import type { ICacheAdapter } from '../types';

export class SelfHostedRedisAdapter implements ICacheAdapter {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff up to 2 seconds
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`[CACHE] Read failure for key ${key}:`, e);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (e) {
      console.warn(`[CACHE] Write failure for key ${key}:`, e);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (e) {
      console.warn(`[CACHE] Delete failure for key ${key}:`, e);
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, amount);
    } catch (e) {
      console.warn(`[CACHE] Increment failure for key ${key}:`, e);
      return 0; // Fallback math protection
    }
  }

  async getMemoryUsage(): Promise<{ usedMB: number; maxMB: number }> {
    try {
      const info = await this.redis.info('memory');
      const usedMatch = info.match(/used_memory:(\d+)/);
      const maxMatch = info.match(/maxmemory:(\d+)/);
      
      const usedBytes = usedMatch ? parseInt(usedMatch[1], 10) : 0;
      const maxBytes = maxMatch && parseInt(maxMatch[1], 10) > 0 ? parseInt(maxMatch[1], 10) : 256 * 1024 * 1024; // Default assumed 256MB free
      
      return { usedMB: usedBytes / 1024 / 1024, maxMB: maxBytes / 1024 / 1024 };
    } catch (e) {
      return { usedMB: 0, maxMB: 0 };
    }
  }

  async healthCheck(): Promise<void> {
    const res = await this.redis.ping();
    if (res !== 'PONG') throw new Error('Redis ping resolved badly.');
  }
}
