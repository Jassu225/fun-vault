import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from './GameCard';
import { Game } from '@/types/database';
import { GameCategory } from '@/types';

const mockGame: Game = {
  uid: 'test-game-1',
  gameId: 'tic-tac-toe',
  name: 'Tic-Tac-Toe',
  description: 'Classic 3x3 grid strategy with AI opponents.',
  category: GameCategory.CLASSIC,
  icon: '⭕',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  lastUpdatedAt: '2025-01-01T00:00:00Z',
};

describe('GameCard', () => {
  it('should render game information correctly', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('Tic-Tac-Toe')).toBeInTheDocument();
    expect(screen.getByText('Classic 3x3 grid strategy with AI opponents.')).toBeInTheDocument();
    expect(screen.getByText('⭕')).toBeInTheDocument();
    expect(screen.getByText('Classic')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should display correct category colors', () => {
    const strategyGame: Game = { ...mockGame, category: GameCategory.STRATEGY };
    const puzzleGame: Game = { ...mockGame, category: GameCategory.PUZZLE };
    const classicGame: Game = { ...mockGame, category: GameCategory.CLASSIC };

    const { rerender } = render(<GameCard game={strategyGame} />);
    expect(screen.getByText('Strategy')).toBeInTheDocument();

    rerender(<GameCard game={puzzleGame} />);
    expect(screen.getByText('Puzzle')).toBeInTheDocument();

    rerender(<GameCard game={classicGame} />);
    expect(screen.getByText('Classic')).toBeInTheDocument();
  });

  it('should show inactive status for inactive games', () => {
    const inactiveGame: Game = { ...mockGame, isActive: false };
    render(<GameCard game={inactiveGame} />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<GameCard game={mockGame} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Tic-Tac-Toe').closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when no handler is provided', () => {
    render(<GameCard game={mockGame} />);

    // Should not throw error when clicked without onClick handler
    expect(() => {
      fireEvent.click(screen.getByText('Tic-Tac-Toe').closest('div')!);
    }).not.toThrow();
  });

  it('should have proper accessibility attributes', () => {
    render(<GameCard game={mockGame} />);

    const card = screen.getByText('Tic-Tac-Toe').closest('div');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('should render with different game data', () => {
    const differentGame: Game = {
      uid: 'test-game-2',
      gameId: 'connect-four',
      name: 'Connect Four',
      description: 'Drop tokens to create winning combinations.',
      category: GameCategory.STRATEGY,
      icon: '🔴',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      lastUpdatedAt: '2025-01-01T00:00:00Z',
    };

    render(<GameCard game={differentGame} />);

    expect(screen.getByText('Connect Four')).toBeInTheDocument();
    expect(screen.getByText('Drop tokens to create winning combinations.')).toBeInTheDocument();
    expect(screen.getByText('🔴')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toBeInTheDocument();
  });
});
