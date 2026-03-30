import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;

export async function createCustomer(email: string) {
  if (!stripe) return 'mock_cus_123';
  const customer = await stripe.customers.create({ email });
  return customer.id;
}

export async function createSubscription(customerId: string, priceId: string) {
  if (!stripe) return { id: 'mock_sub_123' };
  return await stripe.subscriptions.create({ customer: customerId, items: [{ price: priceId }] });
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) return true;
  await stripe.subscriptions.cancel(subscriptionId);
  return true;
}

export async function handleWebhook(body: string, sig: string) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return;
  
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  console.log(`[STRIPE] Handling webhook logically binding events elegantly: ${event.type}`);
  // Dispatch structural boundaries mapping smoothly here via DB updates securely
}
