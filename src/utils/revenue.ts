import { LabTest, SavedReport, SelectedTestState } from '../types';

/**
 * Get the price in cents for a test entry, checking the saved price first,
 * then falling back to the catalog definition, or a name/id match.
 */
export const getTestPriceCents = (
  st: SelectedTestState,
  catalog: LabTest[] = []
): number => {
  if (typeof st.priceCents === 'number' && st.priceCents > 0) {
    return st.priceCents;
  }
  const idClean = (st.testId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const found = catalog.find((t) => {
    const tClean = (t.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameClean = (t.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      t.id === st.testId ||
      tClean === idClean ||
      tClean.includes(idClean) ||
      idClean.includes(tClean) ||
      nameClean.includes(idClean)
    );
  });
  return found?.priceCents || 0;
};

/**
 * Calculate total revenue (in cents) for a single report.
 */
export const getReportRevenueCents = (
  report: SavedReport,
  catalog: LabTest[] = []
): number => {
  if (!report.selectedTests || !Array.isArray(report.selectedTests)) return 0;
  return report.selectedTests.reduce(
    (sum, st) => sum + getTestPriceCents(st, catalog),
    0
  );
};

/**
 * Compute daily gross revenue (in cents) for reports created on the same
 * calendar day as `date` (defaults to today).
 */
export const getDailyRevenueCents = (
  reports: SavedReport[],
  catalog: LabTest[] = [],
  date: Date = new Date()
): number => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const todayReports = reports.filter((r) => {
    const created = new Date(r.createdAt);
    return created >= start && created < end;
  });

  return todayReports.reduce(
    (sum, r) => sum + getReportRevenueCents(r, catalog),
    0
  );
};

/**
 * Compute total gross revenue (in cents) for a list of reports.
 */
export const getTotalGrossRevenueCents = (
  reports: SavedReport[],
  catalog: LabTest[] = []
): number => {
  return reports.reduce(
    (sum, r) => sum + getReportRevenueCents(r, catalog),
    0
  );
};

/**
 * Format cents into Ghana Cedis (GH₵ X.XX)
 */
export const formatCentsGHC = (cents: number): string => {
  const cedis = (cents || 0) / 100;
  return `GH₵ ${cedis.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
