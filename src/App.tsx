import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Step1Patient } from './components/Step1Patient';
import { Step2SelectTests } from './components/Step2SelectTests';
import { Step3EnterResults } from './components/Step3EnterResults';
import { Step4PreviewReport } from './components/Step4PreviewReport';
import { RecentReportsModal } from './components/RecentReportsModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginPortal } from './components/LoginPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ScientistDashboard } from './components/ScientistDashboard';
import { NotFoundPage } from './components/NotFoundPage';
import { ClinicalLoadingScreen } from './components/ClinicalLoadingScreen';
import { ArrowLeft } from './components/Icons';
import { useToast } from './context/ToastContext';
import {
  PatientDetails,
  SelectedTestState,
  FacilitySettings,
  LabTest,
  SavedReport,
  UserAccount,
} from './types';
import {
  loadFacilitySettings,
  saveFacilitySettings,
  loadTestCatalog,
  saveTestCatalog,
  resetTestCatalog,
  loadSavedReports,
  saveReport,
  deleteReport,
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  clearCurrentUser,
} from './utils/storage';
import { getActiveUserSession, signOutSupabase } from './services/authService';
import { fetchCatalogSupabase, createCustomTestSupabase } from './services/catalogService';
import { fetchAllReportsSupabase, saveReportSupabase } from './services/reportsService';
import { fetchDoctorsList } from './services/doctorsService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const getInitialPatient = (): PatientDetails => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return {
    name: '',
    sex: 'Female',
    age: '',
    sampleCollectionDate: today,
    collectionTime: now,
    resultsDate: today,
    sampleId: '',
    sampleType: 'Blood',
    sampleTypes: ['Blood'],
    receiptNumber: '',
    requestedBy: 'Self',
  };
};

