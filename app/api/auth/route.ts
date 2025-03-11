import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // Validate request body
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { email, password, name, isLogin } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    if (isLogin) {
      // Login logic
      const user = await users.findOne({ email });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }

      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json(userWithoutPassword);
    } else {
      // Register logic
      if (!name) {
        return NextResponse.json(
          { error: 'Name is required for registration' },
          { status: 400 }
        );
      }

      const existingUser = await users.findOne({ email });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = {
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date()
      };

      await users.insertOne(newUser);

      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = newUser;
      
      return NextResponse.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Check if error is from MongoDB connection
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(req: Request) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 