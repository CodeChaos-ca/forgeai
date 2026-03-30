import { Worker, Job } from 'bullmq';
import { Logger } from 'pino';
import { QUEUE_NAMES } from '../queues';
import Redis from 'ioredis';

interface EmailJobData {
  to: string;
  template: string;
  payload: Record<string, any>;
}

export function setupEmailProcessor(connection: Redis, logger: Logger) {
  const worker = new Worker(
    QUEUE_NAMES.EMAIL,
    async (job: Job<EmailJobData>) => {
      logger.info({ jobId: job.id, to: job.data.to }, 'Processing email job');
      
      try {
        // Implement email logic here (e.g. Resend / SendGrid)
        // await emailAdapter.sendTemplate(job.data.to, job.data.template, job.data.payload);
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        logger.info({ jobId: job.id }, 'Email sent successfully');
        return { success: true };
      } catch (error) {
        logger.error({ err: error, jobId: job.id }, 'Failed to send email');
        throw error;
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Email job failed');
  });

  return worker;
}
