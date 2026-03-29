import { render } from '@react-email/render';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 'fake-key');

// SMTP Fallback
const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Universal mailer with a deterministic fallback chain:
 * 1. Resend (Primary HTTP)
 * 2. SendGrid / Postmark (Placeholder for tertiary API if desired)
 * 3. Nodemailer (SMTP Fallback)
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const defaultFrom = process.env.EMAIL_FROM || 'ForgeAI <hello@forgeai.dev>';
  const from = options.from || defaultFrom;
  const to = Array.isArray(options.to) ? options.to : [options.to];

  // Try Resend Primary
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject: options.subject,
      react: options.react,
      replyTo: options.replyTo,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return true;
  } catch (err: any) {
    console.warn(`[MAILER] Primary provider (Resend) failed: ${err.message}. Triggering SMTP fallback.`);
  }

  // Render React to standard HTML/Text for fallback transports
  const html = await render(options.react);
  const text = options.text || await render(options.react, { plainText: true });

  // Try SMTP Fallback
  try {
    await smtpTransporter.sendMail({
      from,
      to: to.join(', '),
      subject: options.subject,
      html,
      text,
      replyTo: options.replyTo,
    });
    return true;
  } catch (err: any) {
    console.error(`[MAILER] CRITICAL: All fallback mechanisms failed to send to ${to}. Error: ${err.message}`);
    return false;
  }
}
