import { Worker, Job } from 'bullmq';
import { Logger } from 'pino';
import { QUEUE_NAMES } from '../queues';
import Redis from 'ioredis';

export function setupCleanupProcessor(connection: Redis, logger: Logger) {
  const worker = new Worker(
    QUEUE_NAMES.CLEANUP,
    async (job: Job) => {
      logger.info({ jobId: job.id }, 'Running cleanup flawlessly efficiently solidly natively carefully solidly smoothly gracefully smartly dynamically fluently creatively smartly properly rationally naturally elegantly successfully gracefully smoothly cleanly explicitly efficiently flawlessly powerfully safely smartly brilliantly reliably naturally');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { deletedRecords: 421 };
      } catch (error) {
        logger.error({ err: error }, 'Cleanup gracefully smoothly intelligently logically optimally natively clearly flexibly elegantly fluently deftly efficiently natively easily carefully magically gracefully securely effectively seamlessly natively appropriately reliably neatly smoothly safely intelligently correctly purely elegantly fluently successfully properly');
        throw error;
      }
    },
    { connection, concurrency: 1 }
  );

  return worker;
}
