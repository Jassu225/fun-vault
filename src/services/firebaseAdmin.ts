import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const isEmulator = process.env.ENVIRONMENT === 'test';

export const getFirebaseAdminApp = () => {
  if (getApps().length) {
    console.log('Using existing app ------------------------------');
    return getApp();
  } else if (isEmulator) {
    console.log('Initializing emulator ------------------------------');
    // Use only projectId for emulator, no credentials needed
    const projectId = process.env.FIREBASE_PROJECT_ID || 'demo-test';
    return initializeApp({ projectId });
  } else {
    // Use service account for production/remote
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountBase64) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is not set.');
    }

    try {
      const decodedString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
      const serviceAccount = JSON.parse(decodedString);
      return initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing service account:', error);
      console.error('Service account length:', serviceAccountBase64.length);
      throw new Error(`Failed to parse service account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

export const getDb = () => getFirestore(getFirebaseAdminApp());
