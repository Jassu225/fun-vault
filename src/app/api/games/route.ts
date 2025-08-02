import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/services/server/gameService';
import { Game } from '@/types/database';
import { GamesResponse } from '@/app/types/games';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let games: Game[];
    if (activeOnly) {
      games = await GameService.getActiveGames();
    } else {
      games = await GameService.getAllGames();
    }

    return NextResponse.json({ games } as GamesResponse);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
