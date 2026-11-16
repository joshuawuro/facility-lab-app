import { FacilitySettings, LabTest, SavedReport, UserAccount } from '../types';
import { DEFAULT_FACILITY_SETTINGS, DEFAULT_TEST_CATALOG } from '../data/defaultCatalog';
import { DUMMY_ARCHIVED_REPORTS } from '../data/sampleData';

const SETTINGS_KEY = 'facility_lab_settings_v1';
const CATALOG_KEY = 'facility_lab_catalog_v1';
const REPORTS_KEY = 'facility_lab_reports_v4';
const USERS_KEY = 'facility_lab_users_v1';
const CURRENT_USER_KEY = 'facility_lab_current_user_v1';
const THEME_KEY = 'facility_lab_theme_v1';

export const DEFAULT_USERS: UserAccount[] = [
  {
    username: 'Dorean',
    password: 'password',
    displayName: 'Dorean',
    role: 'scientist',
    title: 'Medical Laboratory Scientist',
  },
  {
    username: 'Hawa',
    password: 'password',
    displayName: 'Hawa',
    role: 'scientist',
    title: 'Medical Laboratory Scientist',
  },
  {
    username: 'admin',
    password: 'password',
    displayName: 'Admin',
    role: 'admin',
    title: 'Laboratory Administrator',
  },
];

export function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch (e) {
    console.error('Failed to load users', e);
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  return null;
}

export function setCurrentUser(user: UserAccount): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getStoredTheme(): 'light' {
  return 'light';
}

export function setStoredTheme(_theme: string): void {
  // light mode only
}

export function loadFacilitySettings(): FacilitySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_FACILITY_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_FACILITY_SETTINGS,
      ...parsed,
      logoUrl: parsed.logoUrl || DEFAULT_FACILITY_SETTINGS.logoUrl || '/logo.png',
      doctors: Array.isArray(parsed.doctors) && parsed.doctors.length > 0 ? parsed.doctors : DEFAULT_FACILITY_SETTINGS.doctors,
    };
  } catch (e) {
    console.error('Failed to load facility settings', e);
    return DEFAULT_FACILITY_SETTINGS;
  }
}

export function saveFacilitySettings(settings: FacilitySettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save facility settings', e);
  }
}

export function loadTestCatalog(): LabTest[] {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(DEFAULT_TEST_CATALOG));
      return DEFAULT_TEST_CATALOG;
    }
    const parsed = JSON.parse(raw) as LabTest[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      const merged = [...parsed];
      DEFAULT_TEST_CATALOG.forEach((dt) => {
        const idx = merged.findIndex((t) => t.id === dt.id);
        if (idx >= 0) {
          if (merged[idx].priceCents === undefined || merged[idx].priceCents === null) {
            merged[idx] = { ...merged[idx], priceCents: dt.priceCents };
          }
        } else {
          merged.push(dt);
        }
      });
      return merged;
    }
    return DEFAULT_TEST_CATALOG;
  } catch (e) {
    console.error('Failed to load test catalog', e);
    return DEFAULT_TEST_CATALOG;
  }
}

export function saveTestCatalog(catalog: LabTest[]): void {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  } catch (e) {
    console.error('Failed to save test catalog', e);
  }
}

export function resetTestCatalog(): LabTest[] {
  saveTestCatalog(DEFAULT_TEST_CATALOG);
  return DEFAULT_TEST_CATALOG;
}

export function loadSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(DUMMY_ARCHIVED_REPORTS));
      return DUMMY_ARCHIVED_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((r: SavedReport) => ({
        ...r,
        status: r.status || 'completed',
      }));
    }
    return DUMMY_ARCHIVED_REPORTS;
  } catch (e) {
    console.error('Failed to load saved reports', e);
    return DUMMY_ARCHIVED_REPORTS;
  }
}

export function saveReport(report: SavedReport): SavedReport[] {
  try {
    const reports = loadSavedReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);
    let updated: SavedReport[];
    if (existingIndex >= 0) {
      updated = [...reports];
      updated[existingIndex] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      updated = [report, ...reports];
    }
    if (updated.length > 500) {
      updated = updated.slice(0, 500);
    }
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save report', e);
    return loadSavedReports();
  }
}

export function deleteReport(reportId: string): SavedReport[] {
  try {
    const reports = loadSavedReports().filter((r) => r.id !== reportId);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return reports;
  } catch (e) {
    console.error('Failed to delete report', e);
    return loadSavedReports();
  }
}

export function exportBackupJSON(): string {
  const data = {
    settings: loadFacilitySettings(),
    catalog: loadTestCatalog(),
    reports: loadSavedReports(),
    users: loadUsers(),
    exportedAt: new Date().toISOString(),
    version: '2.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.settings) saveFacilitySettings(data.settings);
    if (data.catalog) saveTestCatalog(data.catalog);
    if (data.reports) localStorage.setItem(REPORTS_KEY, JSON.stringify(data.reports));
    if (data.users) saveUsers(data.users);
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON', e);
    return false;
  }
}
