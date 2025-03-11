import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const { email, name, currentPassword, newPassword } = await req.json();
    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    // Find the user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If changing password, verify current password
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }

    // Prepare update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    await users.updateOne(
      { email },
      { $set: updateData }
    );

    // Get updated user
    const updatedUser = await users.findOne({ email });
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    const client = await clientPromise;
    const db = client.db('emojify');
    const users = db.collection('users');

    const result = await users.deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 