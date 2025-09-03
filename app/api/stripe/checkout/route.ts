import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { STRIPE_PRICE_IDS } from '../../../../lib/stripe';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { planType, billingInterval, userId, userEmail } = await req.json();

    if (!planType || !billingInterval || !userId || !userEmail) {
      return NextResponse.json({
        error: 'Missing required fields',
        received: { planType, billingInterval, userId, userEmail }
      }, { status: 400 });
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');
    const { ObjectId } = require('mongodb');

    // Handle guest users - create user record if it doesn't exist
    let actualUserId = userId;
    let userExists = true;

    if (userId === 'guest-user') {
      // Check if a guest user with this email already exists
      const existingGuest = await users.findOne({ email: userEmail, name: 'Guest User' });

      if (existingGuest) {
        actualUserId = existingGuest._id.toString();
        console.log('Found existing guest user:', actualUserId);
      } else {
        // Create a new guest user record
        const guestUser = {
          name: 'Guest User',
          email: userEmail,
          password: '', // Guest users don't have passwords
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`,
          createdAt: new Date(),
          subscription: {
            planType: 'FREE',
            billingFrequency: 'monthly',
            status: 'active',
            usageCount: 0,
            usageLimit: 5,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        };

        const result = await users.insertOne(guestUser);
        actualUserId = result.insertedId.toString();
        userExists = false;
        console.log('Created new guest user:', actualUserId);
      }
    } else {
      // For authenticated users, check if they exist
      try {
        const existingUser = await users.findOne({ _id: new ObjectId(userId) });
        if (!existingUser) {
          console.error('Authenticated user not found in database:', userId);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
      } catch (error) {
        console.error('Invalid user ID format:', userId);
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }
    }

    if (planType === 'FREE') {
      // Update user's free plan subscription data
      await users.updateOne(
        { _id: new ObjectId(actualUserId) },
        {
          $set: {
            'subscription.planType': 'FREE',
            'subscription.billingFrequency': 'monthly',
            'subscription.status': 'active',
            'subscription.usageCount': 0,
            'subscription.usageLimit': 5,
            'subscription.createdAt': new Date(),
            'subscription.updatedAt': new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Free plan activated',
        planType: 'FREE',
        userId: actualUserId,
        isGuest: userId === 'guest-user'
      });
    }

    if (planType !== 'PREMIUM') {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const stripePriceId = billingInterval === 'annual' ? STRIPE_PRICE_IDS.PREMIUM_ANNUAL : STRIPE_PRICE_IDS.PREMIUM_MONTHLY;
    if (!stripePriceId) {
      return NextResponse.json({ error: 'Stripe price ID not configured' }, { status: 500 });
    }

    console.log('Creating Stripe session for user:', actualUserId, 'plan:', planType, '(original ID:', userId + ')');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.nextUrl.origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${actualUserId}`,
      cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId: actualUserId,
        originalUserId: userId,
        planType: planType,
        billingFrequency: billingInterval,
        priceId: stripePriceId,
        isGuest: userId === 'guest-user' ? 'true' : 'false'
      },
      subscription_data: {
        metadata: {
          userId: actualUserId,
          originalUserId: userId,
          planType: planType,
          billingFrequency: billingInterval,
          priceId: stripePriceId,
          isGuest: userId === 'guest-user' ? 'true' : 'false'
        }
      },
    });

    console.log('Stripe session created:', session.id, 'for user:', actualUserId);

    // Store the session ID for tracking
    console.log('Storing session data for user:', actualUserId);

    const updateResult = await users.updateOne(
      { _id: new ObjectId(actualUserId) },
      {
        $set: {
          'subscription.stripeCustomerId': session.customer,
          'subscription.stripeSessionId': session.id,
          'subscription.updatedAt': new Date()
        }
      }
    );

    console.log('Database update result:', updateResult.matchedCount, 'documents matched');

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      userId: actualUserId,
      originalUserId: userId,
      isGuest: userId === 'guest-user'
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
