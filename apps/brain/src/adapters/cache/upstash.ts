import { Redis } from '@upstash/redis';
import type { ICacheAdapter } from '../types';
import { trackUsage, getQuotaRemaining, isQuotaAvailable } from '../../utils/quota-tracker';
import { UPSTASH_FREE_COMMANDS_DAY } from '../../config/free-tier-limits';

export class UpstashRedisAdapter implements ICacheAdapter {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || 'fake_token',
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.redis.get<T>(key);
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, { ex: ttlSeconds });
    } else {
      await this.redis.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    return await this.redis.incrby(key, amount);
  }

  async getMemoryUsage(): Promise<{ usedMB: number; maxMB: number }> {
    // Upstash abstracts physical memory bounding. Free tier bound by requests usually, assumed 256MB limit on free DBs.
    return { usedMB: 0, maxMB: 256 };
  }

  async healthCheck(): Promise<void> {
    const res = await this.redis.ping();
    if (res !== 'PONG') throw new Error('Upstash PING failed.');
  }
}
