import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Test: Upgrading user to premium:', userId);

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    // Check current user state
    const userBefore = await users.findOne({ _id: userId });
    console.log('User before upgrade:', {
      id: userBefore?._id,
      planType: userBefore?.subscription?.planType,
      status: userBefore?.subscription?.status
    });

    const result = await users.updateOne(
      { _id: userId },
      {
        $set: {
          'subscription.planType': 'PREMIUM',
          'subscription.billingFrequency': 'monthly',
          'subscription.status': 'active',
          'subscription.stripeCustomerId': `test_customer_${userId}`,
          'subscription.stripeSessionId': `test_session_${Date.now()}`,
          'subscription.usageCount': 0,
          'subscription.usageLimit': 999999, // Unlimited
          'subscription.createdAt': new Date(),
          'subscription.updatedAt': new Date()
        }
      }
    );

    // Check updated user state
    const userAfter = await users.findOne({ _id: userId });
    console.log('User after upgrade:', {
      id: userAfter?._id,
      planType: userAfter?.subscription?.planType,
      status: userAfter?.subscription?.status,
      usageLimit: userAfter?.subscription?.usageLimit
    });

    if (result.matchedCount > 0) {
      console.log('✅ Test upgrade successful for user:', userId);
      return NextResponse.json({
        success: true,
        message: 'User upgraded to premium (test)',
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
      console.error('❌ Test upgrade failed - user not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Test upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
