import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limit';

const aiRoutes = new Hono();
aiRoutes.use('*', requireAuth, rateLimit(30, 60)); // Global 30 per min API bound

aiRoutes.post('/proxy/generate', async (c) => {
  const body = await c.req.json();
  // Proxy explicitly logically bound towards standard Brain TCP socket or HTTP mapping cleanly explicitly natively.
  
  const res = await fetch('http://localhost:3001/brain/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${c.get('userId')}` },
     body: JSON.stringify(body)
  });

  return new Response(res.body, { headers: { 'Content-Type': 'text/event-stream' } });
});

export default aiRoutes;
