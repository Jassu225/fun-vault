import { AuthStatus } from '@/components/AuthStatus';
import { GameCatalog } from '@/components/GameCatalog';
import { fetchGet } from '@/services/shared/fetch';
import { GamesResponse } from './types/games';
import { Suspense } from 'react';

export default async function Home() {
  const gamesPromise = fetchGet<GamesResponse>(`/api/games?active=true`);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-gray text-cyber-purple font-mono">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(179,179,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(179,179,255,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none -z-10"></div>

      {/* Auth Status for Testing */}
      <AuthStatus />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift text-glow mb-8">
            FUN-VAULT
          </h1>
          <p className="text-xl text-cyber-blue uppercase tracking-widest mb-4">
            Digital Arcade • AI Opponents • Classic Strategy
          </p>
          <p className="text-cyber-purple/60 text-sm">Select a game to begin your cyberpunk adventure</p>
        </div>

        {/* Game Catalog */}
        <Suspense fallback={<GameCatalog gamesPromise={Promise.resolve({ games: [] })} loading />}>
          <GameCatalog gamesPromise={gamesPromise} />
        </Suspense>
      </div>
    </main>
  );
}
