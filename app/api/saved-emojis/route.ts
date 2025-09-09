import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

// GET - Fetch user's saved emojis
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
    const savedEmojis = db.collection('saved_emojis');

    const userSavedEmojis = await savedEmojis
      .find({ userId: new ObjectId(userId) })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json({ 
      savedEmojis: userSavedEmojis,
      count: userSavedEmojis.length 
    });
  } catch (error) {
    console.error('Get saved emojis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save a new emoji
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;
    const { emoji, originalPrompt, metadata } = await req.json();

    if (!emoji || !originalPrompt) {
      return NextResponse.json(
        { error: 'Emoji and original prompt are required' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const savedEmojis = db.collection('saved_emojis');

    // Check if emoji is already saved by this user
    const existingEmoji = await savedEmojis.findOne({
      userId: new ObjectId(userId),
      emoji: emoji
    });

    if (existingEmoji) {
      return NextResponse.json(
        { error: 'Emoji is already saved' }, 
        { status: 400 }
      );
    }

    // Save the emoji
    const savedEmoji = {
      userId: new ObjectId(userId),
      emoji,
      originalPrompt,
      metadata,
      isImage: true,
      savedAt: new Date(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const result = await savedEmojis.insertOne(savedEmoji);

    // Log the activity
    const activities = db.collection('user_activities');
    await activities.insertOne({
      userId: new ObjectId(userId),
      type: 'emoji_saved',
      description: 'Saved emoji to collection',
      metadata: {
        emojiUrl: emoji,
        prompt: originalPrompt
      },
      timestamp: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      savedEmoji
    });
  } catch (error) {
    console.error('Save emoji error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove saved emoji
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');

    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.value;
    const { emojiId } = await req.json();

    if (!emojiId) {
      return NextResponse.json({ error: 'Emoji ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('emojify');
    const savedEmojis = db.collection('saved_emojis');

    const result = await savedEmojis.deleteOne({
      userId: new ObjectId(userId),
      id: emojiId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Emoji not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete saved emoji error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
