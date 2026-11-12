export type PatientSex = 'Male' | 'Female';

export type SampleType = 'Blood' | 'Urine' | 'Stool' | 'Swab' | 'Serum' | 'Plasma' | 'Other';

export interface PatientDetails {
  name: string;
  sex: PatientSex;
  age: string; // Stored as string to support "49", "35", etc.
  ageUnit?: 'years' | 'months' | 'days';
  sampleCollectionDate: string; // YYYY-MM-DD
  collectionTime: string; // HH:mm
  resultsDate: string; // YYYY-MM-DD
  sampleId: string; // text to preserve leading zeros e.g. "0016116"
  sampleType: SampleType;
  sampleTypes?: SampleType[]; // Allows multiple sample types selection (e.g. Blood & Urine)
  customSampleType?: string;
  receiptNumber: string; // text to preserve leading zeros e.g. "00452"
  requestedBy: string; // Doctor or Clinic
}

export type RangeType = 'min_max' | 'less_than' | 'greater_than' | 'qualitative' | 'text' | 'none';

export interface TestParameter {
  id: string;
  name: string;
  unit: string;
  rangeType: RangeType;
  referenceRangeText: string; // displayed in the report column

  // Standard numeric ranges
  min?: number;
  max?: number;
  lessThan?: number;
  greaterThan?: number;

  // Sex-specific ranges
  isSexSpecific?: boolean;
  maleMin?: number;
  maleMax?: number;
  maleReferenceRangeText?: string;
  femaleMin?: number;
  femaleMax?: number;
  femaleReferenceRangeText?: string;

  // Qualitative options
  qualitativeOptions?: string[];
  qualitativeNormalValues?: string[];

  // Cross-test sync key (e.g., T3, T4, TSH)
  sharedKey?: string;

  // Category inside test (e.g. Macroscopy vs Microscopy in Urine Routine)
  subCategory?: 'Macroscopy' | 'Microscopy' | string;
}

export interface LabTest {
  id: string;
  name: string;
  category?: string;
  description?: string;
  isCustom?: boolean;
  layoutType?: 'standard' | 'urine_re';
  parameters: TestParameter[];
}

export interface TestResultEntry {
  parameterId: string;
  value: string;
  flag?: 'H' | 'L' | 'ABNORMAL' | 'NO_RANGE' | null;
}

export interface SelectedTestState {
  testId: string;
  selectedParameterIds: string[]; // only ticked parameters
  results: Record<string, string>; // parameterId -> value
  comments?: string;
  cyclePhase?: string; // For hormonal profile
}

export interface FacilitySettings {
  facilityName: string;
  poBox: string;
  address: string;
  telephone: string;
  serviceTitle: string;
  scientistName: string;
  scientistTitle: string;
  logoUrl?: string; // base64 data url
}

export type UserRole = 'admin' | 'scientist';

export interface UserAccount {
  username: string;
  password?: string;
  displayName: string;
  role: UserRole;
  title: string; // e.g. "Medical Laboratory Scientist, MLS (AHPC)"
}

export interface SavedReport {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string;
  status?: 'pending' | 'completed'; // 'pending' = in-progress workup; 'completed' = finalized
  performedBy: string; // username e.g. "Dorean", "Hawa", "admin"
  performedByName: string; // Display name e.g. "Dorean"
  performedByTitle?: string;
  patient: PatientDetails;
  selectedTests: SelectedTestState[];
  facilitySettings: FacilitySettings;
}
