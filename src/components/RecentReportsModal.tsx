import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  FileText,
  Copy,
  Trash2,
  Calendar,
  User,
  ArrowRight,
  X,
  FileCheck,
  Filter,
  Shield,
  BarChart3,
  Users,
  Download,
} from './Icons';
import { SavedReport, UserAccount, LabTest } from '../types';
import { useToast } from '../context/ToastContext';

interface RecentReportsModalProps {
  reports: SavedReport[];
  currentUser: UserAccount;
  catalog: LabTest[];
  onOpenReport: (report: SavedReport) => void;
  onResumeReport?: (report: SavedReport) => void;
  onDuplicateReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
  onClose: () => void;
}

export const RecentReportsModal: React.FC<RecentReportsModalProps> = ({
  reports,
  currentUser,
  catalog,
  onOpenReport,
  onResumeReport,
  onDuplicateReport,
  onDeleteReport,
  onClose,
}) => {
  const { askConfirm, showSuccess } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScientist, setSelectedScientist] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [selectedTestType, setSelectedTestType] = useState<string>('All');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const isAdmin = currentUser.role === 'admin';

  // Distinct list of scientists who performed tests
  const scientistList = useMemo(() => {
    const set = new Set<string>(['Dorean', 'Hawa', 'Admin']);
    reports.forEach((r) => {
      if (r.performedByName) set.add(r.performedByName);
      else if (r.performedBy) set.add(r.performedBy);
    });
    return ['All', ...Array.from(set)];
  }, [reports]);

  // Date filtering logic
  const isDateMatching = (reportIsoDate: string): boolean => {
    if (selectedDateFilter === 'all') return true;

    const reportDate = new Date(reportIsoDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (selectedDateFilter === 'today') {
      return reportDate >= today;
    }

    if (selectedDateFilter === 'yesterday') {
      const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
      const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
      return reportDate >= startOfYesterday && reportDate <= endOfYesterday;
    }

    if (selectedDateFilter === 'this_week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return reportDate >= oneWeekAgo;
    }

    if (selectedDateFilter === 'this_month') {
      return (
        reportDate.getFullYear() === now.getFullYear() &&
        reportDate.getMonth() === now.getMonth()
      );
    }

    if (selectedDateFilter === 'last_month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        reportDate.getFullYear() === lastMonth.getFullYear() &&
        reportDate.getMonth() === lastMonth.getMonth()
      );
    }

    if (selectedDateFilter === 'custom') {
      if (customStartDate && reportIsoDate < customStartDate) return false;
      if (customEndDate && reportIsoDate > customEndDate + 'T23:59:59') return false;
      return true;
    }

    return true;
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // 1. Search Query
      const q = searchTerm.toLowerCase();
      const patientName = r.patient?.name?.toLowerCase() || '';
      const sampleId = r.patient?.sampleId?.toLowerCase() || '';
      const receiptNo = r.patient?.receiptNumber?.toLowerCase() || '';
      const requestedBy = r.patient?.requestedBy?.toLowerCase() || '';
      const matchesSearch =
        patientName.includes(q) ||
        sampleId.includes(q) ||
        receiptNo.includes(q) ||
        requestedBy.includes(q);

      if (!matchesSearch) return false;

      // 2. Scientist Filter
      if (selectedScientist !== 'All') {
        const perfName = r.performedByName || r.performedBy || 'Dorean';
        if (perfName.toLowerCase() !== selectedScientist.toLowerCase()) {
          return false;
        }
      }

      // 3. Date / Month / Day Filter
      const reportDate = r.createdAt || r.patient?.resultsDate || '';
      if (!isDateMatching(reportDate)) {
        return false;
      }

      // 4. Test Type Filter
      if (selectedTestType !== 'All') {
        const hasTest = r.selectedTests.some(
          (st) => st.testId.toLowerCase() === selectedTestType.toLowerCase()
        );
        if (!hasTest) return false;
      }

      return true;
    });
  }, [
    reports,
    searchTerm,
    selectedScientist,
    selectedDateFilter,
    selectedTestType,
    customStartDate,
    customEndDate,
  ]);

  // Analytics Stats for Admin
  const stats = useMemo(() => {
    let doreanCount = 0;
    let hawaCount = 0;
    let adminCount = 0;
    const testCounts: Record<string, number> = {};

    filteredReports.forEach((r) => {
      const name = (r.performedByName || r.performedBy || 'Dorean').toLowerCase();
      if (name.includes('dorean')) doreanCount++;
      else if (name.includes('hawa')) hawaCount++;
      else adminCount++;

      r.selectedTests.forEach((st) => {
        testCounts[st.testId] = (testCounts[st.testId] || 0) + 1;
      });
    });

    return {
      total: filteredReports.length,
      doreanCount,
      hawaCount,
      adminCount,
      testCounts,
    };
  }, [filteredReports]);

  // Export filtered report log to CSV for admin records
  const handleExportCSV = () => {
    const headers = [
      'Report ID',
      'Date Created',
      'Patient Name',
      'Sex',
      'Age',
      'Sample ID',
      'Sample Type',
      'Receipt Number',
      'Requested By',
      'Lab Scientist',
      'Tests Performed',
    ];

    const rows = filteredReports.map((r) => [
      `"${r.id}"`,
      `"${r.createdAt || ''}"`,
      `"${r.patient?.name || ''}"`,
      `"${r.patient?.sex || ''}"`,
      `"${r.patient?.age || ''}"`,
      `"${r.patient?.sampleId || ''}"`,
      `"${r.patient?.sampleType || ''}"`,
      `"${r.patient?.receiptNumber || ''}"`,
      `"${r.patient?.requestedBy || ''}"`,
      `"${r.performedByName || r.performedBy || 'Dorean'}"`,
      `"${r.selectedTests?.map((st) => st.testId.toUpperCase()).join('; ') || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `care_lab_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedScientist('All');
    setSelectedDateFilter('all');
    setSelectedTestType('All');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2.25rem] shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 mb-1.5">
            <Clock className="w-5 h-5 text-teal-600" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">Saved Records & Auditing</span>
            {isAdmin && (
              <span className="bg-teal-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                Admin Audit Mode
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            {isAdmin ? 'Laboratory Results & Scientist Auditing' : 'Recent Patient Reports'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
            Search and filter past reports by scientist, time period, and test category.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {filteredReports.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Export filtered records to spreadsheet CSV"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Active Report</span>
          </button>
        </div>
      </div>

      {/* Admin Performance & Filter Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Reports</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">Matching current filters</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-600" /> Dorean
          </div>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-1">{stats.doreanCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.total > 0 ? `${Math.round((stats.doreanCount / stats.total) * 100)}% of workload` : '0%'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Hawa
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats.hawaCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.total > 0 ? `${Math.round((stats.hawaCount / stats.total) * 100)}% of workload` : '0%'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-300" /> Admin
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.adminCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct entries</div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Filter Archive Results</span>
          </div>

          {(searchTerm || selectedScientist !== 'All' || selectedDateFilter !== 'all' || selectedTestType !== 'All') && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filter Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Filter by Scientist */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Filter by Scientist
            </label>
            <select
              value={selectedScientist}
              onChange={(e) => setSelectedScientist(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-600"
            >
              {scientistList.map((sc) => (
                <option key={sc} value={sc}>
                  {sc === 'All' ? 'All Scientists (Dorean, Hawa, Admin)' : sc}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter by Date / Month / Days */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Filter by Date / Period
            </label>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Time</option>
              <option value="today">Today Only</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">Past 7 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Date Range...</option>
            </select>
          </div>

          {/* 3. Filter by Test Type */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Type of Results / Test
            </label>
            <select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-600"
            >
              <option value="All">All Tests / Panels</option>
              {catalog.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Text Search */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-400" /> Search Patient / ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, Sample ID, Receipt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-7 pl-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Custom Date Pickers (if "custom" selected) */}
        {selectedDateFilter === 'custom' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Custom Date Span:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center transition-colors">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-slate-700 dark:text-slate-300 font-bold text-sm">No laboratory reports match the criteria</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {reports.length === 0
                ? 'Save your first lab report from Step 4 to start recording history.'
                : 'Try adjusting the scientist, test type, or date range filters above.'}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const dateStr = new Date(report.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const performedBy = report.performedByName || report.performedBy || 'Dorean';
            const isDorean = performedBy.toLowerCase().includes('dorean');
            const isHawa = performedBy.toLowerCase().includes('hawa');

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {report.patient?.name || 'Unnamed Patient'}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        report.patient?.sex === 'Female'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                      }`}
                    >
                      {report.patient?.sex}, {report.patient?.age ? `${report.patient.age} yrs` : 'Age N/A'}
                    </span>

                    {/* Status Pill: Pending vs Completed */}
                    {report.status === 'pending' ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Results</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    )}

                    {/* Performed by Scientist Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isDorean
                          ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
                          : isHawa
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <User className="w-3 h-3" />
                      <span>Recorded by {performedBy}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Sample ID: </span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">{report.patient?.sampleId || '-'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Receipt: </span>
                      <span className="font-mono">{report.patient?.receiptNumber || '-'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Type: </span>
                      <span>{report.patient?.sampleType || 'Blood'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">Recorded: </span>
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Tests ({report.selectedTests?.length || 0}): </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {report.selectedTests?.map((st) => st.testId.toUpperCase()).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {report.status === 'pending' && onResumeReport ? (
                    <button
                      onClick={() => onResumeReport(report)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                      title="Resume entering results"
                    >
                      <span>Resume Workup ➔</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => onOpenReport(report)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs"
                    title="Open this report in preview & print"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Open & Print</span>
                  </button>

                  <button
                    onClick={() => onDuplicateReport(report)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Duplicate as new patient"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Duplicate</span>
                  </button>

                  <button
                    onClick={async () => {
                      const confirmed = await askConfirm({
                        title: 'Delete Lab Report',
                        message: `Are you sure you want to delete the report for ${report.patient?.name || 'this patient'}? This action cannot be undone.`,
                        confirmText: 'Delete Report',
                        isDestructive: true,
                      });
                      if (confirmed) {
                        onDeleteReport(report.id);
                        showSuccess('Report deleted successfully.');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
