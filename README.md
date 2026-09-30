# Centralized Training Approvals Platform

An enterprise multi-platform training approvals and compliance oversight portal with secretary triage workflows, administrative analytics, immutable audit logs, and Google Sheets CSV live synchronization.

---

## 🚀 Key Features

### 1. Secretary Review Portal (Desktop & Mobile)
- **Triage Queue**: Consolidated intake pipeline receiving submissions from **Platform Alpha**, **Platform Beta**, and **Platform Gamma**.
- **Instant Decision Ledger**: One-click **Approve** (clears seats and logs endorsement) and **Reject** (requires explicit administrative remarks).
- **Undo / Re-evaluation**: Revert any processed entry back to the pending queue for re-evaluation.
- **Rejection Modal Dialog**: Strict compliance validation requiring secretary remarks before rejection, featuring a 250-character limit counter and one-click canned reason presets (*Schedule Clash*, *Prerequisite Incomplete*, *Cap Exceeded*, *Duplicate Submission*).
- **Dynamic Metrics Strip**: Interactive counter chips for **Total**, **Pending Review**, **Approved**, and **Rejected** registrations with active filter indicators.

### 2. Admin Oversight Dashboard (Desktop & Mobile)
- **4 Key Performance Indicators (KPIs)**:
  - **Total Pipeline Intake**: Consolidated count across all platforms with cycle trends.
  - **Pending Review Queue**: Live count with secretary clearance alerts and average wait duration.
  - **Approved Cleared**: Cleared participant seats with percentage conversion rate.
  - **Rejected / Flagged**: Governance exceptions and department quota mismatches.
- **Master Submissions Data Table**: Sortable across staff member, platform, training program, session date, and submission timestamp.
- **Instant Keyword Search & Filtering**: Multi-field querying across staff names, employee IDs, training programs, and operational platforms.
- **Submission Audit Trail Modal**: Detailed inspection drawer displaying registration metadata, core curriculum info, secretary audit logs, and an immutable 3-step lifecycle timeline.
- **Mobile Card Accordion View**: Tap any mobile submission card to view its registration ID, timestamp, and audit trail log.

### 3. Integrations & Prototype Tools
- **Google Sheet CSV Live Sync (Stage 3 Ready)**: Connect to any published Google Sheet CSV endpoint (`File > Share > Publish to web > CSV`) to ingest live submissions automatically.
- **+ Simulate Intake (+1)**: Generate realistic incoming Google Form submissions in real-time.
- **Export Report (CSV)**: Export and download clean CSV reports formatted for administrative reporting.
- **Sandbox Reset**: Instantly restore default demonstration data across all platforms.
- **Device View Simulator**: Easily toggle between **Responsive**, **Desktop**, and **Mobile Device Screen** views directly from the navigation bar.

---

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 & Google Material Symbols
- **Build Tool**: Vite
- **Icons & Typography**: Google Material Symbols Outlined & Inter font family
- **State & Storage**: React Hooks with local persistence (`localStorage`)

---

## 📂 Project Structure

```
├── index.html                  # HTML entry point with fonts & metadata
├── metadata.json               # AI Studio applet metadata configuration
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration
└── src/
    ├── main.tsx                # React application entry point
    ├── index.css               # Global CSS & Tailwind styling setup
    ├── App.tsx                 # Core application controller & layout router
    ├── types.ts                # TypeScript data interfaces and domain types
    ├── mockData.ts             # Realistic mock registrations & preset reason pools
    └── components/
        ├── Header.tsx                 # Top navigation, live sync trigger & device toggle
        ├── SecretaryViewDesktop.tsx   # Desktop secretary review table & filters
        ├── SecretaryViewMobile.tsx    # Mobile-optimized secretary triage card queue
        ├── AdminDashboardDesktop.tsx  # Executive analytics table, KPIs & search
        ├── AdminDashboardMobile.tsx   # Mobile oversight dashboard with accordions
        ├── RejectionModal.tsx         # Mandatory remarks rejection dialog
        ├── AuditTrailModal.tsx        # Comprehensive immutable audit timeline modal
        ├── GoogleSheetSyncModal.tsx   # Google Sheet published CSV sync bridge
        └── Toast.tsx                  # Floating feedback notification banners
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. Clone this repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_NAME>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

---

## 🔒 Governance & Security

- **Client-Side Data Isolation**: Designed to run zero-credential prototype demonstrations without leaking secrets.
- **Audit Trails**: Every status change generates an immutable timestamp and secretary log record for institutional audit readiness.
- **Strict Mode Validation**: Mandatory validation guarantees that no rejection can be issued without recording the administrative reason.

---

## 📄 License

This project is licensed under the Apache 2.0 License.
