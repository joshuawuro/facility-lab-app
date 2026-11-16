import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff, Activity, Sparkles, CheckCircle2 } from './Icons';
import { UserAccount, FacilitySettings } from '../types';

interface LoginPortalProps {
  users: UserAccount[];
  facilitySettings: FacilitySettings;
  onLogin: (user: UserAccount) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  users,
  facilitySettings,
  onLogin,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );

    if (!foundUser) {
      setError('User account not found. Please verify your username.');
      return;
    }

    if (foundUser.password && foundUser.password !== password) {
      setError('Incorrect password. Default password is "password"');
      return;
    }

    onLogin(foundUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-teal-50/60 via-slate-100 to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 font-sans transition-colors">
      {/* Main Split Container Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.25rem] sm:rounded-[2.75rem] shadow-2xl border border-teal-100/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] transition-all">
        
        {/* LEFT COLUMN: Clinical Healthcare Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-gradient-to-b from-teal-50/30 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90">
          <div>
            {/* Top Logo / Brand Pill with Perfect Circle Logo */}
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-teal-200/80 dark:border-slate-700 bg-white dark:bg-slate-850 shadow-2xs">
                {facilitySettings.logoUrl ? (
                  <div className="w-6 h-6 aspect-square rounded-full overflow-hidden border border-teal-500/40 bg-white p-0.5 flex items-center justify-center shrink-0">
                    <img
                      src={facilitySettings.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain aspect-square rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 aspect-square rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                  {facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC'}
                </span>
              </div>


            </div>

            {/* Heading & Subtitle */}
            <div className="mb-7 sm:mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 mb-2">
                Laboratory Information System
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                Sign in to account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Enter your credentials to access laboratory test entries, reports & auditing
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button (Clinical Medical Teal Palette) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-teal-700/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Sign In to Laboratory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Bottom Footer Note */}
          <div className="pt-8 sm:pt-6 text-center lg:text-left flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 mt-6">
            <span>{facilitySettings.address || 'Madina Estate, Accra'}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{facilitySettings.telephone || '053 197 6621'}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Hero Image Card with Healthcare Badges */}
        <div className="lg:col-span-6 p-3 sm:p-4 lg:p-5 flex">
          <div className="relative w-full h-full min-h-[380px] lg:min-h-full rounded-[2rem] sm:rounded-[2.25rem] overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-slate-900 shadow-inner">
            
            {/* Background Medical Laboratory Image */}
            <img
              src="/login-bg.jpg"
              alt="Medical Laboratory"
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-105"
            />
            {/* Clinical Teal-Slate Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-teal-950/30 to-slate-950/50" />

            {/* TOP ROW: Floating Medical Badge & Theme Switcher Button */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Floating Healthcare Badge */}
              <div className="bg-teal-700/90 hover:bg-teal-700 backdrop-blur-md text-white border border-teal-400/40 px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 font-bold text-xs transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                <div>
                  <div className="text-[11px] font-extrabold uppercase leading-tight tracking-tight">
                    {facilitySettings.serviceTitle || 'LABORATORY SERVICE'}
                  </div>
                  <div className="text-[9px] font-medium text-teal-200">
                    Clinical Auto-Flagging Active
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg text-xs font-black">
                #Lab
              </div>
            </div>

            {/* BOTTOM ROW: Floating Translucent Info Cards */}
            <div className="relative z-10 space-y-3 pt-12">
              {/* Middle Floating Test Profiles Strip */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 text-white shadow-xl">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-teal-300 mb-1.5">
                  <span>Diagnostic Panels</span>
                  <span className="text-[10px] text-white/70">A4 Print-Ready</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="bg-slate-950/40 rounded-xl py-1.5 px-1 border border-white/10 text-teal-100">FBC</div>
                  <div className="bg-slate-950/40 rounded-xl py-1.5 px-1 border border-white/10 text-teal-100">Renal</div>
                  <div className="bg-slate-950/40 rounded-xl py-1.5 px-1 border border-white/10 text-teal-100">Hormonal</div>
                  <div className="bg-slate-950/40 rounded-xl py-1.5 px-1 border border-white/10 text-teal-100">Urine</div>
                </div>
              </div>

              {/* Bottom Floating Scientist Avatar Stack Card */}
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-white/40 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Clinical Lab Personnel
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Licensed Laboratory Scientists
                  </p>
                </div>

                {/* Avatar Circles */}
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-teal-700 border-2 border-white dark:border-slate-800 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    D
                  </div>
                  <div className="w-7 h-7 rounded-full bg-cyan-700 border-2 border-white dark:border-slate-800 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    H
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-800 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
