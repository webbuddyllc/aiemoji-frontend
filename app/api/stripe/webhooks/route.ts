import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

export async function POST(req: NextRequest) {
  console.log('🔄 Webhook received - processing...');

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  console.log('📨 Webhook body length:', body.length);
  console.log('🔐 Signature present:', !!signature);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('🎯 Event type:', event.type);
  console.log('📊 Event data:', JSON.stringify(event.data, null, 2));

  if (relevantEvents.has(event.type)) {
    console.log('✅ Processing relevant event:', event.type);
    try {
      const client = await clientPromise;
      const db = client.db('emojify');
      const users = db.collection('users');

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Checkout session completed:', session.id, 'Payment status:', session.payment_status);

          // Handle successful checkout - upgrade user to premium
          if (session.payment_status === 'paid' && session.metadata?.userId) {
            const actualUserId = session.metadata.userId;
            console.log('Processing premium upgrade for user:', actualUserId, '(isGuest:', session.metadata.isGuest + ')');

            try {
              const result = await users.updateOne(
              { _id: new ObjectId(actualUserId) },
                {
                  $set: {
                    'subscription.planType': 'PREMIUM',
                    'subscription.billingFrequency': session.metadata?.billingFrequency || 'monthly',
                    'subscription.stripePriceId': session.metadata?.priceId,
                    'subscription.status': 'active',
                    'subscription.stripeCustomerId': session.customer,
                    'subscription.stripeSessionId': session.id,
                    'subscription.usageCount': 0,
                    'subscription.usageLimit': 999999, // Unlimited
                    'subscription.createdAt': new Date(),
                    'subscription.updatedAt': new Date()
                  }
                }
              );

              if (result.matchedCount > 0) {
                console.log('✅ User successfully upgraded to premium:', session.metadata.userId);
              } else {
                console.error('❌ User not found for upgrade:', session.metadata.userId);
              }
            } catch (error) {
              console.error('❌ Database error during user upgrade:', error);
            }
          } else {
            console.log('Skipping upgrade - payment not completed or no userId:', {
              paymentStatus: session.payment_status,
              userId: session.metadata?.userId
            });
          }
          break;

        case 'customer.subscription.created':
          const subscriptionCreated = event.data.object;
          console.log('Subscription created:', subscriptionCreated.id);

          // Update user subscription details

          await users.updateOne(
            { 'subscription.stripeCustomerId': subscriptionCreated.customer },
            {
              $set: {
                'subscription.stripeSubscriptionId': subscriptionCreated.id,
                'subscription.stripePriceId': subscriptionCreated.items.data[0]?.price?.id,
                'subscription.billingFrequency': (subscriptionCreated.items.data[0]?.price as any)?.interval || 'monthly',
                'subscription.status': subscriptionCreated.status,
                'subscription.currentPeriodStart': new Date((subscriptionCreated as any).current_period_start * 1000),
                'subscription.currentPeriodEnd': new Date((subscriptionCreated as any).current_period_end * 1000),
                'subscription.cancelAtPeriodEnd': (subscriptionCreated as any).cancel_at_period_end,
                'subscription.updatedAt': new Date()
              }
            }
          );
          break;

        case 'customer.subscription.updated':
          const subscriptionUpdated = event.data.object;
          console.log('Subscription updated:', subscriptionUpdated.id);

          // Update subscription details
          await users.updateOne(
            { 'subscription.stripeSubscriptionId': subscriptionUpdated.id },
            {
              $set: {
                'subscription.stripePriceId': subscriptionUpdated.items.data[0]?.price?.id,
                'subscription.billingFrequency': (subscriptionUpdated.items.data[0]?.price as any)?.interval || 'monthly',
                'subscription.status': subscriptionUpdated.status,
                'subscription.currentPeriodStart': new Date((subscriptionUpdated as any).current_period_start * 1000),
                'subscription.currentPeriodEnd': new Date((subscriptionUpdated as any).current_period_end * 1000),
                'subscription.cancelAtPeriodEnd': (subscriptionUpdated as any).cancel_at_period_end,
                'subscription.updatedAt': new Date()
              }
            }
          );
          break;

        case 'customer.subscription.deleted':
          const subscriptionDeleted = event.data.object;
          console.log('Subscription deleted:', subscriptionDeleted.id);

          // Downgrade user to free plan
          await users.updateOne(
            { 'subscription.stripeSubscriptionId': subscriptionDeleted.id },
            {
              $set: {
                'subscription.planType': 'FREE',
                'subscription.billingFrequency': 'monthly',
                'subscription.status': 'inactive',
                'subscription.usageCount': 0,
                'subscription.usageLimit': 5,
                'subscription.updatedAt': new Date()
              }
            }
          );
          break;

        case 'invoice.payment_succeeded':
          const invoiceSucceeded = event.data.object;
          console.log('Payment succeeded:', invoiceSucceeded.id);
          // Handle successful payment
          break;

        case 'invoice.payment_failed':
          const invoiceFailed = event.data.object;
          console.log('Payment failed:', invoiceFailed.id);
          // Handle failed payment
          break;

        default:
          console.log('Unhandled relevant event:', event.type);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
