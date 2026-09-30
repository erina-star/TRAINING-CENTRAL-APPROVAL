import React, { useState } from 'react';
import { TrainingRegistration, Platform } from '../types';

interface SecretaryViewDesktopProps {
  registrations: TrainingRegistration[];
  onApprove: (id: string) => void;
  onRejectClick: (registration: TrainingRegistration) => void;
  onUndo: (id: string) => void;
  onSimulateIntake: () => void;
  onResetData: () => void;
  onOpenSheetSync: () => void;
}

export const SecretaryViewDesktop: React.FC<SecretaryViewDesktopProps> = ({
  registrations,
  onApprove,
  onRejectClick,
  onUndo,
  onSimulateIntake,
  onResetData,
  onOpenSheetSync
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Metrics
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const rejectedCount = registrations.filter((r) => r.status === 'Rejected').length;

  // Filtered rows
  const filtered = registrations.filter((row) => {
    const matchPlatform = selectedPlatform === 'All' || row.platform === selectedPlatform;
    let matchStatus = true;
    if (statusFilter === 'PENDING') matchStatus = row.status === 'Pending';
    if (statusFilter === 'APPROVED') matchStatus = row.status === 'Approved';
    if (statusFilter === 'REJECTED') matchStatus = row.status === 'Rejected';
    return matchPlatform && matchStatus;
  });

  const clearFilters = () => {
    setSelectedPlatform('All');
    setStatusFilter('ALL');
  };

  const getPlatformBadge = (platform: Platform) => {
    if (platform === 'Platform Alpha') {
      return 'bg-blue-50 text-blue-900 border-blue-200';
    }
    if (platform === 'Platform Beta') {
      return 'bg-indigo-50 text-indigo-900 border-indigo-200';
    }
    return 'bg-emerald-50 text-emerald-900 border-emerald-200';
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Context Banner */}
      <div className="w-full bg-white border border-[#e6e8ea] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#00236f] tracking-tight">
                Platform Secretary Review Portal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-[11px] font-semibold">
                Stage 1 Prototype • Public Access (No Login Required)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Live Intake Stream
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5 max-w-3xl leading-relaxed">
              Authoritative intake validation, course schedule verification, and immediate decision ledger across registered operating platforms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={onOpenSheetSync}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] border border-[#e0e3e5] text-xs text-[#565e74] font-medium transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px]">Source: Google Sheets Live Sync</span>
          </button>
        </div>
      </div>

      {/* Control Toolbar: Platform Filter + Dynamic Interactive KPI Buttons */}
      <div className="w-full bg-white border border-[#e6e8ea] rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Selector */}
          <div className="flex items-center bg-[#f2f4f6] border border-[#e0e3e5] rounded-xl px-3 py-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#565e74] mr-1.5">domain</span>
            <label htmlFor="platformSelectDesktop" className="text-xs font-semibold text-[#565e74] mr-2">
              Platform:
            </label>
            <select
              id="platformSelectDesktop"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-[#191c1e] focus:ring-0 cursor-pointer py-0.5 pr-6 pl-0 outline-none"
            >
              <option value="All">All Platforms</option>
              <option value="Platform Alpha">Platform Alpha</option>
              <option value="Platform Beta">Platform Beta</option>
              <option value="Platform Gamma">Platform Gamma</option>
            </select>
          </div>

          {/* Dynamic KPI Badges (Interactive quick filter) */}
          <div className="flex items-center bg-[#f2f4f6] border border-[#e0e3e5] p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span>Total</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#e6e8ea] text-[#191c1e] text-[10px] font-bold">
                {totalCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-300'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Pending</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                {pendingCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('APPROVED')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'APPROVED'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-300'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Approved</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                {approvedCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('REJECTED')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'REJECTED'
                  ? 'bg-white text-[#93000a] shadow-xs ring-1 ring-[#ba1a1a]/30'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              <span>Rejected</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                {rejectedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Right Sandbox Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onOpenSheetSync}
            className="h-10 px-3.5 rounded-xl border border-[#c5c5d3] bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#004a32]">cloud_sync</span>
            <span>Sync Google Sheet</span>
          </button>
          <button
            type="button"
            onClick={onSimulateIntake}
            className="h-10 px-4 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Simulate Intake (Google Form)</span>
          </button>
          <button
            type="button"
            onClick={onResetData}
            title="Reset sandbox mock data"
            className="h-10 px-3 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#565e74] hover:text-[#191c1e] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* Filter Feedback Notice (If Filtered) */}
      {(selectedPlatform !== 'All' || statusFilter !== 'ALL') && (
        <div className="w-full bg-[#dae2fd]/60 border border-[#b6c4ff] text-[#00164e] px-4 py-2 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#00236f]">filter_list</span>
            <span>
              Showing records filtered by Platform <strong>[{selectedPlatform}]</strong> • Status <strong>[{statusFilter}]</strong> ({filtered.length} found)
            </span>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="font-semibold text-[#00236f] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Workspace Table Card */}
      <div className="w-full bg-white border border-[#e6e8ea] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-[#f2f4f6] text-[#565e74] text-[11px] font-bold uppercase tracking-wider border-b border-[#e6e8ea]">
                <th className="py-3.5 px-5">Candidate Staff</th>
                <th className="py-3.5 px-4">Assigned Platform</th>
                <th className="py-3.5 px-4">Training Program &amp; Schedule</th>
                <th className="py-3.5 px-4">Intake Received</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Secretary Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef0] text-xs">
              {filtered.map((row) => {
                const platformBadgeStyle = getPlatformBadge(row.platform);

                return (
                  <tr key={row.id} className="hover:bg-[#f7f9fb] transition-colors">
                    {/* Candidate Staff */}
                    <td className="py-3.5 px-5 align-top">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${row.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                        >
                          {row.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#191c1e] text-xs leading-tight">
                            {row.staffName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#565e74]">
                            <span className="font-mono bg-[#f2f4f6] px-1.5 py-0.5 rounded border border-[#e0e3e5]">
                              {row.staffId}
                            </span>
                            <span>•</span>
                            <span className="text-[#757682] text-[10px]">{row.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Platform */}
                    <td className="py-3.5 px-4 align-top">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${platformBadgeStyle}`}>
                        <span className="material-symbols-outlined text-[14px]">domain</span>
                        {row.platform}
                      </span>
                    </td>

                    {/* Training Program & Schedule */}
                    <td className="py-3.5 px-4 align-top max-w-md">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#00236f] shrink-0 mt-0.5">
                            school
                          </span>
                          <span className="font-semibold text-[#191c1e] text-xs leading-snug">
                            {row.program}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#565e74] pl-5">
                          {row.category && (
                            <>
                              <span className="bg-[#f2f4f6] px-1.5 py-0.5 rounded text-[#444651]">
                                {row.category}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#757682]">
                              calendar_today
                            </span>
                            {row.sessionDate}
                          </span>
                        </div>

                        {/* Rejection Remark Callout */}
                        {row.status === 'Rejected' && row.remarks && (
                          <div className="mt-1.5 p-2 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-[#93000a] text-[11px] flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-[#ba1a1a] shrink-0 mt-0.5">
                              info
                            </span>
                            <div className="leading-tight">
                              <span className="font-bold">Remarks: </span>
                              <span>{row.remarks}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Intake Received */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-col text-xs text-[#565e74]">
                        <span className="font-medium text-[#191c1e]">{row.submittedAt}</span>
                        <span className="text-[10px] text-[#757682] flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Google Form Intake
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 align-top">
                      {row.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Review
                        </span>
                      )}
                      {row.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#85f8c4]/30 text-[#003120] border border-[#68dba9] text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px] text-[#004a32]">check_circle</span>
                          Approved
                        </span>
                      )}
                      {row.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab] text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">cancel</span>
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Secretary Action */}
                    <td className="py-3.5 px-5 align-top text-right">
                      {row.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApprove(row.id)}
                            className="h-8 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                            title="Endorse and approve training requisition"
                          >
                            <span className="material-symbols-outlined text-[15px]">check</span>
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectClick(row)}
                            className="h-8 px-3 rounded-lg bg-[#f2f4f6] hover:bg-[#ffdad6] text-[#ba1a1a] font-semibold text-xs flex items-center gap-1 border border-[#e0e3e5] hover:border-[#ffdad6] transition-all cursor-pointer"
                            title="Disapprove with remarks"
                          >
                            <span className="material-symbols-outlined text-[15px]">close</span>
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <span className="text-[11px] text-[#565e74] italic">Decided</span>
                          <button
                            type="button"
                            onClick={() => onUndo(row.id)}
                            className="text-xs text-[#00236f] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                            title="Reset decision back to Pending Review"
                          >
                            <span className="material-symbols-outlined text-[14px]">undo</span>
                            <span>Undo</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state when filtered to zero */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#757682] mb-3">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <p className="text-sm font-bold text-[#191c1e]">No registration entries match current criteria</p>
            <p className="text-xs text-[#565e74] max-w-sm mt-1">
              Try adjusting your platform selection or reset filters to view all incoming applications.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 px-3 py-1.5 rounded-lg bg-[#00236f] text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Table Footer */}
        <div className="w-full bg-[#f2f4f6] border-t border-[#e6e8ea] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#565e74]">
          <span>
            Showing {filtered.length} of {registrations.length} total staff registrations
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Instant Decision Ledger
            </span>
            <span className="text-[#c5c5d3]">•</span>
            <span className="font-mono">PRD V1.1 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
