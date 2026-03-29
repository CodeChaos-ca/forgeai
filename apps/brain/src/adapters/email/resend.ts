import { Resend } from 'resend';
import type { IEmailAdapter } from '../types';
import { trackUsage, getQuotaRemaining } from '../../utils/quota-tracker';
import { RESEND_FREE_EMAILS_DAY } from '../../config/free-tier-limits';

export class ResendAdapter implements IEmailAdapter {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_fake_key_local');
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await operation();
        clearTimeout(timeout);
        return res;
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async send(to: string, subject: string, html: string, text: string): Promise<{ id: string }> {
    const status = await getQuotaRemaining('resend');
    if (status.used >= RESEND_FREE_EMAILS_DAY) {
      throw new Error('Resend FREE daily quota exhausted.');
    }

    return this.withRetry(async () => {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'ForgeAI <hello@forgeai.dev>',
        to,
        subject,
        html,
        text
      });
      if (error || !data) throw new Error(error?.message || 'Resend error isolated.');
      
      await trackUsage('resend', 1);
      return { id: data.id };
    });
  }

  async getQuotaRemaining(): Promise<{ remaining: number; resetsAt: Date }> {
    const s = await getQuotaRemaining('resend');
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0); // UTC Midnight cutoff approximation
    return { remaining: s.remaining, resetsAt: tomorrow };
  }
}
