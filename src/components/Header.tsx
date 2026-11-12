import React from 'react';
import {
  Activity,
  Clock,
  Settings,
  FileText,
  PlusCircle,
  CheckCircle2,
  User,
  Shield,
  LogOut,
  BarChart3,
} from './Icons';
import { FacilitySettings, UserAccount } from '../types';

interface HeaderProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeTab: 'dashboard' | 'report' | 'recent' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'report' | 'recent' | 'settings') => void;
  facilitySettings: FacilitySettings;
  recentCount: number;
  currentUser: UserAccount;
  onOpenSwitchUser: () => void;
  onNewPatient: () => void;
  canNavigateToStep: (step: number) => boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  setCurrentStep,
  activeTab,
  setActiveTab,
  facilitySettings,
  recentCount,
  currentUser,
  onOpenSwitchUser,
  onNewPatient,
  canNavigateToStep,
}) => {
  const steps = [
    { number: 1, label: 'Patient Details' },
    { number: 2, label: 'Select Tests' },
    { number: 3, label: 'Enter Results' },
    { number: 4, label: 'Preview & Print' },
  ];

  const isAdmin = currentUser.role === 'admin';
  const isScientist = currentUser.role === 'scientist';

  type NavTab = 'dashboard' | 'report' | 'recent' | 'settings';

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; count?: number; scientistOnly?: boolean }[] = [
    ...(isScientist
      ? [
          {
            id: 'dashboard' as NavTab,
            label: 'Dashboard',
            icon: <BarChart3 className="w-3.5 h-3.5" />,
            scientistOnly: true,
          },
        ]
      : []),
    {
      id: 'report',
      label: 'Active Report',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'recent',
      label: 'Recent Reports',
      icon: <Clock className="w-3.5 h-3.5" />,
      count: recentCount,
    },
    ...(isAdmin
      ? [
          {
            id: 'settings' as NavTab,
            label: 'Settings',
            icon: <Settings className="w-3.5 h-3.5" />,
          },
        ]
      : []),
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 shadow-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Brand ── */}
          <div className="flex items-center space-x-3 shrink-0">
            {facilitySettings.logoUrl ? (
              <div className="w-9 h-9 aspect-square rounded-full overflow-hidden border-2 border-teal-600/40 dark:border-teal-400/30 bg-white dark:bg-slate-800 p-0.5 flex items-center justify-center shadow-xs shrink-0">
                <img
                  src={facilitySettings.logoUrl}
                  alt="Clinic Logo"
                  className="w-full h-full object-contain aspect-square rounded-full"
                />
              </div>
            ) : (
              <div className="w-9 h-9 aspect-square rounded-full bg-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <Activity className="h-5 w-5" />
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-[11px] leading-tight tracking-tight uppercase">
                {facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC'}
              </h1>
              <p className="text-[9px] text-teal-700 dark:text-teal-400 font-extrabold tracking-widest uppercase mt-0.5">
                {facilitySettings.serviceTitle || 'LABORATORY SERVICE'}
              </p>
            </div>
          </div>

          {/* ── Tab Navigation (center) ── */}
          <nav className="flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0 rounded-full font-extrabold leading-5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right-side actions ── */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* New Patient CTA */}
            <button
              onClick={onNewPatient}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm shadow-teal-700/20 cursor-pointer"
              title="Start a new patient lab report"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-200" />
              <span className="hidden md:inline">New Patient</span>
            </button>


            {/* User Avatar Chip */}
            <button
              onClick={onOpenSwitchUser}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
              title={`Signed in as ${currentUser.displayName}. Click to sign out.`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                  isAdmin ? 'bg-slate-900 dark:bg-slate-600' : 'bg-teal-700'
                }`}
              >
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold leading-none text-slate-900 dark:text-slate-100">
                  {currentUser.displayName}
                </div>
                <div className="text-[9px] font-medium text-slate-400 uppercase mt-0.5">
                  {isAdmin ? 'Admin' : 'Scientist'}
                </div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 ml-0.5" />
            </button>
          </div>
        </div>

        {/* ── Step Progression Bar (only on report tab) ── */}
        {activeTab === 'report' && (
          <div className="py-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between max-w-3xl mx-auto px-2">
              {steps.map((s, idx) => {
                const isActive = currentStep === s.number;
                const isPassed = currentStep > s.number;
                const isAccessible = canNavigateToStep(s.number);

                return (
                  <React.Fragment key={s.number}>
                    <button
                      onClick={() => isAccessible && setCurrentStep(s.number)}
                      disabled={!isAccessible}
                      className={`flex items-center space-x-2 py-1 px-3 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500/50 shadow-2xs'
                          : isPassed
                          ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                          : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isActive
                            ? 'bg-teal-700 text-white shadow-xs'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.number}
                      </div>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>

                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 mx-2 sm:mx-3 h-0.5 rounded-full transition-colors ${
                          currentStep > s.number ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
