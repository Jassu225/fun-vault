import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

describe('Firestore Emulator Security Rules: games collection', () => {
  let db: ReturnType<typeof getFirestore>;
  let app: ReturnType<typeof initializeApp>;

  beforeAll(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-test',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'fake',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'fake',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'fake',
    };
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } else {
      throw new Error('Emulator not enabled. Set NEXT_PUBLIC_USE_FIRESTORE_EMULATOR=true in your env.');
    }
  });

  afterAll(async () => {
    await deleteApp(app);
  });

  it('should allow reading from the games collection', async () => {
    const gamesCol = collection(db, 'games');
    let error = null;
    try {
      await getDocs(gamesCol);
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
  });

  it('should deny writing to the games collection', async () => {
    const testRef = doc(db, 'games/testDoc');
    const testData = { foo: 'bar', timestamp: Date.now() };
    let error = null;
    try {
      await setDoc(testRef, testData);
    } catch (e: any) {
      error = e;
    }
    expect(error).not.toBeNull();
    // Firestore emulator returns a FirebaseError with code 'permission-denied'
    expect(error.code).toBe('permission-denied');
  });
});
