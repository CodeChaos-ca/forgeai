import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { loggerMiddleware } from './middleware/logger';
import { generateRequestId } from './middleware/request-id';
import { errorHandler } from './middleware/error-handler';
import { corsMiddleware } from './middleware/cors';
import { securityHeaders } from './middleware/security-headers';

// Placeholder mounts avoiding un-initialized variable references during bootstrapping logically safely.
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import workspacesRoutes from './routes/workspaces';
import projectsRoutes from './routes/projects';
import aiRoutes from './routes/ai';
import deploymentsRoutes from './routes/deployments';
import workflowsRoutes from './routes/workflows';
import testsRoutes from './routes/tests';
import templatesRoutes from './routes/templates';
import billingRoutes from './routes/billing';
import analyticsRoutes from './routes/analytics';
import notificationsRoutes from './routes/notifications';
import adminRoutes from './routes/admin';

const app = new Hono();

// Global Middleware Stack strictly bound accurately
app.use('*', generateRequestId);
app.use('*', loggerMiddleware);
app.use('*', errorHandler);
app.use('*', corsMiddleware);
app.use('*', securityHeaders);

// Mount API Groups elegantly
app.route('/api/v1/health', healthRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/users', usersRoutes);
app.route('/api/v1/workspaces', workspacesRoutes);
app.route('/api/v1/projects', projectsRoutes);
app.route('/api/v1/ai', aiRoutes);
app.route('/api/v1/deployments', deploymentsRoutes);
app.route('/api/v1/workflows', workflowsRoutes);
app.route('/api/v1/tests', testsRoutes);
app.route('/api/v1/templates', templatesRoutes);
app.route('/api/v1/billing', billingRoutes);
app.route('/api/v1/analytics', analyticsRoutes);
app.route('/api/v1/notifications', notificationsRoutes);
app.route('/api/v1/admin', adminRoutes);

app.notFound((c) => c.json({ success: false, error: 'Not Found', path: c.req.path }, 404));

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
console.log(`[API] Listening structurally tightly on natively bound port ${port}`);

serve({ fetch: app.fetch, port });
