import { getDb } from './firebaseAdmin';
import { Game, GameSession, AnonymousUser, GlobalStats, GameStats } from '@/types/database';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  WriteResult,
  FieldValue,
} from 'firebase-admin/firestore';

// Collection names
const COLLECTIONS = {
  GAMES: 'games',
  GAME_SESSIONS: 'gameSessions',
  ANONYMOUS_USERS: 'anonymousUsers',
  GAME_STATISTICS: 'gameStatistics',
  GLOBAL_STATISTICS: 'globalStatistics',
} as const;

// Games Collection Operations
export async function createGame(game: Omit<Game, 'uid' | 'createdAt' | 'lastUpdatedAt'>): Promise<DocumentReference> {
  const ref = await (getDb().collection(COLLECTIONS.GAMES) as CollectionReference<Game>).add({
    ...game,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  } as Game);
  return ref;
}

export async function getGame(gameId: string): Promise<DocumentSnapshot<Game>> {
  const doc = await getDb().collection(COLLECTIONS.GAMES).doc(gameId).get();
  return doc as DocumentSnapshot<Game>;
}

export async function getAllGames(): Promise<QuerySnapshot<Game>> {
  const snapshot = await getDb().collection(COLLECTIONS.GAMES).get();
  return snapshot as QuerySnapshot<Game>;
}

export async function getActiveGames(): Promise<QuerySnapshot<Game>> {
  const snapshot = await getDb().collection(COLLECTIONS.GAMES).where('isActive', '==', true).get();
  return snapshot as QuerySnapshot<Game>;
}

// Game Sessions Collection Operations
export async function createGameSession(
  session: Omit<GameSession, 'uid' | 'createdAt' | 'lastUpdatedAt'>,
): Promise<DocumentReference> {
  // Filter out undefined values
  const cleanData = Object.fromEntries(Object.entries(session).filter(([_, value]) => value !== undefined));

  const ref = await (getDb().collection(COLLECTIONS.GAME_SESSIONS) as CollectionReference<GameSession>).add({
    ...cleanData,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  } as GameSession);
  return ref;
}

export async function getGameSession(sessionId: string): Promise<DocumentSnapshot<GameSession>> {
  const doc = await getDb().collection(COLLECTIONS.GAME_SESSIONS).doc(sessionId).get();
  return doc as DocumentSnapshot<GameSession>;
}

export async function updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<WriteResult> {
  // Filter out undefined values
  const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));

  return await getDb()
    .collection(COLLECTIONS.GAME_SESSIONS)
    .doc(sessionId)
    .update({
      ...cleanUpdates,
      lastUpdatedAt: new Date().toISOString(),
    });
}

export async function getUserGameSessions(userId: string): Promise<QuerySnapshot<GameSession>> {
  const snapshot = await getDb().collection(COLLECTIONS.GAME_SESSIONS).where('anonymousUserUid', '==', userId).get();
  return snapshot as QuerySnapshot<GameSession>;
}

// Anonymous Users Collection Operations
export async function createAnonymousUser(user: Omit<AnonymousUser, 'uid' | 'createdAt'>): Promise<DocumentReference> {
  const ref = await (getDb().collection(COLLECTIONS.ANONYMOUS_USERS) as CollectionReference<AnonymousUser>).add({
    ...user,
    createdAt: new Date().toISOString(),
  } as AnonymousUser);
  return ref;
}

export async function getAnonymousUser(userId: string): Promise<DocumentSnapshot<AnonymousUser>> {
  const doc = await getDb().collection(COLLECTIONS.ANONYMOUS_USERS).doc(userId).get();
  return doc as DocumentSnapshot<AnonymousUser>;
}

export async function updateAnonymousUser(userId: string, updates: Partial<AnonymousUser>): Promise<WriteResult> {
  return await getDb()
    .collection(COLLECTIONS.ANONYMOUS_USERS)
    .doc(userId)
    .update({
      ...updates,
      lastActiveAt: new Date().toISOString(),
    });
}

export async function incrementUserGamesPlayed(userId: string): Promise<WriteResult> {
  return await getDb()
    .collection(COLLECTIONS.ANONYMOUS_USERS)
    .doc(userId)
    .update({
      gamesPlayed: FieldValue.increment(1),
      lastActiveAt: new Date().toISOString(),
    });
}

