import { db } from '../client';
import { templates } from '../schema';

export async function seedTemplates(authorId: string) {
  const templateList = [
    { name: 'Ultra Modern CRM', slug: 'ultra-modern-crm', category: 'crm', desc: 'A multi-tenant CRM with Kanban.' },
    { name: 'E-commerce Storefront', slug: 'ecommerce-storefront', category: 'ecommerce', desc: 'Next.js App Router store with Stripe cart.' },
    { name: 'SaaS Dashboard', slug: 'saas-dashboard', category: 'dashboard', desc: 'Analytics charts and billing management.' },
    { name: 'Realtime Chat App', slug: 'realtime-chat-app', category: 'social', desc: 'Secure WebSockets chat application.' },
    { name: 'Developer Blog', slug: 'developer-blog', category: 'blog', desc: 'MDX based static blog.' },
    { name: 'Task Manager Pro', slug: 'task-manager-pro', category: 'productivity', desc: 'Manage your tasks with drag-and-drop.' },
    { name: 'AI Image Generator UI', slug: 'ai-image-generator', category: 'ai', desc: 'DALL-E inspired UI wrapper.' },
    { name: 'Fintech Wallet App', slug: 'fintech-wallet', category: 'finance', desc: 'Dashboard for financial transactions.' },
    { name: 'EdTech Learning Hub', slug: 'edtech-learning-hub', category: 'education', desc: 'Course management system.' },
    { name: 'Healthcare Portal', slug: 'healthcare-portal', category: 'health', desc: 'HIPAA styling aware patient dashboard.' }
  ];

  await db.insert(templates).values(
    templateList.map((t) => ({
      name: t.name,
      slug: t.slug,
      description: t.desc,
      category: t.category,
      thumbnailUrl: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80`,
      fileTree: {
        'package.json': { type: 'file' },
        'src': { type: 'directory' }
      },
      authorId,
      isOfficial: true,
      isFeatured: true,
    }))
  );
}
