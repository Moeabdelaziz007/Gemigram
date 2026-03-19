import * as admin from 'firebase-admin';

/**
 * serverAuth.ts
 * Sovereign Server-Side Authentication for GemigramOS.
 * Handles JWT verification using Firebase Admin SDK.
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();

/**
 * verifyIdToken
 * Extracts the Bearer token from the Authorization header and verifies it.
 * @param token - The raw Authorization header string
 * @returns {uid, email} or null if invalid
 */
export async function verifyIdToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };
  } catch (error) {
    console.error('[ServerAuth] JWT Verification Failed:', error);
    return null;
  }
}
