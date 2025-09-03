import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    const currentDate = new Date();

    if (userId) {
      // Reset usage for a specific user
      const user = await users.findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.subscription?.planType !== 'FREE') {
        return NextResponse.json(
          { error: 'Only free users can have their usage reset' },
          { status: 400 }
        );
      }

      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'subscription.usageCount': 0,
            'subscription.lastReset': currentDate,
            'subscription.updatedAt': currentDate
          }
        }
      );

      console.log(`Individual usage reset completed for user: ${userId}`);

      return NextResponse.json({
        success: true,
        message: `Reset usage for user ${userId}`,
        resetDate: currentDate.toISOString()
      });
    } else {
      // Bulk reset for all eligible free users
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const result = await users.updateMany(
        {
          'subscription.planType': 'FREE',
          $or: [
            { 'subscription.lastReset': { $lt: firstDayOfMonth } },
            { 'subscription.lastReset': { $exists: false } }
          ]
        },
        {
          $set: {
            'subscription.usageCount': 0,
            'subscription.lastReset': currentDate,
            'subscription.updatedAt': currentDate
          }
        }
      );

      console.log(`Bulk usage reset completed: ${result.modifiedCount} free users reset`);

      return NextResponse.json({
        success: true,
        message: `Reset usage for ${result.modifiedCount} free users`,
        resetDate: currentDate.toISOString()
      });
    }

  } catch (error) {
    console.error('Usage reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error during usage reset' },
      { status: 500 }
    );
  }
}

// GET endpoint to check when the next reset will occur
export async function GET() {
  try {
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    return NextResponse.json({
      currentDate: currentDate.toISOString(),
      nextResetDate: nextMonth.toISOString(),
      daysUntilReset: Math.ceil((nextMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
    });

  } catch (error) {
    console.error('Next reset check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