// Game Statistics Collection Operations
export async function createGameStats(stats: Omit<GameStats, 'uid' | 'lastUpdatedAt'>): Promise<DocumentReference> {
  const ref = await (getDb().collection(COLLECTIONS.GAME_STATISTICS) as CollectionReference<GameStats>).add({
    ...stats,
    lastUpdatedAt: new Date().toISOString(),
  } as GameStats);
  return ref;
}

export async function getGameStats(gameId: string): Promise<DocumentSnapshot<GameStats>> {
  const doc = await getDb().collection(COLLECTIONS.GAME_STATISTICS).doc(gameId).get();
  return doc as DocumentSnapshot<GameStats>;
}

export async function updateGameStats(gameId: string, updates: Partial<GameStats>): Promise<WriteResult> {
  return await getDb()
    .collection(COLLECTIONS.GAME_STATISTICS)
    .doc(gameId)
    .update({
      ...updates,
      lastUpdatedAt: new Date().toISOString(),
    });
}

export async function getAllGameStats(): Promise<QuerySnapshot<GameStats>> {
  const snapshot = await getDb().collection(COLLECTIONS.GAME_STATISTICS).get();
  return snapshot as QuerySnapshot<GameStats>;
}

// Global Statistics Collection Operations
export async function getGlobalStats(): Promise<DocumentSnapshot<GlobalStats>> {
  const doc = await getDb().collection(COLLECTIONS.GLOBAL_STATISTICS).doc('global').get();
  return doc as DocumentSnapshot<GlobalStats>;
}

export async function updateGlobalStats(updates: Partial<GlobalStats>): Promise<WriteResult> {
  return await getDb()
    .collection(COLLECTIONS.GLOBAL_STATISTICS)
    .doc('global')
    .update({
      ...updates,
      lastUpdatedAt: new Date().toISOString(),
    });
}

export async function incrementGlobalStats(fields: Partial<Record<keyof GlobalStats, number>>): Promise<WriteResult> {
  const updates: Record<string, any> = {
    lastUpdatedAt: new Date().toISOString(),
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (typeof value === 'number') {
      updates[key] = FieldValue.increment(value);
    }
  });

  return await getDb().collection(COLLECTIONS.GLOBAL_STATISTICS).doc('global').update(updates);
}

// Utility Functions
export async function initializeGlobalStats(): Promise<WriteResult> {
  const initialStats: GlobalStats = {
    totalGamesPlayed: 0,
    totalPlayers: 0,
    totalMatches: 0,
    lastUpdatedAt: new Date().toISOString(),
  };

  return await getDb().collection(COLLECTIONS.GLOBAL_STATISTICS).doc('global').set(initialStats);
}

export async function getDatabaseStats(): Promise<{
  totalGames: number;
  totalSessions: number;
  totalUsers: number;
  totalGameStats: number;
}> {
  const [gamesSnapshot, sessionsSnapshot, usersSnapshot, statsSnapshot] = await Promise.all([
    getDb().collection(COLLECTIONS.GAMES).get(),
    getDb().collection(COLLECTIONS.GAME_SESSIONS).get(),
    getDb().collection(COLLECTIONS.ANONYMOUS_USERS).get(),
    getDb().collection(COLLECTIONS.GAME_STATISTICS).get(),
  ]);

  return {
    totalGames: gamesSnapshot.size,
    totalSessions: sessionsSnapshot.size,
    totalUsers: usersSnapshot.size,
    totalGameStats: statsSnapshot.size,
  };
}

// Client-side helper function to create anonymous user with Firebase Auth UID
export async function createAnonymousUserWithAuthUid(userId: string): Promise<DocumentReference> {
  const userData: Omit<AnonymousUser, 'uid' | 'createdAt'> = {
    gamesPlayed: 0,
    lastActiveAt: new Date().toISOString(),
  };

  // Use the Firebase Auth UID as the document ID
  const docRef = getDb().collection(COLLECTIONS.ANONYMOUS_USERS).doc(userId);
  await docRef.set({
    ...userData,
    createdAt: new Date().toISOString(),
  } as AnonymousUser);

  return docRef;
}
