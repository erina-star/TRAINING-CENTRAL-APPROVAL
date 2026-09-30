import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 pointer-events-none flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#2d3133] text-[#eff1f3] shadow-2xl border border-white/10 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-5">
      <span className="material-symbols-outlined text-[20px] text-[#85f8c4] shrink-0">
        {icon}
      </span>
      <span className="font-medium">{message}</span>
    </div>
  );
};
