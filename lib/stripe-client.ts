// Lightweight client helpers for Stripe PaymentSheet
import { Platform } from 'react-native';

// Publishable key (test) provided by user. For production, use secure config.
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QBgcGJK4UFpOvkrfkaLoSpdtvmjzCZBJc08Y741RanQH2TdBZRnlRuLrTnbyMOOt2OCW0k8S6Vlx7vjmGYfNoSA005xGBbDlf';

export type PaymentSheetParams = {
  userId?: string;
  email?: string;
  plan?: 'premium' | 'gold' | 'free';
};

export async function preparePaymentSheet(baseUrl: string, params: PaymentSheetParams) {
  const res = await fetch(`${baseUrl}/paymentsheet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Unknown server error');
  return data as { paymentIntent: string; ephemeralKey: string; customerId: string };
}

export async function presentPaymentSheet(baseUrl: string, params: PaymentSheetParams) {
  // Import on demand to avoid type/packaging issues if the module isn't installed yet.
  const stripe: any = require('@stripe/stripe-react-native');
  const { initPaymentSheet, presentPaymentSheet: present } = stripe;
  const { paymentIntent, ephemeralKey, customerId } = await preparePaymentSheet(baseUrl, params);

  const init = await initPaymentSheet({
    merchantDisplayName: 'READU Interactive',
    paymentIntentClientSecret: paymentIntent,
    customerEphemeralKeySecret: ephemeralKey,
    customerId,
    defaultBillingDetails: { email: params.email },
    style: Platform.select({ ios: 'automatic', android: 'automatic' }),
  });
  if (init.error) throw new Error(init.error.message);

  const presentRes = await present();
  if (presentRes.error) throw new Error(presentRes.error.message);
}

