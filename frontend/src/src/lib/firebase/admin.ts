import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminAuth: Auth | null = null;

function getAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      'Firebase Admin: Missing env vars. Need FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
    return null;
  }

  try {
    let app: App;
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = existingApps[0]!;
    } else {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }

    adminAuth = getAuth(app);
    return adminAuth;
  } catch (error) {
    console.error('Firebase Admin init error:', error);
    return null;
  }
}

export { getAdminAuth };
