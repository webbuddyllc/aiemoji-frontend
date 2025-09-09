import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

// GET - Fetch user's recent activities
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const client = await clientPromise;
    const db = client.db('emojify');
    const activities = db.collection('user_activities');

    const userActivities = await activities
      .find({ userId: new ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ activities: userActivities });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Log a new activity
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;
    const { type, description, metadata } = await req.json();

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Type and description are required' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const activities = db.collection('user_activities');

    const activity = {
      userId: new ObjectId(userId),
      type,
      description,
      metadata: metadata || {},
      timestamp: new Date()
    };

    const result = await activities.insertOne(activity);

    return NextResponse.json({ 
      success: true, 
      activityId: result.insertedId 
    });
  } catch (error) {
    console.error('Log activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
