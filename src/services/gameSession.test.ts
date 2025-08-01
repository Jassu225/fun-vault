import { createGameSession } from './gameSession';
import { GameSession } from '../types/database';
import { GameSessionStatus, PlayerType } from '../types/index';
import { getFirebaseAdminApp } from './firebaseAdmin';
import { deleteApp } from 'firebase-admin/app';

describe('createGameSession', () => {
  let createdRef: FirebaseFirestore.DocumentReference | null = null;

  afterAll(async () => {
    try {
      await deleteApp(getFirebaseAdminApp());
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should create a new game session document in Firestore', async () => {
    const session: GameSession = {
      uid: '', // will be ignored
      gameUid: 'game-123',
      anonymousUserUid: 'user-456',
      status: GameSessionStatus.STARTED,
      winner: PlayerType.DRAW,
      startedAt: new Date().toISOString(),
      endedAt: '',
      createdAt: '',
      lastUpdatedAt: '',
    };
    createdRef = await createGameSession(session);
    const snap = await createdRef.get();
    expect(snap.exists).toBe(true);
    const data = snap.data();
    expect(data).toBeDefined();
    expect(data).toMatchObject({
      gameUid: 'game-123',
      anonymousUserUid: 'user-456',
      status: GameSessionStatus.STARTED,
      winner: PlayerType.DRAW,
    });
    expect(typeof data!.createdAt).toBe('string');
    expect(typeof data!.lastUpdatedAt).toBe('string');
  });
});
