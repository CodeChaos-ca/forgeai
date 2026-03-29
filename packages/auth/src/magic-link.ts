import { Redis } from 'ioredis';
import { generateSecureRandomToken } from './password';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function generateMagicLink(email: string): Promise<string> {
  const token = generateSecureRandomToken(32);
  
  // Store the single-use token mapping to the email. Expire in 1 hour.
  await redis.set(`magiclink:${token}`, email, 'EX', 3600);
  
  return token;
}

export async function verifyMagicLink(token: string): Promise<string | null> {
  const email = await redis.get(`magiclink:${token}`);
  
  if (email) {
    // Single use token, destroy after lookup completes
    await redis.del(`magiclink:${token}`);
    return email;
  }
  
  return null;
}

export async function sendMagicLink(email: string, appUrl: string) {
  const token = await generateMagicLink(email);
  const link = `${appUrl}/api/auth/magic-link?token=${token}`;
  
  console.log(`[AUTH] Sending MAGIC LINK to ${email}: ${link}`);
  // Intended side effect: Trigger email sending logic here e.g. Resend, Postmark
}
