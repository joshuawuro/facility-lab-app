import { TestParameter, PatientSex } from '../types';

export type FlagResult = 'H' | 'L' | 'ABNORMAL' | 'NO_RANGE' | null;

/**
 * Normalizes strings for qualitative matching
 */
const normalize = (str: string) => str.trim().toLowerCase();

/**
 * Evaluates whether a parameter result is High, Low, Abnormal, or Normal.
 */
export function evaluateFlag(
  param: TestParameter,
  rawValue: string | undefined | null,
  patientSex: PatientSex
): FlagResult {
  if (!rawValue) return null;
  const val = rawValue.trim();
  if (val === '') return null;

  // 1. Qualitative evaluation
  if (param.rangeType === 'qualitative') {
    const defaultNormals = ['negative', 'nil', 'not seen', 'no mps seen', 'normal', 'none', 'clear', 'straw', 'yellow', 'amber', 'pale yellow'];
    const normals = (param.qualitativeNormalValues && param.qualitativeNormalValues.length > 0)
      ? param.qualitativeNormalValues.map(normalize)
      : defaultNormals;

    const normVal = normalize(val);
    const isNormal = normals.includes(normVal);

    if (isNormal) {
      return null;
    }

    // Explicit abnormal patterns
    const abnormalIndicators = ['positive', 'seen', '+', '++', '+++', '++++', 'trace', 'increased', 'cloudy', 'turbid', 'slightly turbid', 'deep amber', 'reddish'];
    if (abnormalIndicators.includes(normVal) || normVal.includes('seen') || normVal.includes('+') || normVal.includes('pos')) {
      return 'ABNORMAL';
    }

    return 'ABNORMAL';
  }

  // Text with no numeric logic
  if (param.rangeType === 'text' || param.rangeType === 'none') {
    return null;
  }

  // 2. Numeric evaluation
  const numericVal = parseFloat(val);
  if (isNaN(numericVal)) {
    return null;
  }

  // Sex-specific checks
  if (param.isSexSpecific) {
    if (patientSex === 'Male') {
      const min = param.maleMin;
      const max = param.maleMax;
      if (min === undefined && max === undefined) {
        return 'NO_RANGE';
      }
      if (min !== undefined && numericVal < min) return 'L';
      if (max !== undefined && numericVal > max) return 'H';
      return null;
    } else {
      // Female
      const min = param.femaleMin;
      const max = param.femaleMax;
      if (min === undefined && max === undefined) {
        return 'NO_RANGE';
      }
      if (min !== undefined && numericVal < min) return 'L';
      if (max !== undefined && numericVal > max) return 'H';
      return null;
    }
  }

  // Standard range checks
  if (param.rangeType === 'less_than') {
    const limit = param.lessThan ?? (param.max !== undefined ? param.max : undefined);
    if (limit !== undefined && numericVal >= limit) {
      return 'H';
    }
    return null;
  }

  if (param.rangeType === 'greater_than') {
    const limit = param.greaterThan ?? (param.min !== undefined ? param.min : undefined);
    if (limit !== undefined && numericVal <= limit) {
      return 'L';
    }
    return null;
  }

  if (param.rangeType === 'min_max') {
    if (param.min !== undefined && numericVal < param.min) {
      return 'L';
    }
    if (param.max !== undefined && numericVal > param.max) {
      return 'H';
    }
    return null;
  }

  return null;
}

/**
 * Returns formatted reference range display string tailored to patient's sex
 */
export function getDisplayReferenceRange(param: TestParameter, sex: PatientSex): string {
  if (param.isSexSpecific) {
    if (sex === 'Male') {
      if (param.maleReferenceRangeText) return param.maleReferenceRangeText;
      if (param.maleMin !== undefined && param.maleMax !== undefined) return `${param.maleMin}–${param.maleMax}`;
      if (param.maleMin !== undefined) return `>${param.maleMin}`;
      if (param.maleMax !== undefined) return `<${param.maleMax}`;
      return 'Not set (Male)';
    } else {
      if (param.femaleReferenceRangeText) return param.femaleReferenceRangeText;
      if (param.femaleMin !== undefined && param.femaleMax !== undefined) return `${param.femaleMin}–${param.femaleMax}`;
      if (param.femaleMin !== undefined) return `>${param.femaleMin}`;
      if (param.femaleMax !== undefined) return `<${param.femaleMax}`;
      return 'Not set (Female)';
    }
  }
  return param.referenceRangeText || '-';
}

/**
 * Checks for clinical or mathematical inconsistencies in entered results
 */
export interface ConsistencyNotice {
  type: 'info' | 'warning';
  title: string;
  message: string;
}

export function checkFbcConsistency(results: Record<string, string>): ConsistencyNotice[] {
  const notices: ConsistencyNotice[] = [];

  const wbc = parseFloat(results['wbc']);
  const lymPct = parseFloat(results['lym_pct']);
  const midPct = parseFloat(results['mid_pct']);
  const granPct = parseFloat(results['gran_pct']);

  const lymHash = parseFloat(results['lym_hash']);
  const midHash = parseFloat(results['mid_hash']);
  const granHash = parseFloat(results['gran_hash']);

  const rbc = parseFloat(results['rbc']);
  const hgb = parseFloat(results['hgb']);
  const hct = parseFloat(results['hct']);

  // Check 1: Differential percentages sum
  if (!isNaN(lymPct) && !isNaN(midPct) && !isNaN(granPct)) {
    const sum = lymPct + midPct + granPct;
    if (sum < 96 || sum > 104) {
      notices.push({
        type: 'warning',
        title: 'WBC Differential Sum Warning',
        message: `LYM% (${lymPct}) + MID% (${midPct}) + GRAN% (${granPct}) = ${sum.toFixed(1)}%. Differential typically totals close to 100%.`,
      });
    }
  }

  // Check 2: Absolute counts vs percentage calculation
  if (!isNaN(wbc) && wbc > 0) {
    if (!isNaN(lymPct) && !isNaN(lymHash)) {
      const calcLym = (wbc * lymPct) / 100;
      const diff = Math.abs(calcLym - lymHash);
      if (diff > 0.6 && diff / lymHash > 0.25) {
        notices.push({
          type: 'info',
          title: 'Lymphocyte Count Discrepancy',
          message: `LYM# is ${lymHash}, but calculated from WBC (${wbc}) × LYM% (${lymPct}%) is ${calcLym.toFixed(2)}. Please verify typed values.`,
        });
      }
    }

    if (!isNaN(granPct) && !isNaN(granHash)) {
      const calcGran = (wbc * granPct) / 100;
      const diff = Math.abs(calcGran - granHash);
      if (diff > 0.8 && diff / granHash > 0.25) {
        notices.push({
          type: 'info',
          title: 'Granulocyte Count Discrepancy',
          message: `GRAN# is ${granHash}, but calculated from WBC × GRAN% is ${calcGran.toFixed(2)}.`,
        });
      }
    }
  }

  // Check 3: Rule of three check (HGB * 3 ≈ HCT)
  if (!isNaN(hgb) && !isNaN(hct) && hgb > 0 && hct > 0) {
    const expectedHct = hgb * 3;
    if (Math.abs(expectedHct - hct) > 7) {
      notices.push({
        type: 'info',
        title: 'HGB / HCT Correlation',
        message: `HGB of ${hgb} g/dL typically correlates with HCT around ${Math.round(expectedHct)}% (currently typed: ${hct}%).`,
      });
    }
  }

  return notices;
}

