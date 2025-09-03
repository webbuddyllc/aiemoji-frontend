# Stripe Integration Setup Guide

## 1. Install Dependencies
The required packages have already been installed:
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK

## 2. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (get these from your Stripe dashboard)
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_your_annual_price_id_here
```

## 3. Stripe Dashboard Setup

### Create Products & Prices
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Products → Add Product
3. Create a "Premium" product with:
   - Name: "Premium Plan"
   - Description: "Unlimited access to advanced AI emoji generation"
4. Add two pricing options:
   - Monthly: $9.99/month
   - Annual: $99.99/year
5. Copy the Price IDs (they start with `price_`)

### Configure Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret (starts with `whsec_`)

## 4. Update Environment Variables
Replace the placeholder values in `.env.local` with your actual Stripe keys and price IDs.

## 5. Test the Integration
1. Start your development server
2. Go to `/pricing` page
3. Try selecting a plan (make sure you're logged in)
4. You should be redirected to Stripe checkout

## 6. Production Considerations
- Use live keys instead of test keys for production
- Update webhook endpoint to your production domain
- Ensure webhook endpoint is accessible from Stripe
- Test the complete subscription flow

## 7. Files Created/Modified
- `lib/stripe.ts` - Stripe configuration and plan definitions
- `app/api/stripe/checkout/route.ts` - Checkout session creation
- `app/api/stripe/webhooks/route.ts` - Webhook event handling
- `app/api/stripe/portal/route.ts` - Customer portal access
- `hooks/useStripe.ts` - Client-side Stripe operations
- `app/pricing/page.tsx` - Updated with Stripe integration

## 8. Next Steps
- Implement user subscription status tracking in your database
- Add subscription management in the user profile
- Handle successful payments and subscription updates
- Add subscription status checks for emoji generation limits
