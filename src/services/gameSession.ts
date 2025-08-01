import { getDb } from './firebaseAdmin';
import { GameSession } from '@/types/database';
import { CollectionReference, DocumentReference } from 'firebase-admin/firestore';

const GAME_SESSIONS_COLLECTION = 'gameSessions';

export async function createGameSession(session: GameSession): Promise<DocumentReference> {
  // Remove uid if present, Firestore will auto-generate
  const { uid, ...data } = session;
  const ref = await (getDb().collection(GAME_SESSIONS_COLLECTION) as CollectionReference<GameSession>).add({
    ...data,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  } as GameSession);
  return ref;
}
