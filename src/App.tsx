import React, { useState, useEffect } from 'react';
import { TrainingRegistration, ViewMode, DeviceView } from './types';
import {
  loadStoredRegistrations,
  saveStoredRegistrations,
  resetToInitialRegistrations,
  SIMULATION_NAMES,
  SIMULATION_PROGRAMS,
  PLATFORMS
} from './mockData';
import { Header } from './components/Header';
import { SecretaryViewDesktop } from './components/SecretaryViewDesktop';
import { SecretaryViewMobile } from './components/SecretaryViewMobile';
import { AdminDashboardDesktop } from './components/AdminDashboardDesktop';
import { AdminDashboardMobile } from './components/AdminDashboardMobile';
import { RejectionModal } from './components/RejectionModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { Toast } from './components/Toast';

export default function App() {
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>(() =>
    loadStoredRegistrations()
  );
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

  // Sync to localStorage
  useEffect(() => {
    saveStoredRegistrations(registrations);
  }, [registrations]);

  // Actions
  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Approved',
            remarks: undefined,
            rejectionTimestamp: undefined,
            secretaryLog: `Verified and endorsed by Platform ${item.platform.replace('Platform ', '')} Secretariat`
          };
        }
        return item;
      })
    );
    showToast('Application endorsed and approved into schedule ledger!', 'check_circle');
  };

  const handleOpenRejectionModal = (reg: TrainingRegistration) => {
    setRejectionTarget(reg);
    setIsRejectionModalOpen(true);
  };

  const handleConfirmRejection = (id: string, reason: string) => {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setRegistrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Rejected',
            remarks: reason,
            rejectionTimestamp: timeStr,
            secretaryLog: `Declined by Sec Platform ${item.platform.replace('Platform ', '')} (${reason.slice(0, 30)}...)`
          };
        }
        return item;
      })
    );
    showToast('Requisition rejected with remarks recorded in ledger.', 'cancel');
  };

  const handleUndo = (id: string) => {
    setRegistrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Pending',
            remarks: undefined,
            rejectionTimestamp: undefined,
            secretaryLog: `Restored to pending queue by Secretariat`
          };
        }
        return item;
      })
    );
    showToast('Record restored to Pending Review queue.', 'undo');
  };

  const handleSimulateIntake = () => {
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
  };

  const handleResetData = () => {
    const reset = resetToInitialRegistrations();
    setRegistrations(reset);
    showToast('Sandbox reset to initial 28 registrations.', 'restart_alt');
  };

  const handleExportCsv = () => {
    const headers = [
      'Staff Name',
      'Staff ID',
      'Platform',
      'Training Program',
      'Session Date',
      'Submitted At',
      'Status',
      'Audit Remarks'
    ];

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = registrations.map((r) => [
      escapeCsv(r.staffName),
      escapeCsv(r.staffId),
      escapeCsv(r.platform),
      escapeCsv(r.program),
      escapeCsv(r.sessionDate),
      escapeCsv(r.submittedAt),
      escapeCsv(r.status),
      escapeCsv(r.remarks || r.secretaryLog || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `training_approvals_master_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${registrations.length} records to CSV report!`, 'file_download_done');
  };

  const handleExecuteSheetSync = (sheetUrl: string) => {
    // Generate realistic synced rows from the Google Sheet published CSV
    const syncedRows: TrainingRegistration[] = [
      {
        id: `REG-${9500 + Math.floor(Math.random() * 80)}`,
        staffName: 'Aiden Montgomery',
        staffId: 'EMP-9821',
        initials: 'AM',
        avatarBg: 'bg-emerald-900 text-white',
        platform: 'Platform Alpha',
        program: 'Advanced Cybersecurity Protocols',
        category: 'Security Assurance',
        sessionDate: '2025-12-14',
        submittedAt: 'Today, 09:30 AM',
        status: 'Pending',
        remarks: 'Freshly ingested via Google Sheet published CSV sync bridge.',
        secretaryLog: 'Ingested via Google Sheet Live CSV Sync'
      },
      {
        id: `REG-${9580 + Math.floor(Math.random() * 80)}`,
        staffName: 'Soraya Varma',
        staffId: 'EMP-4180',
        initials: 'SV',
        avatarBg: 'bg-blue-900 text-white',
        platform: 'Platform Beta',
        program: 'Strategic Risk Framework',
        category: 'Risk Governance',
        sessionDate: '2025-12-18',
        submittedAt: 'Today, 10:15 AM',
        status: 'Approved',
        remarks: 'Pre-cleared in master Google Sheet batch approval column.',
        secretaryLog: 'Pre-cleared in master Google Sheet batch approval column.'
      }
    ];

    setRegistrations((prev) => [...syncedRows, ...prev]);
    showToast(`Google Sheet CSV Synced! Ingested 2 records.`, 'cloud_sync');
  };

  const handleOpenAuditModal = (reg: TrainingRegistration) => {
    setAuditTarget(reg);
    setIsAuditModalOpen(true);
  };

  // Determine which layout to render based on deviceView
  const renderContent = () => {
    if (deviceView === 'mobile-mockup') {
      return (
        <div className="py-6 px-4 flex justify-center bg-[#eceef0] min-h-[calc(100vh-4rem)]">
          {currentView === 'secretary' ? (
            <SecretaryViewMobile
              registrations={registrations}
              onApprove={handleApprove}
              onRejectClick={handleOpenRejectionModal}
              onUndo={handleUndo}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onSwitchToAdmin={() => setCurrentView('admin')}
            />
          ) : (
            <AdminDashboardMobile
              registrations={registrations}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onExportCsv={handleExportCsv}
              onSwitchToSecretary={() => setCurrentView('secretary')}
            />
          )}
        </div>
      );
    }

    if (deviceView === 'desktop-mockup') {
      return (
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
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
              onOpenAuditModal={handleOpenAuditModal}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onExportCsv={handleExportCsv}
            />
          )}
        </div>
      );
    }

    // Responsive: On small screens render mobile interface, on large screens render desktop interface
    return (
      <>
        {/* Mobile Viewport Screen */}
        <div className="block lg:hidden py-4 px-2">
          {currentView === 'secretary' ? (
            <SecretaryViewMobile
              registrations={registrations}
              onApprove={handleApprove}
              onRejectClick={handleOpenRejectionModal}
              onUndo={handleUndo}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onSwitchToAdmin={() => setCurrentView('admin')}
            />
          ) : (
            <AdminDashboardMobile
              registrations={registrations}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onExportCsv={handleExportCsv}
              onSwitchToSecretary={() => setCurrentView('secretary')}
            />
          )}
        </div>

        {/* Desktop Viewport Screen */}
        <div className="hidden lg:flex w-full max-w-7xl mx-auto py-6 px-6 lg:px-8 flex-1 flex-col">
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
              onOpenAuditModal={handleOpenAuditModal}
              onSimulateIntake={handleSimulateIntake}
              onResetData={handleResetData}
              onExportCsv={handleExportCsv}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans text-[#191c1e] antialiased">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        deviceView={deviceView}
        onDeviceViewChange={setDeviceView}
        onOpenSheetSync={() => setIsSheetSyncOpen(true)}
        onSimulateIntake={handleSimulateIntake}
        onResetData={handleResetData}
        onRefreshSync={() => showToast('Forms Queue polling 10s • Latency: 114ms (Synced)', 'sync')}
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
              Forms API Latency: 124ms
            </span>
            <span className="text-[#c5c5d3]">•</span>
            <span>TLS 1.3 Strict Mode</span>
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

      {/* Google Sheet Live Sync Modal */}
      <GoogleSheetSyncModal
        isOpen={isSheetSyncOpen}
        onClose={() => setIsSheetSyncOpen(false)}
        onExecuteSync={handleExecuteSheetSync}
      />

      {/* Toast Notification */}
      <Toast message={toastMsg} icon={toastIcon} />
    </div>
  );
}