export const App: React.FC = () => {
  const { showSuccess, showInfo, showWarning, askConfirm } = useToast();

  // 404 Route Detection
  const [isNotFound, setIsNotFound] = useState<boolean>(() => {
    return window.location.pathname !== '/' && window.location.pathname !== '';
  });

  // Global Clinical Loading State
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  // Authentication & Current User State (null = show Login Portal)
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(getCurrentUser);

  // Navigation & View State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'recent' | 'settings'>('dashboard');
  const [adminViewingReport, setAdminViewingReport] = useState<SavedReport | null>(null);

  // Core Data State
  const [facilitySettings, setFacilitySettingsState] = useState<FacilitySettings>(loadFacilitySettings);
  const [catalog, setCatalogState] = useState<LabTest[]>(loadTestCatalog);
  const [recentReports, setRecentReports] = useState<SavedReport[]>(loadSavedReports);

  // Active Report State - starts blank for a fresh entry
  const [patient, setPatient] = useState<PatientDetails>(getInitialPatient);
  const [selectedTests, setSelectedTests] = useState<SelectedTestState[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string>(() => `rep_${Date.now()}`);

  // Synchronize reports from Supabase into application state
  const refreshReports = async () => {
    try {
      const supaReports = await fetchAllReportsSupabase();
      if (supaReports && supaReports.length > 0) {
        setRecentReports(supaReports);
      }
    } catch (err) {
      console.error('Failed to sync reports from Supabase:', err);
    }
  };

  // URL route change listener for 404 page handling
  useEffect(() => {
    const handleLocationChange = () => {
      setIsNotFound(window.location.pathname !== '/' && window.location.pathname !== '');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Enforce light mode across the entire application and initialize Supabase data
  useEffect(() => {
    document.documentElement.classList.remove('dark');

    const initData = async () => {
      try {
        await Promise.allSettled([
          getActiveUserSession().then((sessionUser) => {
            if (sessionUser) {
              setCurrentUserState(sessionUser);
            }
          }),
          fetchCatalogSupabase().then((supaCatalog) => {
            if (supaCatalog && supaCatalog.length > 0) {
              setCatalogState(supaCatalog);
            }
          }),
          refreshReports(),
          fetchDoctorsList().then((doctors) => {
            if (doctors && doctors.length > 0) {
              setFacilitySettingsState((prev) => ({ ...prev, doctors }));
            }
          }),
        ]);
      } catch (e) {
        console.error('Initialization error:', e);
      } finally {
        setIsAppLoading(false);
      }
    };

    initData();

    // Realtime Supabase updates: Listen for any new or finalized reports
    let channel: any = null;
    if (isSupabaseConfigured()) {
      channel = supabase
        .channel('realtime_reports_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'reports' },
          () => {
            refreshReports();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'lab_requests' },
          () => {
            refreshReports();
          }
        )
        .subscribe();
    }

    // Background auto-refresh polling interval (every 4 seconds) to guarantee immediate reflection
    const pollInterval = setInterval(() => {
      refreshReports();
    }, 4000);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearInterval(pollInterval);
    };
  }, []);

  const handleLogin = (user: UserAccount) => {
    persistCurrentUser(user);
    setCurrentUserState(user);
    setAdminViewingReport(null);
    refreshReports();

    // Guarantee isolated fresh intake workspace for the logged in user
    setPatient(getInitialPatient());
    setSelectedTests([
      {
        testId: 'fbc',
        selectedParameterIds: [
          'wbc', 'lym_pct', 'mid_pct', 'gran_pct', 'lym_hash', 'mid_hash', 'gran_hash',
          'rbc', 'hgb', 'hct', 'mcv', 'mch', 'mchc', 'rdw_sd', 'rdw_cv', 'plt', 'mpv',
          'pdw', 'pct', 'p_lcr', 'rcdw', 'lcdw',
        ],
        results: {},
        comments: '',
      },
    ]);
    setCurrentReportId(`rep_${Date.now()}`);
    setCurrentStep(1);
    setActiveTab('dashboard');
  };

  // Auto-save active intake or test entry as a "Pending Result"
  const handleAutoSavePending = (
    currentPatient: PatientDetails = patient,
    currentTests: SelectedTestState[] = selectedTests,
    notify: boolean = false
  ) => {
    if (!currentPatient.name || !currentPatient.name.trim()) return;

    const scientistUsername = currentUser?.username || 'Unknown';
    const scientistName = currentUser?.displayName || 'Unknown';
    const scientistTitle = currentUser?.title || 'Medical Laboratory Scientist';

    const existing = recentReports.find((r) => r.id === currentReportId);

    const reportToSave: SavedReport = {
      id: currentReportId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      performedBy: scientistUsername,
      performedByName: scientistName,
      performedByTitle: scientistTitle,
      patient: currentPatient,
      selectedTests: (currentTests || []).map((st) => ({
        ...st,
        priceCents: st.priceCents ?? catalog.find((c) => c.id === st.testId)?.priceCents ?? 0,
      })),
      facilitySettings,
    };

    const updated = saveReport(reportToSave);
    setRecentReports(updated);
    saveReportSupabase(reportToSave, currentUser).catch((e) => console.error(e));
    if (notify) {
      showSuccess(`Patient intake recorded as Pending Workup on your dashboard.`);
    }
  };

  const handleLogout = async () => {
    const displayName = currentUser?.displayName || 'User';

    // Check if the scientist was in the middle of entering patient details
    const hasActiveIntake = Boolean(patient.name && patient.name.trim().length > 0);
    const isCompleted = recentReports.some(
      (r) => r.id === currentReportId && r.status === 'completed'
    );

    if (hasActiveIntake && !isCompleted) {
      // Auto-save active progress to Pending Workups so nothing is ever lost
      handleAutoSavePending(patient, selectedTests, false);

      const confirmed = await askConfirm({
        title: 'Pending Lab Workup in Progress',
        message: `You were working on a test workup for "${patient.name}". It has been recorded as a Pending Result on your dashboard so you or your colleagues can resume it anytime. Are you sure you want to sign out now?`,
        confirmText: 'Yes, Sign Out (Keep in Pending)',
        cancelText: 'Stay & Continue',
        isDestructive: false,
        iconType: 'alert',
      });

      if (!confirmed) {
        showInfo('Logout cancelled. Session remains active.');
        return;
      }
    } else {
      const confirmed = await askConfirm({
        title: 'Sign Out of Laboratory System?',
        message: `Are you sure you want to log out of ${displayName}'s session?`,
        confirmText: 'Yes, Sign Out',
        cancelText: 'Stay Signed In',
        isDestructive: true,
        iconType: 'logout',
      });

      if (!confirmed) {
        showInfo('Logout cancelled. Session remains active.');
        return;
      }
    }

    // ISOLATION GUARANTEE: Reset in-memory active form state completely so the next scientist gets a fresh blank slate!
    setPatient(getInitialPatient());
    setSelectedTests([]);
    setCurrentReportId(`rep_${Date.now()}`);
    setCurrentStep(1);
    setActiveTab('dashboard');
    setAdminViewingReport(null);

    await signOutSupabase(currentUser);
    clearCurrentUser();
    setCurrentUserState(null);
    showSuccess(`Successfully signed out. Workspace reset for the next user.`);
  };

  // Handlers for Facility Settings
  const handleSaveFacilitySettings = (newSettings: FacilitySettings) => {
    saveFacilitySettings(newSettings);
    setFacilitySettingsState(newSettings);
  };

  // Handlers for Catalog & Ranges
  const handleSaveCatalog = (newCatalog: LabTest[]) => {
    saveTestCatalog(newCatalog);
    setCatalogState(newCatalog);
  };

  const handleResetCatalog = () => {
    const defaultCatalog = resetTestCatalog();
    setCatalogState(defaultCatalog);
  };

  const handleAddCustomTest = async (newTest: LabTest) => {
    const updated = [...catalog, newTest];
    saveTestCatalog(updated);
    setCatalogState(updated);
    await createCustomTestSupabase(newTest);
  };

  const areAllResultsFilled = (tests: SelectedTestState[], cat: LabTest[]): boolean => {
    if (!tests || tests.length === 0) return false;
    let totalParamCount = 0;
    for (const st of tests) {
      const def = cat.find((c) => c.id === st.testId);
      if (!def) return false;
      const activeIds = st.selectedParameterIds || [];
      if (activeIds.length === 0) continue;
      for (const pid of activeIds) {
        totalParamCount++;
        const val = st.results ? st.results[pid] : undefined;
        if (val === undefined || val === null || val.trim() === '') {
          return false;
        }
      }
    }
    return totalParamCount > 0;
  };

  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true;
    const step1Valid = patient.name.trim().length > 0 && patient.age.trim().length > 0;
    if (step === 2) return step1Valid;

    const hasSelectedTests =
      selectedTests.length > 0 && selectedTests.some((st) => st.selectedParameterIds.length > 0);
    const step2Valid = step1Valid && hasSelectedTests;
    if (step === 3) return step2Valid;

    const step3Valid = step2Valid && areAllResultsFilled(selectedTests, catalog);
    if (step === 4) return step3Valid;

    return false;
  };

  // New Patient action
  const handleNewPatient = async () => {
    if (patient.name.trim()) {
      const confirmNew = await askConfirm({
        title: 'Start New Patient Report?',
        message: 'Ensure you have printed or saved the current report before clearing.',
        confirmText: 'Start New Report',
      });
      if (!confirmNew) return;
    }
    setPatient(getInitialPatient());
    setSelectedTests([
      {
        testId: 'fbc',
        selectedParameterIds: [
          'wbc', 'lym_pct', 'mid_pct', 'gran_pct', 'lym_hash', 'mid_hash', 'gran_hash',
          'rbc', 'hgb', 'hct', 'mcv', 'mch', 'mchc', 'rdw_sd', 'rdw_cv', 'plt', 'mpv',
          'pdw', 'pct', 'p_lcr', 'rcdw', 'lcdw',
        ],
        results: {},
        comments: '',
      },
    ]);
    setCurrentReportId(`rep_${Date.now()}`);
    setCurrentStep(1);
    setActiveTab('report');
  };

  // Save current report with recorded scientist credentials and marked 'completed'
  const handleSaveCurrentReport = async () => {
    const scientistUsername = currentUser?.username || 'Unknown';
    const scientistName = currentUser?.displayName || 'Unknown';
    const scientistTitle = currentUser?.title || 'Medical Laboratory Scientist';

    const existing = recentReports.find((r) => r.id === currentReportId);

    const report: SavedReport = {
      id: currentReportId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      performedBy: scientistUsername,
      performedByName: scientistName,
      performedByTitle: scientistTitle,
      patient,
      selectedTests: (selectedTests || []).map((st) => ({
        ...st,
        priceCents: st.priceCents ?? catalog.find((c) => c.id === st.testId)?.priceCents ?? 0,
      })),
      facilitySettings,
    };
    const updated = await saveReportSupabase(report, currentUser);
    setRecentReports(updated);
    showSuccess(`Report finalized & saved as Completed under scientist ${scientistName}!`);
  };

  // Reopen existing completed report in preview/print
  const handleOpenReport = (report: SavedReport) => {
    setPatient(report.patient);
    setSelectedTests(report.selectedTests || []);
    setCurrentReportId(report.id);
    setActiveTab('report');
    setCurrentStep(4);
  };

  // Resume an in-progress or pending report to enter/finish test results
  const handleResumeReport = (report: SavedReport) => {
    setPatient(report.patient);
    setSelectedTests(report.selectedTests || []);
    setCurrentReportId(report.id);
    setActiveTab('report');
    // If tests are already selected, jump directly to Step 3 (Enter Results)!
    // If not, go to Step 2 (Select Tests).
    if (report.selectedTests && report.selectedTests.length > 0) {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
    showInfo(`Resumed workup for ${report.patient.name}. You can enter results when ready.`);
  };

  // Duplicate past report
  const handleDuplicateReport = (report: SavedReport) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    setPatient({
      ...report.patient,
      name: `${report.patient.name} (Copy)`,
      sampleCollectionDate: today,
      resultsDate: today,
      collectionTime: now,
      sampleId: '',
      receiptNumber: '',
    });

    const clearedTests = report.selectedTests.map((st) => ({
      ...st,
      results: {},
      comments: '',
    }));

    setSelectedTests(clearedTests);
    setCurrentReportId(`rep_${Date.now()}`);
    setActiveTab('report');
    setCurrentStep(1);
  };

  const handleDeleteReport = (reportId: string) => {
    const updated = deleteReport(reportId);
    setRecentReports(updated);
  };

  // 0. 404 Route Gate
  if (isNotFound) {
    return (
      <NotFoundPage
        onReturnHome={() => {
          window.history.pushState({}, '', '/');
          setIsNotFound(false);
        }}
      />
    );
  }

  // 1. Clinical Data Loading Screen
  if (isAppLoading) {
    return (
      <ClinicalLoadingScreen
        message="Connecting to Care & Social Polyclinic LIS..."
        onRetry={() => {
          setIsAppLoading(true);
          refreshReports().finally(() => setIsAppLoading(false));
        }}
        onBypass={() => setIsAppLoading(false)}
      />
    );
  }

  // 2. GATE: If user is not logged in, show Full-Screen Login Portal!
  if (!currentUser) {
    return (
      <LoginPortal
        facilitySettings={facilitySettings}
        onLogin={handleLogin}
      />
    );
  }

  // 2. ADMIN PORTAL: Admin only has access to statistics and auditing!
  if (currentUser.role === 'admin') {
    // If admin is viewing a specific patient report for printing/auditing
    if (adminViewingReport) {
      return (
        <div className="min-h-screen bg-slate-50 font-sans transition-colors">
          <div className="no-print max-w-5xl mx-auto px-4 pt-6 pb-2">
            <button
              onClick={() => setAdminViewingReport(null)}
              className="px-5 py-2.5 bg-slate-950 hover:bg-black text-white text-xs font-extrabold rounded-full flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Statistics Dashboard</span>
            </button>
          </div>
          <Step4PreviewReport
            catalog={catalog}
            selectedTests={adminViewingReport.selectedTests}
            patient={adminViewingReport.patient}
            facilitySettings={facilitySettings}
            currentUser={currentUser}
            isAlreadySaved={true}
            onEdit={() => { }}
            onSaveReport={() => { }}
            onNewPatient={() => setAdminViewingReport(null)}
          />
        </div>
      );
    }

    return (
      <AdminDashboard
        currentUser={currentUser}
        reports={recentReports}
        catalog={catalog}
        onSaveCatalog={handleSaveCatalog}
        onResetCatalog={handleResetCatalog}
        facilitySettings={facilitySettings}
        onSaveFacilitySettings={handleSaveFacilitySettings}
        onLogout={handleLogout}
        onViewReport={(rep) => setAdminViewingReport(rep)}
      />
    );
  }

  // 3. SCIENTIST WORKBENCH: For scientists to perform and enter patient tests
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans transition-colors">
      {/* Header */}
      <Header
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facilitySettings={facilitySettings}
        recentCount={recentReports.length}
        currentUser={currentUser}
        onOpenSwitchUser={handleLogout}
        onNewPatient={handleNewPatient}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Scientist Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="animate-slide-up">
            <ScientistDashboard
              reports={recentReports}
              currentUser={currentUser}
              onNewPatient={handleNewPatient}
              onViewReport={handleOpenReport}
              onResumeReport={handleResumeReport}
            />
          </div>
        )}

        {/* Active Report View */}
        {activeTab === 'report' && (
          <div>
            {currentStep === 1 && (
              <div key="step-1" className="animate-slide-up">
                <Step1Patient
                  patient={patient}
                  facilitySettings={facilitySettings}
                  onChange={setPatient}
                  onNext={() => {
                    handleAutoSavePending(patient, selectedTests, true);
                    setCurrentStep(2);
                  }}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div key="step-2" className="animate-slide-up">
                <Step2SelectTests
                  catalog={catalog}
                  selectedTests={selectedTests}
                  onChange={(updated) => {
                    setSelectedTests(updated);
                    handleAutoSavePending(patient, updated, false);
                  }}
                  onAddCustomTest={handleAddCustomTest}
                  onNext={() => {
                    handleAutoSavePending(patient, selectedTests, false);
                    setCurrentStep(3);
                  }}
                  onBack={() => setCurrentStep(1)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div key="step-3" className="animate-slide-up">
                <Step3EnterResults
                  catalog={catalog}
                  selectedTests={selectedTests}
                  patient={patient}
                  onChange={(updated) => {
                    setSelectedTests(updated);
                    handleAutoSavePending(patient, updated, false);
                  }}
                  onNext={() => {
                    if (!areAllResultsFilled(selectedTests, catalog)) {
                      showWarning('Please enter results for all selected laboratory parameters before proceeding to Preview & Print.');
                      return;
                    }
                    handleAutoSavePending(patient, selectedTests, false);
                    setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div key="step-4" className="animate-slide-up">
                <Step4PreviewReport
                  catalog={catalog}
                  selectedTests={selectedTests}
                  patient={patient}
                  facilitySettings={facilitySettings}
                  currentUser={currentUser}
                  isAlreadySaved={recentReports.some((r) => r.id === currentReportId && r.status === 'completed')}
                  onEdit={() => setCurrentStep(3)}
                  onSaveReport={handleSaveCurrentReport}
                  onNewPatient={handleNewPatient}
                />
              </div>
            )}
          </div>
        )}

        {/* Scientist Recent Reports View */}
        {activeTab === 'recent' && (
          <div className="animate-slide-up">
            <RecentReportsModal
              reports={recentReports}
              currentUser={currentUser}
              catalog={catalog}
              onOpenReport={handleOpenReport}
              onResumeReport={handleResumeReport}
              onDuplicateReport={handleDuplicateReport}
              onDeleteReport={handleDeleteReport}
              onClose={() => setActiveTab('report')}
            />
          </div>
        )}

        {/* Settings & Reference Ranges View */}
        {activeTab === 'settings' && (
          <div className="animate-slide-up">
            <SettingsModal
              facilitySettings={facilitySettings}
              onSaveFacilitySettings={handleSaveFacilitySettings}
              catalog={catalog}
              onSaveCatalog={handleSaveCatalog}
              onResetCatalog={handleResetCatalog}
              onClose={() => setActiveTab('report')}
            />
          </div>
        )}
      </main>
    </div>
  );
};
