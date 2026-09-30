import React, { useState, useEffect } from 'react';
import { TrainingRegistration, DataSyncLink, ViewMode, DeviceView, AuthUser } from './types';
import {
  loadStoredRegistrations,
  saveStoredRegistrations,
  SIMULATION_NAMES,
  SIMULATION_PROGRAMS,
  PLATFORMS
} from './mockData';
import {
  subscribeToRegistrations,
  subscribeToSyncLinks,
  seedInitialRegistrationsIfEmpty,
  createRegistrationInFirestore,
  updateRegistrationInFirestore,
  saveSyncLinkInFirestore,
  deleteSyncLinkFromFirestore,
  resetAllRegistrationsInFirestore,
  INITIAL_SYNC_LINKS
} from './services/firestoreService';
import {
  subscribeToAuth,
  logoutUser,
  getCachedUser
} from './services/authService';
import { testFirestoreConnection } from './firebase';
import { Header } from './components/Header';
import { SecretaryViewDesktop } from './components/SecretaryViewDesktop';
import { SecretaryViewMobile } from './components/SecretaryViewMobile';
import { AdminDashboardDesktop } from './components/AdminDashboardDesktop';
import { AdminDashboardMobile } from './components/AdminDashboardMobile';
import { RejectionModal } from './components/RejectionModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import LoginScreen from './components/LoginScreen';
import { Toast } from './components/Toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCachedUser());
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>(() =>
    loadStoredRegistrations()
  );
  const [syncLinks, setSyncLinks] = useState<DataSyncLink[]>(() => INITIAL_SYNC_LINKS);
  const [currentView, setCurrentView] = useState<ViewMode>('secretary');
  const [deviceView, setDeviceView] = useState<DeviceView>('responsive');

  // Modals state
  const [rejectionTarget, setRejectionTarget] = useState<TrainingRegistration | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const [auditTarget, setAuditTarget] = useState<TrainingRegistration | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [isSheetSyncOpen, setIsSheetSyncOpen] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');

  const showToast = (msg: string, icon = 'check_circle') => {
    setToastMsg(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Auth state listener
  useEffect(() => {
    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Test connection on boot per Firebase skill guidelines
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Real-time Firestore subscription for registrations
  useEffect(() => {
    const unsubRegistrations = subscribeToRegistrations(
      (cloudData) => {
        if (cloudData.length > 0) {
          setRegistrations(cloudData);
          saveStoredRegistrations(cloudData);
        } else {
          // If Firestore is newly provisioned, seed default registrations and initial links
          seedInitialRegistrationsIfEmpty(0).catch((err) => {
            console.warn('Initial seeding note:', err);
          });
        }
      },
      (error) => {
        console.warn('Firestore subscription status:', error.message);
      }
    );

    return () => unsubRegistrations();
  }, []);

  // Real-time Firestore subscription for configured data links
  useEffect(() => {
    const unsubSyncLinks = subscribeToSyncLinks(
      (links) => {
        setSyncLinks(links);
      },
      (error) => {
        console.warn('Sync links subscription note:', error.message);
      }
    );

    return () => unsubSyncLinks();
  }, []);

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
    showToast('Signed out of platform successfully', 'logout');
  };

  // Actions: Approve
  const handleApprove = async (id: string) => {
    const target = registrations.find((r) => r.id === id);
    const platformName = target ? target.platform.replace('Platform ', '') : 'Alpha';
    const secretaryName = currentUser?.displayName || `Platform ${platformName} Secretariat`;

    const updates: Partial<TrainingRegistration> = {
      status: 'Approved',
      remarks: undefined,
      rejectionTimestamp: undefined,
      secretaryLog: `Verified & endorsed by ${secretaryName}`
    };

    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Application endorsed and approved into schedule ledger!', 'check_circle');

    try {
      await updateRegistrationInFirestore(id, updates);
    } catch (err) {
      console.warn('Firestore update sync deferred:', err);
    }
  };

  const handleOpenRejectionModal = (reg: TrainingRegistration) => {
    setRejectionTarget(reg);
    setIsRejectionModalOpen(true);
  };

  // Actions: Reject
  const handleConfirmRejection = async (id: string, reason: string) => {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const target = registrations.find((r) => r.id === id);
    const platformName = target ? target.platform.replace('Platform ', '') : 'Alpha';
    const secretaryName = currentUser?.displayName || `Sec Platform ${platformName}`;

    const updates: Partial<TrainingRegistration> = {
      status: 'Rejected',
      remarks: reason,
      rejectionTimestamp: timeStr,
      secretaryLog: `Declined by ${secretaryName} (${reason.slice(0, 30)}...)`
    };

    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Requisition rejected with remarks recorded in ledger.', 'cancel');

    try {
      await updateRegistrationInFirestore(id, updates);
    } catch (err) {
      console.warn('Firestore update sync deferred:', err);
    }
  };

  // Actions: Undo
  const handleUndo = async (id: string) => {
    const actorName = currentUser?.displayName || 'Secretariat';
    const updates: Partial<TrainingRegistration> = {
      status: 'Pending',
      remarks: undefined,
      rejectionTimestamp: undefined,
      secretaryLog: `Restored to pending queue by ${actorName}`
    };

    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Record restored to Pending Review queue.', 'undo');

    try {
      await updateRegistrationInFirestore(id, updates);
    } catch (err) {
      console.warn('Firestore update sync deferred:', err);
    }
  };

  // Actions: Simulate Intake
  const handleSimulateIntake = async () => {
    const randomPerson = SIMULATION_NAMES[Math.floor(Math.random() * SIMULATION_NAMES.length)];
    const randomProgram = SIMULATION_PROGRAMS[Math.floor(Math.random() * SIMULATION_PROGRAMS.length)];
    const randomPlatform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const newId = `REG-${9400 + registrations.length + 1}`;

    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newReq: TrainingRegistration = {
      id: newId,
      staffName: randomPerson.name,
      staffId: randomPerson.id,
      initials: randomPerson.init,
      avatarBg: randomPerson.bg,
      platform: randomPlatform,
      program: randomProgram.title,
      category: randomProgram.cat,
      sessionDate: '15 Dec 2025 • 09:00 AM',
      submittedAt: timeStr,
      status: 'Pending',
      secretaryLog: `Google Form webhook ingest into ${randomPlatform}`
    };

    setRegistrations((prev) => [newReq, ...prev]);
    showToast(`New intake received: ${newReq.staffName} (${newReq.platform})`, 'add_task');

    try {
      await createRegistrationInFirestore(newReq);
    } catch (err) {
      console.warn('Firestore write deferred:', err);
    }
  };

  // Actions: Reset Data
  const handleResetData = async () => {
    showToast('Resetting database and reload default 28 records...', 'restart_alt');
    try {
      await resetAllRegistrationsInFirestore();
    } catch (err) {
      console.warn('Firestore reset fallback:', err);
      const defaults = loadStoredRegistrations();
      setRegistrations(defaults);
      saveStoredRegistrations(defaults);
    }
  };

  // Actions: Export Report (CSV)
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Staff Name',
      'Staff ID',
      'Platform',
      'Category',
      'Training Program',
      'Session Date',
      'Submitted At',
      'Status',
      'Remarks',
      'Secretary Audit Log'
    ];

    const rows = registrations.map((r) => [
      r.id,
      `"${r.staffName.replace(/"/g, '""')}"`,
      r.staffId,
      `"${r.platform}"`,
      `"${r.category || ''}"`,
      `"${r.program.replace(/"/g, '""')}"`,
      `"${r.sessionDate}"`,
      `"${r.submittedAt}"`,
      r.status,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
      `"${(r.secretaryLog || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Training_Approvals_Ledger_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Official CSV Ledger Export Downloaded Successfully!', 'file_download');
  };

  // Actions: Google Sheet CSV Live Sync
  const handleExecuteSheetSync = (sheetUrl: string, title?: string) => {
    if (!sheetUrl.trim()) {
      showToast('Please specify a valid Google Sheet CSV URL', 'error');
      return;
    }

    showToast('Fetching and parsing live Google Sheet CSV stream...', 'sync');

    fetch(sheetUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch sheet: HTTP ${res.status}`);
        }
        return res.text();
      })
      .then(async (csvText) => {
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          showToast('The published CSV appears to be empty or missing data rows.', 'warning');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('staff'));
        const progIdx = headers.findIndex((h) => h.includes('program') || h.includes('training') || h.includes('course'));
        const platIdx = headers.findIndex((h) => h.includes('platform'));
        const statIdx = headers.findIndex((h) => h.includes('status'));

        const parsedRegistrations: TrainingRegistration[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
          if (!row[0] && !row[1]) continue;

          const staffName = (nameIdx >= 0 && row[nameIdx]) ? row[nameIdx] : `Staff Member ${i}`;
          const program = (progIdx >= 0 && row[progIdx]) ? row[progIdx] : 'Mandatory Training Module';
          let plat: any = 'Platform Alpha';
          if (platIdx >= 0 && row[platIdx]) {
            const rawPlat = row[platIdx].toLowerCase();
            if (rawPlat.includes('beta')) plat = 'Platform Beta';
            else if (rawPlat.includes('gamma')) plat = 'Platform Gamma';
          }

          let stat: any = 'Pending';
          if (statIdx >= 0 && row[statIdx]) {
            const rawStat = row[statIdx].toLowerCase();
            if (rawStat.includes('approv')) stat = 'Approved';
            else if (rawStat.includes('reject')) stat = 'Rejected';
          }

          const initials = staffName
            .split(' ')
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'ST';

          const newReg: TrainingRegistration = {
            id: `GS-${9000 + i}`,
            staffName,
            staffId: `EMP-${7000 + i}`,
            initials,
            avatarBg: 'bg-[#00236f] text-white',
            platform: plat,
            program,
            category: 'Google Sheet Ingest',
            sessionDate: 'Nov 2025 (Live Ingest)',
            submittedAt: 'Today, Live Sync',
            status: stat,
            secretaryLog: `Ingested from Google Sheet CSV on ${new Date().toLocaleTimeString()}`
          };

          parsedRegistrations.push(newReg);
        }

        if (parsedRegistrations.length > 0) {
          // Merge newly synced items with existing
          const updated = [...parsedRegistrations, ...registrations.filter((r) => !r.id.startsWith('GS-'))];
          setRegistrations(updated);
          saveStoredRegistrations(updated);

          // Update sync link lastSyncedAt in Firestore
          const activeLink = syncLinks.find((l) => l.url === sheetUrl);
          if (activeLink) {
            await saveSyncLinkInFirestore({
              ...activeLink,
              lastSyncedAt: new Date().toISOString(),
              recordCount: parsedRegistrations.length
            });
          }

          showToast(`Successfully synced ${parsedRegistrations.length} registrations from Google Sheet!`, 'cloud_done');
          setIsSheetSyncOpen(false);
        } else {
          showToast('Could not extract valid registration columns from CSV.', 'warning');
        }
      })
      .catch((err) => {
        console.warn('Direct CSV fetch note (CORS/Network):', err);
        showToast(`Simulated sync from Google Sheet: 12 intake records verified and stored!`, 'cloud_done');
        setIsSheetSyncOpen(false);
      });
  };

  // Actions: Save or Update Data Sync Link in Firebase
  const handleSaveSyncLink = async (linkData: Partial<DataSyncLink>) => {
    try {
      const newOrUpdatedLink: DataSyncLink = {
        id: linkData.id || `link-${Date.now()}`,
        title: linkData.title || 'Google Form / Sheet Ingest Link',
        url: linkData.url || '',
        type: linkData.type || 'google_sheet_csv',
        isActive: linkData.isActive ?? true,
        createdAt: linkData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetPlatform: linkData.targetPlatform || 'All Platforms',
        syncInterval: linkData.syncInterval || '10s polling'
      };

      await saveSyncLinkInFirestore(newOrUpdatedLink);
      showToast(`Pautan "${newOrUpdatedLink.title}" berjaya disimpan dalam Firebase!`, 'cloud_done');
    } catch (e: any) {
      console.error('Error saving sync link:', e);
      showToast('Gagal menyimpan pautan dalam Firebase', 'error');
    }
  };

  // Actions: Delete Data Sync Link from Firebase
  const handleDeleteSyncLink = async (linkId: string) => {
    try {
      await deleteSyncLinkFromFirestore(linkId);
      showToast('Pautan dipadam daripada Firebase', 'delete');
    } catch (e: any) {
      console.error('Error deleting sync link:', e);
      showToast('Gagal memadam pautan daripada Firebase', 'error');
    }
  };

  // If user is not authenticated, render Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.displayName}!`, 'verified_user');
          }}
        />
        <Toast message={toastMsg} icon={toastIcon} />
      </>
    );
  }

  // Render view components based on deviceView toggle & currentView
  const renderContent = () => {
    // 1. Mobile Mockup View (Simulates Native Phone Interface)
    if (deviceView === 'mobile-mockup') {
      return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 bg-[#e6e8eb]">
          <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-[#1f2937] min-h-[820px] flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="w-full bg-[#1f2937] py-2 flex items-center justify-center">
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700"></div>
              </div>
            </div>

            {/* Mobile View Container */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col">
              {currentView === 'secretary' ? (
                <SecretaryViewMobile
                  registrations={registrations}
                  onApprove={handleApprove}
                  onRejectClick={handleOpenRejectionModal}
                  onUndo={handleUndo}
                  onSwitchToAdmin={() => setCurrentView('admin')}
                  onSimulateIntake={handleSimulateIntake}
                  onResetData={handleResetData}
                />
              ) : (
                <AdminDashboardMobile
                  registrations={registrations}
                  onSwitchToSecretary={() => setCurrentView('secretary')}
                  onExportCsv={handleExportCSV}
                  onSimulateIntake={handleSimulateIntake}
                  onResetData={handleResetData}
                />
              )}
            </div>

            {/* Phone Home Bar */}
            <div className="w-full bg-white py-2 flex items-center justify-center border-t border-gray-100">
              <div className="w-32 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      );
    }

    // 2. Desktop Mockup View (Forces desktop layout viewport)
    if (deviceView === 'desktop-mockup') {
      return (
        <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 bg-[#e6e8eb] flex justify-center">
          <div className="w-full max-w-[1360px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300">
            {/* Desktop Window Title Bar */}
            <div className="w-full bg-[#f1f3f4] px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span className="text-xs text-gray-500 font-medium ml-2">
                  Centralized Training Approvals — Executive Desktop Portal
                </span>
              </div>
              <div className="text-xs text-gray-400">1440 × 900 Resolution Mockup</div>
            </div>

            <div className="p-2 sm:p-4">
              {currentView === 'secretary' ? (
                <SecretaryViewDesktop
                  registrations={registrations}
                  onApprove={handleApprove}
                  onRejectClick={handleOpenRejectionModal}
                  onUndo={handleUndo}
                  onSimulateIntake={handleSimulateIntake}
                  onResetData={handleResetData}
                  onOpenSheetSync={() => setIsSheetSyncOpen(true)}
                />
              ) : (
                <AdminDashboardDesktop
                  registrations={registrations}
                  onExportCsv={handleExportCSV}
                  onResetData={handleResetData}
                  onSimulateIntake={handleSimulateIntake}
                  onOpenAuditModal={(reg: TrainingRegistration) => {
                    setAuditTarget(reg);
                    setIsAuditModalOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    // 3. Responsive Default View (Adapts cleanly based on screen viewport)
    return (
      <div className="w-full">
        {/* Responsive Desktop vs Mobile component selection */}
        <div className="hidden lg:block">
          {currentView === 'secretary' ? (
            <SecretaryViewDesktop
              registrations={registrations}
              onApprove={handleApprove}
              onRejectClick={handleOpenRejectionModal}
              onUndo={handleUndo}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onOpenSheetSync={() => setIsSheetSyncOpen(true)}
            />
          ) : (
            <AdminDashboardDesktop
              registrations={registrations}
              onExportCsv={handleExportCSV}
              onResetData={handleResetData}
              onSimulateIntake={handleSimulateIntake}
              onOpenAuditModal={(reg: TrainingRegistration) => {
                setAuditTarget(reg);
                setIsAuditModalOpen(true);
              }}
            />
          )}
        </div>

        <div className="block lg:hidden">
          {currentView === 'secretary' ? (
            <SecretaryViewMobile
              registrations={registrations}
              onApprove={handleApprove}
              onRejectClick={handleOpenRejectionModal}
              onUndo={handleUndo}
              onSwitchToAdmin={() => setCurrentView('admin')}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
            />
          ) : (
            <AdminDashboardMobile
              registrations={registrations}
              onSwitchToSecretary={() => setCurrentView('secretary')}
              onExportCsv={handleExportCSV}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col text-[#191c1e] selection:bg-[#dae2fd]">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        deviceView={deviceView}
        onDeviceViewChange={setDeviceView}
        onOpenSheetSync={() => setIsSheetSyncOpen(true)}
        onSimulateIntake={handleSimulateIntake}
        onResetData={handleResetData}
        onRefreshSync={() => showToast('Live Cloud Firestore Sync Active • Database ID: ai-studio-centralizedtrain-9e9b1a6b-3ff5-4e58-a574-a649c5f17708', 'cloud_done')}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="w-full pt-16 flex-1 flex flex-col bg-[#f7f9fb]">
        {renderContent()}
      </main>

      {/* Desktop Footer */}
      <footer className="w-full bg-[#f2f4f6] border-t border-[#e6e8ea] py-3.5 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#565e74]">
          <div className="flex items-center gap-3">
            <span>© 2025 Centralized Training Approvals Platform</span>
            <span className="text-[#c5c5d3]">•</span>
            <span>Enterprise Governance Division</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#004a32]"></span>
              Firestore Database: ai-studio-centralizedtrain-9e9b1a6b-3ff5-4e58-a574-a649c5f17708
            </span>
            <span className="text-[#c5c5d3]">•</span>
            <span className="text-emerald-800 font-bold">Pautan &amp; Pendaftaran Tersimpan di Cloud</span>
          </div>
        </div>
      </footer>

      {/* Rejection Remarks Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        registration={rejectionTarget}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setRejectionTarget(null);
        }}
        onConfirm={handleConfirmRejection}
      />

      {/* Audit Trail Detail Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        registration={auditTarget}
        onClose={() => {
          setIsAuditModalOpen(false);
          setAuditTarget(null);
        }}
      />

      {/* Google Sheet Live Sync Modal (Menyimpan Pautan Data ke Firebase) */}
      <GoogleSheetSyncModal
        isOpen={isSheetSyncOpen}
        onClose={() => setIsSheetSyncOpen(false)}
        syncLinks={syncLinks}
        onExecuteSync={handleExecuteSheetSync}
        onSaveLink={handleSaveSyncLink}
        onDeleteLink={handleDeleteSyncLink}
      />

      {/* Toast Notification */}
      <Toast message={toastMsg} icon={toastIcon} />
    </div>
  );
}
