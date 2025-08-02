'use client';

import { use } from 'react';
import { Game } from '@/types/database';
import { GameCard } from './GameCard';
import { GamesResponse } from '@/app/types/games';

interface GameCatalogProps {
  gamesPromise: Promise<GamesResponse>;
  loading?: boolean;
}

const gamesPlaceholder = Array.from({ length: 10 }).fill({} as Game) as Game[];

export const GameCatalog = ({ gamesPromise, loading = false }: GameCatalogProps) => {
  const { games } = use(gamesPromise);
  const onGameSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const gameId = e.currentTarget.dataset.gameId;
    if (gameId) {
      // TODO: Navigate to game page or start game
      console.log('Selected game:', gameId);
    }
  };

  if (loading || games.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {(games || gamesPlaceholder).map((game) => (
          <GameCard key={game.uid} game={game} data-game-id={game.uid} onClick={onGameSelect} loading={loading} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-cyber-purple text-xl font-mono">No games available</div>
    </div>
  );
};
