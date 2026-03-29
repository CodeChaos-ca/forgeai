import type { IEmailAdapter } from '../types';
import { trackUsage, getQuotaRemaining } from '../../utils/quota-tracker';
import { BREVO_FREE_EMAILS_DAY } from '../../config/free-tier-limits';

export class BrevoAdapter implements IEmailAdapter {
  private apiKey: string;
  private endpoint = 'https://api.brevo.com/v3/smtp/email';

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async send(to: string, subject: string, html: string, text: string): Promise<{ id: string }> {
    const status = await getQuotaRemaining('brevo');
    if (status.used >= BREVO_FREE_EMAILS_DAY) {
      throw new Error('Brevo FREE daily quota exhausted.');
    }

    return this.withRetry(async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: process.env.EMAIL_FROM || 'hello@forgeai.dev', name: 'ForgeAI' },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text,
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Brevo HTTP ${res.status}`);
      }

      const data = await res.json();
      await trackUsage('brevo', 1);

      return { id: data.messageId };
    });
  }

  async getQuotaRemaining(): Promise<{ remaining: number; resetsAt: Date }> {
    const s = await getQuotaRemaining('brevo');
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    return { remaining: s.remaining, resetsAt: tomorrow };
  }
}
