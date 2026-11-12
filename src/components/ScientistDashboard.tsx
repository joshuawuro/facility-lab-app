import React, { useMemo } from 'react';
import {
  FileText,
  User,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ArrowRight,
  AlertTriangle,
} from './Icons';
import { SavedReport, UserAccount } from '../types';

interface ScientistDashboardProps {
  reports: SavedReport[];
  currentUser: UserAccount;
  onNewPatient: () => void;
  onViewReport: (report: SavedReport) => void;
  onResumeReport: (report: SavedReport) => void;
}

// Helper: strip time, compare dates as YYYY-MM-DD strings
const toDateStr = (iso: string): string => (iso ? iso.split('T')[0] : '');

const StatCard: React.FC<{
  label: string;
  value: number;
  iconBg: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}> = ({ label, value, iconBg, icon, badge, badgeColor = 'text-emerald-700 bg-emerald-50 border border-emerald-200' }) => (
  <div className="card-hover bg-white rounded-3xl px-5 py-5 flex items-center gap-4 shadow-sm border border-slate-200/90 flex-1 min-w-0 transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-end gap-2 flex-wrap">
        <span className="text-3xl font-black text-slate-900 leading-none">{value}</span>
        {badge && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-0.5 ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 font-bold mt-1 truncate">{label}</p>
    </div>
  </div>
);

export const ScientistDashboard: React.FC<ScientistDashboardProps> = ({
  reports,
  currentUser,
  onNewPatient,
  onViewReport,
  onResumeReport,
}) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Partition reports into Pending vs Completed
  const pendingReports = useMemo(
    () =>
      reports
        .filter((r) => r.status === 'pending')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()),
    [reports]
  );

  const completedReports = useMemo(
    () =>
      reports
        .filter((r) => r.status !== 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reports]
  );

  const todayCount = useMemo(
    () => reports.filter((r) => toDateStr(r.createdAt) === todayStr).length,
    [reports, todayStr]
  );

  const totalPatients = reports.length;

  // Last 5 completed reports sorted by newest
  const recentCompletedFive = useMemo(
    () => completedReports.slice(0, 5),
    [completedReports]
  );

  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatRelativeTime = (iso: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Welcome back, {currentUser.displayName} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {currentUser.title} · Care &amp; Social Polyclinic Laboratory
          </p>
        </div>
        <button
          onClick={onNewPatient}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-extrabold rounded-full shadow-sm shadow-teal-700/20 transition-all cursor-pointer hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Intake</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Intakes"
          value={todayCount}
          iconBg="bg-teal-100 text-teal-700"
          icon={<FileText className="w-6 h-6" />}
          badge="Today"
          badgeColor="text-teal-700 bg-teal-50 border border-teal-200"
        />
        <StatCard
          label="Pending Lab Workups"
          value={pendingReports.length}
          iconBg="bg-amber-100 text-amber-700"
          icon={<Clock className="w-6 h-6" />}
          badge={pendingReports.length > 0 ? `${pendingReports.length} awaiting results` : 'Up to date'}
          badgeColor={
            pendingReports.length > 0
              ? 'text-amber-800 bg-amber-50 border border-amber-300 font-black animate-pulse'
              : 'text-slate-600 bg-slate-100 border border-slate-200'
          }
        />
        <StatCard
          label="Completed Reports"
          value={completedReports.length}
          iconBg="bg-emerald-100 text-emerald-700"
          icon={<CheckCircle2 className="w-6 h-6" />}
          badge="Finalized"
          badgeColor="text-emerald-700 bg-emerald-50 border border-emerald-200"
        />
        <StatCard
          label="Total Patients"
          value={totalPatients}
          iconBg="bg-blue-100 text-blue-700"
          icon={<User className="w-6 h-6" />}
          badge="All time"
          badgeColor="text-blue-700 bg-blue-50 border border-blue-200"
        />
      </div>

      {/* ========================================================================= */}
      {/* FEATURED: PENDING LAB WORKUPS (AWAITING RESULTS)                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-amber-200/90 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Pending Lab Workups
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {pendingReports.length} In Progress
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patients admitted with pending tests. Click &ldquo;Resume Workup&rdquo; whenever analyzer or culture results are ready.
              </p>
            </div>
          </div>

          <button
            onClick={onNewPatient}
            className="text-xs font-extrabold text-amber-900 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 px-3.5 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit Another Patient</span>
          </button>
        </div>

        {/* Pending Content */}
        {pendingReports.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">
              All Laboratory Workups Completed!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              There are currently no pending laboratory tests in the queue. When you admit a patient and proceed to select tests, they will safely appear here until final results are entered and saved.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-amber-100/80">
            {pendingReports.map((report) => {
              const testCount = report.selectedTests?.length || 0;
              const testNames = report.selectedTests?.map((st) => st.testId.toUpperCase()).join(', ') || 'No tests selected yet';
              const isDorean = (report.performedByName || report.performedBy)?.toLowerCase().includes('dorean');
              const isHawa = (report.performedByName || report.performedBy)?.toLowerCase().includes('hawa');
              const relativeTime = formatRelativeTime(report.updatedAt || report.createdAt);

              // Extract specimen badges
              const specimenBadges = report.patient?.sampleTypes && report.patient.sampleTypes.length > 0
                ? report.patient.sampleTypes
                : [report.patient?.sampleType || 'Blood'];

              return (
                <div
                  key={report.id}
                  className="p-5 hover:bg-amber-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Patient Demographics & Sample Details */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 font-black text-base flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
                      {report.patient?.name ? report.patient.name.charAt(0).toUpperCase() : 'P'}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {report.patient?.name || 'Unnamed Patient'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            report.patient?.sex === 'Female'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {report.patient?.sex}, {report.patient?.age || 'N/A'} yrs
                        </span>

                        {/* Scientist who admitted patient */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                            isDorean
                              ? 'bg-teal-50 text-teal-800 border-teal-300'
                              : isHawa
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <User className="w-3 h-3" />
                          <span>Admitted by {report.performedByName || report.performedBy || 'Scientist'}</span>
                        </span>
                      </div>

                      {/* Meta badges: Sample ID, Sample Type, Requested By */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          ID: {report.patient?.sampleId || '-'}
                        </span>

                        {specimenBadges.map((stype) => (
                          <span
                            key={stype}
                            className="font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px]"
                          >
                            {stype}
                          </span>
                        ))}

                        {report.patient?.requestedBy && (
                          <span className="text-[11px] text-slate-500">
                            Req: <strong className="text-slate-700">{report.patient.requestedBy}</strong>
                          </span>
                        )}

                        <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{relativeTime}</span>
                        </span>
                      </div>

                      {/* Test names */}
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="font-bold text-slate-700">Awaiting Tests ({testCount}):</span>
                        <span className="font-medium text-slate-900 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {testNames}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Resume Workup CTA Button */}
                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => onResumeReport(report)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                      title="Resume entering laboratory results for this patient"
                    >
                      <span>Resume Workup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RECENT COMPLETED REPORTS ACTIVITY                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Recent Completed Reports</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 5 finalized patient records</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {completedReports.length} completed
          </span>
        </div>

        {recentCompletedFive.length === 0 ? (
          <div className="py-14 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-bold">No completed reports yet</p>
            <p className="text-xs text-slate-400 mt-1">Finalized patient reports will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-4 py-3.5 hidden sm:table-cell">Diagnostic Test(s)</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Date</th>
                  <th className="px-4 py-3.5 hidden lg:table-cell">Scientist</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCompletedFive.map((report) => {
                  const testNames = report.selectedTests
                    .map((st) => st.testId.toUpperCase())
                    .slice(0, 2)
                    .join(', ');
                  const extra =
                    report.selectedTests.length > 2
                      ? ` +${report.selectedTests.length - 2}`
                      : '';
                  const isDorean = (report.performedByName || report.performedBy)?.toLowerCase().includes('dorean');
                  const isHawa = (report.performedByName || report.performedBy)?.toLowerCase().includes('hawa');

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xs shrink-0">
                            {report.patient.name ? report.patient.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm leading-tight">
                              {report.patient.name || 'Unnamed'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {report.patient.sex} · {report.patient.age}
                              {report.patient.ageUnit ? ` ${report.patient.ageUnit}` : ' yrs'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-slate-600 text-xs font-medium">
                          {testNames}
                          {extra && (
                            <span className="ml-1 text-slate-400">{extra}</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500 font-mono">
                          {formatDate(report.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isDorean
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : isHawa
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {report.performedByName || report.performedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => onViewReport(report)}
                          className="px-3 py-1 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer border border-slate-200 hover:border-teal-200"
                          title="View and print report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
