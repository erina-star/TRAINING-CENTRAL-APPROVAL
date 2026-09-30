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
  const [activeTab, setActiveTab] = useState<'pending' | 'batch' | 'audit' | 'metrics' | 'config'>('pending');

  // Filter logic
  let filtered = registrations.filter((item) => {
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
              <span className="text-[11px] text-[#565e74]">Pending Queue</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-8 h-8 relative flex items-center justify-center rounded-full hover:bg-[#eceef0] transition-colors"
            >
              <span className="material-symbols-outlined text-[#565e74] text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>
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
        {/* Public Prototype Access Banner */}
        <div className="w-full bg-[#dae2fd] rounded-xl p-2.5 flex items-center justify-between shadow-2xs border border-[#b6c4ff]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[#00236f] text-[16px]">verified_user</span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">
                Stage 1 Prototype • Public Access
              </p>
              <p className="text-[10px] text-[#5c647a] truncate">
                No login required • Secretary view mode
              </p>
            </div>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#00236f] text-white text-[10px] font-bold tracking-wider uppercase">
            Active
          </span>
        </div>

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
              className="h-10 px-3 rounded-lg bg-[#1e3a8a] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Simulate Intake</span>
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

        {/* Quick Filter Label Indicator */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#00236f]">filter_list</span>
            <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wider">
              {activeStatusFilter
                ? `QUEUE: ${selectedPlatform === 'ALL' ? 'ALL PLATFORMS' : selectedPlatform} • ${activeStatusFilter}`
                : `QUEUE: ${selectedPlatform === 'ALL' ? 'ALL PLATFORMS' : selectedPlatform}`}
            </span>
          </div>
          {(selectedPlatform !== 'ALL' || activeStatusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSelectedPlatform('ALL');
                setActiveStatusFilter(null);
              }}
              className="text-[#00236f] text-xs font-semibold hover:underline cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>

        {/* Requests Card List */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((req) => {
            const platformBadgeClass = getPlatformColor(req.platform);

            return (
              <div
                key={req.id}
                className="w-full bg-white rounded-2xl p-3.5 shadow-xs border border-[#e6e8ea] flex flex-col gap-2 transition-all"
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
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#757682]">schedule</span>
                      <span>Submitted: {req.submittedAt}</span>
                    </div>
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
                      {req.remarks || 'Prerequisite coursework not fulfilled on platform.'}
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
                    <span className="text-[11px] text-[#565e74] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">done_all</span>
                      Verified by Secretary
                    </span>
                    <button
                      type="button"
                      onClick={() => onUndo(req.id)}
                      className="h-7 px-2 rounded text-[#565e74] hover:text-[#00236f] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#eceef0] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">undo</span>
                      <span>Undo / Re-evaluate</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#ba1a1a] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">block</span>
                      Application Declined
                    </span>
                    <button
                      type="button"
                      onClick={() => onUndo(req.id)}
                      className="h-7 px-2 rounded text-[#565e74] hover:text-[#00236f] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#eceef0] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[13px]">undo</span>
                      <span>Undo / Re-evaluate</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xs border border-[#e6e8ea] text-center my-4">
              <div className="w-14 h-14 rounded-full bg-[#f2f4f6] flex items-center justify-center mb-2.5 text-[#565e74]">
                <span className="material-symbols-outlined text-[28px]">folder_off</span>
              </div>
              <h3 className="text-sm font-bold text-[#191c1e] mb-1">Queue Clear</h3>
              <p className="text-xs text-[#565e74] max-w-xs mb-3">
                No pending training requests found for this platform selection.
              </p>
              <button
                type="button"
                onClick={onSimulateIntake}
                className="h-9 px-3.5 rounded-lg bg-[#00236f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                <span>Simulate Inbound Request</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sandbox Bar */}
      <div className="fixed bottom-16 inset-x-0 z-20 px-3 pointer-events-none max-w-md mx-auto">
        <div className="pointer-events-auto bg-[#2d3133]/95 text-[#eff1f3] backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center justify-between shadow-xl border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#85f8c4] animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#eff1f3]">
              PROTOTYPE SANDBOX
            </span>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-1 text-[#85f8c4] hover:text-[#68dba9] text-[11px] font-semibold py-0.5 px-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px]">sync</span>
            <span>Reset Mock Data</span>
          </button>
        </div>
      </div>

      {/* Bottom Mobile Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-[#e6e8ea] h-16 flex items-center justify-around px-2 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 transition-colors cursor-pointer ${
            activeTab === 'pending' ? 'text-[#00236f] font-bold' : 'text-[#565e74]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          <span className="text-[10px]">Pending</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('batch')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 transition-colors cursor-pointer ${
            activeTab === 'batch' ? 'text-[#00236f] font-bold' : 'text-[#565e74]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">rule</span>
          <span className="text-[10px]">Batch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'text-[#00236f] font-bold' : 'text-[#565e74]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">history_edu</span>
          <span className="text-[10px]">Audit</span>
        </button>

        <button
          type="button"
          onClick={() => onSwitchToAdmin()}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#565e74] hover:text-[#00236f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">insights</span>
          <span className="text-[10px]">Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 transition-colors cursor-pointer ${
            activeTab === 'config' ? 'text-[#00236f] font-bold' : 'text-[#565e74]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          <span className="text-[10px]">Config</span>
        </button>
      </nav>
    </div>
  );
};
