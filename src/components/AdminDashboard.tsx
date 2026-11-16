import React, { useState, useMemo } from 'react';
import {
  Shield,
  BarChart3,
  Calendar,
  User,
  Filter,
  Search,
  Download,
  FileCheck,
  FileText,
  Clock,
  CheckCircle2,
  LogOut,
  Sun,
  Moon,
  Activity,
  X,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Building,
  Users,
  Key,
  Check,
  Upload,
  UploadCloud,
  Sparkles,
  Bell,
  TrendingUp,
  TrendingDown,
  Eye,
} from './Icons';
import { SavedReport, UserAccount, LabTest, FacilitySettings, TestParameter } from '../types';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import { getDailyRevenueCents, getTotalGrossRevenueCents, formatCentsGHC, getTestPriceCents, getReportRevenueCents } from '../utils/revenue';
import { RevenueCard } from './RevenueCard';

// Color Coding Palette for Laboratory Scientists
export interface ScientistColorTheme {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  avatarBg: string;
  avatarText: string;
  hex: string;
  dotBg: string;
  ringColor: string;
  softBg: string;
}

export const SCIENTIST_PALETTES: ScientistColorTheme[] = [
  {
    name: 'Teal',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-800',
    avatarBg: 'bg-teal-600',
    avatarText: 'text-white',
    hex: '#0d9488',
    dotBg: 'bg-teal-500',
    ringColor: 'ring-teal-500/30',
    softBg: 'bg-teal-500/10',
  },
  {
    name: 'Purple',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    avatarBg: 'bg-purple-600',
    avatarText: 'text-white',
    hex: '#9333ea',
    dotBg: 'bg-purple-500',
    ringColor: 'ring-purple-500/30',
    softBg: 'bg-purple-500/10',
  },
  {
    name: 'Sky Blue',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    avatarBg: 'bg-sky-500',
    avatarText: 'text-white',
    hex: '#0284c7',
    dotBg: 'bg-sky-500',
    ringColor: 'ring-sky-500/30',
    softBg: 'bg-sky-500/10',
  },
  {
    name: 'Rose',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    avatarBg: 'bg-rose-500',
    avatarText: 'text-white',
    hex: '#e11d48',
    dotBg: 'bg-rose-500',
    ringColor: 'ring-rose-500/30',
    softBg: 'bg-rose-500/10',
  },
  {
    name: 'Amber',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    avatarBg: 'bg-amber-500',
    avatarText: 'text-white',
    hex: '#d97706',
    dotBg: 'bg-amber-500',
    ringColor: 'ring-amber-500/30',
    softBg: 'bg-amber-500/10',
  },
  {
    name: 'Emerald',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    avatarBg: 'bg-emerald-600',
    avatarText: 'text-white',
    hex: '#059669',
    dotBg: 'bg-emerald-500',
    ringColor: 'ring-emerald-500/30',
    softBg: 'bg-emerald-500/10',
  },
  {
    name: 'Indigo',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    avatarBg: 'bg-indigo-600',
    avatarText: 'text-white',
    hex: '#4f46e5',
    dotBg: 'bg-indigo-500',
    ringColor: 'ring-indigo-500/30',
    softBg: 'bg-indigo-500/10',
  },
];

export const getScientistTheme = (scientistName: string, scientistList: UserAccount[]): ScientistColorTheme => {
  const clean = (scientistName || '').trim().toLowerCase();
  const index = scientistList.findIndex(
    (s) => s.displayName.toLowerCase() === clean || s.username.toLowerCase() === clean
  );
  if (index >= 0) {
    return SCIENTIST_PALETTES[index % SCIENTIST_PALETTES.length];
  }
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
  }
  return SCIENTIST_PALETTES[Math.abs(hash) % SCIENTIST_PALETTES.length];
};

