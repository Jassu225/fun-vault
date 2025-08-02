'use client';

import { Game } from '@/types/database';
import { GameCategory } from '@/types';

interface GameCardProps {
  game: Game;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
}

const getCategoryColor = (category: GameCategory) => {
  switch (category) {
    case GameCategory.STRATEGY:
      return 'border-cyber-blue bg-cyber-blue/10';
    case GameCategory.PUZZLE:
      return 'border-cyber-purple bg-cyber-purple/10';
    case GameCategory.CLASSIC:
      return 'border-cyber-green bg-cyber-green/10';
    default:
      return 'border-cyber-gray bg-cyber-gray/10';
  }
};

const getCategoryLabel = (category: GameCategory) => {
  switch (category) {
    case GameCategory.STRATEGY:
      return 'Strategy';
    case GameCategory.PUZZLE:
      return 'Puzzle';
    case GameCategory.CLASSIC:
      return 'Classic';
    default:
      return 'Unknown';
  }
};

export const GameCard = ({ game, onClick, loading = false }: GameCardProps) => {
  const categoryColor = getCategoryColor(game.category);
  const categoryLabel = getCategoryLabel(game.category);

  return (
    <div
      className={`
        relative group cursor-pointer
        bg-cyber-gray/50 backdrop-blur-sm 
        border border-cyber-blue/20 rounded-lg p-6 
        hover:border-cyber-blue/40 hover:shadow-lg hover:shadow-cyber-blue/25 
        transition-all duration-300 transform hover:scale-105
        ${categoryColor}
      `}
      onClick={onClick}
    >
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(179,179,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(179,179,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none rounded-lg"></div>

      {/* Game Icon */}
      <div className="text-4xl mb-4 text-center">{game.icon}</div>

      {/* Game Title */}
      <h3 className="text-2xl font-bold text-cyber-blue mb-2 text-center">{game.name}</h3>

      {/* Category Badge */}
      <div className="flex justify-center mb-4">
        <span
          className={`
          px-3 py-1 rounded-full text-xs font-mono font-bold
          ${categoryColor.replace('border-', 'bg-').replace('/10', '/20')}
          text-cyber-blue border border-current
        `}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Game Description */}
      <p className="text-cyber-purple/80 mb-4 text-center text-sm leading-relaxed">{game.description}</p>

      {/* Status Indicator */}
      <div className="flex justify-center">
        <div
          className={`
          w-3 h-3 rounded-full
          ${game.isActive ? 'bg-cyber-green animate-pulse' : 'bg-cyber-red'}
        `}
        ></div>
        <span className="ml-2 text-xs text-cyber-purple/60 font-mono">{game.isActive ? 'Active' : 'Inactive'}</span>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/5 to-cyber-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
    </div>
  );
};
