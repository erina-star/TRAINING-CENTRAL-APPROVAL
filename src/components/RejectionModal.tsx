import React, { useState, useEffect } from 'react';
import { TrainingRegistration } from '../types';
import { CANNED_REJECTION_REASONS } from '../mockData';

interface RejectionModalProps {
  isOpen: boolean;
  registration: TrainingRegistration | null;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  registration,
  onClose,
  onConfirm
}) => {
  const [remarks, setRemarks] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRemarks('');
      setHasError(false);
    }
  }, [isOpen, registration]);

  if (!isOpen || !registration) return null;

  const handleConfirm = () => {
    const trimmed = remarks.trim();
    if (!trimmed) {
      setHasError(true);
      return;
    }
    onConfirm(registration.id, trimmed);
    onClose();
  };

  const handlePresetClick = (reason: string) => {
    setRemarks(reason);
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d3133]/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e6e8ea] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#fff5f5] border-b border-[#fed7d7] flex items-center justify-between text-[#c53030]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fed7d7] text-[#9b2c2c] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#742a2a] leading-tight">
                Disapprove Training Requisition
              </h2>
              <p className="text-[11px] text-[#9b2c2c]">
                Mandatory secretary audit exception note
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#fed7d7] flex items-center justify-center text-[#9b2c2c] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Candidate & Course metadata summary */}
          <div className="bg-[#f2f4f6] p-3 rounded-xl border border-[#e6e8ea] flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[#565e74] tracking-wider">
              Candidate / Requisition ID
            </span>
            <div className="font-bold text-[#191c1e] text-sm flex items-center gap-2">
              <span>{registration.staffName}</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-white text-[#565e74] border border-[#e6e8ea]">
                {registration.staffId}
              </span>
              <span className="text-[11px] text-[#757682]">• {registration.id}</span>
            </div>
            <div className="text-[#565e74] text-xs flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-[#1e3a8a]">school</span>
              <span className="font-medium">{registration.program}</span>
            </div>
          </div>

          {/* Error Banner */}
          {hasError && (
            <div className="p-2.5 rounded-lg bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-2 border border-[#ba1a1a]/20 animate-shake">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>Remarks are required when rejecting a request.</span>
            </div>
          )}

          {/* Remarks Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="rejectionRemarks"
                className="font-semibold text-[#191c1e] text-xs flex items-center gap-1"
              >
                <span>Secretary Rejection Remarks</span>
                <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <span className="text-[11px] text-[#565e74] font-mono">
                {remarks.length} / 250
              </span>
            </div>
            <textarea
              id="rejectionRemarks"
              rows={3}
              maxLength={250}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (e.target.value.trim().length > 0) setHasError(false);
              }}
              placeholder="State specific administrative reasons (e.g. Schedule clash with operating deployment, prerequisite not met)..."
              className={`w-full text-xs p-3 rounded-xl border bg-[#f7f9fb] focus:bg-white outline-none transition-all resize-none placeholder:text-[#757682] ${
                hasError
                  ? 'border-[#ba1a1a] ring-2 ring-[#ba1a1a]/20 bg-[#ffdad6]/20'
                  : 'border-[#c5c5d3] focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/15'
              }`}
            />
          </div>

          {/* Quick Canned Preset Reasons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#565e74]">
              Quick reason presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CANNED_REJECTION_REASONS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="px-2.5 py-1 rounded-md bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#444651] hover:text-[#191c1e] text-[11px] transition-colors border border-[#e0e3e5] cursor-pointer"
                >
                  {preset.length > 36 ? preset.substring(0, 36) + '...' : preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#f2f4f6] border-t border-[#e6e8ea] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#565e74] hover:text-[#191c1e] hover:bg-[#e6e8ea] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#ba1a1a] hover:bg-[#93000a] text-white flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">block</span>
            <span>Confirm Rejection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
