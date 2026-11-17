import React from 'react';
import { Activity, ArrowLeft, Shield, AlertTriangle } from './Icons';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-teal-50/60 via-slate-100 to-cyan-50/40 font-sans">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-teal-100/80 p-8 sm:p-12 text-center space-y-6">
        
        {/* Top Clinical Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-teal-200 bg-teal-50/60 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
          <span>Care & Social Polyclinic LIS</span>
        </div>

        {/* 404 Illustration / Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-500 shadow-inner">
          <AlertTriangle className="w-12 h-12" />
        </div>

        {/* Heading & Information */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            404
          </h1>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
            Resource or Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            The clinical route, patient record path, or laboratory resource you requested does not exist or has been relocated.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onReturnHome}
            className="w-full py-3.5 px-6 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm shadow-md shadow-teal-700/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Laboratory Portal</span>
          </button>
        </div>

        {/* Footer Clinic Tagline */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Secure Clinical Laboratory Diagnostic System</span>
        </div>

      </div>
    </div>
  );
};
