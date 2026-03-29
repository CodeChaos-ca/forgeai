import { db } from '@forgeai/db';
import { notifications } from '@forgeai/db/schema';
import { sendEmail, WelcomeEmail } from '@forgeai/email'; // Placeholder imports for universal logic

export async function notifyAdmin(title: string, message: string, severity: 'info'|'warning'|'critical'): Promise<void> {
  const adminId = 'super-admin-uuid'; // Logic to fetch real admin UUID happens here normally
  
  // Create persistent notification in the platform database UI layer
  await db.insert(notifications).values({
    userId: adminId,
    type: 'system',
    title,
    message,
    read: false,
    link: severity === 'critical' ? '/admin/monitoring' : undefined,
  });

  if (severity === 'critical') {
    console.error(`[CRITICAL NOTIFICATION RAISED] ${title}: ${message}`);
    // A real platform sends an alert via email here bypassing queues for immediacy.
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@forgeai.dev',
        subject: `[ForgeAI CRITICAL] ${title}`,
        text: message,
        react: undefined as any // Bypassed for pure raw critical text alerting
      });
    } catch (e) {
      // Ignored inline
    }
  } else {
    console.log(`[NOTIFY ${severity.toUpperCase()}] ${title}: ${message}`);
  }
}

export async function notifyUser(userId: string, title: string, message: string, link?: string): Promise<void> {
  await db.insert(notifications).values({
    userId,
    type: 'system',
    title,
    message,
    read: false,
    link
  });
}
