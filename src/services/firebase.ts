import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
  // Only connect once in dev mode
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    // eslint-disable-next-line no-console
    console.warn('[Firestore] Using local emulator at localhost:8080');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[Firestore] Emulator connection attempted more than once.');
  }
}

export { db };
