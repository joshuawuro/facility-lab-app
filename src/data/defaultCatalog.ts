import { LabTest, FacilitySettings } from '../types';

export const DEFAULT_DOCTORS: string[] = [
  'Dr. Alex',
  'Dr. Joshua',
  'Dr. Obuobi',
  'Dr. Jennifer',
  'Self',
];

export const DEFAULT_FACILITY_SETTINGS: FacilitySettings = {
  facilityName: 'CARE AND SOCIAL POLYCLINIC',
  poBox: 'P. O. BOX 2425',
  address: 'ADJACENT PUMA FILLING STATION, MADINA ESTATE',
  telephone: 'TEL: 053 197 6621',
  serviceTitle: 'LABORATORY SERVICE',
  scientistName: 'Kwame Mensah, MLS',
  scientistTitle: 'Lab Scientist',
  logoUrl: '/logo.png',
  doctors: DEFAULT_DOCTORS,
};

export const DEFAULT_TEST_CATALOG: LabTest[] = [
  // --- HAEMATOLOGY ---
  {
    id: 'fbc',
    name: 'FULL BLOOD COUNT (FBC)',
    category: 'Haematology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'wbc', name: 'WBC', unit: '×10^9/L', rangeType: 'min_max', referenceRangeText: '4.0–12.0', min: 4.0, max: 12.0 },
      { id: 'lym_pct', name: 'LYM%', unit: '%', rangeType: 'min_max', referenceRangeText: '10.0–40.0', min: 10.0, max: 40.0 },
      { id: 'mid_pct', name: 'MID%', unit: '%', rangeType: 'min_max', referenceRangeText: '3.0–15.0', min: 3.0, max: 15.0 },
      { id: 'gran_pct', name: 'GRAN%', unit: '%', rangeType: 'min_max', referenceRangeText: '50.0–70.0', min: 50.0, max: 70.0 },
      { id: 'lym_hash', name: 'LYM#', unit: '×10^9/L', rangeType: 'min_max', referenceRangeText: '0.8–4.0', min: 0.8, max: 4.0 },
      { id: 'mid_hash', name: 'MID#', unit: '×10^9/L', rangeType: 'min_max', referenceRangeText: '0.1–1.5', min: 0.1, max: 1.5 },
      { id: 'gran_hash', name: 'GRAN#', unit: '×10^9/L', rangeType: 'min_max', referenceRangeText: '2.0–7.0', min: 2.0, max: 7.0 },
      { id: 'rbc', name: 'RBC', unit: '×10^12/L', rangeType: 'min_max', referenceRangeText: '4.5–6.5', min: 4.5, max: 6.5 },
      { id: 'hgb', name: 'HGB', unit: 'g/dL', rangeType: 'min_max', referenceRangeText: '11.0–16.0', min: 11.0, max: 16.0 },
      { id: 'hct', name: 'HCT', unit: '%', rangeType: 'min_max', referenceRangeText: '37.0–54.0', min: 37.0, max: 54.0 },
      { id: 'mcv', name: 'MCV', unit: 'fL', rangeType: 'min_max', referenceRangeText: '76.0–100.0', min: 76.0, max: 100.0 },
      { id: 'mch', name: 'MCH', unit: 'pg', rangeType: 'min_max', referenceRangeText: '27.0–34.0', min: 27.0, max: 34.0 },
      { id: 'mchc', name: 'MCHC', unit: 'g/dL', rangeType: 'min_max', referenceRangeText: '32.0–36.2', min: 32.0, max: 36.2 },
      { id: 'rdw_sd', name: 'RDW-SD', unit: 'fL', rangeType: 'min_max', referenceRangeText: '35.0–56.0', min: 35.0, max: 56.0 },
      { id: 'rdw_cv', name: 'RDW-CV', unit: '%', rangeType: 'min_max', referenceRangeText: '11.0–16.0', min: 11.0, max: 16.0 },
      { id: 'plt', name: 'PLT', unit: '×10^9/L', rangeType: 'min_max', referenceRangeText: '100–450', min: 100, max: 450 },
      { id: 'mpv', name: 'MPV', unit: 'fL', rangeType: 'min_max', referenceRangeText: '6.5–12.0', min: 6.5, max: 12.0 },
      { id: 'pdw', name: 'PDW', unit: '%', rangeType: 'min_max', referenceRangeText: '5.0–25.0', min: 5.0, max: 25.0 },
      { id: 'pct', name: 'PCT', unit: '%', rangeType: 'min_max', referenceRangeText: '0.10–0.28', min: 0.10, max: 0.28 },
      { id: 'p_lcr', name: 'P-LCR', unit: '%', rangeType: 'min_max', referenceRangeText: '11.0–45.0', min: 11.0, max: 45.0 },
      { id: 'rcdw', name: 'RCDW', unit: '%', rangeType: 'min_max', referenceRangeText: '0.0–20.0', min: 0.0, max: 20.0 },
      { id: 'lcdw', name: 'LCDW', unit: '%', rangeType: 'min_max', referenceRangeText: '0.0–30.0', min: 0.0, max: 30.0 },
    ],
  },
  {
    id: 'malaria_bf',
    name: 'BLOOD FILM FOR MPs',
    category: 'Haematology',
    priceCents: 6000, // GH₵ 60.00
    layoutType: 'standard',
    parameters: [
      {
        id: 'malaria_res',
        name: 'Malaria Parasite (BF)',
        unit: '',
        rangeType: 'qualitative',
        referenceRangeText: 'No MPs seen',
        qualitativeOptions: ['No MPs seen', 'MPs seen (+)', 'MPs seen (++)', 'MPs seen (+++)'],
        qualitativeNormalValues: ['No MPs seen'],
      },
    ],
  },
  {
    id: 'esr',
    name: 'ESR (ERYTHROCYTE SEDIMENTATION RATE)',
    category: 'Haematology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      {
        id: 'esr_val',
        name: 'ESR',
        unit: 'mm/hr',
        rangeType: 'min_max',
        isSexSpecific: true,
        referenceRangeText: 'Male: 0–15 | Female: 0–20',
        maleMin: 0,
        maleMax: 15,
        femaleMin: 0,
        femaleMax: 20,
      },
    ],
  },
  {
    id: 'hb_electrophoresis',
    name: 'HB ELECTROPHORESIS',
    category: 'Haematology',
    priceCents: 15000, // GH₵ 150.00
    layoutType: 'standard',
    parameters: [
      { id: 'hb_pattern', name: 'Genotype / Pattern', unit: '', rangeType: 'text', referenceRangeText: 'AA' },
    ],
  },
  {
    id: 'hb_electro_sickling',
    name: 'HB ELECTROPHORESIS + SICKLING',
    category: 'Haematology',
    priceCents: 20000, // GH₵ 200.00
    layoutType: 'standard',
    parameters: [
      { id: 'hbes_pattern', name: 'Genotype Pattern', unit: '', rangeType: 'text', referenceRangeText: 'AA' },
      { id: 'hbes_sickling', name: 'Sickling Status', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'sickling',
    name: 'SICKLING TEST',
    category: 'Haematology',
    priceCents: 4500, // GH₵ 45.00
    layoutType: 'standard',
    parameters: [
      { id: 'sickling_res', name: 'Sickling Test', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'g6pd',
    name: 'G6PD SCREENING',
    category: 'Haematology',
    priceCents: 11500, // GH₵ 115.00
    layoutType: 'standard',
    parameters: [
      { id: 'g6pd_status', name: 'G6PD Status', unit: '', rangeType: 'qualitative', referenceRangeText: 'No Defect', qualitativeOptions: ['No Defect', 'Partial Defect', 'Full Defect'], qualitativeNormalValues: ['No Defect'] },
    ],
  },
  {
    id: 'clotting_profile',
    name: 'CLOTTING PROFILE',
    category: 'Haematology',
    priceCents: 20000, // GH₵ 200.00
    layoutType: 'standard',
    parameters: [
      { id: 'pt_time', name: 'Prothrombin Time (PT)', unit: 'sec', rangeType: 'min_max', referenceRangeText: '11.0–14.0', min: 11.0, max: 14.0 },
      { id: 'inr_val', name: 'INR', unit: '', rangeType: 'min_max', referenceRangeText: '0.8–1.2', min: 0.8, max: 1.2 },
      { id: 'aptt_time', name: 'APTT', unit: 'sec', rangeType: 'min_max', referenceRangeText: '25.0–38.0', min: 25.0, max: 38.0 },
    ],
  },
  {
    id: 'ddimer',
    name: 'D-DIMER',
    category: 'Haematology',
    priceCents: 30000, // GH₵ 300.00
    layoutType: 'standard',
    parameters: [
      { id: 'd_dimer_val', name: 'D-Dimer', unit: 'mg/L', rangeType: 'less_than', referenceRangeText: '<0.5', lessThan: 0.5 },
    ],
  },
  {
    id: 'inr',
    name: 'INR',
    category: 'Haematology',
    priceCents: 15000, // GH₵ 150.00
    layoutType: 'standard',
    parameters: [
      { id: 'inr_single', name: 'INR', unit: '', rangeType: 'min_max', referenceRangeText: '0.8–1.2', min: 0.8, max: 1.2 },
    ],
  },

  // --- SEROLOGY ---
  {
    id: 'hbsag',
    name: 'HBsAG (HEPATITIS B)',
    category: 'Serology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'hbsag_res', name: 'HBsAg', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
    ],
  },
  {
    id: 'hcv',
    name: 'HCV (HEPATITIS C)',
    category: 'Serology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'hcv_res', name: 'HCV Antibody', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
    ],
  },
  {
    id: 'vdrl',
    name: 'VDRL (SYPHILIS)',
    category: 'Serology',
    priceCents: 13000, // GH₵ 130.00
    layoutType: 'standard',
    parameters: [
      { id: 'vdrl_res', name: 'VDRL', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
    ],
  },
  {
    id: 'retro_screening',
    name: 'RETRO SCREENING (HIV)',
    category: 'Serology',
    priceCents: 13000, // GH₵ 130.00
    layoutType: 'standard',
    parameters: [
      { id: 'retro_res', name: 'HIV 1 & 2 Screening', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
    ],
  },
  {
    id: 'spt',
    name: 'SPT',
    category: 'Serology',
    priceCents: 9000, // GH₵ 90.00
    layoutType: 'standard',
    parameters: [
      { id: 'spt_res', name: 'SPT Result', unit: '', rangeType: 'text', referenceRangeText: 'Negative' },
    ],
  },
  {
    id: 'upt',
    name: 'UPT (PREGNANCY TEST)',
    category: 'Serology',
    priceCents: 5000, // GH₵ 50.00
    layoutType: 'standard',
    parameters: [
      { id: 'upt_res', name: 'Urine hCG (UPT)', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'typhoid',
    name: 'TYPHOID (IgM/IgG)',
    category: 'Serology',
    priceCents: 7000, // GH₵ 70.00
    layoutType: 'standard',
    parameters: [
      { id: 'typhoid_igg', name: 'IgG', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
      { id: 'typhoid_igm', name: 'IgM', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'blood_grouping',
    name: 'BLOOD GROUPING',
    category: 'Serology',
    priceCents: 7500, // GH₵ 75.00
    layoutType: 'standard',
    parameters: [
      { id: 'abo_group', name: 'ABO Group', unit: '', rangeType: 'qualitative', referenceRangeText: 'Reported', qualitativeOptions: ['A', 'B', 'AB', 'O'], qualitativeNormalValues: ['A', 'B', 'AB', 'O'] },
      { id: 'rh_factor', name: 'Rhesus (Rh D)', unit: '', rangeType: 'qualitative', referenceRangeText: 'Positive', qualitativeOptions: ['Positive', 'Negative'], qualitativeNormalValues: ['Positive'] },
    ],
  },
  {
    id: 'rf',
    name: 'RHEUMATOID FACTOR',
    category: 'Serology',
    priceCents: 15000, // GH₵ 150.00
    layoutType: 'standard',
    parameters: [
      { id: 'rf_res', name: 'Rheumatoid Factor', unit: 'IU/mL', rangeType: 'less_than', referenceRangeText: '<20', lessThan: 20 },
    ],
  },
  {
    id: 'hpylori',
    name: 'H. PYLORI BLOOD',
    category: 'Serology',
    priceCents: 12000, // GH₵ 120.00
    layoutType: 'standard',
    parameters: [
      { id: 'hpylori_res', name: 'H. Pylori Antibody (Blood)', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },

  // --- MICROBIOLOGY ---
  {
    id: 'urine_re',
    name: 'URINE R/E',
    category: 'Microbiology',
    priceCents: 7000, // GH₵ 70.00
    layoutType: 'urine_re',
    parameters: [
      { id: 'u_appearance', name: 'Appearance', unit: '', rangeType: 'qualitative', referenceRangeText: 'Clear', subCategory: 'Macroscopy', qualitativeOptions: ['Clear', 'Slightly Turbid', 'Turbid', 'Cloudy'], qualitativeNormalValues: ['Clear'] },
      { id: 'u_colour', name: 'Colour', unit: '', rangeType: 'qualitative', referenceRangeText: 'Straw / Amber', subCategory: 'Macroscopy', qualitativeOptions: ['Straw', 'Pale Yellow', 'Amber', 'Yellow', 'Deep Amber', 'Reddish'], qualitativeNormalValues: ['Straw', 'Pale Yellow', 'Amber', 'Yellow'] },
      { id: 'u_ph', name: 'pH', unit: '', rangeType: 'min_max', referenceRangeText: '5.0–8.0', subCategory: 'Macroscopy', min: 5.0, max: 8.0 },
      { id: 'u_sg', name: 'Specific Gravity', unit: '', rangeType: 'min_max', referenceRangeText: '1.005–1.030', subCategory: 'Macroscopy', min: 1.005, max: 1.030 },
      { id: 'u_blood', name: 'Blood', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', 'Trace', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_leukocyte', name: 'Leukocyte', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', 'Trace', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_nitrite', name: 'Nitrite', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_glucose', name: 'Glucose', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', 'Trace', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_bilirubin', name: 'Bilirubin', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_protein', name: 'Protein', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', 'Trace', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_urobilinogen', name: 'Urobilinogen', unit: '', rangeType: 'qualitative', referenceRangeText: 'Normal', subCategory: 'Macroscopy', qualitativeOptions: ['Normal', 'Increased'], qualitativeNormalValues: ['Normal'] },
      { id: 'u_ketone', name: 'Ketone', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', subCategory: 'Macroscopy', qualitativeOptions: ['Negative', '+', '++', '+++'], qualitativeNormalValues: ['Negative'] },
      { id: 'u_pus', name: 'Pus Cells', unit: '/hpf', rangeType: 'text', referenceRangeText: '0–5 /hpf', subCategory: 'Microscopy' },
      { id: 'u_epithelial', name: 'Epithelial Cells', unit: '/hpf', rangeType: 'text', referenceRangeText: 'Few /hpf', subCategory: 'Microscopy' },
      { id: 'u_rbc', name: 'Red Blood Cells', unit: '/hpf', rangeType: 'text', referenceRangeText: '0–2 /hpf', subCategory: 'Microscopy' },
      { id: 'u_crystals', name: 'Crystals', unit: '', rangeType: 'qualitative', referenceRangeText: 'Not Seen', subCategory: 'Microscopy', qualitativeOptions: ['Not Seen', 'Seen'], qualitativeNormalValues: ['Not Seen'] },
      { id: 'u_casts', name: 'Casts', unit: '', rangeType: 'qualitative', referenceRangeText: 'Not Seen', subCategory: 'Microscopy', qualitativeOptions: ['Not Seen', 'Seen'], qualitativeNormalValues: ['Not Seen'] },
      { id: 'u_yeast', name: 'Yeast Cells', unit: '', rangeType: 'qualitative', referenceRangeText: 'Nil', subCategory: 'Microscopy', qualitativeOptions: ['Nil', 'Seen'], qualitativeNormalValues: ['Nil'] },
      { id: 'u_bacteria', name: 'Bacteria', unit: '', rangeType: 'qualitative', referenceRangeText: 'Nil', subCategory: 'Microscopy', qualitativeOptions: ['Nil', 'Seen'], qualitativeNormalValues: ['Nil'] },
    ],
  },
  {
    id: 'urine_cs',
    name: 'URINE C/S',
    category: 'Microbiology',
    priceCents: 16500, // GH₵ 165.00
    layoutType: 'standard',
    parameters: [
      { id: 'ucs_growth', name: 'Culture & Growth', unit: '', rangeType: 'text', referenceRangeText: 'No significant bacterial growth after 48hrs' },
      { id: 'ucs_isolate', name: 'Organism Isolated', unit: '', rangeType: 'text', referenceRangeText: 'None' },
    ],
  },
  {
    id: 'stool_re',
    name: 'STOOL R/E',
    category: 'Microbiology',
    priceCents: 6500, // GH₵ 65.00
    layoutType: 'standard',
    parameters: [
      { id: 'st_colour', name: 'Colour', unit: '', rangeType: 'text', referenceRangeText: 'Brown' },
      { id: 'st_consistency', name: 'Consistency', unit: '', rangeType: 'text', referenceRangeText: 'Formed' },
      { id: 'st_micro', name: 'Microscopy', unit: '', rangeType: 'text', referenceRangeText: 'No ova or parasites seen' },
    ],
  },
  {
    id: 'stool_cs',
    name: 'STOOL C/S',
    category: 'Microbiology',
    priceCents: 25000, // GH₵ 250.00
    layoutType: 'standard',
    parameters: [
      { id: 'scs_growth', name: 'Culture & Growth', unit: '', rangeType: 'text', referenceRangeText: 'Normal enteric flora isolated' },
    ],
  },
  {
    id: 'hpylori_stool',
    name: 'H. PYLORI STOOL',
    category: 'Microbiology',
    priceCents: 13000, // GH₵ 130.00
    layoutType: 'standard',
    parameters: [
      { id: 'hpstool_res', name: 'H. Pylori Antigen (Stool)', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'hvs_re',
    name: 'HVS R/E',
    category: 'Microbiology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'hvs_pus', name: 'Pus Cells', unit: '/hpf', rangeType: 'text', referenceRangeText: 'Few' },
      { id: 'hvs_yeast', name: 'Yeast Cells', unit: '', rangeType: 'qualitative', referenceRangeText: 'Not Seen', qualitativeOptions: ['Not Seen', 'Seen'], qualitativeNormalValues: ['Not Seen'] },
      { id: 'hvs_tvag', name: 'T. vaginalis', unit: '', rangeType: 'qualitative', referenceRangeText: 'Not Seen', qualitativeOptions: ['Not Seen', 'Seen'], qualitativeNormalValues: ['Not Seen'] },
    ],
  },
  {
    id: 'hvs_cs',
    name: 'HVS C/S',
    category: 'Microbiology',
    priceCents: 16500, // GH₵ 165.00
    layoutType: 'standard',
    parameters: [
      { id: 'hvs_cs_growth', name: 'Culture Result', unit: '', rangeType: 'text', referenceRangeText: 'No pathogenic growth' },
    ],
  },
  {
    id: 'chlamydia',
    name: 'CHLAMYDIA',
    category: 'Microbiology',
    priceCents: 10000, // GH₵ 100.00
    layoutType: 'standard',
    parameters: [
      { id: 'chlam_res', name: 'Chlamydia Rapid Ag', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },
  {
    id: 'gonorrhea',
    name: 'GONORRHEA',
    category: 'Microbiology',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'gono_res', name: 'N. gonorrhoeae Test', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
    ],
  },

  // --- CHEMISTRY ---
  {
    id: 'rft',
    name: 'RENAL FUNCTION TEST (BUE+CR)',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'urea', name: 'Urea', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '1.7–8.3', min: 1.7, max: 8.3 },
      {
        id: 'creatinine',
        name: 'Creatinine',
        unit: 'µmol/L',
        rangeType: 'min_max',
        isSexSpecific: true,
        referenceRangeText: 'Male 50.0–120.0 | Female 65.4–119.5',
        maleMin: 50.0,
        maleMax: 120.0,
        maleReferenceRangeText: '50.0–120.0',
        femaleMin: 65.4,
        femaleMax: 119.5,
        femaleReferenceRangeText: '65.4–119.5',
      },
      { id: 'potassium', name: 'Potassium', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '3.2–5.7', min: 3.2, max: 5.7 },
      { id: 'sodium', name: 'Sodium', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '130.0–150.0', min: 130.0, max: 150.0 },
      { id: 'chlorides', name: 'Chlorides', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '98.0–109.0', min: 98.0, max: 109.0 },
      { id: 'egfr', name: 'eGFR', unit: 'mL/min/1.73 m²', rangeType: 'greater_than', referenceRangeText: '>60', greaterThan: 60 },
    ],
  },
  {
    id: 'lipid_profile',
    name: 'LIPID PROFILE',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'tc', name: 'Total Cholesterol', unit: 'mmol/L', rangeType: 'less_than', referenceRangeText: '<5.2', lessThan: 5.2 },
      { id: 'tg', name: 'Triglycerides', unit: 'mmol/L', rangeType: 'less_than', referenceRangeText: '<1.7', lessThan: 1.7 },
      { id: 'hdl', name: 'HDL Cholesterol', unit: 'mmol/L', rangeType: 'greater_than', referenceRangeText: '>1.0', greaterThan: 1.0 },
      { id: 'ldl', name: 'LDL Cholesterol', unit: 'mmol/L', rangeType: 'less_than', referenceRangeText: '<3.4', lessThan: 3.4 },
    ],
  },
  {
    id: 'lft',
    name: 'LIVER FUNCTION TEST',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'alt', name: 'ALT (SGPT)', unit: 'U/L', rangeType: 'less_than', referenceRangeText: '<45', lessThan: 45 },
      { id: 'ast', name: 'AST (SGOT)', unit: 'U/L', rangeType: 'less_than', referenceRangeText: '<35', lessThan: 35 },
      { id: 'alp', name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', rangeType: 'min_max', referenceRangeText: '40–150', min: 40, max: 150 },
      { id: 'tb', name: 'Total Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<21', lessThan: 21 },
      { id: 'db', name: 'Direct Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<5', lessThan: 5 },
      { id: 'tp', name: 'Total Protein', unit: 'g/L', rangeType: 'min_max', referenceRangeText: '60–80', min: 60, max: 80 },
      { id: 'alb', name: 'Albumin', unit: 'g/L', rangeType: 'min_max', referenceRangeText: '35–50', min: 35, max: 50 },
    ],
  },
  {
    id: 'fbs',
    name: 'FASTING BLOOD SUGAR',
    category: 'Chemistry',
    priceCents: 3500, // GH₵ 35.00
    layoutType: 'standard',
    parameters: [
      { id: 'fbs_val', name: 'Fasting Blood Sugar', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '3.9–6.1', min: 3.9, max: 6.1 },
    ],
  },
  {
    id: 'rbs',
    name: 'RANDOM BLOOD SUGAR',
    category: 'Chemistry',
    priceCents: 3500, // GH₵ 35.00
    layoutType: 'standard',
    parameters: [
      { id: 'rbs_val', name: 'Random Blood Sugar', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '4.0–7.8', min: 4.0, max: 7.8 },
    ],
  },
  {
    id: 'hba1c',
    name: 'HBA1C',
    category: 'Chemistry',
    priceCents: 15000, // GH₵ 150.00
    layoutType: 'standard',
    parameters: [
      { id: 'hba1c_val', name: 'HbA1c', unit: '%', rangeType: 'min_max', referenceRangeText: '4.0–6.0', min: 4.0, max: 6.0 },
    ],
  },
  {
    id: 'uric_acid',
    name: 'URIC ACID',
    category: 'Chemistry',
    priceCents: 7000, // GH₵ 70.00
    layoutType: 'standard',
    parameters: [
      { id: 'ua_val', name: 'Uric Acid', unit: 'µmol/L', rangeType: 'min_max', isSexSpecific: true, referenceRangeText: 'Male: 200–420 | Female: 140–340', maleMin: 200, maleMax: 420, femaleMin: 140, femaleMax: 340 },
    ],
  },
  {
    id: 'serum_bilirubin',
    name: 'SERUM BILIRUBIN',
    category: 'Chemistry',
    priceCents: 12000, // GH₵ 120.00
    layoutType: 'standard',
    parameters: [
      { id: 'sb_total', name: 'Total Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<21', lessThan: 21 },
      { id: 'sb_direct', name: 'Direct Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<5', lessThan: 5 },
    ],
  },
  {
    id: 'total_bilirubin',
    name: 'TOTAL BILIRUBIN',
    category: 'Chemistry',
    priceCents: 6000, // GH₵ 60.00
    layoutType: 'standard',
    parameters: [
      { id: 'tb_only', name: 'Total Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<21', lessThan: 21 },
    ],
  },
  {
    id: 'direct_bilirubin',
    name: 'DIRECT BILIRUBIN',
    category: 'Chemistry',
    priceCents: 6000, // GH₵ 60.00
    layoutType: 'standard',
    parameters: [
      { id: 'db_only', name: 'Direct Bilirubin', unit: 'µmol/L', rangeType: 'less_than', referenceRangeText: '<5', lessThan: 5 },
    ],
  },
  {
    id: 'fsh',
    name: 'FSH',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'fsh_val', name: 'FSH', unit: 'mIU/mL', rangeType: 'min_max', referenceRangeText: '1.5–12.4', min: 1.5, max: 12.4 },
    ],
  },
  {
    id: 'lh',
    name: 'LH',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'lh_val', name: 'LH', unit: 'mIU/mL', rangeType: 'min_max', referenceRangeText: '1.7–8.6', min: 1.7, max: 8.6 },
    ],
  },
  {
    id: 'bhcg',
    name: 'β-HCG',
    category: 'Chemistry',
    priceCents: 20000, // GH₵ 200.00
    layoutType: 'standard',
    parameters: [
      { id: 'bhcg_val', name: 'Beta-hCG', unit: 'mIU/mL', rangeType: 'less_than', referenceRangeText: '<5.0', lessThan: 5.0 },
    ],
  },
  {
    id: 'cortisol',
    name: 'CORTISOL',
    category: 'Chemistry',
    priceCents: 33000, // GH₵ 330.00
    layoutType: 'standard',
    parameters: [
      { id: 'cortisol_val', name: 'Cortisol (Morning)', unit: 'nmol/L', rangeType: 'min_max', referenceRangeText: '171–536', min: 171, max: 536 },
    ],
  },
  {
    id: 'prolactin',
    name: 'PROLACTIN',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'prl_val', name: 'Prolactin', unit: 'ng/mL', rangeType: 'min_max', isSexSpecific: true, referenceRangeText: 'Male: 2.1–17.7 | Female: 2.8–29.2', maleMin: 2.1, maleMax: 17.7, femaleMin: 2.8, femaleMax: 29.2 },
    ],
  },
  {
    id: 'psa',
    name: 'PSA',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'psa_val', name: 'Total PSA', unit: 'ng/mL', rangeType: 'less_than', referenceRangeText: '<4.0', lessThan: 4.0 },
    ],
  },
  {
    id: 'tft',
    name: 'TFT (THYROID FUNCTION TEST)',
    category: 'Chemistry',
    priceCents: 24500, // GH₵ 245.00
    layoutType: 'standard',
    parameters: [
      { id: 't3', name: 'Total T3', unit: 'nmol/L', rangeType: 'min_max', referenceRangeText: '1.23–3.07', min: 1.23, max: 3.07, sharedKey: 'T3' },
      { id: 't4', name: 'Total T4', unit: 'nmol/L', rangeType: 'min_max', referenceRangeText: '66–181', min: 66, max: 181, sharedKey: 'T4' },
      { id: 'tsh', name: 'TSH', unit: 'mIU/L', rangeType: 'min_max', referenceRangeText: '0.3–4.2', min: 0.3, max: 4.2, sharedKey: 'TSH' },
    ],
  },
  {
    id: 'tsh',
    name: 'TSH',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'tsh_single', name: 'TSH', unit: 'mIU/L', rangeType: 'min_max', referenceRangeText: '0.3–4.2', min: 0.3, max: 4.2 },
    ],
  },
  {
    id: 't3',
    name: 'T3',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 't3_single', name: 'Total T3', unit: 'nmol/L', rangeType: 'min_max', referenceRangeText: '1.23–3.07', min: 1.23, max: 3.07 },
    ],
  },
  {
    id: 't4',
    name: 'T4',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 't4_single', name: 'Total T4', unit: 'nmol/L', rangeType: 'min_max', referenceRangeText: '66–181', min: 66, max: 181 },
    ],
  },
  {
    id: 'crp',
    name: 'CRP',
    category: 'Chemistry',
    priceCents: 15000, // GH₵ 150.00
    layoutType: 'standard',
    parameters: [
      { id: 'crp_val', name: 'C-Reactive Protein (CRP)', unit: 'mg/L', rangeType: 'less_than', referenceRangeText: '<6.0', lessThan: 6.0 },
    ],
  },
  {
    id: 'calcium',
    name: 'CALCIUM',
    category: 'Chemistry',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'ca_val', name: 'Serum Calcium', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '2.15–2.55', min: 2.15, max: 2.55 },
    ],
  },
  {
    id: 'magnesium',
    name: 'MAGNESIUM',
    category: 'Chemistry',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'mg_val', name: 'Serum Magnesium', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '0.70–1.05', min: 0.70, max: 1.05 },
    ],
  },
  {
    id: 'phosphate',
    name: 'PHOSPHATE',
    category: 'Chemistry',
    priceCents: 8000, // GH₵ 80.00
    layoutType: 'standard',
    parameters: [
      { id: 'phos_val', name: 'Serum Phosphate', unit: 'mmol/L', rangeType: 'min_max', referenceRangeText: '0.81–1.45', min: 0.81, max: 1.45 },
    ],
  },
  {
    id: 'hormonal',
    name: 'HORMONAL PROFILE',
    category: 'Chemistry',
    priceCents: 17000, // GH₵ 170.00
    layoutType: 'standard',
    parameters: [
      { id: 'h_fsh', name: 'FSH', unit: 'mIU/L', rangeType: 'min_max', referenceRangeText: '3.0–9.0', min: 3.0, max: 9.0 },
      { id: 'h_lh', name: 'LH', unit: 'mIU/L', rangeType: 'min_max', referenceRangeText: '2.0–10.0', min: 2.0, max: 10.0 },
      { id: 'h_prolactin', name: 'Prolactin', unit: 'ng/ml', rangeType: 'min_max', referenceRangeText: '0.0–20.0', min: 0.0, max: 20.0 },
      { id: 'h_progesterone', name: 'Progesterone', unit: 'ng/ml', rangeType: 'min_max', referenceRangeText: '5.0–20.0', min: 5.0, max: 20.0 },
      { id: 'h_testosterone', name: 'Testosterone', unit: 'ng/ml', rangeType: 'min_max', referenceRangeText: '0.15–0.70', min: 0.15, max: 0.70 },
    ],
  },

  // --- ANC LABS ---
  {
    id: 'anc_labs',
    name: 'ANC LABS (COMPREHENSIVE PACKAGE)',
    category: 'ANC Labs',
    priceCents: 60000, // GH₵ 600.00 total package
    layoutType: 'standard',
    parameters: [
      { id: 'anc_fbc', name: 'Full Blood Count (FBC)', unit: '', rangeType: 'text', referenceRangeText: 'Done' },
      { id: 'anc_urine', name: 'Urine R/E', unit: '', rangeType: 'text', referenceRangeText: 'Done' },
      { id: 'anc_stool', name: 'Stool R/E', unit: '', rangeType: 'text', referenceRangeText: 'Done' },
      { id: 'anc_group', name: 'Blood Grouping', unit: '', rangeType: 'text', referenceRangeText: 'Reported' },
      { id: 'anc_sickling', name: 'Sickling', unit: '', rangeType: 'qualitative', referenceRangeText: 'Negative', qualitativeOptions: ['Negative', 'Positive'], qualitativeNormalValues: ['Negative'] },
      { id: 'anc_g6pd', name: 'G6PD', unit: '', rangeType: 'qualitative', referenceRangeText: 'No Defect', qualitativeOptions: ['No Defect', 'Partial Defect', 'Full Defect'], qualitativeNormalValues: ['No Defect'] },
      { id: 'anc_vdrl', name: 'VDRL', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
      { id: 'anc_hbsag', name: 'HBsAg', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
      { id: 'anc_retro', name: 'Retro Screening', unit: '', rangeType: 'qualitative', referenceRangeText: 'Non-Reactive', qualitativeOptions: ['Non-Reactive', 'Reactive'], qualitativeNormalValues: ['Non-Reactive'] },
    ],
  },
];
