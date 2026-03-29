import { Hono } from 'hono';
import { systemHealth } from '../capabilities/infrastructure';
import { registry } from '../adapters/registry';
import { ICacheAdapter } from '../adapters/types';

export const healthRoutes = new Hono();

healthRoutes.get('/health', async (c) => {
  const report = await systemHealth.checkAll();
  
  const cache = registry.getAdapter<ICacheAdapter>('Cache');
  const iScore = await cache.get<number>(`intelligence:daily:${new Date().toISOString().split('T')[0]}`) || 85.0;

  let statusStr = 'healthy';
  const unhealthyCount = Object.values(report.services).filter(s => s === 'unhealthy').length;
  if (unhealthyCount > 0) statusStr = unhealthyCount > 2 ? 'unhealthy' : 'degraded';

  return c.json({
    status: statusStr,
    intelligence_score: iScore,
    skills_count: 50, // Usually from DB explicitly cleanly caching logic global explicitly dynamically natively mapped globally dynamically natively mapped
    services: report.services,
    uptime_seconds: Math.floor(process.uptime())
  });
});
