import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth';
import { handleWebhook } from '../services/stripe';

const billingRoutes = new Hono();

billingRoutes.get('/subscription', requireAuth, async (c) => {
  return c.json({ success: true, data: { plan: 'pro', active: true } });
});

billingRoutes.post('/webhook', async (c) => {
  const sig = c.req.header('stripe-signature');
  const body = await c.req.text();
  
  try {
     await handleWebhook(body, sig as string);
     return c.json({ received: true });
  } catch (err: any) {
     return c.json({ error: err.message }, 400);
  }
});

export default billingRoutes;
