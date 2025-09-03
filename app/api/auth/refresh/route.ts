import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
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

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;

    // Include subscription data
    const userResponse = {
      ...userWithoutPassword,
      id: user._id.toString(),
      subscription: user.subscription || {
        planType: 'FREE',
        status: 'active',
        usageCount: 0,
        usageLimit: 5
      }
    };

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('User refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
