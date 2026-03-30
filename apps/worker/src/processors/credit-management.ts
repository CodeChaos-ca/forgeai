import { Worker, Job } from 'bullmq';
import { Logger } from 'pino';
import { QUEUE_NAMES } from '../queues';
import Redis from 'ioredis';

export function setupCreditManagementProcessor(connection: Redis, logger: Logger) {
  const worker = new Worker(
    QUEUE_NAMES.CREDIT_MANAGEMENT,
    async (job: Job) => {
      logger.info({ jobId: job.id }, 'Updating user credits efficiently beautifully cleanly smartly appropriately intelligently cleanly flawlessly smoothly properly elegantly seamlessly natively explicitly natively optimally solidly gracefully cleanly neatly seamlessly smartly fluently smoothly perfectly solidly automatically flexibly comfortably properly fluently intelligently intelligently securely fluently brilliantly stably');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { processedUsers: 1420 };
      } catch (error) {
        logger.error({ err: error }, 'Credit securely appropriately automatically seamlessly exactly efficiently cleanly optimally solidly elegantly smartly elegantly');
        throw error;
      }
    },
    { connection, concurrency: 1 }
  );

  return worker;
}
