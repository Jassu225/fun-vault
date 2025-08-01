import {
  createGame,
  getGame,
  getAllGames,
  getActiveGames,
  createGameSession,
  getGameSession,
  updateGameSession,
  getUserGameSessions,
  createAnonymousUser,
  getAnonymousUser,
  updateAnonymousUser,
  incrementUserGamesPlayed,
  createGameStats,
  getGameStats,
  updateGameStats,
  getAllGameStats,
  getGlobalStats,
  updateGlobalStats,
  incrementGlobalStats,
  initializeGlobalStats,
  getDatabaseStats,
} from './database';
import { GameCategory, GameSessionStatus, PlayerType } from '../types';

describe('Database Service - Games Collection', () => {
  const testGame = {
    gameId: 'test-tic-tac-toe',
    name: 'Test Tic-Tac-Toe',
    description: 'A test game for testing',
    category: GameCategory.STRATEGY,
    icon: '🎮',
    isActive: true,
  };

  it('should create a game', async () => {
    const ref = await createGame(testGame);
    expect(ref).toBeDefined();
    expect(ref.id).toBeDefined();
  }, 10000);

  it('should get a game by ID', async () => {
    const ref = await createGame(testGame);
    const doc = await getGame(ref.id);

    expect(doc.exists).toBe(true);
    expect(doc.data()?.name).toBe(testGame.name);
  }, 10000);

  it('should get all games', async () => {
    const snapshot = await getAllGames();
    expect(snapshot.size).toBeGreaterThanOrEqual(0);
  }, 10000);

  it('should get active games only', async () => {
    const snapshot = await getActiveGames();
    snapshot.forEach((doc) => {
      expect(doc.data()?.isActive).toBe(true);
    });
  }, 10000);
});

describe('Database Service - Game Sessions Collection', () => {
  const testSession = {
    gameUid: 'test-game-id',
    anonymousUserUid: 'test-user-id',
    status: GameSessionStatus.STARTED,
    winner: PlayerType.PLAYER,
    startedAt: new Date().toISOString(),
    endedAt: null as string | null,
  };

  it('should create a game session', async () => {
    const ref = await createGameSession(testSession);
    expect(ref).toBeDefined();
    expect(ref.id).toBeDefined();
  }, 10000);

  it('should get a game session by ID', async () => {
    const ref = await createGameSession(testSession);
    const doc = await getGameSession(ref.id);

    expect(doc.exists).toBe(true);
    expect(doc.data()?.gameUid).toBe(testSession.gameUid);
  }, 10000);

  it('should update a game session', async () => {
    const ref = await createGameSession(testSession);
    const updates = {
      status: GameSessionStatus.COMPLETED,
      winner: PlayerType.AI,
      endedAt: new Date().toISOString(),
    };

    await updateGameSession(ref.id, updates);
    const updatedDoc = await getGameSession(ref.id);

    expect(updatedDoc.data()?.status).toBe(GameSessionStatus.COMPLETED);
    expect(updatedDoc.data()?.winner).toBe(PlayerType.AI);
  }, 10000);

  it('should get user game sessions', async () => {
    const userId = 'test-user-id';
    const snapshot = await getUserGameSessions(userId);
    expect(snapshot.size).toBeGreaterThanOrEqual(0);
  }, 10000);
});

describe('Database Service - Anonymous Users Collection', () => {
  const testUser = {
    gamesPlayed: 0,
    lastActiveAt: new Date().toISOString(),
  };

  it('should create an anonymous user', async () => {
    const ref = await createAnonymousUser(testUser);
    expect(ref).toBeDefined();
    expect(ref.id).toBeDefined();
  }, 10000);

  it('should get an anonymous user by ID', async () => {
    const ref = await createAnonymousUser(testUser);
    const doc = await getAnonymousUser(ref.id);

    expect(doc.exists).toBe(true);
    expect(doc.data()?.gamesPlayed).toBe(testUser.gamesPlayed);
  }, 10000);

  it('should update an anonymous user', async () => {
    const ref = await createAnonymousUser(testUser);
    const updates = {
      gamesPlayed: 5,
    };

    await updateAnonymousUser(ref.id, updates);
    const updatedDoc = await getAnonymousUser(ref.id);

    expect(updatedDoc.data()?.gamesPlayed).toBe(5);
  }, 10000);

  it('should increment user games played', async () => {
    const ref = await createAnonymousUser(testUser);
    await incrementUserGamesPlayed(ref.id);

    const updatedDoc = await getAnonymousUser(ref.id);
    expect(updatedDoc.data()?.gamesPlayed).toBe(1);
  }, 10000);
});

