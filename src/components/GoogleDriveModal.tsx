import React, { useState, useEffect } from 'react';
import { TrainingRegistration, DataSyncLink, AuthUser } from '../types';
import {
  DriveFile,
  listDriveSpreadsheetsAndCsvs,
  importRegistrationsFromDriveFile,
  createSpreadsheetInDrive,
  deleteFileFromDrive
} from '../services/driveService';
import { getCachedAccessToken, requestDriveAccessToken } from '../services/authService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  registrations: TrainingRegistration[];
  onBatchIntegrate: (registrations: TrainingRegistration[], links: DataSyncLink[], filterToGoogleOnly?: boolean) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  registrations,
  onBatchIntegrate,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [token, setToken] = useState<string | null>(() => getCachedAccessToken());
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // File browser state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: 0,
    title: ''
  });

  // Export State
  const [exportFileName, setExportFileName] = useState(
    `Training_Approvals_Ledger_${new Date().toISOString().slice(0, 10)}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isConfirmExportOpen, setIsConfirmExportOpen] = useState(false);
  const [lastExportedLink, setLastExportedLink] = useState<string | null>(null);

  // Destructive Delete State (Mandatory User Confirmation per SKILL.md)
  const [deleteTarget, setDeleteTarget] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update token from memory cache
  useEffect(() => {
    if (isOpen) {
      const currentToken = getCachedAccessToken();
      setToken(currentToken);
      if (currentToken) {
        loadFiles(currentToken, searchQuery);
      }
    }
  }, [isOpen]);

  const loadFiles = async (accessToken: string, query?: string) => {
    setIsLoadingFiles(true);
    const { files: loadedFiles, error } = await listDriveSpreadsheetsAndCsvs(accessToken, query);
    setIsLoadingFiles(false);
    if (error) {
      showToast(error, 'error');
    } else {
      setFiles(loadedFiles);
    }
  };

  const handleConnectDrive = async () => {
    setIsAuthorizing(true);
    try {
      const accessToken = await requestDriveAccessToken();
      if (accessToken) {
        setToken(accessToken);
        showToast('Connected to Google Drive successfully!', 'verified');
        loadFiles(accessToken, searchQuery);
      } else {
        showToast('Google Drive authorization was not completed.', 'warning');
      }
    } catch (e: any) {
      showToast(e.message || 'Drive authorization error', 'error');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      loadFiles(token, searchQuery);
    }
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId);
      }
      if (prev.length >= 20) {
        showToast('Maximum 20 Google Drive files can be selected per upload.', 'warning');
        return prev;
      }
      return [...prev, fileId];
    });
  };

  // Import Selected Files into Approval Queue
  const handleImportSelected = async () => {
    if (!token || selectedFileIds.length === 0) return;
    setIsImporting(true);

    const selectedFiles = files.filter((f) => selectedFileIds.includes(f.id));
    const allRegistrations: TrainingRegistration[] = [];
    const allLinks: DataSyncLink[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setImportProgress({
        current: i + 1,
        total: selectedFiles.length,
        title: file.name
      });

      const res = await importRegistrationsFromDriveFile(file, token, i);
      if (res.registrations.length > 0) {
        allRegistrations.push(...res.registrations);
        allLinks.push(res.syncLink);
      }
    }

    setIsImporting(false);

    if (allRegistrations.length > 0) {
      onBatchIntegrate(allRegistrations, allLinks, true);
      showToast(
        `Successfully imported ${allRegistrations.length} registrations from ${allLinks.length} Google Drive files!`,
        'cloud_done'
      );
      onClose();
    } else {
      showToast('No readable rows found in the selected Drive files.', 'warning');
    }
  };

  // Export approved registrations as a new Google Sheet / CSV in user's Drive
  const handleConfirmExportToDrive = async () => {
    if (!token) return;
    setIsConfirmExportOpen(false);
    setIsExporting(true);
    setLastExportedLink(null);

    // Build CSV Content from registrations
    const headers = [
      'Registration ID',
      'Staff Name',
      'Staff ID',
      'Operating Platform',
      'Training Program',
      'Session Date',
      'Submission Timestamp',
      'Status',
      'Remarks',
      'Secretary Endorsement Log'
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${r.staffName.replace(/"/g, '""')}"`,
      `"${r.staffId}"`,
      `"${r.platform}"`,
      `"${r.program.replace(/"/g, '""')}"`,
      `"${r.sessionDate}"`,
      `"${r.submittedAt}"`,
      `"${r.status}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
      `"${(r.secretaryLog || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const { file, error } = await createSpreadsheetInDrive(exportFileName, csvContent, token);
    setIsExporting(false);

    if (error) {
      showToast(error, 'error');
    } else if (file) {
      setLastExportedLink(file.webViewLink || null);
      showToast(`Exported "${file.name}" to Google Drive successfully!`, 'cloud_done');
      loadFiles(token, searchQuery);
    }
  };

  // Delete Drive file with mandatory user confirmation
  const handleExecuteDeleteFile = async () => {
    if (!token || !deleteTarget) return;
    setIsDeleting(true);
    const { success, error } = await deleteFileFromDrive(deleteTarget.id, token);
    setIsDeleting(false);
    setDeleteTarget(null);

    if (success) {
      showToast('File removed from Google Drive.', 'delete');
      loadFiles(token, searchQuery);
    } else {
      showToast(error || 'Failed to delete file.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#191c1e]/65 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#c4c7c5] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f2f4f6] flex items-center justify-between border-b border-[#e0e2ec]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00236f] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">add_to_drive</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#00164e] leading-tight">
                  Google Drive Workspace Integration
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#00164e] text-[10px] font-bold border border-[#b6c4ff]">
                  Google Drive API v3
                </span>
              </div>
              <p className="text-xs text-[#444746] mt-0.5">
                Browse, import, and sync training files directly from your Google Drive
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#e0e2ec] text-[#444746] hover:text-[#1b1b1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Auth Status Header Bar */}
        <div className="bg-[#e8f0fe] px-5 py-2.5 border-b border-[#c2e7ff] flex items-center justify-between text-xs text-[#001d35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#004a77]">verified</span>
            {token ? (
              <span>
                Connected to Google Drive as <strong>{currentUser?.email || 'Authorized User'}</strong>
              </span>
            ) : (
              <span>Google Drive authorization is required to access your files.</span>
            )}
          </div>

          {!token && (
            <button
              type="button"
              onClick={handleConnectDrive}
              disabled={isAuthorizing}
              className="px-3 py-1 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px]">key</span>
              <span>{isAuthorizing ? 'Connecting...' : 'Authorize Google Drive'}</span>
            </button>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e0e2ec] bg-white px-5 pt-2.5 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#74777f] hover:text-[#1b1b1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">folder_open</span>
            <span>Browse &amp; Import from Drive</span>
            {selectedFileIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                {selectedFileIds.length} selected
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#74777f] hover:text-[#1b1b1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">upload_file</span>
            <span>Export Approvals Ledger to Drive</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* Search Toolbar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#74777f] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search spreadsheets and CSVs in your Google Drive..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#c4c7c5] focus:border-[#00236f] text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!token || isLoadingFiles}
                  className="px-4 h-10 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => token && loadFiles(token, '')}
                  disabled={!token || isLoadingFiles}
                  className="px-3 h-10 rounded-xl border border-[#c4c7c5] bg-[#f8f9fa] hover:bg-[#e0e2ec] text-[#1b1b1f] text-xs font-semibold cursor-pointer"
                  title="Reload files"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </form>

              {/* Selection Summary Banner */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-[#565e74]">
                  {files.length} spreadsheet/CSV files found in Google Drive
                </span>
                <span className="font-bold text-[#00236f]">
                  {selectedFileIds.length} / 20 Selected
                </span>
              </div>

              {/* Files List */}
              {isLoadingFiles ? (
                <div className="py-16 text-center text-xs text-[#565e74] flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#00236f] border-t-transparent rounded-full animate-spin" />
                  <span>Loading files from Google Drive...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-[#c4c7c5] rounded-xl text-xs text-[#74777f] space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#74777f]">folder_off</span>
                  <p>No spreadsheets or CSV files found in Google Drive matching the query.</p>
                  {!token && (
                    <button
                      type="button"
                      onClick={handleConnectDrive}
                      className="mt-2 px-4 py-1.5 bg-[#00236f] text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Authorize Drive Access
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 border border-[#e0e2ec] rounded-xl p-2 bg-[#f8f9fa]">
                  {files.map((file) => {
                    const isSelected = selectedFileIds.includes(file.id);
                    const isSheet = file.mimeType.includes('spreadsheet');

                    return (
                      <div
                        key={file.id}
                        onClick={() => toggleSelectFile(file.id)}
                        className={`p-3 rounded-xl bg-white border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'border-[#00236f] bg-[#dae2fd]/30 ring-1 ring-[#00236f]'
                            : 'border-[#e0e2ec] hover:border-[#b6c4ff]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // controlled by parent div onClick
                            className="w-4 h-4 rounded text-[#00236f] focus:ring-[#00236f] cursor-pointer shrink-0"
                          />

                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isSheet ? 'bg-[#0f9d58] text-white' : 'bg-[#4285f4] text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isSheet ? 'table_view' : 'description'}
                            </span>
                          </div>

                          <div className="overflow-hidden min-w-0">
                            <span className="font-bold text-xs text-[#1b1b1f] truncate block">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-[#565e74] mt-0.5">
                              <span>{isSheet ? 'Google Sheet' : 'CSV File'}</span>
                              {file.modifiedTime && (
                                <>
                                  <span>•</span>
                                  <span>Modified: {new Date(file.modifiedTime).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg hover:bg-[#e0e2ec] text-[#565e74] hover:text-[#00236f] flex items-center justify-center transition-colors"
                              title="Open in Google Drive"
                            >
                              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(file);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-[#ffdad6] text-[#74777f] hover:text-[#ba1a1a] flex items-center justify-center transition-colors"
                            title="Delete file from Drive"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Progress bar during batch import */}
              {isImporting && (
                <div className="p-3.5 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-[#00164e] font-bold">
                    <span>
                      Reading file {importProgress.current} of {importProgress.total}...
                    </span>
                    <span>{Math.round((importProgress.current / importProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-[#00236f] transition-all duration-300 rounded-full"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#00236f] truncate">
                    Parsing candidate rows from: {importProgress.title}
                  </p>
                </div>
              )}

              {/* Bottom Action Button */}
              <button
                type="button"
                onClick={handleImportSelected}
                disabled={selectedFileIds.length === 0 || isImporting}
                className="w-full h-11 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Rows from Drive...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                    <span>
                      Import {selectedFileIds.length > 0 ? `${selectedFileIds.length} Drive Files` : 'Files'} &amp; Show in Approvals
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: EXPORT TO GOOGLE DRIVE */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] text-[#00164e] text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#00236f]">cloud_upload</span>
                  <span>Export Approvals Ledger Directly to Google Drive</span>
                </div>
                <p className="text-[11px] text-[#00236f]/90 leading-relaxed">
                  Generate and commit a consolidated CSV ledger with all {registrations.length} staff training registrations, approval statuses, audit trails, and secretary remarks straight into your Google Drive root folder.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1b1b1f] block mb-1">
                  File Name for Google Drive
                </label>
                <input
                  type="text"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#c4c7c5] text-xs focus:border-[#00236f]"
                />
              </div>

              {lastExportedLink && (
                <div className="p-3 bg-[#edf7ed] border border-[#c8e6c9] rounded-xl text-xs text-[#1b5e20] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>File saved successfully in your Google Drive!</span>
                  </div>
                  <a
                    href={lastExportedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[#0f9d58] flex items-center gap-1"
                  >
                    <span>Open in Drive</span>
                    <span className="material-symbols-outlined text-[14px]">launch</span>
                  </a>
                </div>
              )}

              {/* Mandatory Confirmation Step per Workspace SKILL.md */}
              <button
                type="button"
                onClick={() => setIsConfirmExportOpen(true)}
                disabled={!token || isExporting}
                className="w-full h-11 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Google Drive...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    <span>Export {registrations.length} Records to Google Drive</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog for File Creation per SKILL.md */}
      {isConfirmExportOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#191c1e]/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-[#c4c7c5] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#dae2fd] text-[#00236f] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1b1f]">Create File in Google Drive?</h3>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  This action will create a new file named <strong>&quot;{exportFileName}.csv&quot;</strong> in your Google Drive containing {registrations.length} training registration records.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e0e2ec]">
              <button
                type="button"
                onClick={() => setIsConfirmExportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#565e74] hover:bg-[#f2f4f6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExportToDrive}
                className="px-4 py-2 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm &amp; Create File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for File Deletion per SKILL.md */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#191c1e]/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-[#ffb4ab] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">delete_forever</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#410002]">Delete File from Google Drive?</h3>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Are you sure you want to permanently delete <strong>&quot;{deleteTarget.name}&quot;</strong> from your Google Drive? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e0e2ec]">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#565e74] hover:bg-[#f2f4f6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
