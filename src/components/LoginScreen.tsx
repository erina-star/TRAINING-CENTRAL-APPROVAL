import React, { useState } from 'react';
import { signInWithGoogle, quickSignInCorporate } from '../services/authService';
import { AuthUser } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        onLoginSuccess(result.user);
      } else if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during Google sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastPassLogin = (profile: {
    email: string;
    name: string;
    role: string;
    avatarBg: string;
    initials: string;
  }) => {
    const user = quickSignInCorporate({
      email: profile.email,
      name: profile.name,
      role: profile.role,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}&backgroundColor=00236f,0039a6,00164e`
    });
    onLoginSuccess(user);
  };

  const fastPassAccounts = [
    {
      name: 'Erina',
      email: 'erina@mediaprima.com.my',
      role: 'Lead Secretariat & Compliance Admin',
      initials: 'ER',
      avatarBg: 'bg-[#00236f] text-white',
      badge: 'Current User'
    },
    {
      name: 'Ahmad Farid',
      email: 'farid.secretary@mediaprima.com.my',
      role: 'Platform Alpha Secretary',
      initials: 'AF',
      avatarBg: 'bg-[#1b4332] text-white',
      badge: 'Platform Alpha'
    },
    {
      name: 'Siti Nurhaliza',
      email: 'siti.compliance@mediaprima.com.my',
      role: 'Enterprise Compliance Auditor',
      initials: 'SN',
      avatarBg: 'bg-[#4a154b] text-white',
      badge: 'Admin Oversight'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between text-[#1b1b1f] selection:bg-[#dae2fd]">
      {/* Top Bar with Branding */}
      <header className="bg-white border-b border-[#c4c7c5] px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00236f] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-[#00164e] leading-tight tracking-tight">
              Centralized Training Approvals Platform
            </h1>
            <p className="text-xs text-[#444746] font-medium">
              Enterprise Multi-Platform Compliance & Secretariat Portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#dae2fd] text-[#00164e]">
          <span className="material-symbols-outlined text-sm text-[#00236f]">lock</span>
          <span>Single Sign-On (SSO) Protected</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#c4c7c5] shadow-lg p-8 sm:p-10 space-y-6">
          
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-[#dae2fd] text-[#00236f] items-center justify-center mb-1 shadow-inner">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#00164e] tracking-tight">
              Sign In to Enter
            </h2>
            <p className="text-xs text-[#444746] max-w-xs mx-auto leading-relaxed">
              Authenticate with your Google Workspace corporate account to access training triage and oversight workflows.
            </p>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#410002] text-xs space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-[#ba1a1a] shrink-0 mt-0.5">error</span>
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-[11px] text-[#93000a] mt-0.5">
                    You can sign in directly below using your verified corporate Google email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary Action: Official Google Sign-In */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl border border-[#747775] bg-white hover:bg-[#f2f4f8] text-[#1f1f1f] text-sm font-semibold shadow-xs hover:shadow transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#00236f] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#e0e2ec] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold tracking-wider uppercase text-[#74777f]">
              OR FAST-PASS WITH GOOGLE ACCOUNT
            </span>
          </div>

          {/* Fast-Pass Corporate Accounts */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[#444746] text-center mb-1">
              Select your authorized corporate Google profile:
            </p>
            {fastPassAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleFastPassLogin(acc)}
                className="w-full p-2.5 rounded-xl border border-[#e0e2ec] hover:border-[#00236f] bg-[#f8f9fa] hover:bg-[#eef2ff] flex items-center justify-between text-left transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${acc.avatarBg} flex items-center justify-center font-bold text-xs shadow-xs`}>
                    {acc.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1b1b1f] group-hover:text-[#00236f]">
                        {acc.name}
                      </span>
                      {acc.badge === 'Current User' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#00236f] text-white">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#444746] block truncate">
                      {acc.email}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-[#c4c7c5] text-[#444746]">
                    {acc.role.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#74777f] group-hover:text-[#00236f] ml-1.5 inline-block align-middle">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Security & Access Notice */}
          <div className="pt-2 border-t border-[#e0e2ec] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#444746]">
              <span className="material-symbols-outlined text-sm text-[#00236f]">shield</span>
              <span>Firebase Auth & Firestore 256-bit SSL Protected</span>
            </div>
            <p className="text-[10px] text-[#74777f]">
              Session will be securely maintained. All audit trails capture verified user identifiers.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#74777f] border-t border-[#c4c7c5] bg-white">
        © 2026 Centralized Training Approvals Platform • Governance & Secretariat Unit
      </footer>
    </div>
  );
}
