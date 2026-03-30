import { Hono } from 'hono';

const templatesRoutes = new Hono();

templatesRoutes.get('/', async (c) => {
  return c.json({ success: true, data: [{ id: 't_1', name: 'Next.js SaaS Foundation natively' }] });
});

export default templatesRoutes;
