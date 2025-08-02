import { Game } from '@/types/database';
import { getAllGames, getActiveGames } from './database';

export class GameService {
  static async getAllGames(): Promise<Game[]> {
    try {
      const snapshot = await getAllGames();
      return snapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          }) as Game,
      );
    } catch (error) {
      console.error('Error fetching all games:', error);
      throw new Error('Failed to fetch games');
    }
  }

  static async getActiveGames(): Promise<Game[]> {
    try {
      const snapshot = await getActiveGames();
      return snapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          }) as Game,
      );
    } catch (error) {
      console.error('Error fetching active games:', error);
      throw new Error('Failed to fetch active games');
    }
  }

  static async getGameById(gameId: string): Promise<Game | null> {
    try {
      const games = await this.getAllGames();
      return games.find((game) => game.gameId === gameId) || null;
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      throw new Error('Failed to fetch game');
    }
  }
}
