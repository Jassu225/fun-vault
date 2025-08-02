import { NextRequest, NextResponse } from 'next/server';
import { createAnonymousUserWithAuthUid, getAnonymousUser, updateAnonymousUser } from '@/services/server/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getAnonymousUser(userId);

    if (existingUser.exists) {
      // Update last active timestamp
      await updateAnonymousUser(userId, {
        lastActiveAt: new Date().toISOString(),
      });

      return NextResponse.json({
        message: 'User updated successfully',
        user: existingUser.data(),
      });
    }

    // Create new anonymous user with Firebase UID as document ID
    const userRef = await createAnonymousUserWithAuthUid(userId);

    return NextResponse.json({
      message: 'User created successfully',
      userId: userRef.id,
    });
  } catch (error) {
    console.error('Error creating/updating anonymous user:', error);
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userDoc = await getAnonymousUser(userId);

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: userDoc.data(),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
