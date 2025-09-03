import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    // Get current user subscription data
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const subscription = user.subscription || {
      planType: 'FREE',
      usageCount: 0,
      usageLimit: 5
    };

    // Check if user has reached their limit
    if (subscription.usageCount >= subscription.usageLimit) {
      return NextResponse.json({
        error: 'Usage limit reached',
        usageCount: subscription.usageCount,
        usageLimit: subscription.usageLimit,
        planType: subscription.planType
      }, { status: 429 });
    }

    // Increment usage count
    const newUsageCount = (subscription.usageCount || 0) + 1;

    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'subscription.usageCount': newUsageCount,
          'subscription.updatedAt': new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      usageCount: newUsageCount,
      usageLimit: subscription.usageLimit,
      planType: subscription.planType
    });

  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const subscription = user.subscription || {
      planType: 'FREE',
      usageCount: 0,
      usageLimit: 5
    };

    return NextResponse.json({
      usageCount: subscription.usageCount || 0,
      usageLimit: subscription.usageLimit || 5,
      planType: subscription.planType || 'FREE',
      status: subscription.status || 'active'
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
