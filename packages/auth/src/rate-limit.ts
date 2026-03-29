import { Redis } from 'ioredis';
import { Context, Next } from 'hono';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export function createRateLimiter(maxRequests: number, windowMs: number) {
  return async (c: Context, next: Next) => {
    // Extract IP dynamically based on proxy handling if necessary
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const path = c.req.path;
    const redisKey = `ratelimit:${path}:${ip}`;

    const limitStats = await redis.multi()
      .set(redisKey, 0, 'EX', Math.floor(windowMs / 1000), 'NX') // Initializer exclusively
      .incr(redisKey)
      .ttl(redisKey)
      .exec();

    if (!limitStats) return next();

    const [, currentUses] = limitStats[1] as [Error | null, number];

    // Standard headers
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - currentUses).toString());

    if (currentUses > maxRequests) {
      return c.json({ 
        error: 'Too Many Requests', 
        message: `Rate limit of ${maxRequests} requests per ${windowMs}ms exceeded.`
      }, 429);
    }

    return next();
  };
}
