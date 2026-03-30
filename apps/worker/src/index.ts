import pino from 'pino';
import { setupQueues } from './queues';
import { setupEmailProcessor } from './processors/email';
import { setupDeploymentProcessor } from './processors/deployment';
import { setupAiProcessingProcessor } from './processors/ai-processing';
import { setupTestRunnerProcessor } from './processors/test-runner';
import { setupAnalyticsProcessor } from './processors/analytics-aggregation';
import { setupSelfHealingProcessor } from './processors/self-healing';
import { setupCreditManagementProcessor } from './processors/credit-management';
import { setupCleanupProcessor } from './processors/cleanup';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

async function main() {
  logger.info('Starting ForgeAI Background Worker...');

  try {
    const { connection, queues } = setupQueues(logger);

    logger.info('Initializing job processors...');
    
    // Setup processors for each queue
    const workers = [
      setupEmailProcessor(connection, logger),
      setupDeploymentProcessor(connection, logger),
      setupAiProcessingProcessor(connection, logger),
      setupTestRunnerProcessor(connection, logger),
      setupAnalyticsProcessor(connection, logger),
      setupSelfHealingProcessor(connection, logger),
      setupCreditManagementProcessor(connection, logger),
      setupCleanupProcessor(connection, logger),
    ];

    logger.info(`Successfully initialized ${workers.length} worker processors`);
    logger.info('Worker is ready to process jobs.');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      for (const worker of workers) {
         await worker.close();
      }
      for (const queue of Object.values(queues)) {
        await queue.close();
      }
      connection.disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize worker');
    process.exit(1);
  }
}

main();
