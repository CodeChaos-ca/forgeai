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
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          throw new Error('RESEND_API_KEY is missing from environment variables');
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'ForgeAI <hello@forgeai.dev>',
            to: [job.data.to],
            subject: `ForgeAI: ${job.data.template} Event`,
            html: `<p>This is an automated notification for the template: <b>${job.data.template}</b></p><pre>${JSON.stringify(job.data.payload, null, 2)}</pre>`
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Resend API failed: ${response.status} ${errorBody}`);
        }
        
        const result = await response.json();
        
        logger.info({ jobId: job.id, resendId: result.id }, 'Email sent successfully via Resend');
        return { success: true, id: result.id };
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
