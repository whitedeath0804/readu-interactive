/* eslint-disable */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('[Stripe] Missing STRIPE_SECRET_KEY in environment.');
}
const stripe = require('stripe')(stripeSecret || '');

// Utility: create or get a customer by userId/email
async function getOrCreateCustomer({ userId, email }) {
  const searchQ = userId ? `metadata['userId']:'${userId}'` : `email:'${email}'`;
  const existing = await stripe.customers.search({ query: searchQ }).catch(() => null);
  if (existing && existing.data && existing.data.length) {
    return existing.data[0];
  }
  return stripe.customers.create({
    email: email || undefined,
    metadata: userId ? { userId } : undefined,
  });
}

// Create PaymentSheet data
app.post('/paymentsheet', async (req, res) => {
  try {
    const { userId, email, plan } = req.body || {};
    const customer = await getOrCreateCustomer({ userId, email });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-06-20' },
    );

    // Test amount: 22.89 BGN for premium; 0 for free
    const amount = plan === 'premium' ? Number(process.env.PREMIUM_AMOUNT || 2289) : 0;
    const currency = process.env.CURRENCY || 'bgn';

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: { plan: plan || 'premium' },
    });

    res.json({
      ok: true,
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
      paymentIntent: paymentIntent.client_secret,
    });
  } catch (e) {
    console.error('[paymentsheet]', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Webhook to confirm payments
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.WEBHOOK_SECRET;
  let event;
  try {
    if (!endpointSecret) throw new Error('Missing WEBHOOK_SECRET');
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // TODO: Mark user as subscribed in your DB (e.g., Firebase) using metadata
      break;
    default:
      break;
  }
  res.json({ received: true });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe test server running on :${PORT}`));

