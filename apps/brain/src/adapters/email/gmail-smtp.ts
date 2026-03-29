import * as nodemailer from 'nodemailer';
import type { IEmailAdapter } from '../types';

export class GmailSmtpAdapter implements IEmailAdapter {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || '',
      },
    });
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        // Nodemailer has its own timeout configuration internally usually
        return await operation();
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async send(to: string, subject: string, html: string, text: string): Promise<{ id: string }> {
    return this.withRetry(async () => {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
        to,
        subject,
        text,
        html,
      });

      if (!info || !info.messageId) {
        throw new Error('SMTP Dispatch failed silently');
      }

      return { id: info.messageId };
    });
  }

  async getQuotaRemaining(): Promise<{ remaining: number; resetsAt: Date }> {
    // Gmail limits proxy approximately 500 emails/day
    // Not formally tracking via Redis here as this is our final absolute fallback
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    return { remaining: Infinity, resetsAt: tomorrow };
  }
}
