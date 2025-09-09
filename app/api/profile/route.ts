import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;
    const { name, email, bio, avatar } = await req.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    // Check if email is already taken by another user
    const existingUser = await users.findOne({ 
      email: email,
      _id: { $ne: new ObjectId(userId) }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
    }

    // Update user profile
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          name,
          email,
          bio: bio || '',
          avatar: avatar || '',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log the activity
    try {
      const activities = db.collection('user_activities');
      await activities.insertOne({
        userId: new ObjectId(userId),
        type: 'profile_updated',
        description: 'Updated profile information',
        metadata: {
          updatedFields: ['name', 'email', 'bio', 'avatar']
        },
        timestamp: new Date()
      });
    } catch (activityError) {
      console.error('Failed to log profile update activity:', activityError);
      // Don't fail the request if activity logging fails
    }

    // Return updated user data
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    const { password: _, ...userWithoutPassword } = updatedUser as any;

    const userResponse = {
      ...userWithoutPassword,
      id: updatedUser._id.toString(),
      subscription: updatedUser.subscription || {
        planType: 'FREE',
        status: 'active',
        usageCount: 0,
        usageLimit: 5,
      },
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
