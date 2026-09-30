# Centralized Training Approvals Platform

[![Version](https://img.shields.io/badge/version-2.3.0_Google_Drive_&_SSO-blue.svg)](https://github.com/)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFA611.svg)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg)](https://www.typescriptlang.org/)

An enterprise multi-platform training approvals and compliance oversight portal. Built for organizational secretariats and compliance administrators to authenticate via Google Workspace, triage incoming employee training requisitions, enforce governance decisions, audit lifecycle logs, and synchronize live Google Sheets data with real-time Firebase Cloud Firestore persistence.

---

## 🌟 What's New in Version 2.2 (Latest)

- **📊 Batch Google Link Upload & Live Data Integration (Up to 20 Links)**: Bulk upload up to 20 Google links (Sheets, published CSVs, Form response feeds) simultaneously with automatic link normalization, batch intake ingestion into the Pending Approvals queue, and persistent Firestore storage.
- **🔐 Google Workspace Authentication & Login Gate**: Access to the portal is strictly gated behind an enterprise Google login screen. Users must sign in with Google or authorized corporate credentials before viewing registrations or governance tools.
- **👤 Real-time User Profile & Role-Based Attribution**: Displays verified Google account avatars, corporate emails, and designated secretariat roles (*e.g. Lead Secretariat & Compliance Admin*). Triage decisions (Approvals, Rejections, Undos) are logged under the authenticated user's identity.
- **🚪 Seamless Sign Out & Session Security**: Secure profile menu in the global navigation allows instantaneous 1-click logout back to the authenticated portal gate.
- **🚀 Corporate Fast-Pass Access**: Integrated fast-pass for verified corporate profiles (including `erina@mediaprima.com.my`) for uninterrupted local development and testing even when browser popups are restricted.
- **🔥 Cloud Firestore Real-time Persistence**: All staff training registrations, approval decisions, audit timelines, and rejection notes are saved directly in Google Cloud Firestore (`training_registrations`).
- **🔗 Persistent Google Sheet CSV Data Links (`sync_links`)**: All Google Sheet CSV endpoints (both default streams and custom user-added URLs) are stored in Firestore with real-time synchronization across all devices and sessions.
- **⚡ Dual-Sync & Offline Resilience**: Instant real-time UI updates powered by Firestore `onSnapshot` listeners, paired with local storage caching for immediate zero-latency startup and offline resilience.
- **🛡️ Deployed Firestore Security Rules**: Granular, schema-validated Firestore security rules enforcing strict data integrity, timestamp formatting, valid status transitions, and protection against unauthorized mutations.

---

## 🚀 Core Features & Workflows

### 1. Authentication & Secretariat Access Gate
- **Google Workspace Single Sign-On (SSO)**: Powered by Firebase Authentication (`GoogleAuthProvider`) for single-click enterprise authentication.
- **Pre-Access Gating**: All platform features, triage queues, audit logs, and data sync tools remain completely protected until successful authentication.
- **Interactive User Menu**: Top-right header displays user photo, name, email, and corporate division, with an intuitive "Sign Out from Platform" action.
- **Authenticated Audit Logs**: Secretariat actions record the exact name and role of the officer who reviewed the requisition.

### 2. Secretary Review Portal (Desktop & Mobile)
- **Consolidated Intake Queue**: Unified triage stream aggregating incoming staff registrations across **Platform Alpha**, **Platform Beta**, and **Platform Gamma**.
- **One-Click Approval Ledger**: Instantly endorse eligible candidates into the official training ledger with logged timestamps and secretariat identity.
- **Mandatory Remarks Rejection Modal**: Enforces compliance by requiring secretaries to provide administrative feedback before rejecting an application.
  - **Live Character Counter**: 250-character limit counter with instant feedback.
  - **Canned Quick Reasons**: 1-click presets (*"Schedule Clash with platform operation"*, *"Department training cap exceeded for Q3"*, *"Prerequisite module not completed"*, *"Duplicate submission detected"*).
- **Undo / Re-evaluation Support**: Revert any approved or rejected submission back into the pending queue for re-evaluation.
- **Interactive Metric Filter Chips**: Filter the triage queue instantaneously by status (**Total**, **Pending**, **Approved**, **Rejected**) with active count indicators.

### 3. Admin Training Oversight Dashboard (Desktop & Mobile)
- **4 Key Performance Indicator (KPI) Metric Cards**:
  - **Total Pipeline Intake**: Consolidated volume across all operational platforms.
  - **Pending Review Queue**: Unprocessed applications requiring secretary clearance, with average queue wait indicators.
  - **Approved Cleared**: Verified seats ready for schedule endorsement, with percentage conversion rate.
  - **Rejected / Flagged**: Non-compliant registrations or department quota conflicts.
- **Sortable Submissions Master Table**: Column sorting by Staff Name, Platform, Training Program, Session Date, and Submission Timestamp.
- **Instant Keyword Search & Platform Filtering**: Multi-field querying across employee names, IDs, departments, training titles, and platform affiliations.
- **Comprehensive Submission Audit Trail**:
  - Modal drawer providing a deep dive into candidate metadata, verification timestamps, and secretary logs.
  - 3-step visual lifecycle timeline: **Form Intake** ➔ **Secretary Clearance** ➔ **Schedule Ledger Enrollment**.
- **Mobile Accordion Card Layout**: Tap any mobile submission card to inspect registration IDs, timestamps, and full audit logs.

### 4. Google Link Data Integration & Batch Upload (Up to 20 Links)
- **Authentic Link Data Capture (Zero Mock Injection)**:
  - Captures and displays **strictly real data** from the Google links shared by the user.
  - Complete elimination of synthetic or placeholder fallback records; only authentic applicant rows parsed from your sheet are presented for approval.
- **Batch Upload Engine (Capped at 20 Links per Upload)**:
  - Paste up to 20 Google links at once, or upload a `.txt`/`.csv` file containing links.
  - Strict validation: detects and warns when more than 20 links are provided, prioritizing the first 20 links.
  - Automatic URL normalization: supports direct CSV endpoints, published `/pub?output=csv` links, and standard `/edit` URLs (converted via Google Visualization API with CORS proxying).
- **Direct Sheet Cells Paste (Zero Permission Hurdles)**:
  - If a corporate Google Sheet is private or requires restricted login, users can copy cells directly from their Google Sheet (Ctrl+A, Ctrl+C) and paste into the portal to capture 100% of their actual data instantly.
- **Isolated Google Link Review & Approval Interface**:
  - Dedicated **"Only My Google Link Data"** view filter across Secretary and Admin portals to isolate and focus solely on rows captured from shared links.
  - Each applicant card features an explicit origin tag: `🔗 Google Link: [Sheet Name]` with original row index and a column inspector.
  - 1-Click **"Approve All Link Items"** action for streamlined batch clearance.
- **Persistent Data Links in Firebase Firestore**:
  - All uploaded Google links are committed directly to the `/sync_links` collection in Firestore.
  - Tracks link titles, URLs, creation dates, last synced timestamps, and ingested record counts.
  - Ingested participant registrations are saved in `/training_registrations` for multi-device visibility.

### 5. Google Drive Workspace Integration (v2.3)
- **Direct Drive File Browser**: Search and browse spreadsheets (`application/vnd.google-apps.spreadsheet`) and CSV files stored directly in your Google Drive.
- **Multi-File Drive Import (Up to 20 Files)**: Select and extract participant training records from multiple Google Drive files simultaneously directly into the Secretary Approvals queue.
- **Export Approvals Ledger to Google Drive**: Generate and commit a consolidated CSV ledger with complete audit trails and approval statuses directly into your Google Drive root folder.
- **Strict User Confirmation Protocol**: Enforces compliance dialogs prior to file creation or deletion in Google Drive to prevent unintended mutations.
- **Authenticated Bearer Token Lifecycle**: Seamlessly accesses the Google Drive API v3 using in-memory cached OAuth tokens scoped to authorized users.

### 6. Enterprise Simulation & Reporting
- **+ Simulate Intake**: Generate realistic incoming Google Form submissions on demand to test high-volume triage workflows.
- **Export Report (CSV)**: One-click export of the entire consolidated dataset with complete audit logs and administrative statuses into a clean CSV file.
- **Sandbox Reset**: Instantly repopulate default demonstration data across all three platforms.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19 (TypeScript) |
| **Authentication** | Firebase Authentication (Google Auth Provider & Corporate SSO) |
| **Styling & Design System** | Tailwind CSS v4 + Google Material Symbols Outlined + Inter Font |
| **Build Tool & Bundler** | Vite 8 + ESNext Bundler |
| **Cloud Database** | Google Firebase Cloud Firestore (`asia-southeast1`) |
| **Persistence Layer** | Dual-tier: Firestore `onSnapshot` real-time listeners + `localStorage` cache fallback |
| **Animation & Transitions** | Motion (Framer Motion v12) |
| **Icons** | Lucide React + Google Material Symbols |

---

## 🗄️ Firestore Database Schema

### 1. Collection: `/training_registrations`
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `REG-9401` or `REQ-1001`) |
| `staffName` | `string` | Full name of the applicant |
| `staffId` | `string` | Corporate staff ID (e.g., `EMP-1042`) |
| `platform` | `string` | `Platform Alpha` \| `Platform Beta` \| `Platform Gamma` |
| `department` | `string` | Staff department (Engineering, Production, Legal, etc.) |
| `trainingProgram` | `string` | Title of the enrolled training course |
| `sessionDate` | `string` | Date of the training session (`YYYY-MM-DD`) |
| `timestamp` | `string` | Submission timestamp string |
| `status` | `string` | Current triage status: `Pending` \| `Approved` \| `Rejected` |
| `secretaryRemarks` | `string` | Mandatory remarks if rejected, optional if approved |
| `auditLog` | `string` | Formatted audit log entry with timestamp and secretary action |

### 2. Collection: `/sync_links`
| Field | Type | Description |
|---|---|---|
| `id` | `string` | Link identifier (e.g., `link-default-stream`) |
| `title` | `string` | Human-readable name for the Google Sheet data source |
| `sheetUrl` | `string` | Published Google Sheets CSV URL |
| `lastSyncedAt` | `string` | ISO timestamp of the last successful sync execution |
| `createdAt` | `string` | ISO timestamp when the link was added |
| `isActive` | `boolean` | Flag indicating whether this link is the primary active source |
| `recordCount` | `number` | Total number of records synced from this source |

---

## 📂 Project Structure

```
├── firebase-applet-config.json    # Firebase project credentials & database configuration
├── firebase-blueprint.json        # Firestore entity schemas & permission blueprint
├── firestore.rules                # Deployed production Firestore security rules
├── index.html                     # HTML entry point, fonts & metadata
├── metadata.json                  # AI Studio applet manifest
├── package.json                   # Dependencies and npm script definitions
├── README.md                      # Comprehensive project documentation
├── tsconfig.json                  # Strict TypeScript compiler options
├── vite.config.ts                 # Vite bundler & Tailwind v4 plugin config
└── src/
    ├── main.tsx                   # React root entry point
    ├── index.css                  # Tailwind CSS v4 stylesheet
    ├── App.tsx                    # Main app controller, Firestore sync, state manager
    ├── firebase.ts                # Firebase app & Firestore client initialization
    ├── types.ts                   # TypeScript interfaces (TrainingRegistration, DataSyncLink, AuthUser)
    ├── mockData.ts                # Initial demonstration records & canned rejection presets
    ├── services/
    │   ├── authService.ts         # Google Auth provider, session caching & user mapping
    │   └── firestoreService.ts    # Firestore CRUD operations, real-time listeners & error handling
    └── components/
        ├── LoginScreen.tsx        # Enterprise Google login gate & corporate fast-pass
        ├── Header.tsx             # Navigation header, user profile dropdown, cloud status & device selector
        ├── SecretaryViewDesktop.tsx # Desktop table view with batch triage actions
        ├── SecretaryViewMobile.tsx  # Mobile touch-first registration card list
        ├── AdminDashboardDesktop.tsx # KPI summary cards, search filter & master table
        ├── AdminDashboardMobile.tsx  # Mobile oversight dashboard with accordions & KPIs
        ├── RejectionModal.tsx     # Mandatory secretary remarks modal with preset shortcuts
        ├── AuditTrailModal.tsx    # 3-step lifecycle audit trail inspection drawer
        ├── GoogleSheetSyncModal.tsx # Google Sheet CSV sync manager & Firebase link storage
        └── Toast.tsx              # Floating toast notification system
```

---

## ⚙️ Getting Started & Local Development

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/centralized-training-approvals.git
   cd centralized-training-approvals
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`.

### Type-Checking & Verification
```bash
# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```

---

## 🔒 Security & Institutional Governance

1. **Enterprise Google Authentication Gating**:
   - Single Sign-On (SSO) protects the portal against unauthorized visitors.
   - All review, approve, and reject actions are attributable to the logged-in user.
2. **Granular Firestore Security Rules (`firestore.rules`)**:
   - Denies arbitrary path reads and writes by default.
   - Enforces valid status transitions (`Pending` ➔ `Approved` / `Rejected`).
   - Restricts field lengths and mandates string sanitization.
3. **Mandatory Administrative Accountability**:
   - Rejections cannot be committed without explicit administrative feedback.
   - Every status modification automatically updates the immutable `auditLog` with the exact system timestamp and authenticated officer's credentials.
4. **Data Link Security**:
   - Validates that Google Sheet sync URLs conform to secure `https://` schemas before committing to Firestore.

---

## 📄 License

This project is licensed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.
