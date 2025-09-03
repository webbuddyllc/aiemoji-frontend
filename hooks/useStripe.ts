import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    console.log('🔑 Loading Stripe with key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Key present' : 'Key missing');
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    planType: 'FREE' | 'PREMIUM',
    billingInterval: 'monthly' | 'annual',
    userId: string,
    userEmail: string
  ) => {
    try {
      console.log('🔄 useStripe - Creating checkout session:', { planType, billingInterval, userId, userEmail });
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, billingInterval, userId, userEmail })
      });

      console.log('📡 Checkout API response status:', response.status);
      const data = await response.json();
      console.log('📋 Checkout API response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (planType === 'FREE') {
        console.log('📋 FREE plan processed successfully');
        // If this was a guest user and they got a real user ID, update the user context
        if (data.isGuest && data.userId && data.userId !== userId) {
          console.log('Guest user created with ID:', data.userId);
        }
        return { success: true };
      }

      console.log('💳 Loading Stripe...');
      const stripe = await getStripe();
      console.log('💳 Stripe loaded:', !!stripe);

      if (stripe) {
        console.log('🔄 Redirecting to Stripe checkout...');
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (stripeError) {
          console.log('❌ Stripe redirect error:', stripeError);
          throw new Error(stripeError.message);
        }
        console.log('✅ Stripe redirect successful');
      } else {
        console.log('❌ Stripe not loaded');
        throw new Error('Stripe not loaded');
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      console.log('❌ useStripe error:', message);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async (customerId: string, returnUrl?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, returnUrl })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { createCheckoutSession, openCustomerPortal, loading, error, clearError: () => setError(null) };
};
