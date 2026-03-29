export const PLANS = {
  FREE: {
    id: 'free',
    price: 0,
    messagesMonth: 50,
    messagesDay: 10,
    apps: 3,
    integrationCredits: 10000,
    features: ['All core features', 'code view']
  },
  STARTER: {
    id: 'starter',
    price: 15,
    messagesMonth: 200,
    apps: 10,
    integrationCredits: 50000,
    features: ['Code export', 'custom domain', 'GitHub sync']
  },
  BUILDER: {
    id: 'builder',
    price: 35,
    messagesMonth: 500,
    apps: 'unlimited',
    integrationCredits: 200000,
    features: ['All features', 'priority AI']
  },
  PRO: {
    id: 'pro',
    price: 75,
    messagesMonth: 1500,
    apps: 'unlimited',
    integrationCredits: 500000,
    features: ['Advanced analytics', 'SSO']
  },
  ENTERPRISE: {
    id: 'enterprise',
    price: -1, // Custom pricing
    messagesMonth: 'unlimited',
    apps: 'unlimited',
    integrationCredits: 'unlimited',
    features: ['Dedicated infrastructure', 'SLA']
  }
} as const;
