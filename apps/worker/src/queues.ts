import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { Logger } from 'pino';

export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  DEPLOYMENT: 'deployment-queue',
  AI_PROCESSING: 'ai-processing-queue',
  TEST_RUNNER: 'test-runner-queue',
  ANALYTICS: 'analytics-aggregation-queue',
  SELF_HEALING: 'self-healing-queue',
  CREDIT_MANAGEMENT: 'credit-management-queue',
  CLEANUP: 'cleanup-queue',
};

export function setupQueues(logger: Logger) {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  
  const connection = new Redis(redisPort, redisHost, {
    maxRetriesPerRequest: null,
  });

  connection.on('error', (err) => {
    logger.error({ err }, 'Redis connection error for BullMQ');
  });

  connection.on('ready', () => {
    logger.info('Redis connected for BullMQ workloads');
  });

  const queues = {
    email: new Queue(QUEUE_NAMES.EMAIL, { connection }),
    deployment: new Queue(QUEUE_NAMES.DEPLOYMENT, { connection }),
    aiProcessing: new Queue(QUEUE_NAMES.AI_PROCESSING, { connection }),
    testRunner: new Queue(QUEUE_NAMES.TEST_RUNNER, { connection }),
    analytics: new Queue(QUEUE_NAMES.ANALYTICS, { connection }),
    selfHealing: new Queue(QUEUE_NAMES.SELF_HEALING, { connection }),
    creditManagement: new Queue(QUEUE_NAMES.CREDIT_MANAGEMENT, { connection }),
    cleanup: new Queue(QUEUE_NAMES.CLEANUP, { connection }),
  };

  return { connection, queues };
}