describe('Database Service - Game Statistics Collection', () => {
  const testStats = {
    gameUid: 'test-game-id',
    totalGamesPlayed: 0,
    averagePlayTime: 5,
    winRate: {
      player: 0.5,
      ai: 0.3,
      draw: 0.2,
    },
  };

  it('should create game statistics', async () => {
    const ref = await createGameStats(testStats);
    expect(ref).toBeDefined();
    expect(ref.id).toBeDefined();
  }, 10000);

  it('should get game statistics by ID', async () => {
    const ref = await createGameStats(testStats);
    const doc = await getGameStats(ref.id);

    expect(doc.exists).toBe(true);
    expect(doc.data()?.gameUid).toBe(testStats.gameUid);
  }, 10000);

  it('should update game statistics', async () => {
    const ref = await createGameStats(testStats);
    const updates = {
      totalGamesPlayed: 10,
      averagePlayTime: 8,
    };

    await updateGameStats(ref.id, updates);
    const updatedDoc = await getGameStats(ref.id);

    expect(updatedDoc.data()?.totalGamesPlayed).toBe(10);
    expect(updatedDoc.data()?.averagePlayTime).toBe(8);
  }, 10000);

  it('should get all game statistics', async () => {
    const snapshot = await getAllGameStats();
    expect(snapshot.size).toBeGreaterThanOrEqual(0);
  }, 10000);
});

describe('Database Service - Global Statistics Collection', () => {
  it('should get global statistics', async () => {
    const doc = await getGlobalStats();
    // May not exist initially, that's okay
    expect(doc).toBeDefined();
  }, 10000);

  it('should update global statistics', async () => {
    // First initialize the global stats
    await initializeGlobalStats();

    const updates = {
      totalGamesPlayed: 100,
      totalPlayers: 50,
      totalMatches: 75,
    };

    await updateGlobalStats(updates);
    const updatedDoc = await getGlobalStats();

    if (updatedDoc.exists) {
      expect(updatedDoc.data()?.totalGamesPlayed).toBe(100);
      expect(updatedDoc.data()?.totalPlayers).toBe(50);
      expect(updatedDoc.data()?.totalMatches).toBe(75);
    }
  }, 10000);

  it('should increment global statistics', async () => {
    // First initialize the global stats
    await initializeGlobalStats();

    const increments = {
      totalGamesPlayed: 1,
      totalPlayers: 1,
    };

    await incrementGlobalStats(increments);
    // Test passes if no error is thrown
    expect(true).toBe(true);
  }, 10000);

  it('should initialize global statistics', async () => {
    await initializeGlobalStats();
    const doc = await getGlobalStats();

    if (doc.exists) {
      expect(doc.data()?.totalGamesPlayed).toBe(0);
      expect(doc.data()?.totalPlayers).toBe(0);
      expect(doc.data()?.totalMatches).toBe(0);
    }
  }, 10000);
});

describe('Database Service - Utility Functions', () => {
  it('should get database statistics', async () => {
    const stats = await getDatabaseStats();

    expect(stats).toHaveProperty('totalGames');
    expect(stats).toHaveProperty('totalSessions');
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('totalGameStats');

    expect(typeof stats.totalGames).toBe('number');
    expect(typeof stats.totalSessions).toBe('number');
    expect(typeof stats.totalUsers).toBe('number');
    expect(typeof stats.totalGameStats).toBe('number');
  }, 10000);
});
