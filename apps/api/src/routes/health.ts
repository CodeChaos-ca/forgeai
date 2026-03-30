import { Hono } from 'hono';

const healthRoutes = new Hono();

healthRoutes.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: '@forgeai/api',
      uptime: process.uptime()
    }
  });
});

export default healthRoutes;