interface AdminDashboardProps {
  currentUser: UserAccount;
  reports: SavedReport[];
  catalog: LabTest[];
  onSaveCatalog: (catalog: LabTest[]) => void;
  onResetCatalog: () => void;
  users: UserAccount[];
  onSaveUsers: (users: UserAccount[]) => void;
  facilitySettings: FacilitySettings;
  onSaveFacilitySettings: (settings: FacilitySettings) => void;
  onLogout: () => void;
  onViewReport: (report: SavedReport) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  reports,
  catalog,
  onSaveCatalog,
  onResetCatalog,
  users,
  onSaveUsers,
  facilitySettings,
  onSaveFacilitySettings,
  onLogout,
  onViewReport,
}) => {
  const { showSuccess, showError, showWarning, askConfirm } = useToast();
  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'catalog' | 'scientists' | 'facility' | 'backup'>('stats');

  // Statistics Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScientist, setSelectedScientist] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [selectedTestType, setSelectedTestType] = useState<string>('All');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Interactive Chart States
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m' | '1y'>('6m');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'revenue' | 'volume'>('revenue');
  const [donutMetric, setDonutMetric] = useState<'revenue' | 'volume'>('revenue');
  const [hoveredScientist, setHoveredScientist] = useState<string | null>(null);
  const [showTotalSeries, setShowTotalSeries] = useState<boolean>(true);
  const [activeScientistSeries, setActiveScientistSeries] = useState<string[]>(['all']);

  // Local Catalog State for editing
  const [localCatalog, setLocalCatalog] = useState<LabTest[]>([...catalog]);
  const [selectedCatalogTestId, setSelectedCatalogTestId] = useState<string>(catalog[0]?.id || 'fbc');
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showAddParamModal, setShowAddParamModal] = useState(false);
  const [catalogSavedAlert, setCatalogSavedAlert] = useState(false);

  // New Test Modal State
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Clinical Chemistry');
  const [newTestPrice, setNewTestPrice] = useState('80.00');
  const [newTestParams, setNewTestParams] = useState<Array<{ name: string; unit: string; refRange: string; min?: string; max?: string }>>([
    { name: '', unit: '', refRange: '', min: '', max: '' },
  ]);

  // New Parameter to Existing Test State
  const [newParamName, setNewParamName] = useState('');
  const [newParamUnit, setNewParamUnit] = useState('');
  const [newParamRefText, setNewParamRefText] = useState('');
  const [newParamMin, setNewParamMin] = useState('');
  const [newParamMax, setNewParamMax] = useState('');
  const [newParamIsSexSpecific, setNewParamIsSexSpecific] = useState(false);
  const [newParamMaleMin, setNewParamMaleMin] = useState('');
  const [newParamMaleMax, setNewParamMaleMax] = useState('');
  const [newParamFemaleMin, setNewParamFemaleMin] = useState('');
  const [newParamFemaleMax, setNewParamFemaleMax] = useState('');

  // Scientists Management State
  const [localUsers, setLocalUsers] = useState<UserAccount[]>([...users]);
  const [showAddScientistModal, setShowAddScientistModal] = useState(false);
  const [newScientistUsername, setNewScientistUsername] = useState('');
  const [newScientistName, setNewScientistName] = useState('');
  const [newScientistPassword, setNewScientistPassword] = useState('password');
  const [newScientistTitle, setNewScientistTitle] = useState('Medical Laboratory Scientist');
  const [userSavedAlert, setUserSavedAlert] = useState(false);

  // Facility Settings State
  const [localFacility, setLocalFacility] = useState<FacilitySettings>({ ...facilitySettings });
  const [facilitySavedAlert, setFacilitySavedAlert] = useState(false);

  // Active scientists (excluding admin)
  const scientistUsers = useMemo(() => {
    return localUsers.filter((u) => u.role === 'scientist');
  }, [localUsers]);

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

  // Filtered reports for auditing
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
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

      if (selectedScientist !== 'All') {
        const perfName = (r.performedByName || r.performedBy || '').toLowerCase();
        if (!perfName.includes(selectedScientist.toLowerCase())) {
          return false;
        }
      }

      const reportDate = r.createdAt || r.patient?.resultsDate || '';
      if (!isDateMatching(reportDate)) {
        return false;
      }

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

  // Statistics calculation per scientist and financial revenue
  const stats = useMemo(() => {
    const scientistCounts: Record<string, number> = {};
    const scientistRevenues: Record<string, number> = {};
    const testCounts: Record<string, number> = {};
    const testRevenues: Record<string, number> = {};
    let periodRevenueCents = 0;

    scientistUsers.forEach((sc) => {
      scientistCounts[sc.displayName.toLowerCase()] = 0;
      scientistRevenues[sc.displayName.toLowerCase()] = 0;
    });

    filteredReports.forEach((r) => {
      const perfName = (r.performedByName || r.performedBy || 'Unknown').toLowerCase();
      let matchedKey = 'other';
      for (const sc of scientistUsers) {
        if (perfName.includes(sc.displayName.toLowerCase()) || perfName.includes(sc.username.toLowerCase())) {
          matchedKey = sc.displayName.toLowerCase();
          break;
        }
      }
      scientistCounts[matchedKey] = (scientistCounts[matchedKey] || 0) + 1;

      let reportRev = 0;
      r.selectedTests.forEach((st) => {
        testCounts[st.testId] = (testCounts[st.testId] || 0) + 1;
        const price = getTestPriceCents(st, catalog);
        testRevenues[st.testId] = (testRevenues[st.testId] || 0) + price;
        reportRev += price;
      });

      scientistRevenues[matchedKey] = (scientistRevenues[matchedKey] || 0) + reportRev;
      periodRevenueCents += reportRev;
    });

    const total = filteredReports.length;
    const dailyRevenueCents = getDailyRevenueCents(reports, catalog);
    const allTimeRevenueCents = getTotalGrossRevenueCents(reports, catalog);

    return {
      total,
      scientistCounts,
      scientistRevenues,
      testCounts,
      testRevenues,
      periodRevenueCents,
      dailyRevenueCents,
      allTimeRevenueCents,
    };
  }, [filteredReports, scientistUsers, reports, catalog]);

  // Interactive timeline stats for Laboratory Performance & Scientist Analytics
  const interactiveChartStats = useMemo(() => {
    const now = new Date();
    interface IntervalScientistData {
      name: string;
      reportsCount: number;
      revenueCents: number;
      theme: ScientistColorTheme;
    }

    interface ChartInterval {
      label: string;
      fullLabel: string;
      totalReports: number;
      totalRevenueCents: number;
      byScientist: IntervalScientistData[];
      topScientist: string;
    }

    const intervals: ChartInterval[] = [];

    const buildInterval = (label: string, fullLabel: string, matching: SavedReport[]): ChartInterval => {
      const byScientist: IntervalScientistData[] = scientistUsers.map((sc, scIdx) => {
        const scReports = matching.filter((r) => {
          const perf = (r.performedByName || r.performedBy || '').toLowerCase();
          return perf.includes(sc.displayName.toLowerCase()) || perf.includes(sc.username.toLowerCase());
        });
        const rev = scReports.reduce((sum, r) => sum + getReportRevenueCents(r, catalog), 0);
        return {
          name: sc.displayName,
          reportsCount: scReports.length,
          revenueCents: rev,
          theme: SCIENTIST_PALETTES[scIdx % SCIENTIST_PALETTES.length],
        };
      });

      const totalReports = matching.length;
      const totalRevenueCents = matching.reduce((sum, r) => sum + getReportRevenueCents(r, catalog), 0);
      const topSc = [...byScientist].sort((a, b) => b.revenueCents - a.revenueCents)[0]?.name || 'Dorean';

      return {
        label,
        fullLabel,
        totalReports,
        totalRevenueCents,
        byScientist,
        topScientist: topSc,
      };
    };

    if (timeRange === '7d') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const shortDate = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;

        const matching = reports.filter((r) => {
          const rDate = (r.createdAt || r.patient?.resultsDate || '').split('T')[0];
          return rDate === dateStr;
        });

        intervals.push(buildInterval(`${dayName} ${d.getDate()}`, `${dayName}, ${shortDate}`, matching));
      }
    } else if (timeRange === '30d') {
      for (let i = 4; i >= 0; i--) {
        const startD = new Date(now);
        startD.setDate(startD.getDate() - (i + 1) * 6);
        const endD = new Date(now);
        endD.setDate(endD.getDate() - i * 6);

        const startIso = startD.toISOString().split('T')[0];
        const endIso = endD.toISOString().split('T')[0];

        const matching = reports.filter((r) => {
          const rDate = (r.createdAt || r.patient?.resultsDate || '').split('T')[0];
          return rDate >= startIso && rDate <= endIso;
        });

        intervals.push(
          buildInterval(
            `Wk ${5 - i}`,
            `${startD.getDate()} ${startD.toLocaleDateString('en-US', { month: 'short' })} – ${endD.getDate()} ${endD.toLocaleDateString('en-US', { month: 'short' })}`,
            matching
          )
        );
      }
    } else if (timeRange === '1y') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const monthName = d.toLocaleString('en-US', { month: 'short' });

        const matching = reports.filter((r) => {
          const rDate = new Date(r.createdAt || r.patient?.resultsDate || '');
          return rDate.getFullYear() === year && rDate.getMonth() === month;
        });

        intervals.push(buildInterval(monthName, `${monthName} ${year}`, matching));
      }
    } else {
      // 6m
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const monthName = d.toLocaleString('en-US', { month: 'short' });

        const matching = reports.filter((r) => {
          const rDate = new Date(r.createdAt || r.patient?.resultsDate || '');
          return rDate.getFullYear() === year && rDate.getMonth() === month;
        });

        intervals.push(buildInterval(monthName, `${monthName} ${year}`, matching));
      }
    }

    return intervals;
  }, [reports, timeRange, scientistUsers, catalog]);

  // Aggregated scientist performance for the active timeRange
  const scientistPeriodPerformance = useMemo(() => {
    let totalTimeRangeRev = 0;
    let totalTimeRangeReports = 0;

    const list = scientistUsers.map((sc, scIdx) => {
      const theme = SCIENTIST_PALETTES[scIdx % SCIENTIST_PALETTES.length];
      let scientistRev = 0;
      let scientistCount = 0;

      interactiveChartStats.forEach((interval) => {
        const scData = interval.byScientist.find((b) => b.name === sc.displayName);
        if (scData) {
          scientistRev += scData.revenueCents;
          scientistCount += scData.reportsCount;
        }
      });

      totalTimeRangeRev += scientistRev;
      totalTimeRangeReports += scientistCount;

      return {
        user: sc,
        name: sc.displayName,
        theme,
        revenueCents: scientistRev,
        reportsCount: scientistCount,
        avgTicketCents: scientistCount > 0 ? Math.round(scientistRev / scientistCount) : 0,
      };
    });

    return {
      scientists: list,
      totalRevenueCents: totalTimeRangeRev,
      totalReports: totalTimeRangeReports,
    };
  }, [scientistUsers, interactiveChartStats]);

  // Current month count
  const currentMonthReportsCount = useMemo(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    return reports.filter((r) => {
      const rDate = new Date(r.createdAt || r.patient?.resultsDate || '');
      return rDate.getFullYear() === curYear && rDate.getMonth() === curMonth;
    }).length;
  }, [reports]);

  // Scientist Breakdown for Donut Chart & Workload Cards (supports volume and revenue)
  const scientistBreakdown = useMemo(() => {
    const items = scientistUsers.map((sc, i) => {
      const theme = SCIENTIST_PALETTES[i % SCIENTIST_PALETTES.length];
      const matchingReports = reports.filter((r) => {
        const perf = (r.performedByName || r.performedBy || '').toLowerCase();
        return perf.includes(sc.displayName.toLowerCase()) || perf.includes(sc.username.toLowerCase());
      });
      const count = matchingReports.length;
      const revenueCents = matchingReports.reduce((sum, r) => sum + getReportRevenueCents(r, catalog), 0);
      return {
        user: sc,
        name: sc.displayName,
        count,
        revenueCents,
        theme,
      };
    });

    const otherReports = reports.filter((r) => {
      const perf = (r.performedByName || r.performedBy || '').toLowerCase();
      return !scientistUsers.some(
        (sc) => perf.includes(sc.displayName.toLowerCase()) || perf.includes(sc.username.toLowerCase())
      );
    });
    const otherCount = otherReports.length;
    const otherRevenueCents = otherReports.reduce((sum, r) => sum + getReportRevenueCents(r, catalog), 0);

    if (otherCount > 0) {
      items.push({
        user: { username: 'other', displayName: 'Other / Admin', role: 'admin' } as UserAccount,
        name: 'Other',
        count: otherCount,
        revenueCents: otherRevenueCents,
        theme: {
          name: 'Slate',
          badgeBg: 'bg-slate-100',
          badgeText: 'text-slate-700',
          badgeBorder: 'border-slate-300',
          avatarBg: 'bg-slate-600',
          avatarText: 'text-white',
          hex: '#64748b',
          dotBg: 'bg-slate-400',
          ringColor: 'ring-slate-500/30',
          softBg: 'bg-slate-500/10',
        },
      });
    }

    const total = items.reduce((sum, item) => sum + item.count, 0);
    const totalRevenueCents = items.reduce((sum, item) => sum + item.revenueCents, 0);

    return {
      items,
      total,
      totalRevenueCents,
    };
  }, [reports, scientistUsers, catalog]);

  // Export filtered audit report to CSV
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
    link.setAttribute('download', `care_polyclinic_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- SCIENTIST MANAGEMENT HANDLERS ---
  const handleAddScientist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScientistUsername.trim() || !newScientistName.trim()) {
      showWarning('Please enter a username and scientist name.');
      return;
    }

    const usernameClean = newScientistUsername.trim();
    if (localUsers.some((u) => u.username.toLowerCase() === usernameClean.toLowerCase())) {
      showError('A user with this username already exists.');
      return;
    }

    const newUser: UserAccount = {
      username: usernameClean,
      displayName: newScientistName.trim(),
      password: newScientistPassword || 'password',
      role: 'scientist',
      title: newScientistTitle.trim() || 'Medical Laboratory Scientist',
    };

    const updated = [...localUsers, newUser];
    setLocalUsers(updated);
    onSaveUsers(updated);

    setNewScientistUsername('');
    setNewScientistName('');
    setNewScientistPassword('password');
    setShowAddScientistModal(false);
    showSuccess(`Scientist "${newUser.displayName}" added successfully!`);
  };

  const handleRemoveScientist = async (usernameToRemove: string) => {
    if (usernameToRemove.toLowerCase() === 'admin') {
      showError('Cannot delete the master admin account.');
      return;
    }
    const confirmed = await askConfirm({
      title: 'Remove Scientist Account',
      message: `Are you sure you want to remove scientist account "${usernameToRemove}"?`,
      confirmText: 'Remove Scientist',
      isDestructive: true,
    });
    if (confirmed) {
      const updated = localUsers.filter((u) => u.username !== usernameToRemove);
      setLocalUsers(updated);
      onSaveUsers(updated);
      showSuccess(`Scientist "${usernameToRemove}" removed.`);
    }
  };

  const handleUpdateScientist = (idx: number, updates: Partial<UserAccount>) => {
    const updated = [...localUsers];
    updated[idx] = { ...updated[idx], ...updates };
    setLocalUsers(updated);
  };

  const handleSaveAllScientists = () => {
    onSaveUsers(localUsers);
    setUserSavedAlert(true);
    setTimeout(() => setUserSavedAlert(false), 3000);
  };

  // --- LAB TEST & PARAMETER MANAGEMENT HANDLERS ---
  const handleSaveNewLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) {
      showWarning('Please enter a lab test name.');
      return;
    }

    const validParams: TestParameter[] = newTestParams
      .filter((p) => p.name.trim().length > 0)
      .map((p, idx) => {
        const minVal = p.min ? parseFloat(p.min) : undefined;
        const maxVal = p.max ? parseFloat(p.max) : undefined;
        const hasMinMax = !isNaN(minVal as number) || !isNaN(maxVal as number);

        return {
          id: `param_${Date.now()}_${idx}`,
          name: p.name.trim(),
          unit: p.unit.trim(),
          rangeType: hasMinMax ? 'min_max' : 'text',
          referenceRangeText: p.refRange.trim() || (hasMinMax ? `${p.min || ''}–${p.max || ''}` : '-'),
          min: isNaN(minVal as number) ? undefined : minVal,
          max: isNaN(maxVal as number) ? undefined : maxVal,
        };
      });

    if (validParams.length === 0) {
      showWarning('Please add at least one valid parameter for this test.');
      return;
    }

    const parsedPrice = parseFloat(newTestPrice);
    const createdTest: LabTest = {
      id: `test_${Date.now()}`,
      name: newTestName.trim().toUpperCase(),
      category: newTestCategory.trim() || 'Clinical Chemistry',
      isCustom: true,
      priceCents: isNaN(parsedPrice) ? 0 : Math.round(parsedPrice * 100),
      parameters: validParams,
    };

    const updatedCatalog = [...localCatalog, createdTest];
    setLocalCatalog(updatedCatalog);
    onSaveCatalog(updatedCatalog);
    setSelectedCatalogTestId(createdTest.id);

    setNewTestName('');
    setNewTestParams([{ name: '', unit: '', refRange: '', min: '', max: '' }]);
    setShowAddTestModal(false);
    showSuccess(`Lab test "${createdTest.name}" created successfully!`);
  };

  const handleAddParamToCurrentTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParamName.trim()) {
      showWarning('Please enter parameter name.');
      return;
    }

    const minNum = newParamMin ? parseFloat(newParamMin) : undefined;
    const maxNum = newParamMax ? parseFloat(newParamMax) : undefined;
    const mMinNum = newParamMaleMin ? parseFloat(newParamMaleMin) : undefined;
    const mMaxNum = newParamMaleMax ? parseFloat(newParamMaleMax) : undefined;
    const fMinNum = newParamFemaleMin ? parseFloat(newParamFemaleMin) : undefined;
    const fMaxNum = newParamFemaleMax ? parseFloat(newParamFemaleMax) : undefined;

    const newParam: TestParameter = {
      id: `p_${Date.now()}`,
      name: newParamName.trim(),
      unit: newParamUnit.trim(),
      rangeType: 'min_max',
      referenceRangeText:
        newParamRefText.trim() ||
        (newParamIsSexSpecific
          ? `Male ${newParamMaleMin}–${newParamMaleMax} | Female ${newParamFemaleMin}–${newParamFemaleMax}`
          : `${newParamMin}–${newParamMax}`),
      min: isNaN(minNum as number) ? undefined : minNum,
      max: isNaN(maxNum as number) ? undefined : maxNum,
      isSexSpecific: newParamIsSexSpecific,
      maleMin: isNaN(mMinNum as number) ? undefined : mMinNum,
      maleMax: isNaN(mMaxNum as number) ? undefined : mMaxNum,
      femaleMin: isNaN(fMinNum as number) ? undefined : fMinNum,
      femaleMax: isNaN(fMaxNum as number) ? undefined : fMaxNum,
    };

    const updated = localCatalog.map((t) => {
      if (t.id === selectedCatalogTestId) {
        return {
          ...t,
          parameters: [...t.parameters, newParam],
        };
      }
      return t;
    });

    setLocalCatalog(updated);
    onSaveCatalog(updated);

    setNewParamName('');
    setNewParamUnit('');
    setNewParamRefText('');
    setNewParamMin('');
    setNewParamMax('');
    setShowAddParamModal(false);
    setCatalogSavedAlert(true);
    setTimeout(() => setCatalogSavedAlert(false), 3000);
  };

  const updateParameter = (testId: string, paramId: string, updates: Partial<TestParameter>) => {
    const updated = localCatalog.map((t) => {
      if (t.id !== testId) return t;
      return {
        ...t,
        parameters: t.parameters.map((p) => (p.id === paramId ? { ...p, ...updates } : p)),
      };
    });
    setLocalCatalog(updated);
  };

  const handleSaveCatalogChanges = () => {
    onSaveCatalog(localCatalog);
    setCatalogSavedAlert(true);
    setTimeout(() => setCatalogSavedAlert(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showWarning('Logo must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLocalFacility((prev) => ({ ...prev, logoUrl: reader.result as string }));
        showSuccess('New logo loaded. Remember to click "Save Header Settings".');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFacilitySettings(localFacility);
    showSuccess('Facility header settings updated successfully!');
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `care_lab_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Database backup downloaded successfully.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const success = importBackupJSON(reader.result as string);
        if (success) {
          showSuccess('Backup restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showError('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const currentTestDef = localCatalog.find((t) => t.id === selectedCatalogTestId) || localCatalog[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans transition-colors pb-16">
      {/* Top Admin Header Bar (Cyno style) with enhanced padding */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Facility Title */}
            <div className="flex items-center space-x-4">
              {facilitySettings.logoUrl ? (
                <div className="w-12 h-12 aspect-square rounded-2xl overflow-hidden border-2 border-teal-500/30 bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src={facilitySettings.logoUrl}
                    alt="Clinic Logo"
                    className="w-full h-full object-contain aspect-square rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 aspect-square rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0 font-extrabold">
                  <Shield className="h-6 w-6" />
                </div>
              )}
              <div>
                <h1 className="font-black text-slate-900 text-sm sm:text-base tracking-tight uppercase leading-snug">
                  {facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC'}
                </h1>
                <p className="text-[11px] text-teal-700 font-extrabold tracking-wider uppercase mt-0.5">
                  Administrator &bull; Management Hub
                </p>
              </div>
            </div>

            {/* Right Action Icons (Cyno style) */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-white animate-pulse" />
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center pl-1 sm:pl-2">
                <div className="flex items-center space-x-3 py-1.5 px-3.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-black text-slate-900 leading-tight">
                      {currentUser.displayName || 'Admin'}
                    </div>
                    <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                      Administrator
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar - Centered Navigation Pills (No admin control center text) */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-3.5 overflow-x-auto scrollbar-none">
            {/* Centered Navigation Pills */}
            <nav className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
              <button
                onClick={() => setActiveAdminTab('stats')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${activeAdminTab === 'stats'
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('catalog')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${activeAdminTab === 'catalog'
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Lab Tests</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('scientists')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${activeAdminTab === 'scientists'
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Scientists ({scientistUsers.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('facility')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${activeAdminTab === 'facility'
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Header &amp; Logo</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('backup')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all cursor-pointer ${activeAdminTab === 'backup'
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-500/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Cyno-styled Welcome & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <span>Hi, {currentUser.displayName || 'Administrator'}</span>
              <span className="inline-block animate-bounce">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              This is your laboratory analytics, diagnostics, and scientist performance report so far!
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveAdminTab('scientists');
                setShowAddScientistModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-full text-xs font-black shadow-lg shadow-teal-900/30 flex items-center space-x-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Scientist</span>
            </button>

            <button
              onClick={() => {
                setActiveAdminTab('catalog');
                setShowAddTestModal(true);
              }}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>New Lab Test</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: STATISTICS & AUDITING (CYNO REDESIGN) */}
        {/* ======================================================== */}
        {activeAdminTab === 'stats' && (
          <div className="space-y-7">
            {/* 5 Cyno-styled Stat Cards including Daily & Total Gross Billings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {/* Card 1: Daily Gross Revenue (Today) */}
              <RevenueCard
                title="Daily Gross Revenue"
                totalCents={stats.dailyRevenueCents}
                subtitle="Today's lab gross billings"
                badgeText="Today"
              />

              {/* Card 2: Period Gross Revenue */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs font-black text-xl">
                    <span>GH₵</span>
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-teal-50 text-teal-700 border border-teal-200">
                    <TrendingUp className="w-3 h-3 text-teal-600" />
                    <span>{selectedDateFilter === 'all' ? 'All-Time' : 'Period'}</span>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {formatCentsGHC(stats.periodRevenueCents)}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {selectedDateFilter === 'all' ? 'Total Gross Revenue' : 'Period Gross Revenue'}
                  </p>
                  <p className="text-[11px] font-medium text-teal-600 mt-0.5">
                    {filteredReports.length} {filteredReports.length === 1 ? 'sample' : 'samples'} billed
                  </p>
                </div>
              </div>

              {/* Card 3: Total Reports Processed */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <span>{selectedDateFilter === 'all' ? 'All-Time' : 'Period'}</span>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {stats.total.toLocaleString()}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Total Reports Processed
                  </p>
                </div>
              </div>

              {/* Card 4: All-Time Patient Reports */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-50 text-sky-600 border border-sky-200">
                    <span>All-Time</span>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {reports.length.toLocaleString()}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Total Patient Reports
                  </p>
                </div>
              </div>

              {/* Card 5: Active Lab Scientists */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                    <span>Active</span>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900  tracking-tight">
                    {scientistUsers.length}
                  </div>
                  <p className="text-xs font-semibold text-slate-500  mt-1">
                    Active Medical Scientists
                  </p>
                </div>
              </div>
            </div>

            {/* Cyno Dual Charts Section - Fully Interactive */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Chart: Scientist Performance & Revenue Timeline */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        <h3 className="text-base font-black text-slate-900">
                          Scientist Performance & Revenue Analytics
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Compare workload and gross revenue generated per laboratory scientist over time
                      </p>

                      {/* Metric Toggle Buttons: Revenue (GH₵) vs Labs Conducted */}
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          type="button"
                          onClick={() => setChartViewMode('revenue')}
                          className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${chartViewMode === 'revenue'
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Gross Revenue (GH₵)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setChartViewMode('volume')}
                          className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${chartViewMode === 'volume'
                              ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Labs Conducted (Volume)</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Timeframe Filter Pills */}
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200 self-start sm:self-auto">
                      {(['7d', '30d', '6m', '1y'] as const).map((range) => {
                        const labels = {
                          '7d': '7 Days',
                          '30d': '30 Days',
                          '6m': '6 Months',
                          '1y': '1 Year',
                        };
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => {
                              setTimeRange(range);
                              setHoveredPointIndex(null);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${timeRange === range
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                              }`}
                          >
                            {labels[range]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Series Legend Toggles: All (Cumulative) + Scientists */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Active Series:
                    </span>

                    {/* All (Cumulative) Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => setShowTotalSeries(!showTotalSeries)}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer border ${showTotalSeries
                          ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                          : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                        }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-300 ring-2 ring-white/50" />
                      <span>All (Cumulative Total)</span>
                    </button>

                    {/* Per-Scientist Toggles */}
                    {scientistUsers.map((sc, idx) => {
                      const theme = SCIENTIST_PALETTES[idx % SCIENTIST_PALETTES.length];
                      const isHovered = hoveredScientist === sc.displayName;
                      const isVisible = activeScientistSeries.includes('all') || activeScientistSeries.includes(sc.displayName);

                      return (
                        <button
                          key={sc.username}
                          type="button"
                          onClick={() => {
                            if (activeScientistSeries.includes('all')) {
                              setActiveScientistSeries([sc.displayName]);
                            } else if (activeScientistSeries.includes(sc.displayName)) {
                              const remaining = activeScientistSeries.filter((s) => s !== sc.displayName);
                              setActiveScientistSeries(remaining.length === 0 ? ['all'] : remaining);
                            } else {
                              setActiveScientistSeries([...activeScientistSeries, sc.displayName]);
                            }
                          }}
                          onMouseEnter={() => setHoveredScientist(sc.displayName)}
                          onMouseLeave={() => setHoveredScientist(null)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${isHovered
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-400'
                              : isVisible
                                ? 'bg-slate-50 text-slate-800 border-slate-300 shadow-2xs'
                                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
                            }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: theme.hex }}
                          />
                          <span>{sc.displayName}</span>
                        </button>
                      );
                    })}

                    {!activeScientistSeries.includes('all') && (
                      <button
                        type="button"
                        onClick={() => setActiveScientistSeries(['all'])}
                        className="text-[10px] text-teal-700 font-extrabold hover:underline ml-1 cursor-pointer"
                      >
                        Reset All Series
                      </button>
                    )}
                  </div>

                  {/* Linear Multi-Series SVG Chart */}
                  <div className="relative pt-6 pb-2" onMouseLeave={() => setHoveredPointIndex(null)}>
                    {(() => {
                      const data = interactiveChartStats;
                      const isRev = chartViewMode === 'revenue';

                      // Find max value across all intervals (cumulative total is highest)
                      const maxVal = Math.max(
                        ...data.map((m) =>
                          isRev
                            ? Math.max(m.totalRevenueCents, ...m.byScientist.map((s) => s.revenueCents), 10000)
                            : Math.max(m.totalReports, ...m.byScientist.map((s) => s.reportsCount), 4)
                        ),
                        isRev ? 20000 : 5
                      );

                      const width = 560;
                      const height = 200;
                      const padX = 35;
                      const usableW = width - padX * 2;
                      const stepX = data.length > 1 ? usableW / (data.length - 1) : usableW;
                      const baseY = height - 28;
                      const usableH = height - 50;

                      // 1. Calculate Linear Points for Cumulative Total
                      const totalPoints = data.map((m, idx) => {
                        const val = isRev ? m.totalRevenueCents : m.totalReports;
                        return {
                          x: padX + idx * stepX,
                          y: baseY - (maxVal > 0 ? (val / maxVal) * usableH : 0),
                          val,
                          item: m,
                        };
                      });

                      // 2. Calculate Linear Points for each Scientist
                      const scientistSeriesList = scientistUsers.map((sc, scIdx) => {
                        const theme = SCIENTIST_PALETTES[scIdx % SCIENTIST_PALETTES.length];
                        const isVisible = activeScientistSeries.includes('all') || activeScientistSeries.includes(sc.displayName);

                        const points = data.map((m, idx) => {
                          const scData = m.byScientist.find((b) => b.name === sc.displayName);
                          const val = scData ? (isRev ? scData.revenueCents : scData.reportsCount) : 0;
                          return {
                            x: padX + idx * stepX,
                            y: baseY - (maxVal > 0 ? (val / maxVal) * usableH : 0),
                            val,
                          };
                        });

                        return {
                          name: sc.displayName,
                          theme,
                          isVisible,
                          points,
                        };
                      });

                      // Linear SVG path helpers
                      const createLinearPath = (pts: { x: number; y: number }[]) => {
                        if (pts.length === 0) return '';
                        return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
                      };

                      const createLinearArea = (pts: { x: number; y: number }[]) => {
                        if (pts.length === 0) return '';
                        const line = createLinearPath(pts);
                        return `${line} L ${pts[pts.length - 1].x} ${baseY} L ${pts[0].x} ${baseY} Z`;
                      };

                      const totalPath = createLinearPath(totalPoints);
                      const totalArea = createLinearArea(totalPoints);

                      const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : null;
                      const activeItem = activeIdx !== null ? data[activeIdx] : null;

                      return (
                        <div className="relative w-full h-56 sm:h-64">
                          {/* Floating Interactive Tooltip Card */}
                          {activeIdx !== null && activeItem && (
                            <div
                              className="absolute z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 text-xs min-w-[220px]"
                              style={{
                                left: `${((padX + activeIdx * stepX) / width) * 100}%`,
                                top: '20px',
                              }}
                            >
                              <div className="font-black text-teal-300 text-[11px] mb-2 pb-1.5 border-b border-slate-700/80 flex items-center justify-between">
                                <span>{activeItem.fullLabel}</span>
                                <span className="text-[10px] text-teal-400 font-extrabold bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800">
                                  {isRev
                                    ? formatCentsGHC(activeItem.totalRevenueCents)
                                    : `${activeItem.totalReports} Labs`}
                                </span>
                              </div>

                              <div className="space-y-1.5 text-[11px]">
                                {/* Cumulative Total Row */}
                                <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-teal-200 font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                                    <span>All (Cumulative):</span>
                                  </span>
                                  <span className="font-mono font-black text-white">
                                    {isRev
                                      ? formatCentsGHC(activeItem.totalRevenueCents)
                                      : `${activeItem.totalReports} labs`}
                                  </span>
                                </div>

                                {/* Per-Scientist Breakdown */}
                                {activeItem.byScientist.map((sc, scIdx) => {
                                  const pct = isRev
                                    ? activeItem.totalRevenueCents > 0
                                      ? Math.round((sc.revenueCents / activeItem.totalRevenueCents) * 100)
                                      : 0
                                    : activeItem.totalReports > 0
                                      ? Math.round((sc.reportsCount / activeItem.totalReports) * 100)
                                      : 0;

                                  return (
                                    <div
                                      key={scIdx}
                                      className="flex items-center justify-between text-[10px] text-slate-300 py-0.5"
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span
                                          className="w-2 h-2 rounded-full shrink-0"
                                          style={{ backgroundColor: sc.theme.hex }}
                                        />
                                        <span className="text-white font-semibold">{sc.name}</span>
                                        <span className="text-slate-400 font-mono">({pct}%)</span>
                                      </span>
                                      <span className="font-mono text-emerald-400 font-bold">
                                        {isRev
                                          ? formatCentsGHC(sc.revenueCents)
                                          : `${sc.reportsCount} labs`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="totalLinearGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Background Horizontal Grid Lines */}
                            {[0.2, 0.45, 0.7, 0.95].map((pct, idx) => (
                              <g key={idx}>
                                <line
                                  x1={padX}
                                  y1={15 + pct * usableH}
                                  x2={width - padX}
                                  y2={15 + pct * usableH}
                                  stroke="#f1f5f9"
                                  strokeDasharray="4 4"
                                  strokeWidth="1"
                                />
                              </g>
                            ))}

                            {/* Hover Vertical Guide Line */}
                            {activeIdx !== null && (
                              <g>
                                <rect
                                  x={padX + activeIdx * stepX - stepX / 2}
                                  y="10"
                                  width={stepX}
                                  height={height - 35}
                                  fill="#0d9488"
                                  fillOpacity="0.04"
                                  rx="6"
                                />
                                <line
                                  x1={padX + activeIdx * stepX}
                                  y1={12}
                                  x2={padX + activeIdx * stepX}
                                  y2={baseY}
                                  stroke="#0d9488"
                                  strokeDasharray="3 3"
                                  strokeWidth="1.5"
                                />
                              </g>
                            )}

                            {/* 1. Cumulative Total Area & Linear Path */}
                            {showTotalSeries && (
                              <g>
                                <path d={totalArea} fill="url(#totalLinearGrad)" />
                                <path
                                  d={totalPath}
                                  fill="none"
                                  stroke="#0d9488"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            )}

                            {/* 2. Scientist Linear Paths */}
                            {scientistSeriesList.map((sc, scIdx) => {
                              if (!sc.isVisible) return null;
                              const path = createLinearPath(sc.points);
                              const isScHovered = hoveredScientist === sc.name;

                              return (
                                <g key={scIdx}>
                                  <path
                                    d={path}
                                    fill="none"
                                    stroke={sc.theme.hex}
                                    strokeWidth={isScHovered ? '3.5' : '2.5'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={scIdx === 1 ? '4 3' : undefined}
                                    opacity={
                                      hoveredScientist
                                        ? isScHovered
                                          ? 1
                                          : 0.3
                                        : 1
                                    }
                                    className="transition-all duration-200"
                                  />
                                </g>
                              );
                            })}

                            {/* 3. Scientist Point Nodes */}
                            {scientistSeriesList.map((sc, scIdx) => {
                              if (!sc.isVisible) return null;
                              return sc.points.map((pt, ptIdx) => {
                                const isHov = activeIdx === ptIdx;
                                return (
                                  <circle
                                    key={`sc-pt-${scIdx}-${ptIdx}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHov ? 5.5 : 3.5}
                                    fill={isHov ? sc.theme.hex : '#ffffff'}
                                    stroke={sc.theme.hex}
                                    strokeWidth={isHov ? 2.5 : 2}
                                    className="transition-all duration-150"
                                  />
                                );
                              });
                            })}

                            {/* 4. Cumulative Total Point Nodes */}
                            {showTotalSeries &&
                              totalPoints.map((pt, ptIdx) => {
                                const isHov = activeIdx === ptIdx;
                                return (
                                  <circle
                                    key={`tot-pt-${ptIdx}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHov ? 6 : 4}
                                    fill={isHov ? '#0d9488' : '#ffffff'}
                                    stroke="#0d9488"
                                    strokeWidth={isHov ? 3 : 2.5}
                                    className="transition-all duration-150"
                                  />
                                );
                              })}

                            {/* X-axis Labels */}
                            {data.map((m, idx) => {
                              const x = padX + idx * stepX;
                              const isHov = activeIdx === idx;
                              return (
                                <text
                                  key={idx}
                                  x={x}
                                  y={height - 6}
                                  textAnchor="middle"
                                  className={`text-[10px] font-bold font-sans transition-colors ${isHov ? 'fill-teal-700 font-black' : 'fill-slate-500'
                                    }`}
                                >
                                  {m.label}
                                </text>
                              );
                            })}

                            {/* Transparent Hit-Testing Columns */}
                            {data.map((_, idx) => {
                              const colW = stepX;
                              const x = padX + idx * stepX - colW / 2;
                              return (
                                <rect
                                  key={`hit-${idx}`}
                                  x={Math.max(x, 0)}
                                  y={0}
                                  width={colW}
                                  height={height}
                                  fill="transparent"
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredPointIndex(idx)}
                                />
                              );
                            })}
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                  {/* Period Scientist Performance & Revenue Leaderboard */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        {timeRange === '7d'
                          ? 'Last 7 Days Summary'
                          : timeRange === '30d'
                            ? 'Last 30 Days Summary'
                            : timeRange === '1y'
                              ? 'Last 12 Months Summary'
                              : 'Last 6 Months Summary'}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-slate-600">
                          Total Labs:{' '}
                          <strong className="text-slate-900">
                            {scientistPeriodPerformance.totalReports}
                          </strong>
                        </span>
                        <span className="text-emerald-700 font-mono">
                          Total Gross:{' '}
                          <strong>{formatCentsGHC(scientistPeriodPerformance.totalRevenueCents)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {scientistPeriodPerformance.scientists.map((sc, idx) => {
                        const revPct =
                          scientistPeriodPerformance.totalRevenueCents > 0
                            ? Math.round(
                              (sc.revenueCents / scientistPeriodPerformance.totalRevenueCents) * 100
                            )
                            : 0;
                        const volPct =
                          scientistPeriodPerformance.totalReports > 0
                            ? Math.round(
                              (sc.reportsCount / scientistPeriodPerformance.totalReports) * 100
                            )
                            : 0;
                        const isHovered = hoveredScientist === sc.name;

                        return (
                          <div
                            key={sc.user.username || idx}
                            onMouseEnter={() => setHoveredScientist(sc.name)}
                            onMouseLeave={() => setHoveredScientist(null)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${isHovered
                                ? 'bg-teal-50/50 border-teal-300 shadow-xs'
                                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 ${sc.theme.avatarBg}`}
                                >
                                  {sc.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-xs font-black text-slate-900">{sc.name}</div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase">
                                    Medical Scientist
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-black text-emerald-700 font-mono">
                                  {formatCentsGHC(sc.revenueCents)}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500">
                                  {sc.reportsCount} Labs ({volPct}%)
                                </div>
                              </div>
                            </div>

                            {/* Contribution Progress Bar */}
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                              <div
                                className="h-full transition-all duration-300 rounded-full"
                                style={{
                                  width: `${revPct}%`,
                                  backgroundColor: sc.theme.hex,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-1">
                              <span>Share of Revenue: {revPct}%</span>
                              <span>Avg/Lab: {formatCentsGHC(sc.avgTicketCents)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Chart: Scientist Contribution Share (Interactive Donut Chart) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Scientist Share
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Period contribution by Scientist
                      </p>
                    </div>

                    {/* Donut Metric Toggle Pills */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setDonutMetric('revenue')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${donutMetric === 'revenue'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        GH₵
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonutMetric('volume')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${donutMetric === 'volume'
                            ? 'bg-teal-700 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        Labs
                      </button>
                    </div>
                  </div>

                  {/* SVG Donut Chart with Interactive Segments */}
                  <div className="pt-5 pb-2 flex flex-col items-center">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      {(() => {
                        const R = 56;
                        const C = 2 * Math.PI * R; // ~351.85
                        const isRev = donutMetric === 'revenue';
                        const total = isRev
                          ? scientistPeriodPerformance.totalRevenueCents
                          : scientistPeriodPerformance.totalReports;

                        if (total === 0) {
                          return (
                            <svg viewBox="0 0 140 140" className="w-full h-full">
                              <circle
                                cx="70"
                                cy="70"
                                r={R}
                                fill="none"
                                stroke="#f1f5f9"
                                strokeWidth="16"
                              />
                              <text
                                x="70"
                                y="68"
                                textAnchor="middle"
                                className="text-xl font-black fill-slate-900 font-sans"
                              >
                                0
                              </text>
                              <text
                                x="70"
                                y="84"
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
                              >
                                {isRev ? 'GH₵ 0' : 'Reports'}
                              </text>
                            </svg>
                          );
                        }

                        let accumulatedOffset = 0;

                        return (
                          <svg viewBox="0 0 140 140" className="w-full h-full transform -rotate-90">
                            {/* Base Track */}
                            <circle
                              cx="70"
                              cy="70"
                              r={R}
                              fill="none"
                              stroke="#f8fafc"
                              strokeWidth="16"
                            />

                            {/* Color-Coded Segments with Hover Highlight */}
                            {scientistPeriodPerformance.scientists.map((sc, idx) => {
                              const val = isRev ? sc.revenueCents : sc.reportsCount;
                              const ratio = total > 0 ? val / total : 0;
                              const arcLen = ratio * C;
                              const offset = accumulatedOffset;
                              accumulatedOffset += arcLen;

                              const isHovered = hoveredScientist === sc.name;
                              const isAnyHovered = hoveredScientist !== null;
                              const strokeW = isHovered ? 20 : 16;
                              const opacity = isHovered ? 1 : isAnyHovered ? 0.35 : 1;

                              return (
                                <circle
                                  key={idx}
                                  cx="70"
                                  cy="70"
                                  r={R}
                                  fill="none"
                                  stroke={sc.theme.hex}
                                  strokeWidth={strokeW}
                                  strokeDasharray={`${Math.max(arcLen - 2, 0)} ${C}`}
                                  strokeDashoffset={-offset}
                                  strokeLinecap="round"
                                  opacity={opacity}
                                  className="transition-all duration-300 cursor-pointer"
                                  onMouseEnter={() => setHoveredScientist(sc.name)}
                                  onMouseLeave={() => setHoveredScientist(null)}
                                />
                              );
                            })}
                          </svg>
                        );
                      })()}

                      {/* Dynamic Center Stats Display */}
                      {(() => {
                        const isRev = donutMetric === 'revenue';
                        const total = isRev
                          ? scientistPeriodPerformance.totalRevenueCents
                          : scientistPeriodPerformance.totalReports;

                        const activeItem = hoveredScientist
                          ? scientistPeriodPerformance.scientists.find((it) => it.name === hoveredScientist)
                          : null;

                        if (activeItem) {
                          const val = isRev ? activeItem.revenueCents : activeItem.reportsCount;
                          const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                          return (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all">
                              <span className="text-xl font-black text-slate-900 leading-none font-mono">
                                {isRev ? formatCentsGHC(activeItem.revenueCents) : activeItem.reportsCount}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase tracking-tight mt-1 text-teal-700 truncate max-w-[100px]">
                                {activeItem.name}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500">
                                {pct}% of Period
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all text-center px-2">
                            <span className="text-lg font-black text-slate-900 leading-none font-mono">
                              {isRev
                                ? formatCentsGHC(scientistPeriodPerformance.totalRevenueCents)
                                : scientistPeriodPerformance.totalReports}
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                              {isRev ? 'Period Billings' : 'Total Labs'}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Interactive Color-coded Legend */}
                    <div className="w-full mt-4 space-y-2">
                      {scientistPeriodPerformance.scientists.map((sc, idx) => {
                        const isRev = donutMetric === 'revenue';
                        const total = isRev
                          ? scientistPeriodPerformance.totalRevenueCents
                          : scientistPeriodPerformance.totalReports;
                        const val = isRev ? sc.revenueCents : sc.reportsCount;
                        const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                        const isHovered = hoveredScientist === sc.name;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredScientist(sc.name)}
                            onMouseLeave={() => setHoveredScientist(null)}
                            className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-all cursor-pointer ${isHovered
                                ? 'bg-slate-100 border-teal-400 shadow-2xs'
                                : 'border-transparent hover:bg-slate-50'
                              }`}
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <span
                                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                                style={{ backgroundColor: sc.theme.hex }}
                              />
                              <span className="font-extrabold text-slate-800 truncate">
                                {sc.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 font-mono shrink-0">
                              <span className="font-bold text-slate-900">
                                {isRev ? formatCentsGHC(sc.revenueCents) : `${sc.reportsCount} labs`}
                              </span>
                              <span className="text-slate-400 text-[10px]">({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Type Distribution Grid - Horizontal Layout: test | amount | number done */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Test Panels &bull; Billings &bull; Quick Filter</span>
                  </h3>
                  {selectedTestType !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTestType('All')}
                      className="text-[11px] font-black text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full border border-teal-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Filtered by: {catalog.find((t) => t.id === selectedTestType)?.name || selectedTestType}</span>
                      <span className="text-teal-500 hover:text-teal-900">&times;</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Total Period Billings: {formatCentsGHC(stats.periodRevenueCents)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {catalog.length} Available Tests
                  </span>
                </div>
              </div>

              {/* Horizontal Table: test | amount | number done */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="py-3 px-5">Test</th>
                        <th className="py-3 px-5">Amount</th>
                        <th className="py-3 px-5 text-right">Number Done</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {catalog.map((t) => {
                        const count = stats.testCounts[t.id] || 0;
                        const rev = stats.testRevenues[t.id] || 0;
                        const isSelected = selectedTestType === t.id;

                        return (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTestType(isSelected ? 'All' : t.id)}
                            className={`transition-colors cursor-pointer select-none ${isSelected
                                ? 'bg-teal-50/90 hover:bg-teal-100/80 font-bold'
                                : 'hover:bg-slate-50'
                              }`}
                          >
                            {/* 1. Test Name & Category */}
                            <td className="py-3 px-5">
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected
                                      ? 'bg-teal-600 ring-2 ring-teal-400'
                                      : count > 0
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300'
                                    }`}
                                />
                                <div>
                                  <div
                                    className={`text-xs ${isSelected
                                        ? 'text-teal-950 font-black'
                                        : 'text-slate-900 font-bold'
                                      }`}
                                  >
                                    {t.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {t.category || 'General Diagnostic'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Amount (Price & Total Generated) */}
                            <td className="py-3 px-5">
                              <div className="flex items-center space-x-2.5">
                                <span className="font-mono font-black text-slate-900 text-xs">
                                  {formatCentsGHC(t.priceCents || 0)}
                                </span>
                                {count > 0 && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                                    Total: {formatCentsGHC(rev)}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 3. Number Done */}
                            <td className="py-3 px-5 text-right">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${count > 0
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs font-mono'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                  }`}
                              >
                                {count} {count === 1 ? 'done' : 'done'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cyno-styled "Employees" Laboratory Audit & Records Section */}
            <div className="bg-white  rounded-[2rem] border border-slate-100  shadow-sm overflow-hidden">
              {/* Header & Search Bar */}
              <div className="p-6 border-b border-slate-100  flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 ">
                    Laboratory Records &amp; Audits
                  </h3>
                  <p className="text-xs text-slate-500  mt-0.5">
                    Showing {filteredReports.length} recorded patient results with color-coded scientists
                  </p>
                </div>

                {/* Search Pill Input (Cyno style) */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search employee, patient, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-200  bg-slate-50  text-slate-900  text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all placeholder:text-slate-400"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills Row (Cyno style) */}
              <div className="px-6 py-4 bg-slate-50/70 /50 border-b border-slate-100  flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Scientist Dropdown with Color Indicators */}
                  <div className="relative">
                    <select
                      value={selectedScientist}
                      onChange={(e) => setSelectedScientist(e.target.value)}
                      className="px-4 py-2 rounded-full border border-slate-200  bg-white  text-slate-800  font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer shadow-2xs"
                    >
                      <option value="All">All Scientists</option>
                      {scientistUsers.map((sc) => (
                        <option key={sc.username} value={sc.displayName}>
                          {sc.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Period Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="px-4 py-2 rounded-full border border-slate-200  bg-white  text-slate-800  font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer shadow-2xs"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today Only</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="this_week">Past 7 Days</option>
                      <option value="this_month">This Month</option>
                      <option value="last_month">Last Month</option>
                      <option value="custom">Custom Date...</option>
                    </select>
                  </div>

                  {/* Test Type Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedTestType}
                      onChange={(e) => setSelectedTestType(e.target.value)}
                      className="px-4 py-2 rounded-full border border-slate-200  bg-white  text-slate-800  font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer shadow-2xs"
                    >
                      <option value="All">All Test Types</option>
                      {catalog.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(searchTerm || selectedScientist !== 'All' || selectedDateFilter !== 'all' || selectedTestType !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedScientist('All');
                        setSelectedDateFilter('all');
                        setSelectedTestType('All');
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center space-x-1 cursor-pointer px-2"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {filteredReports.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-white  hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700  border border-slate-200  rounded-full text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Download CSV</span>
                  </button>
                )}
              </div>

              {/* Custom Date Range Picker */}
              {selectedDateFilter === 'custom' && (
                <div className="px-6 py-3 bg-amber-50/40 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center space-x-3 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200">Custom Range:</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-slate-300  bg-white  text-slate-900 "
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-slate-300  bg-white  text-slate-900 "
                  />
                </div>
              )}

              {/* Data Table (Cyno style) */}
              {filteredReports.length === 0 ? (
                <div className="p-14 text-center text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30 text-teal-600" />
                  <p className="text-sm font-bold text-slate-600 ">
                    No results match the current filters.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting the search query or clearing the date/scientist filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100  font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-6">Patient Name</th>
                        <th className="py-3.5 px-4">Demographics</th>
                        <th className="py-3.5 px-4">Sample / Receipt</th>
                        <th className="py-3.5 px-4">Scientist (Color-Coded)</th>
                        <th className="py-3.5 px-4">Diagnostic Panels</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredReports.map((report) => {
                        const dateStr = new Date(report.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        });
                        const perf = report.performedByName || report.performedBy || 'Dorean';
                        const theme = getScientistTheme(perf, scientistUsers);

                        return (
                          <tr
                            key={report.id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Patient Name with avatar initial */}
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100  text-slate-700  font-black text-xs flex items-center justify-center shrink-0">
                                  {report.patient?.name ? report.patient.name.charAt(0).toUpperCase() : 'P'}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 ">
                                    {report.patient?.name || 'Unnamed'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {report.patient?.requestedBy ? `Req: ${report.patient.requestedBy}` : 'Self-Referral'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Demographics */}
                            <td className="py-4 px-4 font-semibold text-slate-700 ">
                              {report.patient?.sex}, {report.patient?.age}y
                            </td>

                            {/* Sample & Receipt */}
                            <td className="py-4 px-4">
                              <div className="font-mono font-bold text-slate-900  text-[11px]">
                                {report.patient?.sampleId || '-'}
                              </div>
                              <div className="font-mono text-slate-400 text-[10px]">
                                {report.patient?.receiptNumber || '-'}
                              </div>
                            </td>

                            {/* Scientist (COLOR CODED!) */}
                            <td className="py-4 px-4">
                              <div className="inline-flex items-center space-x-2 py-1 px-2.5 rounded-full border shadow-2xs"
                                style={{
                                  borderColor: theme.hex + '40',
                                  backgroundColor: theme.hex + '12',
                                }}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                                  style={{ backgroundColor: theme.hex }}
                                />
                                <span
                                  className="font-black text-[11px]"
                                  style={{ color: theme.hex }}
                                >
                                  {perf}
                                </span>
                              </div>
                            </td>

                            {/* Diagnostic Panels */}
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-1">
                                {report.selectedTests?.map((st) => (
                                  <span
                                    key={st.testId}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80"
                                  >
                                    {st.testId.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4">
                              {report.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Pending</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Completed</span>
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 font-mono text-[11px] text-slate-500 ">
                              {dateStr}
                            </td>

                            {/* Action Button */}
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => onViewReport(report)}
                                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white rounded-full text-xs font-bold transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                                title="Reprint full clinical report"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Reprint</span>
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
        )}

        {/* ======================================================== */}
        {/* TAB 2: LAB TESTS & PARAMETERS (ADMIN RIGHTS) */}
        {/* ======================================================== */}
        {activeAdminTab === 'catalog' && (
          <div className="bg-white/90 /90 backdrop-blur-md rounded-[2rem] shadow-xs border border-slate-200/80  p-6 sm:p-8 space-y-6">
            {catalogSavedAlert && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full px-5 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Lab tests and reference ranges successfully saved!</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 ">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 ">
                  Laboratory Test Directory & Parameter Editor
                </h3>
                <p className="text-xs text-slate-500 ">
                  Exclusive administrator rights to create new lab tests, add parameters, and adjust male/female ranges.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(true)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Lab Test</span>
                </button>
              </div>
            </div>

            {/* Test Selector, Price Editor and Add Parameter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Select Test:
                  </label>
                  <select
                    value={selectedCatalogTestId}
                    onChange={(e) => setSelectedCatalogTestId(e.target.value)}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-full text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  >
                    {localCatalog.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price (GH₵) Editor */}
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
                  <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    Price (GH₵):
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentTestDef.priceCents !== undefined ? (currentTestDef.priceCents / 100) : ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const cents = isNaN(val) ? 0 : Math.round(val * 100);
                      const updated = localCatalog.map((t) =>
                        t.id === currentTestDef.id ? { ...t, priceCents: cents } : t
                      );
                      setLocalCatalog(updated);
                      onSaveCatalog(updated);
                    }}
                    className="w-20 px-2 py-0.5 rounded text-xs font-black text-emerald-700 bg-emerald-50/50 border border-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddParamModal(true)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-750 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800  rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter to {currentTestDef.name}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = await askConfirm({
                      title: 'Factory Reset All Catalog Ranges?',
                      message: 'This will reset all lab test parameters, units, and reference ranges to system factory defaults.',
                      confirmText: 'Reset to Defaults',
                      isDestructive: true,
                    });
                    if (confirmed) {
                      onResetCatalog();
                      setLocalCatalog([...catalog]);
                      showSuccess('Reference ranges reset to factory defaults.');
                    }
                  }}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 text-xs font-medium cursor-pointer"
                >
                  Factory Reset
                </button>
              </div>
            </div>

            {/* Editable Table */}
            <div className="border border-slate-200  rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50  border-b border-slate-200  font-bold text-slate-600  uppercase">
                    <th className="py-2.5 px-3">Parameter Name</th>
                    <th className="py-2.5 px-2 w-20">Unit</th>
                    <th className="py-2.5 px-2 w-28">Type</th>
                    <th className="py-2.5 px-2">Limits / Sex Ranges</th>
                    <th className="py-2.5 px-3">Display Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentTestDef.parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 ">
                        <input
                          type="text"
                          value={param.name}
                          onChange={(e) =>
                            updateParameter(currentTestDef.id, param.id, { name: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-600 bg-transparent"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={param.unit}
                          onChange={(e) =>
                            updateParameter(currentTestDef.id, param.id, { unit: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-600 font-mono text-[11px] bg-transparent text-slate-800 "
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <select
                          value={param.rangeType}
                          onChange={(e) =>
                            updateParameter(currentTestDef.id, param.id, {
                              rangeType: e.target.value as any,
                            })
                          }
                          className="w-full px-1.5 py-1 rounded border border-slate-200  bg-white  text-[11px] text-slate-900 "
                        >
                          <option value="min_max">Min–Max</option>
                          <option value="less_than">&lt; Upper Limit</option>
                          <option value="greater_than">&gt; Lower Limit</option>
                          <option value="qualitative">Qualitative</option>
                          <option value="text">Text / None</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-2">
                        {param.isSexSpecific ? (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center space-x-1">
                              <span className="w-12 font-bold text-blue-700 dark:text-blue-400">Male:</span>
                              <input
                                type="text"
                                value={param.maleMin ?? ''}
                                onChange={(e) => {
                                  const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                  updateParameter(currentTestDef.id, param.id, { maleMin: num });
                                }}
                                className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                              />
                              <span>–</span>
                              <input
                                type="text"
                                value={param.maleMax ?? ''}
                                onChange={(e) => {
                                  const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                  updateParameter(currentTestDef.id, param.id, { maleMax: num });
                                }}
                                className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="w-12 font-bold text-rose-700 dark:text-rose-400">Female:</span>
                              <input
                                type="text"
                                value={param.femaleMin ?? ''}
                                onChange={(e) => {
                                  const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                  updateParameter(currentTestDef.id, param.id, { femaleMin: num });
                                }}
                                className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                              />
                              <span>–</span>
                              <input
                                type="text"
                                value={param.femaleMax ?? ''}
                                onChange={(e) => {
                                  const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                  updateParameter(currentTestDef.id, param.id, { femaleMax: num });
                                }}
                                className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              placeholder="Min"
                              value={param.min ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { min: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                            />
                            <span>–</span>
                            <input
                              type="text"
                              placeholder="Max"
                              value={param.max ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { max: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200  rounded bg-white  text-slate-900 "
                            />
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={param.referenceRangeText}
                          onChange={(e) =>
                            updateParameter(currentTestDef.id, param.id, {
                              referenceRangeText: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 rounded border border-slate-200  bg-white  text-slate-900  text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 ">
              <button
                type="button"
                onClick={handleSaveCatalogChanges}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Catalog Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MANAGE SCIENTISTS (ADD / EDIT / REMOVE) */}
        {/* ======================================================== */}
        {activeAdminTab === 'scientists' && (
          <div className="bg-white/90 /90 backdrop-blur-md rounded-[2rem] shadow-xs border border-slate-200/80  p-6 sm:p-8 space-y-6">
            {userSavedAlert && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full px-5 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Scientist accounts updated successfully!</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 ">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 ">
                  Authorized Laboratory Scientists
                </h3>
                <p className="text-xs text-slate-500 ">
                  Exclusive administrator rights to add new scientists, change passwords, and remove staff.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddScientistModal(true)}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-bold flex items-center space-x-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Scientist</span>
              </button>
            </div>

            {/* Scientists List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localUsers.map((u, idx) => {
                const isAdmin = u.role === 'admin';
                return (
                  <div
                    key={u.username}
                    className="p-5 rounded-2xl border border-slate-200  bg-slate-50  space-y-3.5 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs ${isAdmin ? 'bg-slate-900' : 'bg-teal-700'
                            }`}
                        >
                          {isAdmin ? <Shield className="w-4 h-4" /> : u.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 ">
                            {u.displayName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            @{u.username}
                          </div>
                        </div>
                      </div>

                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScientist(u.username)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Remove Scientist Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Display Name (Printed on Signature)
                        </label>
                        <input
                          type="text"
                          value={u.displayName}
                          onChange={(e) => handleUpdateScientist(idx, { displayName: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300  bg-white  text-slate-900  text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Password
                        </label>
                        <input
                          type="text"
                          value={u.password || ''}
                          onChange={(e) => handleUpdateScientist(idx, { password: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300  bg-white  text-slate-900  text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Professional Title / Qualification
                        </label>
                        <input
                          type="text"
                          value={u.title}
                          onChange={(e) => handleUpdateScientist(idx, { title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300  bg-white  text-slate-900  text-xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 ">
              <button
                type="button"
                onClick={handleSaveAllScientists}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Accounts</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FACILITY HEADER & LOGO */}
        {/* ======================================================== */}
        {activeAdminTab === 'facility' && (
          <div className="bg-white/90 /90 backdrop-blur-md rounded-[2rem] shadow-xs border border-slate-200/80  p-6 sm:p-8 space-y-6">
            {facilitySavedAlert && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full px-5 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Facility details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveFacility} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100  pb-2">
                  Report Header Details (Printed on Every Page)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700  mb-1">
                      Facility Name (Header Left Line 1)
                    </label>
                    <input
                      type="text"
                      required
                      value={localFacility.facilityName}
                      onChange={(e) => setLocalFacility({ ...localFacility, facilityName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700  mb-1">
                      P.O. Box (Header Right Line 1)
                    </label>
                    <input
                      type="text"
                      value={localFacility.poBox}
                      onChange={(e) => setLocalFacility({ ...localFacility, poBox: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700  mb-1">
                      Physical Address (Header Left Line 2)
                    </label>
                    <input
                      type="text"
                      value={localFacility.address}
                      onChange={(e) => setLocalFacility({ ...localFacility, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700  mb-1">
                      Telephone (Header Right Line 2)
                    </label>
                    <input
                      type="text"
                      value={localFacility.telephone}
                      onChange={(e) => setLocalFacility({ ...localFacility, telephone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700  mb-1">
                      Service Subtitle (Centered Line 3)
                    </label>
                    <input
                      type="text"
                      value={localFacility.serviceTitle}
                      onChange={(e) => setLocalFacility({ ...localFacility, serviceTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-sm font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3 pt-4 border-t border-slate-100 ">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Facility Logo (Rendered as Perfect Circle)
                </h3>
                <div className="flex items-center space-x-4">
                  {localFacility.logoUrl ? (
                    <div className="relative group">
                      <div className="w-24 h-24 aspect-square rounded-full overflow-hidden border-2 border-teal-500 bg-white p-1 shadow-md flex items-center justify-center">
                        <img
                          src={localFacility.logoUrl}
                          alt="Facility Logo"
                          className="w-full h-full object-contain aspect-square rounded-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocalFacility({ ...localFacility, logoUrl: '' })}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1.5 shadow-xs hover:bg-rose-700 cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 aspect-square rounded-full border-2 border-dashed border-slate-300  flex items-center justify-center text-slate-400 text-xs text-center p-2">
                      No Logo
                    </div>
                  )}
                  <label className="cursor-pointer px-5 py-2.5 bg-slate-100  hover:bg-slate-200 dark:hover:bg-slate-750 rounded-full text-xs font-bold text-slate-800  border border-slate-300 ">
                    <span>Upload Logo Image</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 ">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Header Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SYSTEM BACKUP & TRANSFER */}
        {/* ======================================================== */}
        {activeAdminTab === 'backup' && (
          <div className="bg-white/90 /90 backdrop-blur-md rounded-[2rem] shadow-xs border border-slate-200/80  p-6 sm:p-8 space-y-6">
            <div className="max-w-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900  mb-1">Export Full Lab Database</h3>
                <p className="text-xs text-slate-500  mb-3">
                  Download a JSON file containing all facility settings, test definitions, scientist accounts, and archived patient reports.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-full flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Database Backup (.JSON)</span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-200 ">
                <h3 className="text-sm font-bold text-slate-900  mb-1">Restore from Backup</h3>
                <p className="text-xs text-slate-500  mb-3">
                  Upload a JSON database backup file to restore records on this workstation.
                </p>
                <label className="cursor-pointer inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100  hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800  rounded-full text-xs font-bold border border-slate-300 ">
                  <UploadCloud className="w-4 h-4 text-teal-600" />
                  <span>Choose Backup File (.JSON)</span>
                  <input type="file" accept=".json,application/json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW SCIENTIST */}
      {showAddScientistModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-[2rem] shadow-xl border border-slate-200  max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100  pb-3">
              <h3 className="font-extrabold text-base text-slate-900  flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>Add New Lab Scientist</span>
              </h3>
              <button onClick={() => setShowAddScientistModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScientist} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700  mb-1">
                  Scientist Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi Mensah"
                  value={newScientistName}
                  onChange={(e) => setNewScientistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700  mb-1">
                  Login Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi"
                  value={newScientistUsername}
                  onChange={(e) => setNewScientistUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700  mb-1">
                  Login Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newScientistPassword}
                  onChange={(e) => setNewScientistPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700  mb-1">
                  Professional Qualification / Title
                </label>
                <input
                  type="text"
                  value={newScientistTitle}
                  onChange={(e) => setNewScientistTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 ">
                <button
                  type="button"
                  onClick={() => setShowAddScientistModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-bold cursor-pointer"
                >
                  Create Scientist Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW LAB TEST (ADMIN) */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-[2rem] shadow-xl border border-slate-200  max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100  flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900  text-base">
                  Admin: Add New Laboratory Test Panel
                </h3>
                <p className="text-xs text-slate-500 ">
                  Define a new diagnostic test and its measurable analytes.
                </p>
              </div>
              <button onClick={() => setShowAddTestModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewLabTest} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lab Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LIPID PROFILE"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical Chemistry"
                    value={newTestCategory}
                    onChange={(e) => setNewTestCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (GH₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="80.00"
                    value={newTestPrice}
                    onChange={(e) => setNewTestPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 ">
                    Parameters / Analytes
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewTestParams([...newTestParams, { name: '', unit: '', refRange: '', min: '', max: '' }])}
                    className="text-xs text-teal-600 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newTestParams.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50  p-2.5 rounded-xl border border-slate-200 dark:border-slate-750">
                      <input
                        type="text"
                        placeholder="Parameter Name"
                        value={cp.name}
                        onChange={(e) => {
                          const updated = [...newTestParams];
                          updated[idx].name = e.target.value;
                          setNewTestParams(updated);
                        }}
                        className="flex-2 px-3 py-1.5 rounded-lg border border-slate-300  text-xs bg-white  text-slate-900 "
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={cp.unit}
                        onChange={(e) => {
                          const updated = [...newTestParams];
                          updated[idx].unit = e.target.value;
                          setNewTestParams(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300  text-xs bg-white  text-slate-900 "
                      />
                      <input
                        type="text"
                        placeholder="Min"
                        value={cp.min || ''}
                        onChange={(e) => {
                          const updated = [...newTestParams];
                          updated[idx].min = e.target.value;
                          setNewTestParams(updated);
                        }}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-300  text-xs bg-white  text-slate-900 "
                      />
                      <input
                        type="text"
                        placeholder="Max"
                        value={cp.max || ''}
                        onChange={(e) => {
                          const updated = [...newTestParams];
                          updated[idx].max = e.target.value;
                          setNewTestParams(updated);
                        }}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-300  text-xs bg-white  text-slate-900 "
                      />
                      {newTestParams.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewTestParams(newTestParams.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100  flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-full cursor-pointer"
                >
                  Save & Publish Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PARAMETER TO EXISTING TEST (ADMIN) */}
      {showAddParamModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white  rounded-[2rem] shadow-xl border border-slate-200  max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100  pb-3">
              <h3 className="font-extrabold text-base text-slate-900 ">
                Add Parameter to {currentTestDef.name}
              </h3>
              <button onClick={() => setShowAddParamModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddParamToCurrentTest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700  mb-1">Parameter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ferritin"
                  value={newParamName}
                  onChange={(e) => setNewParamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700  mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="ng/mL"
                    value={newParamUnit}
                    onChange={(e) => setNewParamUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300  bg-white  text-slate-900 "
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700  mb-1">Min</label>
                  <input
                    type="text"
                    placeholder="30"
                    value={newParamMin}
                    onChange={(e) => setNewParamMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300  bg-white  text-slate-900 "
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700  mb-1">Max</label>
                  <input
                    type="text"
                    placeholder="400"
                    value={newParamMax}
                    onChange={(e) => setNewParamMax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300  bg-white  text-slate-900 "
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700  mb-1">Reference Range Text</label>
                <input
                  type="text"
                  placeholder="e.g. 30.0–400.0"
                  value={newParamRefText}
                  onChange={(e) => setNewParamRefText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300  bg-white  text-slate-900  focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 ">
                <button
                  type="button"
                  onClick={() => setShowAddParamModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-bold cursor-pointer"
                >
                  Add Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
