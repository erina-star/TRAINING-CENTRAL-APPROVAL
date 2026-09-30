export type Platform = 'Platform Alpha' | 'Platform Beta' | 'Platform Gamma';

export type Status = 'Pending' | 'Approved' | 'Rejected';

export interface TrainingRegistration {
  id: string; // e.g. REQ-1001 or REG-9401
  staffName: string;
  staffId: string; // e.g. EMP-3045 or STF-1042
  initials: string;
  avatarBg: string;
  platform: Platform;
  program: string; // Training title e.g. Advanced Cloud Architecture & Security
  category?: string; // e.g. Technical Operations, Systems Architecture
  sessionDate: string; // e.g. 2025-11-14 or 15 Nov 2025 • 09:00 AM
  submittedAt: string; // e.g. 2025-10-25 16:15 or Today, 09:30 AM
  status: Status;
  remarks?: string; // Rejection remarks or secretary endorsement notes
  rejectionTimestamp?: string;
  secretaryLog?: string; // e.g. "Auto-endorsed by Secretary Unit A (Tier-1 Pass)"
  updatedAt?: string;
  sourceType?: 'google_link' | 'system' | 'manual';
  sourceUrl?: string;
  sourceLinkTitle?: string;
  sourceRowNumber?: number;
  capturedFromGoogleLink?: boolean;
  rawDataPreview?: Record<string, string>;
}

export interface DataSyncLink {
  id: string;
  title: string;
  url: string;
  type: 'google_sheet_csv' | 'google_form_webhook' | 'api_endpoint';
  targetPlatform?: string;
  syncInterval?: string;
  isActive: boolean;
  lastSyncedAt?: string;
  recordCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type ViewMode = 'secretary' | 'admin';
export type DeviceView = 'responsive' | 'mobile-mockup' | 'desktop-mockup';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
}
