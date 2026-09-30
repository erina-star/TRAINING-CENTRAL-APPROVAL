import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthUser } from '../types';

const AUTH_STORAGE_KEY = 'centralized_training_auth_user';

// In-memory cache for OAuth access token per Workspace integration skill
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts'
];

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

export function getCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse cached auth user', e);
  }
  return null;
}

export function setCachedUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to save cached auth user', e);
  }
}

/**
 * Convert Firebase User to application AuthUser model
 */
export function mapFirebaseUser(user: User): AuthUser {
  const isMediaPrima = user.email?.toLowerCase().includes('mediaprima') || false;
  const role = isMediaPrima
    ? 'Lead Secretariat & Compliance Admin'
    : 'Authorized Platform Secretary';

  return {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Authorized Staff',
    email: user.email,
    photoURL: user.photoURL,
    role
  };
}

/**
 * Sign in using Firebase Google Auth Provider with Google Drive Scopes
 */
export async function signInWithGoogle(): Promise<{ user: AuthUser | null; accessToken?: string; error?: string }> {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Add Google Drive scopes
    GOOGLE_DRIVE_SCOPES.forEach((scope) => {
      provider.addScope(scope);
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    const mapped = mapFirebaseUser(result.user);
    setCachedUser(mapped);
    return { user: mapped, accessToken: cachedAccessToken || undefined };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);

    let errorMsg = 'Failed to sign in with Google.';
    if (error?.code === 'auth/popup-closed-by-user') {
      errorMsg = 'Sign-in popup was closed before completion.';
    } else if (error?.code === 'auth/popup-blocked') {
      errorMsg = 'Sign-in popup was blocked by your browser. Please allow popups or use Fast-Pass sign in.';
    } else if (error?.code === 'auth/unauthorized-domain') {
      errorMsg = 'Domain not authorized in Firebase Console. Please add this domain to Authorized Domains or use Corporate Fast-Pass.';
    } else if (error?.code === 'auth/operation-not-allowed') {
      errorMsg = 'Google sign-in provider is not enabled in Firebase Console. You can also sign in via Corporate Fast-Pass.';
    } else if (error?.message) {
      errorMsg = error.message;
    }

    return { user: null, error: errorMsg };
  } finally {
    isSigningIn = false;
  }
}

/**
 * Re-authenticates or requests Drive authorization popup if token is missing
 */
export async function requestDriveAccessToken(): Promise<string | null> {
  if (cachedAccessToken) return cachedAccessToken;

  const result = await signInWithGoogle();
  if (result.accessToken) {
    return result.accessToken;
  }
  return cachedAccessToken;
}

/**
 * Corporate Fast-Pass Sign In (e.g. Media Prima Official Account)
 */
export function quickSignInCorporate(profile: {
  email: string;
  name: string;
  role: string;
  photoURL?: string;
}): AuthUser {
  const user: AuthUser = {
    uid: `corporate-${Date.now()}`,
    displayName: profile.name,
    email: profile.email,
    photoURL: profile.photoURL || null,
    role: profile.role
  };
  setCachedUser(user);
  return user;
}

/**
 * Sign out user & clear cached token in memory
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase signOut error', e);
  } finally {
    cachedAccessToken = null;
    setCachedUser(null);
  }
}

/**
 * Listen to auth changes
 */
export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const mapped = mapFirebaseUser(firebaseUser);
      setCachedUser(mapped);
      callback(mapped);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
      }
      const cached = getCachedUser();
      callback(cached);
    }
  });
}
