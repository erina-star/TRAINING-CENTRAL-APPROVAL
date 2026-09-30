import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { TrainingRegistration, DataSyncLink } from '../types';
import { INITIAL_DATA } from '../mockData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const REGISTRATIONS_COLLECTION = 'training_registrations';
const SYNC_LINKS_COLLECTION = 'sync_links';

// Default initial links to persist in Firebase
export const INITIAL_SYNC_LINKS: DataSyncLink[] = [
  {
    id: 'LINK-GOOGLE-SHEET-MASTER',
    title: 'Google Sheet Master Training Ledger (Published CSV)',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7_Training_Master_Ledger_2025/pub?output=csv',
    type: 'google_sheet_csv',
    targetPlatform: 'All Platforms',
    syncInterval: '10s Realtime Polling',
    isActive: true,
    lastSyncedAt: 'Just now (Cloud Sync Ready)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'LINK-GOOGLE-FORMS-WEBHOOK',
    title: 'Multi-Platform Google Forms Intake Feed',
    url: 'https://script.google.com/macros/s/AKfycbw_TrainingApprovalsWebhook/exec',
    type: 'google_form_webhook',
    targetPlatform: 'All Platforms',
    syncInterval: 'Immediate Webhook Ingest',
    isActive: true,
    lastSyncedAt: 'Live',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Subscribe to real-time changes on training registrations from Firestore
 */
export function subscribeToRegistrations(
  onData: (registrations: TrainingRegistration[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, REGISTRATIONS_COLLECTION);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: TrainingRegistration[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as TrainingRegistration);
      });
      onData(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, REGISTRATIONS_COLLECTION);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

/**
 * Subscribe to real-time changes on data sync links from Firestore
 */
export function subscribeToSyncLinks(
  onData: (links: DataSyncLink[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, SYNC_LINKS_COLLECTION);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: DataSyncLink[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as DataSyncLink);
      });
      onData(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, SYNC_LINKS_COLLECTION);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}

/**
 * Seed initial sample registrations and sync links if Firestore collection is empty
 */
export async function seedInitialRegistrationsIfEmpty(existingCount: number): Promise<void> {
  if (existingCount > 0) return;

  try {
    const batch = writeBatch(db);
    INITIAL_DATA.forEach((item) => {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, item.id);
      batch.set(docRef, {
        ...item,
        updatedAt: new Date().toISOString()
      });
    });
    // Seed default sync links
    INITIAL_SYNC_LINKS.forEach((link) => {
      const linkRef = doc(db, SYNC_LINKS_COLLECTION, link.id);
      batch.set(linkRef, link);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, REGISTRATIONS_COLLECTION);
  }
}

/**
 * Save / Create a new registration in Firestore
 */
export async function createRegistrationInFirestore(
  registration: TrainingRegistration
): Promise<void> {
  const path = `${REGISTRATIONS_COLLECTION}/${registration.id}`;
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registration.id);
    await setDoc(docRef, {
      ...registration,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update an existing registration in Firestore
 */
export async function updateRegistrationInFirestore(
  id: string,
  updates: Partial<TrainingRegistration>
): Promise<void> {
  const path = `${REGISTRATIONS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Save or update a Data Sync Link in Firestore
 */
export async function saveSyncLinkInFirestore(link: DataSyncLink): Promise<void> {
  const path = `${SYNC_LINKS_COLLECTION}/${link.id}`;
  try {
    const docRef = doc(db, SYNC_LINKS_COLLECTION, link.id);
    await setDoc(docRef, {
      ...link,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a Data Sync Link from Firestore
 */
export async function deleteSyncLinkFromFirestore(id: string): Promise<void> {
  const path = `${SYNC_LINKS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SYNC_LINKS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Reset all registrations in Firestore back to standard demo dataset
 */
export async function resetAllRegistrationsInFirestore(): Promise<void> {
  try {
    const batch = writeBatch(db);
    INITIAL_DATA.forEach((item) => {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, item.id);
      batch.set(docRef, {
        ...item,
        updatedAt: new Date().toISOString()
      });
    });
    INITIAL_SYNC_LINKS.forEach((link) => {
      const linkRef = doc(db, SYNC_LINKS_COLLECTION, link.id);
      batch.set(linkRef, link);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, REGISTRATIONS_COLLECTION);
  }
}
