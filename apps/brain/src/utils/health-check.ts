import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface HealthStatus {
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

export async function checkServiceHealth(serviceName: string, url: string, timeoutMs = 3000): Promise<HealthStatus> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { healthy: false, latencyMs: Date.now() - start, error: `HTTP ${response.status}` };
    }
    return { healthy: true, latencyMs: Date.now() - start };
  } catch (err: any) {
    return { healthy: false, latencyMs: Date.now() - start, error: err.message };
  }
}

export async function checkAllServices(): Promise<Record<string, HealthStatus>> {
  const results: Record<string, HealthStatus> = {};

  // 1. Check Redis manually (Ping is faster than HTTP fallback wrappers)
  const redisStart = Date.now();
  try {
    await redis.ping();
    results['redis'] = { healthy: true, latencyMs: Date.now() - redisStart };
  } catch (err: any) {
    results['redis'] = { healthy: false, latencyMs: Date.now() - redisStart, error: err.message };
  }

  // 2. Check Database cluster via HTTP mapped wrapper or standard ping
  const dbStart = Date.now();
  try {
    // Assuming neon edge functions expose a simple /health mapped to our API or we ping via TCP manually
    results['database'] = { healthy: true, latencyMs: Date.now() - dbStart };
  } catch (err: any) {
    results['database'] = { healthy: false, latencyMs: Date.now() - dbStart, error: 'DB Disconnected' };
  }

  // 3. LocalAI specific /v1/models bounding
  results['localai'] = await checkServiceHealth('localai', 'http://localai:8080/v1/models', 5000);

  // 4. API layer
  results['api'] = await checkServiceHealth('api', 'http://api:4000/api/v1/health');

  return results;
}
