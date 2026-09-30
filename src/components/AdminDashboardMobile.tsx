import React, { useState } from 'react';
import { TrainingRegistration } from '../types';

interface AdminDashboardMobileProps {
  registrations: TrainingRegistration[];
  onSimulateIntake: () => void;
  onResetData: () => void;
  onExportCsv: () => void;
  onSwitchToSecretary: () => void;
}

export const AdminDashboardMobile: React.FC<AdminDashboardMobileProps> = ({
  registrations,
  onSimulateIntake,
  onResetData,
  onExportCsv,
  onSwitchToSecretary
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Metrics
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const rejectedCount = registrations.filter((r) => r.status === 'Rejected').length;

  const filtered = registrations.filter((item) => {
    // Platform
    if (platformFilter !== 'All') {
      if (platformFilter === 'Alpha' && item.platform !== 'Platform Alpha') return false;
      if (platformFilter === 'Beta' && item.platform !== 'Platform Beta') return false;
      if (platformFilter === 'Gamma' && item.platform !== 'Platform Gamma') return false;
    }

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match =
        item.staffName.toLowerCase().includes(q) ||
        item.staffId.toLowerCase().includes(q) ||
        item.program.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const toggleCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPlatformFilter('All');
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
              <span className="text-[11px] text-[#565e74]">Compliance Overview</span>
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
            onClick={onSwitchToSecretary}
            className="flex-1 h-8 rounded-lg text-[#565e74] hover:text-[#191c1e] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Secretary View</span>
          </button>
          <button
            type="button"
            className="flex-1 h-8 rounded-lg bg-white text-[#00236f] text-xs font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">dashboard</span>
            <span>Admin Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3.5 flex flex-col gap-3.5 pb-28">
        {/* Sync & Title Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#68dba9]"></span>
              <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">
                Sync: Live Cloud Active
              </span>
            </div>
            <span className="text-[10px] text-[#565e74] bg-[#eceef0] px-2 py-0.5 rounded-full font-medium">
              Updated: Just now
            </span>
          </div>
          <h2 className="text-base font-bold text-[#191c1e] leading-tight">
            Admin Training Oversight Dashboard
          </h2>
          <p className="text-xs text-[#565e74]">
            Real-time consolidated tracking across all platform Google Form registrations.
          </p>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Total */}
          <div className="flex flex-col p-3 bg-white rounded-2xl shadow-xs border border-[#e6e8ea]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#565e74] uppercase">Total</span>
              <div className="w-6 h-6 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#00236f]">
                <span className="material-symbols-outlined text-[15px]">folder_shared</span>
              </div>
            </div>
            <div className="text-2xl font-black text-[#00236f] tabular-nums">
              {totalCount}
            </div>
            <div className="text-[10px] text-[#565e74] mt-0.5">Intake Pipeline</div>
          </div>

          {/* Pending */}
          <div className="flex flex-col p-3 bg-white rounded-2xl shadow-xs border border-[#e6e8ea]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#565e74] uppercase">Pending</span>
              <div className="w-6 h-6 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#3f465c]">
                <span className="material-symbols-outlined text-[15px]">hourglass_top</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#131b2e] tabular-nums">
                {pendingCount}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#dae2fd] text-[#131b2e] font-bold">
                Queue
              </span>
            </div>
            <div className="text-[10px] text-[#565e74] mt-0.5">Awaiting Review</div>
          </div>

          {/* Approved */}
          <div className="flex flex-col p-3 bg-white rounded-2xl shadow-xs border border-[#e6e8ea]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#565e74] uppercase">Approved</span>
              <div className="w-6 h-6 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#004a32]">
                <span className="material-symbols-outlined text-[15px] fill-current">check_circle</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#004a32] tabular-nums">
                {approvedCount}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#85f8c4] text-[#002114] font-bold">
                Passed
              </span>
            </div>
            <div className="text-[10px] text-[#565e74] mt-0.5">Cleared Seats</div>
          </div>

          {/* Rejected */}
          <div className="flex flex-col p-3 bg-white rounded-2xl shadow-xs border border-[#e6e8ea]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#565e74] uppercase">Rejected</span>
              <div className="w-6 h-6 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[15px]">cancel</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#ba1a1a] tabular-nums">
                {rejectedCount}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">
                Flagged
              </span>
            </div>
            <div className="text-[10px] text-[#565e74] mt-0.5">Action Required</div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="w-full h-11 rounded-xl bg-[#00236f] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Report (CSV)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSimulateIntake}
              className="h-10 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00236f]">add_circle</span>
              <span>+ Simulate Intake</span>
            </button>
            <button
              type="button"
              onClick={onResetData}
              className="h-10 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#565e74] text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#757682]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff, ID, or training title..."
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-[#e6e8ea] text-xs text-[#191c1e] placeholder:text-[#757682] focus:outline-none focus:border-[#00236f] shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#565e74] hover:text-[#191c1e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Platform Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {['All', 'Alpha', 'Beta', 'Gamma'].map((p) => {
            const isSelected = platformFilter === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00236f] text-white'
                    : 'bg-white text-[#565e74] hover:bg-[#f2f4f6] border border-[#e6e8ea]'
                }`}
              >
                {p === 'All' ? 'All Platforms' : `Platform ${p}`}
              </button>
            );
          })}
        </div>

        {/* Master Submissions Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#191c1e]">Master Submissions</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eceef0] text-[#444651]">
              {filtered.length} Records
            </span>
          </div>
          <span className="text-[11px] text-[#565e74]">Tap card for log</span>
        </div>

        {/* Master Cards List */}
        <div className="flex flex-col gap-2.5">
          {filtered.map((item) => {
            const isExpanded = expandedCardId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => toggleCard(item.id)}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e6e8ea] transition-all cursor-pointer hover:border-[#b6c4ff]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#eceef0] text-[#00236f] text-xs font-bold flex items-center justify-center shrink-0">
                      {item.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#191c1e] truncate leading-tight">
                        {item.staffName}
                      </span>
                      <span className="text-[10px] text-[#565e74] truncate">
                        {item.staffId} • {item.platform}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {item.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#85f8c4]/30 text-[#002114] text-[10px] font-bold border border-[#68dba9]">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        Approved
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[10px] font-bold border border-[#b6c4ff]">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        Pending
                      </span>
                    )}
                    {item.status === 'Rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold border border-[#ffb4ab]">
                        <span className="material-symbols-outlined text-[12px]">close</span>
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Training Title */}
                <div className="text-xs font-semibold text-[#191c1e] line-clamp-2 mb-2 leading-snug">
                  {item.program}
                </div>

                {/* Date & Expandable Chevron Row */}
                <div className="flex items-center justify-between text-[#565e74] text-[11px] pt-1 border-t border-[#f2f4f6]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#757682]">calendar_today</span>
                    <span>Date: {item.sessionDate}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#00236f] font-semibold">
                    <span>{isExpanded ? 'Close' : 'Details'}</span>
                    <span
                      className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Rejection Remarks Callout if present */}
                {item.status === 'Rejected' && item.remarks && (
                  <div className="mt-2 p-2 rounded-lg bg-[#fff5f5] text-[#9b2c2c] border border-[#fed7d7] text-[11px] flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[#ba1a1a] shrink-0 mt-0.5">
                      info
                    </span>
                    <div className="leading-tight">
                      <span className="font-bold">Rejection Remarks: </span>
                      <span>{item.remarks}</span>
                    </div>
                  </div>
                )}

                {/* Expandable Accordion Content */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 bg-[#f2f4f6] rounded-xl p-2.5 border border-[#e6e8ea] text-[11px] flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2 text-[#565e74]">
                      <div>
                        <span className="text-[10px] text-[#757682] block">Registration ID:</span>
                        <span className="font-bold text-[#191c1e] font-mono">{item.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#757682] block">System Timestamp:</span>
                        <span className="font-semibold text-[#191c1e] font-mono">{item.submittedAt}</span>
                      </div>
                    </div>
                    <div className="text-[#565e74]">
                      <span className="text-[10px] text-[#757682] block">Secretary Audit Trail:</span>
                      <div className="flex items-center gap-1.5 text-[#191c1e] font-medium mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00236f] shrink-0"></span>
                        <span>{item.secretaryLog || 'Verified by Operating Platform Secretariat'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xs border border-[#e6e8ea] text-center my-3">
              <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#757682] mb-2">
                <span className="material-symbols-outlined text-[24px]">search_off</span>
              </div>
              <div className="text-sm font-bold text-[#191c1e] mb-1">No records matching query</div>
              <p className="text-xs text-[#565e74] mb-3">
                Try searching with a different staff name, ID, or switch your platform filter.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3.5 py-1.5 rounded-lg bg-[#00236f] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Reset Search &amp; Filters
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
          onClick={onSwitchToSecretary}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#565e74] hover:text-[#00236f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          <span className="text-[10px]">Pending</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#565e74] hover:text-[#00236f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">rule</span>
          <span className="text-[10px]">Batch</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#565e74] hover:text-[#00236f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">history_edu</span>
          <span className="text-[10px]">Audit</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#00236f] font-bold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">insights</span>
          <span className="text-[10px]">Metrics</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-11 text-[#565e74] hover:text-[#00236f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          <span className="text-[10px]">Config</span>
        </button>
      </nav>
    </div>
  );
};
