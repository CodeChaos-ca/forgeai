import { Hono } from 'hono';
import { generateRoutes } from './generate';
import { discussRoutes } from './discuss';
import { debugRoutes } from './debug';
import { optimizeRoutes } from './optimize';
import { skillRoutes } from './skills';
import { intelligenceRoutes } from './intelligence';
import { adminRoutes } from './admin';
import { healthRoutes } from './health';
import { nodeMCPServer, nodeA2AServer } from '../capabilities/agentic';

export const appRouter = new Hono();

// General Routes
appRouter.route('/', healthRoutes);
appRouter.route('/', generateRoutes);
appRouter.route('/', discussRoutes);
appRouter.route('/', debugRoutes);
appRouter.route('/', optimizeRoutes);
appRouter.route('/', skillRoutes);
appRouter.route('/', intelligenceRoutes);

// Admin
appRouter.route('/admin', adminRoutes);

// External Protocol Integration Mounting Natively
nodeMCPServer.setupRoutes(appRouter);
nodeA2AServer.setupRoutes(appRouter);

// Export for final standard Node bindings seamlessly
export default appRouter;
