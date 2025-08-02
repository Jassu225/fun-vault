import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { UNAUTHORIZED_ERROR } from '@/app/constants/errors';

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

    try {
      const decodedString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');

      // Fix the JSON by replacing literal newlines in the private key with escaped newlines
      const fixedJsonString = decodedString.replace(/"private_key":\s*"([^"]*(?:\\.[^"]*)*)"/g, (match, privateKey) => {
        // Replace literal newlines with escaped newlines
        const fixedPrivateKey = privateKey.replace(/\n/g, '\\n');
        return `"private_key": "${fixedPrivateKey}"`;
      });

      const serviceAccount = JSON.parse(fixedJsonString);

      // Restore the newlines in the private key for Firebase Admin
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

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

export const getAuthenticatedUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    throw new Error(UNAUTHORIZED_ERROR.json.error);
  }
  const user = await adminAuth.verifyIdToken(token);
  return user;
};

export const getDb = () => getFirestore(getFirebaseAdminApp());
export const adminDb = getDb();
export const adminAuth = getAuth(getFirebaseAdminApp());
