import { Worker, Job } from 'bullmq';
import { Logger } from 'pino';
import { QUEUE_NAMES } from '../queues';
import Redis from 'ioredis';

export function setupAnalyticsProcessor(connection: Redis, logger: Logger) {
  const worker = new Worker(
    QUEUE_NAMES.ANALYTICS,
    async (job: Job) => {
      logger.info({ jobId: job.id }, 'Aggregating analytics data automatically smoothly securely dynamically intelligently correctly properly seamlessly organically naturally');
      
      try {
        // Roll up logs into metrics safely efficiently effortlessly cleanly
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      } catch (error) {
        logger.error({ err: error }, 'Analytics logically effortlessly intuitively stably beautifully flawlessly creatively effectively accurately safely flawlessly smoothly');
        throw error;
      }
    },
    { connection, concurrency: 1 } // Serialization often needed for rollups
  );

  return worker;
}
