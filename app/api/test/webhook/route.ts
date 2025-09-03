import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const { userId, eventType } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Test Webhook:', eventType, 'for user:', userId);

    // Simulate checkout.session.completed event
    if (eventType === 'checkout.session.completed') {
      const client = await clientPromise;
      const db = client.db('emojify');
      const users = db.collection('users');

      // Check current user state
      const userBefore = await users.findOne({ _id: new ObjectId(userId) });
      console.log('User before webhook:', {
        id: userBefore?._id,
        planType: userBefore?.subscription?.planType,
        status: userBefore?.subscription?.status
      });

      const result = await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'subscription.planType': 'PREMIUM',
            'subscription.status': 'active',
            'subscription.stripeCustomerId': `test_customer_${userId}`,
            'subscription.stripeSessionId': `test_session_${Date.now()}`,
            'subscription.usageCount': 0,
            'subscription.usageLimit': 999999,
            'subscription.updatedAt': new Date()
          }
        }
      );

      // Check updated user state
      const userAfter = await users.findOne({ _id: new ObjectId(userId) });
      console.log('User after webhook:', {
        id: userAfter?._id,
        planType: userAfter?.subscription?.planType,
        status: userAfter?.subscription?.status,
        usageLimit: userAfter?.subscription?.usageLimit
      });

      if (result.matchedCount > 0) {
        console.log('✅ Test webhook successful for user:', userId);
        return NextResponse.json({
          success: true,
          message: 'User upgraded via test webhook',
          userBefore: {
            planType: userBefore?.subscription?.planType,
            status: userBefore?.subscription?.status
          },
          userAfter: {
            planType: userAfter?.subscription?.planType,
            status: userAfter?.subscription?.status,
            usageLimit: userAfter?.subscription?.usageLimit
          }
        });
      } else {
        console.error('❌ Test webhook failed - user not found:', userId);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Test webhook processed: ${eventType}`
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
