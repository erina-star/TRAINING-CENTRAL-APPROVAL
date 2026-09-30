import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Connection test helper as specified in the Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt a light check from server to confirm connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'health'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or network is unreachable.');
      return false;
    }
    // Document not found is fine, it proves connection reached Firestore server
    return true;
  }
}
