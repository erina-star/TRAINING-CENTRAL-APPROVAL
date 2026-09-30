import React, { useState, useEffect } from 'react';
import { DataSyncLink } from '../types';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLinks: DataSyncLink[];
  onExecuteSync: (sheetUrl: string, title?: string) => void;
  onSaveLink: (link: DataSyncLink) => void;
  onDeleteLink: (id: string) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  syncLinks,
  onExecuteSync,
  onSaveLink,
  onDeleteLink
}) => {
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7_Training_Master_Ledger_2025/pub?output=csv'
  );
  const [linkTitle, setLinkTitle] = useState('Google Sheet Master Intake');
  const [targetPlatform, setTargetPlatform] = useState('All Platforms');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sync' | 'manage'>('sync');

  // Load latest link URL when modal opens
  useEffect(() => {
    if (syncLinks.length > 0) {
      const firstSheet = syncLinks.find((l) => l.type === 'google_sheet_csv') || syncLinks[0];
      if (firstSheet) {
        setSheetUrl(firstSheet.url);
        setLinkTitle(firstSheet.title);
      }
    }
  }, [syncLinks, isOpen]);

  if (!isOpen) return null;

  const handleSync = () => {
    setIsLoading(true);

    // Save link to Firestore first
    const linkId = 'LINK-' + (linkTitle.replace(/\s+/g, '-').toUpperCase() || 'SHEET-CSV');
    const newLink: DataSyncLink = {
      id: linkId,
      title: linkTitle || 'Google Sheet Live Feed',
      url: sheetUrl,
      type: 'google_sheet_csv',
      targetPlatform,
      syncInterval: '10s Realtime Polling',
      isActive: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveLink(newLink);

    setTimeout(() => {
      setIsLoading(false);
      onExecuteSync(sheetUrl, linkTitle);
      onClose();
    }, 800);
  };

  const handleAddNewCustomLink = () => {
    if (!sheetUrl.trim()) return;
    const linkId = 'LINK-' + Date.now();
    const customLink: DataSyncLink = {
      id: linkId,
      title: linkTitle.trim() || 'Custom Google Sheet Feed',
      url: sheetUrl.trim(),
      type: 'google_sheet_csv',
      targetPlatform,
      syncInterval: '10s Realtime Polling',
      isActive: true,
      lastSyncedAt: 'Not yet synced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveLink(customLink);
    setActiveTab('manage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#e6e8ea] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f2f4f6] flex items-center justify-between border-b border-[#e6e8ea]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#85f8c4] text-[#002114] flex items-center justify-center shadow-xs border border-[#68dba9]">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#191c1e] leading-tight">
                  Google Sheet CSV Live Sync
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#00164e] text-[10px] font-bold">
                  Firebase Cloud Storage
                </span>
              </div>
              <span className="text-[11px] text-[#565e74]">
                Semua data pautan (link) disimpan terus ke dalam Cloud Firestore
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#e6e8ea] text-[#565e74] hover:text-[#191c1e] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e6e8ea] bg-white px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sync'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#565e74] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync Sekarang</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'manage'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#565e74] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span>Pautan Disimpan dalam Firebase ({syncLinks.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs overflow-y-auto">
          {activeTab === 'sync' ? (
            <>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[#00236f] leading-relaxed">
                <span className="material-symbols-outlined text-[18px] text-blue-700 shrink-0 mt-0.5">
                  cloud_done
                </span>
                <div>
                  <span className="font-bold">Penyimpanan Automatik ke Firebase:</span>
                  <p className="text-[11px] text-[#565e74] mt-0.5">
                    Pautan CSV Google Sheet ini dan semua rekod yang diambil akan disimpan secara kekal dalam koleksi <strong>sync_links</strong> dan <strong>training_registrations</strong> di Cloud Firestore.
                  </p>
                </div>
              </div>

              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="linkTitleInput" className="font-semibold text-[#191c1e]">
                  Nama / Label Pautan
                </label>
                <input
                  id="linkTitleInput"
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#c5c5d3] bg-[#f7f9fb] focus:bg-white focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 outline-none transition-all shadow-inner"
                  placeholder="Contoh: Master Google Sheet Intake 2025"
                />
              </div>

              {/* URL Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="sheetUrlInput" className="font-semibold text-[#191c1e]">
                    Google Sheet Published CSV URL
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Firebase Persistent
                  </span>
                </div>
                <input
                  id="sheetUrlInput"
                  type="url"
                  spellCheck={false}
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#c5c5d3] bg-[#f7f9fb] focus:bg-white focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15 outline-none transition-all shadow-inner"
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                />
                <span className="text-[11px] text-[#565e74]">
                  Format: File &gt; Share &gt; Publish to web as CSV.
                </span>
              </div>

              {/* Target Platform Selector */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
                <div>
                  <span className="font-semibold text-[#191c1e] block">Sasaran Platform:</span>
                  <span className="text-[11px] text-[#565e74]">Data pautan akan diselaraskan ke platform ini</span>
                </div>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="bg-white border border-[#c5c5d3] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#191c1e] outline-none cursor-pointer"
                >
                  <option value="All Platforms">All Platforms</option>
                  <option value="Platform Alpha">Platform Alpha</option>
                  <option value="Platform Beta">Platform Beta</option>
                  <option value="Platform Gamma">Platform Gamma</option>
                </select>
              </div>

              {/* Spinner during sync */}
              {isLoading && (
                <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold animate-pulse">
                  <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan pautan dan memuat turun data ke Firebase...</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#191c1e]">
                  Senarai Pautan Tersimpan di Firebase ({syncLinks.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('sync')}
                  className="text-xs text-[#00236f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Tambah Pautan Baharu</span>
                </button>
              </div>

              {syncLinks.length === 0 ? (
                <div className="p-8 text-center bg-[#f2f4f6] rounded-xl text-[#565e74]">
                  Belum ada pautan disimpan. Sila tambah pautan pertama anda.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {syncLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 bg-[#f7f9fb] border border-[#e6e8ea] rounded-xl flex flex-col gap-1.5 hover:border-[#b6c4ff] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-[16px] text-emerald-700 shrink-0">
                            check_circle
                          </span>
                          <span className="font-bold text-[#191c1e] truncate">{link.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border text-[#565e74]">
                            {link.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSheetUrl(link.url);
                              setLinkTitle(link.title);
                              setActiveTab('sync');
                            }}
                            className="p-1 rounded hover:bg-white text-[#00236f] text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
                            title="Gunakan pautan ini"
                          >
                            <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                            <span>Sync</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteLink(link.id)}
                            className="p-1 rounded hover:bg-[#ffdad6] text-[#ba1a1a] cursor-pointer"
                            title="Padam pautan dari Firebase"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-[10px] text-[#565e74] truncate bg-white p-1.5 rounded border border-[#e6e8ea]">
                        {link.url}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#757682] pt-0.5">
                        <span>Sasaran: {link.targetPlatform || 'All Platforms'}</span>
                        <span>Disimpan dalam Firebase: {link.lastSyncedAt || 'Live'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#f2f4f6] border-t border-[#e6e8ea] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#565e74] hover:text-[#191c1e] hover:bg-[#e6e8ea] transition-colors cursor-pointer"
          >
            Tutup
          </button>
          {activeTab === 'sync' ? (
            <button
              type="button"
              onClick={handleSync}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
              <span>Simpan &amp; Sync ke Firebase</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddNewCustomLink}
              className="px-4 py-2 rounded-xl bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">save</span>
              <span>Simpan Pautan ke Firebase</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
