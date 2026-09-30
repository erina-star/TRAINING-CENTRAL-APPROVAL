import React, { useState } from 'react';
import { TrainingRegistration } from '../types';

interface SecretaryViewMobileProps {
  registrations: TrainingRegistration[];
  onApprove: (id: string) => void;
  onRejectClick: (registration: TrainingRegistration) => void;
  onUndo: (id: string) => void;
  onSimulateIntake: () => void;
  onResetData: () => void;
  onSwitchToAdmin: () => void;
}

export const SecretaryViewMobile: React.FC<SecretaryViewMobileProps> = ({
  registrations,
  onApprove,
  onRejectClick,
  onUndo,
  onSimulateIntake,
  onResetData,
  onSwitchToAdmin
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'GOOGLE_LINK_ONLY'>('ALL');
  const [activeTab, setActiveTab] = useState<'pending' | 'batch' | 'audit' | 'metrics' | 'config'>('pending');

  const googleLinkCount = registrations.filter(
    (r) => r.capturedFromGoogleLink || r.sourceType === 'google_link'
  ).length;

  // Filter logic
  let filtered = registrations.filter((item) => {
    if (sourceFilter === 'GOOGLE_LINK_ONLY') {
      if (!item.capturedFromGoogleLink && item.sourceType !== 'google_link') return false;
    }
    if (selectedPlatform === 'ALL') return true;
    return item.platform === selectedPlatform;
  });

  const pendingCount = filtered.filter((i) => i.status === 'Pending').length;
  const approvedCount = filtered.filter((i) => i.status === 'Approved').length;
  const rejectedCount = filtered.filter((i) => i.status === 'Rejected').length;

  if (activeStatusFilter) {
    filtered = filtered.filter((i) => {
      if (activeStatusFilter === 'PENDING') return i.status === 'Pending';
      if (activeStatusFilter === 'APPROVED') return i.status === 'Approved';
      if (activeStatusFilter === 'REJECTED') return i.status === 'Rejected';
      return true;
    });
  }

  const getPlatformColor = (platform: string) => {
    if (platform === 'Platform Alpha') return 'bg-[#1e3a8a] text-white';
    if (platform === 'Platform Beta') return 'bg-[#dae2fd] text-[#131b2e]';
    return 'bg-[#e0e3e5] text-[#191c1e]';
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#f7f9fb] shadow-xl rounded-3xl overflow-hidden border border-[#e6e8ea]">
      {/* Mobile Top App Bar */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-[#e6e8ea] px-4 pt-3 pb-3 flex flex-col gap-2.5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00236f] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm text-[#191c1e] leading-tight">
                  Training Approvals
                </h1>
                <span className="px-1.5 py-0.2 rounded-full bg-[#dae2fd] text-[#131b2e] text-[9px] font-bold uppercase tracking-wider">
                  LIVE
                </span>
              </div>
              <span className="text-[11px] text-[#565e74]">Secretary Triage Queue</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#00236f] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[17px]">person</span>
            </div>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center p-0.5 bg-[#eceef0] rounded-xl">
          <button
            type="button"
            className="flex-1 h-8 rounded-lg bg-white text-[#00236f] text-xs font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Secretary View</span>
          </button>
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="flex-1 h-8 rounded-lg text-[#565e74] hover:text-[#191c1e] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">dashboard</span>
            <span>Admin Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3.5 flex flex-col gap-3.5 pb-28">
        {/* Source Isolation Switcher Pill Bar */}
        <div className="flex items-center p-1 bg-white rounded-xl border border-[#e0e3e5] gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setSourceFilter('ALL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
              sourceFilter === 'ALL'
                ? 'bg-[#f2f4f6] text-[#00236f] font-bold shadow-2xs'
                : 'text-[#565e74]'
            }`}
          >
            <span>All Data ({registrations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceFilter('GOOGLE_LINK_ONLY')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
              sourceFilter === 'GOOGLE_LINK_ONLY'
                ? 'bg-[#00236f] text-white font-bold shadow-2xs'
                : 'text-[#00236f] bg-[#dae2fd]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">link</span>
            <span>Google Link Data ({googleLinkCount})</span>
          </button>
        </div>

        {/* Notice Banner if viewing Google Link only */}
        {sourceFilter === 'GOOGLE_LINK_ONLY' && (
          <div className="p-2.5 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] text-[#00164e] text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#00236f]">verified</span>
              <span className="font-bold">Showing Google Link records only</span>
            </div>
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  filtered.filter((r) => r.status === 'Pending').forEach((r) => onApprove(r.id));
                }}
                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold cursor-pointer"
              >
                Approve All ({pendingCount})
              </button>
            )}
          </div>
        )}

        {/* Platform Control & Simulation Bar */}
        <div className="w-full bg-white rounded-xl p-3 shadow-xs border border-[#e6e8ea] flex flex-col gap-2.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <label htmlFor="platformSelectorMobile" className="block text-[11px] font-semibold text-[#565e74] mb-1">
                Select Operational Platform
              </label>
              <div className="relative w-full">
                <select
                  id="platformSelectorMobile"
                  value={selectedPlatform}
                  onChange={(e) => {
                    setSelectedPlatform(e.target.value);
                    setActiveStatusFilter(null);
                  }}
                  className="w-full h-10 bg-[#f2f4f6] text-[#191c1e] text-xs font-semibold rounded-lg pl-3 pr-8 appearance-none focus:outline-none focus:bg-[#eceef0] cursor-pointer border border-[#e0e3e5]"
                >
                  <option value="ALL">All Platforms</option>
                  <option value="Platform Alpha">Platform Alpha</option>
                  <option value="Platform Beta">Platform Beta</option>
                  <option value="Platform Gamma">Platform Gamma</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#565e74] pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSimulateIntake}
              className="h-10 px-3 rounded-lg bg-[#00236f] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Manual</span>
            </button>
          </div>

          {/* Metrics Summary Pills */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setActiveStatusFilter(activeStatusFilter === 'PENDING' ? null : 'PENDING')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all active:scale-95 border cursor-pointer ${
                activeStatusFilter === 'PENDING'
                  ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold'
                  : 'bg-[#f2f4f6] border-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-[11px] font-semibold truncate">Pending</span>
              </div>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                {pendingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStatusFilter(activeStatusFilter === 'APPROVED' ? null : 'APPROVED')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all active:scale-95 border cursor-pointer ${
                activeStatusFilter === 'APPROVED'
                  ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold'
                  : 'bg-[#f2f4f6] border-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                <span className="text-[11px] font-semibold truncate">Approved</span>
              </div>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900">
                {approvedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStatusFilter(activeStatusFilter === 'REJECTED' ? null : 'REJECTED')}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all active:scale-95 border cursor-pointer ${
                activeStatusFilter === 'REJECTED'
                  ? 'bg-[#ffdad6]/80 border-[#ba1a1a] text-[#93000a] font-bold'
                  : 'bg-[#f2f4f6] border-[#e0e3e5] text-[#191c1e]'
              }`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0"></span>
                <span className="text-[11px] font-semibold truncate">Rejected</span>
              </div>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a]">
                {rejectedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Card List of Registrations */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((req) => {
            const platformBadgeClass = getPlatformColor(req.platform);
            const isFromGoogleLink = req.capturedFromGoogleLink || req.sourceType === 'google_link';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl p-3.5 shadow-xs border border-[#e6e8ea] flex flex-col gap-2.5 transition-all ${
                  isFromGoogleLink ? 'border-l-4 border-l-[#00236f]' : ''
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#eceef0] flex items-center justify-center text-xs font-bold text-[#00236f] shrink-0 shadow-2xs">
                      {req.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#191c1e] truncate leading-tight">
                        {req.staffName}
                      </h3>
                      <span className="text-[10px] text-[#565e74] font-mono mt-0.5">
                        ID: {req.staffId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${platformBadgeClass}`}>
                      {req.platform}
                    </span>
                    {req.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending Review
                      </span>
                    )}
                    {req.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Approved
                      </span>
                    )}
                    {req.status === 'Rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">cancel</span>
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Training Information Box */}
                <div className="flex flex-col gap-1 bg-[#f2f4f6]/80 rounded-xl p-2.5 mt-0.5 border border-[#e6e8ea]">
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#00236f] shrink-0 mt-0.5">
                      school
                    </span>
                    <span className="text-xs font-semibold text-[#191c1e] leading-snug">
                      {req.program}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[#565e74] pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#757682]">event</span>
                      <span>Session: {req.sessionDate}</span>
                    </div>
                    {isFromGoogleLink ? (
                      <div className="flex items-center gap-1.5 text-[#00236f] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">link</span>
                        <span>Captured from: {req.sourceLinkTitle || 'Google Link'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[13px] text-[#757682]">schedule</span>
                        <span>Submitted: {req.submittedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection Remarks Callout Box if Rejected */}
                {req.status === 'Rejected' && (
                  <div className="p-2.5 rounded-xl bg-[#fff5f5] border border-[#fed7d7] flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between text-[#c53030]">
                      <span className="font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">feedback</span>
                        Rejection Remarks
                      </span>
                      <span className="opacity-80 text-[10px]">{req.rejectionTimestamp || 'Recent'}</span>
                    </div>
                    <p className="text-[#742a2a] leading-tight">
                      {req.remarks || 'Course prerequisites not satisfied.'}
                    </p>
                  </div>
                )}

                {/* Card Bottom Actions */}
                {req.status === 'Pending' ? (
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => onRejectClick(req)}
                      className="h-9 rounded-lg bg-[#e6e8ea] hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onApprove(req.id)}
                      className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve</span>
                    </button>
                  </div>
                ) : req.status === 'Approved' ? (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Endorsed by Secretary
                    </span>
                    <button
                      type="button"
                      onClick={() => onUndo(req.id)}
                      className="text-xs text-[#00236f] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">undo</span>
                      <span>Undo</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#93000a] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      Disapproved
                    </span>
                    <button
                      type="button"
                      onClick={() => onUndo(req.id)}
                      className="text-xs text-[#00236f] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">undo</span>
                      <span>Undo</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e6e8ea] text-[#74777f] text-xs">
              No applications match current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
