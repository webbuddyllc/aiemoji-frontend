import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user as any;

    const userResponse = {
      ...userWithoutPassword,
      id: user._id.toString(),
      subscription: user.subscription || {
        planType: 'FREE',
        status: 'active',
        usageCount: 0,
        usageLimit: 5,
      },
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


