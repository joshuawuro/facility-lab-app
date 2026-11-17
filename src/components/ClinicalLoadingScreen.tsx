import React, { useState, useEffect } from 'react';
import { Activity, Shield, RotateCcw } from './Icons';

interface ClinicalLoadingScreenProps {
  message?: string;
  onRetry?: () => void;
  onBypass?: () => void;
}

export const ClinicalLoadingScreen: React.FC<ClinicalLoadingScreenProps> = ({
  message = 'Connecting to Care & Social Polyclinic LIS...',
  onRetry,
  onBypass,
}) => {
  const [showDelayedWarning, setShowDelayedWarning] = useState(false);

  useEffect(() => {
    // If loading takes more than 4 seconds, show delayed network guidance
    const timer = setTimeout(() => {
      setShowDelayedWarning(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-teal-50/70 via-slate-50 to-cyan-50/50 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-teal-100 p-8 sm:p-10 text-center space-y-6">
        
        {/* Animated Clinical Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/30">
            <Activity className="w-8 h-8 animate-pulse text-teal-100" />
          </div>
        </div>

        {/* Brand & Loading Status */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase tracking-widest border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Care & Social Polyclinic</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {message}
          </h2>

          <p className="text-xs text-slate-500 font-medium">
            Synchronizing diagnostic test catalog, reference ranges & active workups
          </p>
        </div>

        {/* Progress bar animation */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-teal-600 h-1.5 rounded-full animate-indeterminate" style={{
            width: '60%',
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
        </div>

        {/* Slow network guidance if delayed */}
        {showDelayedWarning && (
          <div className="pt-2 space-y-3 animate-fade-in">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 font-medium leading-relaxed">
              Connection is taking longer than usual. The system will continue trying or you may retry.
            </div>

            <div className="flex items-center justify-center space-x-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              )}

              {onBypass && (
                <button
                  type="button"
                  onClick={onBypass}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer"
                >
                  <span>Continue to Workspace</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[10px] font-semibold text-slate-400">
          <Shield className="w-3 h-3 text-teal-600" />
          <span>Accra, Ghana • Laboratory Information System</span>
        </div>

      </div>
    </div>
  );
};
