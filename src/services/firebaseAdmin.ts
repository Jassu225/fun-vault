import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const isEmulator = process.env.ENVIRONMENT === 'test';

export const getFirebaseAdminApp = () => {
  if (getApps().length) {
    return getApp();
  } else if (isEmulator) {
    // Use only projectId for emulator, no credentials needed
    const projectId = process.env.FIREBASE_PROJECT_ID || 'demo-test';
    return initializeApp({ projectId });
  } else {
    // Use service account for production/remote
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountBase64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is not set.');
    }
    const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }
};

export const getDb = () => getFirestore(getFirebaseAdminApp());
