import { NextRequest, NextResponse } from 'next/server';
import { incrementUserGamesPlayed } from '@/services/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await incrementUserGamesPlayed(userId);

    return NextResponse.json({
      message: 'Games played incremented successfully',
    });
  } catch (error) {
    console.error('Error incrementing games played:', error);
    return NextResponse.json({ error: 'Failed to increment games played' }, { status: 500 });
  }
}
