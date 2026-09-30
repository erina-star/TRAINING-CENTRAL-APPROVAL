import React from 'react';
import { TrainingRegistration } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  registration: TrainingRegistration | null;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  registration,
  onClose
}) => {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1e]/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#e6e8ea] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between border-b border-[#e6e8ea]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[#191c1e] leading-tight">
                Submission Audit Trail
              </h2>
              <span className="text-xs text-[#565e74] font-mono mt-0.5">
                Ref ID: {registration.id}
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
          {/* Metadata 4-Cell Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#565e74] uppercase font-bold tracking-wider">
                Candidate
              </span>
              <span className="text-xs font-bold text-[#191c1e] mt-1 truncate">
                {registration.staffName}
              </span>
              <span className="text-[11px] text-[#565e74] font-mono mt-0.5">
                {registration.staffId}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#565e74] uppercase font-bold tracking-wider">
                Platform Hub
              </span>
              <span className="text-xs font-bold text-[#191c1e] mt-1 truncate">
                {registration.platform}
              </span>
              <span className="text-[11px] text-[#565e74] mt-0.5">
                Google Sync Form #1
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#565e74] uppercase font-bold tracking-wider">
                Approval State
              </span>
              <div className="mt-1">
                {registration.status === 'Approved' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4]/30 text-[#004a32] text-[11px] font-bold border border-[#68dba9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004a32]"></span>
                    Approved
                  </span>
                )}
                {registration.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending Review
                  </span>
                )}
                {registration.status === 'Rejected' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold border border-[#ffb4ab]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                    Rejected
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#565e74] uppercase font-bold tracking-wider">
                Session Window
              </span>
              <span className="text-xs font-bold text-[#191c1e] mt-1 truncate">
                {registration.sessionDate}
              </span>
              <span className="text-[11px] text-[#565e74] mt-0.5">
                Full-Day Track
              </span>
            </div>
          </div>

          {/* Program Overview */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Training Program Detail
            </span>
            <div className="p-3.5 rounded-xl bg-white border border-[#e6e8ea] shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eceef0] flex items-center justify-center text-[#00236f] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#191c1e] leading-snug">
                    {registration.program}
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-0.5">
                    {registration.category || 'Competency Matrix Standard'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#eceef0] text-[#444651] whitespace-nowrap">
                Core Curriculum
              </span>
            </div>
          </div>

          {/* Remarks Banner (If Available) */}
          {registration.status === 'Rejected' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
                Secretary Evaluation & Audit Note
              </span>
              <div className="p-3.5 rounded-xl bg-[#fff5f5] border border-[#fed7d7] text-[#9b2c2c] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#e53e3e] shrink-0 mt-0.5">
                  flag
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold tracking-wide">
                    Action Required / Governance Exception
                  </span>
                  <p className="mt-0.5 text-xs text-[#742a2a] leading-relaxed">
                    {registration.remarks || 'Prerequisites incomplete; missing foundational certificate verification.'}
                  </p>
                  {registration.rejectionTimestamp && (
                    <span className="text-[10px] text-[#9b2c2c] mt-1 font-mono">
                      Timestamp: {registration.rejectionTimestamp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {registration.status === 'Approved' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
                Secretary Evaluation & Audit Note
              </span>
              <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#16a34a] shrink-0 mt-0.5">
                  verified
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold tracking-wide">
                    Cleared & Endorsed by Platform Secretary
                  </span>
                  <p className="mt-0.5 text-xs text-[#14532d] leading-relaxed">
                    {registration.remarks || registration.secretaryLog || 'Fully cleared. Pre-requisites verified with Department Head.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lifecycle Timeline */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Lifecycle Timeline
            </span>
            <div className="flex flex-col gap-3.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e6e8ea]">
              {/* Event 1 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 z-10 border border-emerald-300">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#191c1e]">
                    Registration Submitted via Google Form
                  </span>
                  <span className="text-[11px] text-[#565e74] font-mono mt-0.5">
                    {registration.submittedAt} • Form Intake ID: {registration.id}
                  </span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-start gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-[#dce1ff] text-[#00236f] flex items-center justify-center shrink-0 z-10 border border-[#b6c4ff]">
                  <span className="material-symbols-outlined text-[15px]">sync_alt</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#191c1e]">
                    Ingested by Live Cloud Sync Bridge
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-0.5">
                    Transferred to Centralized Oversight Portal with 0 schema validation errors
                  </span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-start gap-3 relative">
                {registration.status === 'Approved' ? (
                  <div className="w-7 h-7 rounded-full bg-[#85f8c4] text-[#003120] flex items-center justify-center shrink-0 z-10 border border-[#68dba9]">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                  </div>
                ) : registration.status === 'Rejected' ? (
                  <div className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 z-10 border border-[#ffb4ab]">
                    <span className="material-symbols-outlined text-[15px]">block</span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 z-10 border border-amber-300">
                    <span className="material-symbols-outlined text-[15px] animate-pulse">hourglass_bottom</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#191c1e]">
                    {registration.status === 'Approved'
                      ? 'Platform Secretary Approval Issued'
                      : registration.status === 'Rejected'
                      ? 'Requisition Disapproved by Platform Secretary'
                      : 'Pending Secretary Queue Verification'}
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-0.5">
                    {registration.secretaryLog ||
                      (registration.status === 'Pending'
                        ? 'Candidate application is currently in priority queue awaiting review.'
                        : 'Action decision stored to immutable ledger.')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f2f4f6] flex items-center justify-between border-t border-[#e6e8ea]">
          <div className="flex items-center gap-1.5 text-[#565e74] text-xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">security</span>
            <span>Immutable Audit Trail • Read-Only</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-semibold transition-colors border border-[#e0e3e5] shadow-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
