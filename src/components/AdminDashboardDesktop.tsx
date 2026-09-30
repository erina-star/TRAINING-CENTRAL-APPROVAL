import React, { useState, useMemo } from 'react';
import { TrainingRegistration, Platform, Status } from '../types';

interface AdminDashboardDesktopProps {
  registrations: TrainingRegistration[];
  onOpenAuditModal: (registration: TrainingRegistration) => void;
  onSimulateIntake: () => void;
  onResetData: () => void;
  onExportCsv: () => void;
}

export const AdminDashboardDesktop: React.FC<AdminDashboardDesktopProps> = ({
  registrations,
  onOpenAuditModal,
  onSimulateIntake,
  onResetData,
  onExportCsv
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformTab, setPlatformTab] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceTab, setSourceTab] = useState<'All' | 'GoogleLink'>('All');
  const [sortField, setSortField] = useState<'staff' | 'platform' | 'program' | 'session' | 'submitted'>('submitted');
  const [sortAsc, setSortAsc] = useState(false);

  // Metrics
  const googleLinkCount = registrations.filter(
    (r) => r.capturedFromGoogleLink || r.sourceType === 'google_link'
  ).length;

  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const rejectedCount = registrations.filter((r) => r.status === 'Rejected').length;

  const approvedRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : '0';
  const rejectedRate = totalCount > 0 ? ((rejectedCount / totalCount) * 100).toFixed(1) : '0';

  // Filtered and sorted records
  const filteredAndSorted = useMemo(() => {
    let result = registrations.filter((item) => {
      // Source filter
      if (sourceTab === 'GoogleLink') {
        if (!item.capturedFromGoogleLink && item.sourceType !== 'google_link') return false;
      }

      // Platform filter
      if (platformTab !== 'All' && item.platform !== platformTab) return false;

      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;

      // Search filter
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

    result.sort((a, b) => {
      let valA: string, valB: string;
      if (sortField === 'staff') {
        valA = a.staffName.toLowerCase();
        valB = b.staffName.toLowerCase();
      } else if (sortField === 'platform') {
        valA = a.platform.toLowerCase();
        valB = b.platform.toLowerCase();
      } else if (sortField === 'program') {
        valA = a.program.toLowerCase();
        valB = b.program.toLowerCase();
      } else if (sortField === 'session') {
        valA = a.sessionDate;
        valB = b.sessionDate;
      } else {
        valA = a.submittedAt;
        valB = b.submittedAt;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [registrations, platformTab, statusFilter, searchQuery, sortField, sortAsc]);

  const handleSort = (field: 'staff' | 'platform' | 'program' | 'session' | 'submitted') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setPlatformTab('All');
    setStatusFilter('All');
  };

  const getPlatformBadge = (platform: Platform) => {
    if (platform === 'Platform Alpha') return 'bg-blue-50 text-blue-900 border-blue-200';
    if (platform === 'Platform Beta') return 'bg-indigo-50 text-indigo-900 border-indigo-200';
    return 'bg-emerald-50 text-emerald-900 border-emerald-200';
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[#00236f] tracking-tight">
              Admin Training Oversight Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-semibold border border-[#68dba9]">
              <span className="w-2 h-2 rounded-full bg-[#005137] animate-pulse"></span>
              Sync: Live Cloud Active • Updated: Just now
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#565e74]">
            Real-time consolidated tracking across all platform Google Form registrations
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onResetData}
            className="h-11 px-4 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer border border-[#e0e3e5]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#565e74]">restart_alt</span>
            <span>Reset Demo Data</span>
          </button>
          <button
            type="button"
            onClick={onSimulateIntake}
            className="h-11 px-4 rounded-xl bg-[#dae2fd] hover:bg-[#b6c4ff] text-[#131b2e] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer border border-[#b6c4ff]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00236f]">add_task</span>
            <span>+ Simulate Intake</span>
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="h-11 px-5 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards (PRD F04) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pipeline Intake */}
        <div className="bg-white p-5 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-[#e6e8ea]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-[#565e74]">
                Total Pipeline Intake
              </span>
              <span className="text-3xl font-extrabold text-[#191c1e] mt-1 tabular-nums">
                {totalCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center text-[#00236f]">
              <span className="material-symbols-outlined text-[22px]">inbox</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-[#f2f4f6] -mx-5 -mb-5 px-5 py-2.5 border-t border-[#e6e8ea]">
            <div className="flex items-center gap-1.5 text-[#004a32] font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+12% vs last cycle</span>
            </div>
            <span className="text-[#565e74]">Updated 1m ago</span>
          </div>
        </div>

        {/* Card 2: Pending Review Queue */}
        <div className="bg-white p-5 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-[#e6e8ea]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-[#565e74]">
                Pending Review Queue
              </span>
              <span className="text-3xl font-extrabold text-[#191c1e] mt-1 tabular-nums">
                {pendingCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-[#f2f4f6] -mx-5 -mb-5 px-5 py-2.5 border-t border-[#e6e8ea]">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Secretary clearance needed</span>
            </div>
            <span className="text-[#565e74]">Avg wait: 4.2 hrs</span>
          </div>
        </div>

        {/* Card 3: Approved Cleared */}
        <div className="bg-white p-5 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-[#e6e8ea]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-[#565e74]">
                Approved Cleared
              </span>
              <span className="text-3xl font-extrabold text-[#191c1e] mt-1 tabular-nums">
                {approvedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-[#f2f4f6] -mx-5 -mb-5 px-5 py-2.5 border-t border-[#e6e8ea]">
            <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Confirmed participant seats</span>
            </div>
            <span className="text-[#565e74] font-medium">{approvedRate}% rate</span>
          </div>
        </div>

        {/* Card 4: Rejected / Flagged */}
        <div className="bg-white p-5 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-[#e6e8ea]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-[#565e74]">
                Rejected / Flagged
              </span>
              <span className="text-3xl font-extrabold text-[#ba1a1a] mt-1 tabular-nums">
                {rejectedCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[22px]">error</span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-xs bg-[#f2f4f6] -mx-5 -mb-5 px-5 py-2.5 border-t border-[#e6e8ea]">
            <div className="flex items-center gap-1.5 text-[#ba1a1a] font-semibold">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Action / Quota mismatch</span>
            </div>
            <span className="text-[#565e74] font-medium">{rejectedRate}% audit flagged</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border border-[#e6e8ea]">
        <div className="flex flex-col md:flex-row items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757682] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, staff ID, or training program..."
              className="w-full h-11 pl-10 pr-9 bg-[#f2f4f6] rounded-xl text-[#191c1e] text-xs sm:text-sm placeholder:text-[#757682] focus:outline-none focus:bg-white border border-transparent focus:border-[#c5c5d3] shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#191c1e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Platform Filter Quick Tabs */}
          <div className="flex items-center bg-[#f2f4f6] p-1 rounded-xl w-full md:w-auto overflow-x-auto border border-[#e0e3e5]">
            {['All', 'Platform Alpha', 'Platform Beta', 'Platform Gamma'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatformTab(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer ${
                  platformTab === p
                    ? 'bg-white text-[#00236f] shadow-xs font-bold'
                    : 'text-[#565e74] hover:text-[#191c1e] font-medium'
                }`}
              >
                {p === 'All' ? 'All Platforms' : p}
              </button>
            ))}
          </div>

          {/* Source Filter Switcher */}
          <div className="flex items-center bg-[#f2f4f6] p-1 rounded-xl border border-[#e0e3e5]">
            <button
              type="button"
              onClick={() => setSourceTab('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceTab === 'All'
                  ? 'bg-white text-[#00236f] shadow-xs'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              All Sources
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('GoogleLink')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                sourceTab === 'GoogleLink'
                  ? 'bg-[#00236f] text-white shadow-xs'
                  : 'text-[#00236f] hover:bg-[#dae2fd]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">link</span>
              <span>Google Link Data ({googleLinkCount})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-4 shrink-0">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="statusDropdownFilter" className="text-xs font-bold text-[#565e74] uppercase tracking-wider">
              Status:
            </label>
            <div className="relative">
              <select
                id="statusDropdownFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] appearance-none focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#565e74] text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Record Counter */}
          <div className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#565e74] shrink-0 border border-[#e0e3e5]">
            Showing {filteredAndSorted.length} of {registrations.length} records
          </div>
        </div>
      </div>

      {/* Master Submissions Table */}
      <div className="bg-white rounded-2xl shadow-xs overflow-hidden flex flex-col border border-[#e6e8ea]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left table-auto min-w-[1000px]">
            <thead>
              <tr className="bg-[#f2f4f6] text-[#565e74] text-[11px] font-bold uppercase tracking-wider select-none border-b border-[#e6e8ea]">
                <th
                  onClick={() => handleSort('staff')}
                  className="py-3.5 px-5 font-semibold cursor-pointer hover:text-[#00236f] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Staff Member</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>

                <th
                  onClick={() => handleSort('platform')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00236f] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Platform</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>

                <th
                  onClick={() => handleSort('program')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00236f] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Training Program</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>

                <th
                  onClick={() => handleSort('session')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00236f] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Session Date</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>

                <th
                  onClick={() => handleSort('submitted')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00236f] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Submitted At</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>

                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Audit Remarks</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-xs divide-y divide-[#eceef0]">
              {filteredAndSorted.map((item, index) => {
                const isAlt = index % 2 === 1;
                const rowBg = isAlt ? 'bg-[#f7f9fb]/60' : 'bg-white';
                const platformBadgeStyle = getPlatformBadge(item.platform);

                return (
                  <tr key={item.id} className={`${rowBg} hover:bg-[#f2f4f6] transition-colors group`}>
                    {/* Staff Member */}
                    <td className="py-3 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${item.avatarBg} flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs`}
                        >
                          {item.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#191c1e] text-xs leading-snug">
                            {item.staffName}
                          </span>
                          <span className="text-[11px] text-[#565e74] font-mono">
                            {item.staffId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold ${platformBadgeStyle}`}>
                        {item.platform}
                      </span>
                    </td>

                    {/* Program */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-[#191c1e] block truncate max-w-xs" title={item.program}>
                        {item.program}
                      </span>
                    </td>

                    {/* Session Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs text-[#565e74] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#757682]">event</span>
                        {item.sessionDate}
                      </span>
                    </td>

                    {/* Submitted At */}
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#565e74]">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono">{item.submittedAt}</span>
                        {(item.capturedFromGoogleLink || item.sourceType === 'google_link') && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-[#dae2fd] text-[#00164e] text-[10px] font-bold w-fit">
                            <span className="material-symbols-outlined text-[10px]">link</span>
                            <span>{item.sourceLinkTitle || 'Google Link'}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4]/30 text-[#003120] text-[11px] font-bold border border-[#68dba9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#004a32]"></span>
                          Approved
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </span>
                      )}
                      {item.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold border border-[#ffb4ab]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Audit Remarks */}
                    <td className="py-3 px-4">
                      {item.status === 'Rejected' ? (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fff5f5] text-[#9b2c2c] border border-[#fed7d7] text-[11px] font-medium max-w-xs truncate"
                          title={item.remarks}
                        >
                          <span className="material-symbols-outlined text-[15px] text-[#e53e3e] shrink-0">
                            warning
                          </span>
                          <span className="truncate">{item.remarks}</span>
                        </div>
                      ) : item.status === 'Pending' ? (
                        <div
                          className="inline-flex items-center gap-1.5 text-[#565e74] text-[11px] max-w-xs truncate"
                          title={item.remarks || item.secretaryLog}
                        >
                          <span className="material-symbols-outlined text-[15px] text-amber-600 shrink-0">
                            hourglass_top
                          </span>
                          <span className="truncate">{item.remarks || item.secretaryLog || 'Awaiting platform review'}</span>
                        </div>
                      ) : (
                        <div
                          className="inline-flex items-center gap-1.5 text-[#565e74] text-[11px] max-w-xs truncate"
                          title={item.remarks || item.secretaryLog}
                        >
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">
                            check
                          </span>
                          <span className="truncate">{item.remarks || item.secretaryLog || 'Verified by Secretary'}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenAuditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-semibold transition-colors border border-[#e0e3e5] cursor-pointer"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#757682] mb-3">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="text-sm font-bold text-[#191c1e]">
              No matching training submissions found
            </h3>
            <p className="text-xs text-[#565e74] mt-1 max-w-md">
              Try adjusting your keyword search query, clearing active filters, or changing platform tabs.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#00236f] text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination / Footer Bar */}
        <div className="px-5 py-3.5 bg-[#f2f4f6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#565e74] border-t border-[#e6e8ea]">
          <div className="flex items-center gap-2">
            <span>Enterprise System Sync API</span>
            <span className="w-1 h-1 rounded-full bg-[#757682]"></span>
            <span>Encrypted Audit Ledger</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] opacity-40 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-2.5 py-1 rounded-md bg-white text-xs text-[#191c1e] shadow-2xs font-bold border border-[#e0e3e5]">
              1
            </span>
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#757682] opacity-40 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
