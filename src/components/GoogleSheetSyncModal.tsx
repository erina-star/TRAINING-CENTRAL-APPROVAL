import React, { useState } from 'react';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteSync: (sheetUrl: string) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  onExecuteSync
}) => {
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7_Training_Master_Ledger_2025/pub?output=csv'
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onExecuteSync(sheetUrl);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#e6e8ea] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f2f4f6] flex items-center justify-between border-b border-[#e6e8ea]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#85f8c4] text-[#002114] flex items-center justify-center shadow-xs border border-[#68dba9]">
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm sm:text-base font-bold text-[#191c1e] leading-tight">
                Google Sheet CSV Live Sync
              </h2>
              <span className="text-[11px] text-[#565e74]">
                Stage 3 Production Live Data Pipeline
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

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[#00236f] leading-relaxed">
            <span className="material-symbols-outlined text-[18px] text-blue-700 shrink-0 mt-0.5">
              info
            </span>
            <div>
              <span className="font-bold">Google Sheet Publishing Format:</span>
              <p className="text-[11px] text-[#565e74] mt-0.5">
                In Google Sheets, go to <strong>File &gt; Share &gt; Publish to the web</strong>, select your tab, choose <strong>Comma-separated values (.csv)</strong>, and paste the URL here to fetch incoming submissions.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sheetUrlInput" className="font-semibold text-[#191c1e]">
              Google Sheet Published CSV URL
            </label>
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
              Auto-sync interval: 10s polling with ETags caching.
            </span>
          </div>

          {/* Sync Targets Grid */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
            <div className="flex items-center justify-between text-[#565e74]">
              <span className="font-semibold text-[#191c1e]">Sync Hub Destination:</span>
              <span className="font-mono text-[10px] bg-white border border-[#e0e3e5] px-2 py-0.5 rounded-full font-bold text-emerald-800">
                All 3 Operating Platforms
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1 text-center font-medium text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-[#e0e3e5] text-[#191c1e] shadow-2xs">
                Platform Alpha
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e0e3e5] text-[#191c1e] shadow-2xs">
                Platform Beta
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#e0e3e5] text-[#191c1e] shadow-2xs">
                Platform Gamma
              </div>
            </div>
          </div>

          {/* Spinner during sync */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold animate-pulse">
              <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to Google Sheets CSV endpoint &amp; parsing rows...</span>
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
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
            <span>Sync Live Data Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
