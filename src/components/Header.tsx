import React, { useState } from 'react';
import { ViewMode, DeviceView, AuthUser } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  deviceView: DeviceView;
  onDeviceViewChange: (mode: DeviceView) => void;
  onOpenSheetSync: () => void;
  onOpenDrive?: () => void;
  onSimulateIntake: () => void;
  onResetData: () => void;
  onRefreshSync?: () => void;
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  deviceView,
  onDeviceViewChange,
  onOpenSheetSync,
  onOpenDrive,
  onSimulateIntake,
  onResetData,
  onRefreshSync,
  currentUser,
  onSignOut
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e6e8ea]">
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Division */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#00236f] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-[#00236f] tracking-tight leading-none">
                Training Approvals System
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e6e8ea] text-[#444651] text-[10px] font-bold uppercase tracking-wider">
                LIVE V1.1
              </span>
            </div>
            <span className="text-[11px] text-[#565e74] leading-tight mt-0.5 hidden sm:inline">
              Enterprise Governance Division
            </span>
          </div>
        </div>

        {/* View Switcher (Secretary Review vs Admin Oversight) */}
        <nav className="flex items-center bg-[#f2f4f6] p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => onViewChange('secretary')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'secretary'
                ? 'bg-[#1e3a8a] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span className="hidden md:inline">Secretary Review Portal</span>
            <span className="md:hidden">Secretary</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange('admin')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#1e3a8a] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span className="hidden md:inline">Admin Oversight Dashboard</span>
            <span className="md:hidden">Admin</span>
          </button>
        </nav>

        {/* Actions & Device Simulator Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Device Mockup Toggle (Allows switching between full desktop and mobile view from screenshots) */}
          <div className="hidden lg:flex items-center bg-[#f2f4f6] rounded-lg p-0.5 border border-[#e0e3e5]">
            <button
              type="button"
              title="Responsive Standard View"
              onClick={() => onDeviceViewChange('responsive')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceView === 'responsive'
                  ? 'bg-white text-[#00236f] shadow-xs font-semibold'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">devices</span>
            </button>
            <button
              type="button"
              title="Desktop Layout"
              onClick={() => onDeviceViewChange('desktop-mockup')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceView === 'desktop-mockup'
                  ? 'bg-white text-[#00236f] shadow-xs font-semibold'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            </button>
            <button
              type="button"
              title="Mobile Device Screen View (as shown in images 1 & 3)"
              onClick={() => onDeviceViewChange('mobile-mockup')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceView === 'mobile-mockup'
                  ? 'bg-white text-[#00236f] shadow-xs font-semibold'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
            </button>
          </div>

          {/* Cloud Firestore Status Badge */}
          <div
            title="Connected to Firebase Firestore"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#00164e] text-xs font-semibold border border-[#b6c4ff]"
          >
            <span className="w-2 h-2 rounded-full bg-[#1e3a8a] animate-pulse"></span>
            <span className="material-symbols-outlined text-[15px] text-[#00236f]">cloud_done</span>
            <span>Firestore Live</span>
          </div>

          {/* Google Drive Workspace Trigger */}
          {onOpenDrive && (
            <button
              type="button"
              onClick={onOpenDrive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dae2fd] hover:bg-[#c2d0fc] text-[#00164e] text-xs font-semibold shadow-xs transition-all border border-[#b6c4ff] cursor-pointer"
              title="Browse and import files from Google Drive"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00236f]">add_to_drive</span>
              <span className="hidden md:inline">Google Drive</span>
            </button>
          )}

          {/* Google Sheet CSV Sync Trigger (Stage 3 Requirement) */}
          <button
            type="button"
            onClick={onOpenSheetSync}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#85f8c4] hover:bg-[#68dba9] text-[#002114] text-xs font-semibold shadow-xs transition-all border border-[#52d69f] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#005137] animate-pulse"></span>
            <span className="material-symbols-outlined text-[15px]">sync_alt</span>
            <span>Google Sheet CSV Sync</span>
            <span className="text-[10px] bg-white/70 px-1.5 py-0.2 rounded font-mono text-[#003120]">
              Live
            </span>
          </button>

          {/* Simulate Intake Trigger */}
          <button
            type="button"
            onClick={onSimulateIntake}
            className="h-9 px-2.5 sm:px-3 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Simulate inbound Google Form submission"
          >
            <span className="material-symbols-outlined text-[16px]">add_task</span>
            <span className="hidden xl:inline">+ Simulate Intake</span>
          </button>

          {/* Quick Refresh & Reset */}
          <button
            type="button"
            onClick={onRefreshSync || onResetData}
            title="Refresh Live Data"
            className="w-9 h-9 rounded-lg bg-[#f2f4f6] text-[#565e74] hover:text-[#191c1e] hover:bg-[#eceef0] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>

          {/* User Profile & Sign Out Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full hover:bg-[#f2f4f6] transition-colors border border-transparent hover:border-[#c4c7c5] cursor-pointer"
              title={currentUser?.displayName || 'User Profile'}
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google Profile'}
                  className="w-8 h-8 rounded-full object-cover border border-[#00236f] shadow-xs"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                >
                  {currentUser?.displayName
                    ? currentUser.displayName.slice(0, 2).toUpperCase()
                    : <span className="material-symbols-outlined text-[18px]">person</span>}
                </div>
              )}
              
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#00164e] leading-tight max-w-[120px] truncate">
                  {currentUser?.displayName || 'Authorized User'}
                </span>
                <span className="text-[10px] text-[#565e74] leading-tight truncate max-w-[120px]">
                  {currentUser?.role?.split('&')[0] || 'Secretariat'}
                </span>
              </div>

              <span className="material-symbols-outlined text-[16px] text-[#565e74] hidden sm:inline">
                {showUserMenu ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#c4c7c5] shadow-xl py-2 z-50 text-left animate-fadeIn">
                  <div className="px-4 py-3 border-b border-[#e0e2ec]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#dae2fd] text-[#00164e]">
                        Google Workspace
                      </span>
                      <span className="text-[10px] text-[#006e1c] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c]"></span>
                        Authenticated
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1b1b1f] truncate">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-[11px] text-[#565e74] truncate">
                      {currentUser?.email || 'Authenticated Account'}
                    </p>
                    <p className="text-[10px] text-[#00236f] font-semibold mt-1 bg-[#f0f4fc] px-2 py-0.5 rounded-md inline-block">
                      {currentUser?.role || 'Staff'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      <span>Sign Out from Platform</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
