import { PatientDetails, SelectedTestState, SavedReport } from '../types';
import { DEFAULT_FACILITY_SETTINGS } from './defaultCatalog';

const DUMMY_FACILITY = DEFAULT_FACILITY_SETTINGS;

// Helper to create ISO date relative to current time
const daysAgo = (days: number, hour: number = 9, minute: number = 30): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const dateOnly = (iso: string): string => iso.split('T')[0];

export const DUMMY_PATIENT: PatientDetails = {
  name: 'AMA BOATENG',
  sex: 'Female',
  age: '32',
  sampleCollectionDate: new Date().toISOString().split('T')[0],
  collectionTime: '08:45 AM',
  resultsDate: new Date().toISOString().split('T')[0],
  sampleId: 'LAB-2026-0901',
  sampleType: 'Blood',
  sampleTypes: ['Blood', 'Urine'],
  receiptNumber: 'REC-010245',
  requestedBy: 'Dr. K. Mensah',
};

export const DUMMY_SELECTED_TESTS: SelectedTestState[] = [
  {
    testId: 'fbc',
    priceCents: 8000, // GH₵ 80.00
    selectedParameterIds: [
      'wbc', 'lym_pct', 'mid_pct', 'gran_pct', 'lym_hash', 'mid_hash', 'gran_hash',
      'rbc', 'hgb', 'hct', 'mcv', 'mch', 'mchc', 'rdw_cv', 'plt', 'mpv',
    ],
    results: {
      wbc: '6.5',
      lym_pct: '32.0',
      mid_pct: '5.8',
      gran_pct: '62.2',
      lym_hash: '2.1',
      mid_hash: '0.4',
      gran_hash: '4.0',
      rbc: '4.62',
      hgb: '13.4',
      hct: '41.2',
      mcv: '89.1',
      mch: '29.0',
      mchc: '32.5',
      rdw_cv: '12.4',
      plt: '268',
      mpv: '9.4',
    },
    comments: 'Platelets adequate. Red cell morphology normal.',
  },
  {
    testId: 'malaria_bf',
    priceCents: 6000, // GH₵ 60.00
    selectedParameterIds: ['malaria_res'],
    results: { malaria_res: 'No MPs seen' },
  },
  {
    testId: 'urine_re',
    priceCents: 7000, // GH₵ 70.00
    selectedParameterIds: [
      'u_appearance', 'u_colour', 'u_ph', 'u_sg', 'u_blood', 'u_leukocyte',
      'u_nitrite', 'u_glucose', 'u_bilirubin', 'u_protein', 'u_urobilinogen', 'u_ketone',
      'u_pus', 'u_epithelial', 'u_rbc', 'u_crystals', 'u_casts', 'u_yeast', 'u_bacteria'
    ],
    results: {
      u_appearance: 'Clear',
      u_colour: 'Pale Yellow',
      u_ph: '6.5',
      u_sg: '1.015',
      u_blood: 'Negative',
      u_leukocyte: 'Negative',
      u_nitrite: 'Negative',
      u_glucose: 'Negative',
      u_bilirubin: 'Negative',
      u_protein: 'Negative',
      u_urobilinogen: 'Normal',
      u_ketone: 'Negative',
      u_pus: '0–1 /hpf',
      u_epithelial: '1–2 /hpf',
      u_rbc: 'Nil',
      u_crystals: 'None seen',
      u_casts: 'None seen',
      u_yeast: 'None seen',
      u_bacteria: 'None seen',
    },
    comments: 'Urine appears normal.',
  },
];

export const DUMMY_ARCHIVED_REPORTS: SavedReport[] = [
  // ==========================================
  // TODAY'S COMPLETED REPORTS (DaysAgo 0)
  // ==========================================
  {
    id: 'rep_today_01',
    status: 'completed',
    patient: {
      name: 'AMA BOATENG',
      sex: 'Female',
      age: '32',
      sampleCollectionDate: dateOnly(daysAgo(0, 8, 30)),
      collectionTime: '08:30 AM',
      resultsDate: dateOnly(daysAgo(0, 9, 45)),
      sampleId: 'LAB-2026-0901',
      sampleType: 'Blood',
      sampleTypes: ['Blood', 'Urine'],
      receiptNumber: 'REC-010245',
      requestedBy: 'Dr. K. Mensah',
    },
    selectedTests: [
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'rbc', 'hgb', 'hct', 'plt'],
        results: { wbc: '6.5', rbc: '4.62', hgb: '13.4', hct: '41.2', plt: '268' },
      },
      {
        testId: 'malaria_bf',
        priceCents: 6000, // GH₵ 60.00
        selectedParameterIds: ['malaria_res'],
        results: { malaria_res: 'No MPs seen' },
      },
      {
        testId: 'urine_re',
        priceCents: 7000, // GH₵ 70.00
        selectedParameterIds: ['u_appearance', 'u_colour', 'u_protein', 'u_glucose'],
        results: { u_appearance: 'Clear', u_colour: 'Straw', u_protein: 'Negative', u_glucose: 'Negative' },
      },
    ],
    createdAt: daysAgo(0, 9, 45),
    updatedAt: daysAgo(0, 9, 45),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_today_02',
    status: 'completed',
    patient: {
      name: 'KWASI ADDO',
      sex: 'Male',
      age: '48',
      sampleCollectionDate: dateOnly(daysAgo(0, 9, 0)),
      collectionTime: '09:00 AM',
      resultsDate: dateOnly(daysAgo(0, 10, 15)),
      sampleId: 'LAB-2026-0902',
      sampleType: 'Blood',
      sampleTypes: ['Blood', 'Serum'],
      receiptNumber: 'REC-010246',
      requestedBy: 'Dr. Owusu-Ansah',
    },
    selectedTests: [
      {
        testId: 'rft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['urea', 'creatinine', 'potassium', 'sodium', 'egfr'],
        results: { urea: '4.8', creatinine: '88.5', potassium: '4.2', sodium: '141.0', egfr: '92' },
      },
      {
        testId: 'fbs',
        priceCents: 3500, // GH₵ 35.00
        selectedParameterIds: ['fbs_val'],
        results: { fbs_val: '5.2' },
      },
      {
        testId: 'lipid_profile',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['tc', 'tg', 'hdl', 'ldl'],
        results: { tc: '4.6', tg: '1.2', hdl: '1.4', ldl: '2.7' },
      },
    ],
    createdAt: daysAgo(0, 10, 15),
    updatedAt: daysAgo(0, 10, 15),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_today_03',
    status: 'completed',
    patient: {
      name: 'ABENA AGYEMANG',
      sex: 'Female',
      age: '27',
      sampleCollectionDate: dateOnly(daysAgo(0, 10, 30)),
      collectionTime: '10:30 AM',
      resultsDate: dateOnly(daysAgo(0, 11, 40)),
      sampleId: 'LAB-2026-0903',
      sampleType: 'Blood',
      sampleTypes: ['Blood', 'Urine'],
      receiptNumber: 'REC-010247',
      requestedBy: 'Dr. Cynthia Darko',
    },
    selectedTests: [
      {
        testId: 'anc_labs',
        priceCents: 60000, // GH₵ 600.00 (ANC Comprehensive Package)
        selectedParameterIds: ['anc_fbc', 'anc_urine', 'anc_stool', 'anc_group', 'anc_sickling', 'anc_g6pd', 'anc_vdrl', 'anc_hbsag', 'anc_retro'],
        results: {
          anc_fbc: 'HGB: 11.8 g/dL, WBC: 6.9',
          anc_urine: 'Normal',
          anc_stool: 'No parasites',
          anc_group: 'O Rh D Positive',
          anc_sickling: 'Negative',
          anc_g6pd: 'No Defect',
          anc_vdrl: 'Non-Reactive',
          anc_hbsag: 'Non-Reactive',
          anc_retro: 'Non-Reactive',
        },
      },
    ],
    createdAt: daysAgo(0, 11, 40),
    updatedAt: daysAgo(0, 11, 40),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_today_04',
    status: 'completed',
    patient: {
      name: 'KOFI ANTWI',
      sex: 'Male',
      age: '38',
      sampleCollectionDate: dateOnly(daysAgo(0, 11, 15)),
      collectionTime: '11:15 AM',
      resultsDate: dateOnly(daysAgo(0, 12, 30)),
      sampleId: 'LAB-2026-0904',
      sampleType: 'Blood',
      sampleTypes: ['Blood'],
      receiptNumber: 'REC-010248',
      requestedBy: 'Dr. K. Mensah',
    },
    selectedTests: [
      {
        testId: 'typhoid',
        priceCents: 7000, // GH₵ 70.00
        selectedParameterIds: ['typhoid_igg', 'typhoid_igm'],
        results: { typhoid_igg: 'Positive', typhoid_igm: 'Negative' },
      },
      {
        testId: 'malaria_bf',
        priceCents: 6000, // GH₵ 60.00
        selectedParameterIds: ['malaria_res'],
        results: { malaria_res: 'MPs seen (+)' },
      },
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '8.4', hgb: '14.2', plt: '185' },
      },
    ],
    createdAt: daysAgo(0, 12, 30),
    updatedAt: daysAgo(0, 12, 30),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_today_05',
    status: 'completed',
    patient: {
      name: 'AKOSUA FRIMPOMAA',
      sex: 'Female',
      age: '54',
      sampleCollectionDate: dateOnly(daysAgo(0, 13, 0)),
      collectionTime: '01:00 PM',
      resultsDate: dateOnly(daysAgo(0, 14, 15)),
      sampleId: 'LAB-2026-0905',
      sampleType: 'Blood',
      sampleTypes: ['Blood'],
      receiptNumber: 'REC-010249',
      requestedBy: 'Dr. Osei Tutu',
    },
    selectedTests: [
      {
        testId: 'hba1c',
        priceCents: 15000, // GH₵ 150.00
        selectedParameterIds: ['hba1c_val'],
        results: { hba1c_val: '6.4' },
      },
      {
        testId: 'rft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['urea', 'creatinine', 'egfr'],
        results: { urea: '5.1', creatinine: '92.0', egfr: '86' },
      },
    ],
    createdAt: daysAgo(0, 14, 15),
    updatedAt: daysAgo(0, 14, 15),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },

  // ==========================================
  // YESTERDAY'S COMPLETED REPORTS (DaysAgo 1)
  // ==========================================
  {
    id: 'rep_yest_01',
    status: 'completed',
    patient: {
      name: 'YAW MENSAH',
      sex: 'Male',
      age: '61',
      sampleCollectionDate: dateOnly(daysAgo(1, 8, 45)),
      collectionTime: '08:45 AM',
      resultsDate: dateOnly(daysAgo(1, 10, 0)),
      sampleId: 'LAB-2026-0895',
      sampleType: 'Blood',
      receiptNumber: 'REC-010238',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'psa',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['psa_val'],
        results: { psa_val: '1.8' },
      },
      {
        testId: 'lft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['alt', 'ast', 'alp', 'tb'],
        results: { alt: '28', ast: '24', alp: '85', tb: '14' },
      },
    ],
    createdAt: daysAgo(1, 10, 0),
    updatedAt: daysAgo(1, 10, 0),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_yest_02',
    status: 'completed',
    patient: {
      name: 'EFUA ASANTE',
      sex: 'Female',
      age: '24',
      sampleCollectionDate: dateOnly(daysAgo(1, 10, 0)),
      collectionTime: '10:00 AM',
      resultsDate: dateOnly(daysAgo(1, 11, 20)),
      sampleId: 'LAB-2026-0896',
      sampleType: 'Blood',
      sampleTypes: ['Blood'],
      receiptNumber: 'REC-010239',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'hbsag',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['hbsag_res'],
        results: { hbsag_res: 'Non-Reactive' },
      },
      {
        testId: 'hcv',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['hcv_res'],
        results: { hcv_res: 'Non-Reactive' },
      },
      {
        testId: 'retro_screening',
        priceCents: 13000, // GH₵ 130.00
        selectedParameterIds: ['retro_res'],
        results: { retro_res: 'Non-Reactive' },
      },
    ],
    createdAt: daysAgo(1, 11, 20),
    updatedAt: daysAgo(1, 11, 20),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_yest_03',
    status: 'completed',
    patient: {
      name: 'EMMANUEL TETTEH',
      sex: 'Male',
      age: '35',
      sampleCollectionDate: dateOnly(daysAgo(1, 11, 30)),
      collectionTime: '11:30 AM',
      resultsDate: dateOnly(daysAgo(1, 13, 0)),
      sampleId: 'LAB-2026-0897',
      sampleType: 'Blood',
      receiptNumber: 'REC-010240',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'ddimer',
        priceCents: 30000, // GH₵ 300.00
        selectedParameterIds: ['d_dimer_val'],
        results: { d_dimer_val: '0.28' },
      },
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'rbc', 'hgb', 'plt'],
        results: { wbc: '7.1', rbc: '4.95', hgb: '14.8', plt: '245' },
      },
    ],
    createdAt: daysAgo(1, 13, 0),
    updatedAt: daysAgo(1, 13, 0),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_yest_04',
    status: 'completed',
    patient: {
      name: 'PATRICIA OFORI',
      sex: 'Female',
      age: '40',
      sampleCollectionDate: dateOnly(daysAgo(1, 14, 0)),
      collectionTime: '02:00 PM',
      resultsDate: dateOnly(daysAgo(1, 15, 10)),
      sampleId: 'LAB-2026-0898',
      sampleType: 'Blood',
      receiptNumber: 'REC-010241',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'tft',
        priceCents: 24500, // GH₵ 245.00
        selectedParameterIds: ['t3', 't4', 'tsh'],
        results: { t3: '1.85', t4: '115', tsh: '1.92' },
      },
    ],
    createdAt: daysAgo(1, 15, 10),
    updatedAt: daysAgo(1, 15, 10),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },

  // ==========================================
  // PAST 7 DAYS (DaysAgo 2 to 6)
  // ==========================================
  {
    id: 'rep_7d_01',
    status: 'completed',
    patient: {
      name: 'KOFI BOADU',
      sex: 'Male',
      age: '42',
      sampleCollectionDate: dateOnly(daysAgo(2, 9, 30)),
      collectionTime: '09:30 AM',
      resultsDate: dateOnly(daysAgo(2, 11, 0)),
      sampleId: 'LAB-2026-0885',
      sampleType: 'Blood',
      receiptNumber: 'REC-010220',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'lft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['alt', 'ast', 'alp', 'tb', 'db', 'tp', 'alb'],
        results: { alt: '32', ast: '26', alp: '90', tb: '12', db: '3', tp: '72', alb: '42' },
      },
      {
        testId: 'lipid_profile',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['tc', 'tg', 'hdl', 'ldl'],
        results: { tc: '5.0', tg: '1.4', hdl: '1.3', ldl: '3.1' },
      },
    ],
    createdAt: daysAgo(2, 11, 0),
    updatedAt: daysAgo(2, 11, 0),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_7d_02',
    status: 'completed',
    patient: {
      name: 'AKUA YEBOAH',
      sex: 'Female',
      age: '29',
      sampleCollectionDate: dateOnly(daysAgo(3, 10, 0)),
      collectionTime: '10:00 AM',
      resultsDate: dateOnly(daysAgo(3, 11, 30)),
      sampleId: 'LAB-2026-0880',
      sampleType: 'Blood',
      receiptNumber: 'REC-010215',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'hormonal',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['h_fsh', 'h_lh', 'h_prolactin', 'h_progesterone', 'h_testosterone'],
        results: { h_fsh: '6.2', h_lh: '7.8', h_prolactin: '12.5', h_progesterone: '0.85', h_testosterone: '0.35' },
      },
    ],
    createdAt: daysAgo(3, 11, 30),
    updatedAt: daysAgo(3, 11, 30),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_7d_03',
    status: 'completed',
    patient: {
      name: 'SAMUEL QUAYE',
      sex: 'Male',
      age: '33',
      sampleCollectionDate: dateOnly(daysAgo(4, 9, 0)),
      collectionTime: '09:00 AM',
      resultsDate: dateOnly(daysAgo(4, 10, 30)),
      sampleId: 'LAB-2026-0872',
      sampleType: 'Blood',
      receiptNumber: 'REC-010202',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'rbc', 'hgb', 'plt'],
        results: { wbc: '6.8', rbc: '4.85', hgb: '14.5', plt: '220' },
      },
      {
        testId: 'sickling',
        priceCents: 4500, // GH₵ 45.00
        selectedParameterIds: ['sickling_res'],
        results: { sickling_res: 'Negative' },
      },
      {
        testId: 'g6pd',
        priceCents: 11500, // GH₵ 115.00
        selectedParameterIds: ['g6pd_status'],
        results: { g6pd_status: 'No Defect' },
      },
    ],
    createdAt: daysAgo(4, 10, 30),
    updatedAt: daysAgo(4, 10, 30),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_7d_04',
    status: 'completed',
    patient: {
      name: 'GLORIA APPIAH',
      sex: 'Female',
      age: '31',
      sampleCollectionDate: dateOnly(daysAgo(5, 11, 0)),
      collectionTime: '11:00 AM',
      resultsDate: dateOnly(daysAgo(5, 12, 15)),
      sampleId: 'LAB-2026-0865',
      sampleType: 'Blood',
      receiptNumber: 'REC-010190',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'rft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['urea', 'creatinine', 'potassium', 'sodium'],
        results: { urea: '4.2', creatinine: '80.0', potassium: '4.0', sodium: '139.0' },
      },
      {
        testId: 'crp',
        priceCents: 15000, // GH₵ 150.00
        selectedParameterIds: ['crp_val'],
        results: { crp_val: '3.2' },
      },
    ],
    createdAt: daysAgo(5, 12, 15),
    updatedAt: daysAgo(5, 12, 15),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_7d_05',
    status: 'completed',
    patient: {
      name: 'MICHAEL SARPONG',
      sex: 'Male',
      age: '50',
      sampleCollectionDate: dateOnly(daysAgo(6, 14, 0)),
      collectionTime: '02:00 PM',
      resultsDate: dateOnly(daysAgo(6, 15, 30)),
      sampleId: 'LAB-2026-0858',
      sampleType: 'Blood',
      receiptNumber: 'REC-010182',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '7.8', hgb: '15.1', plt: '235' },
      },
      {
        testId: 'cortisol',
        priceCents: 33000, // GH₵ 330.00
        selectedParameterIds: ['cortisol_val'],
        results: { cortisol_val: '345' },
      },
    ],
    createdAt: daysAgo(6, 15, 30),
    updatedAt: daysAgo(6, 15, 30),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },

  // ==========================================
  // PAST 30 DAYS & MONTHS (DaysAgo 8 to 150)
  // ==========================================
  {
    id: 'rep_30d_01',
    status: 'completed',
    patient: {
      name: 'BERNICE MENSAH',
      sex: 'Female',
      age: '26',
      sampleCollectionDate: dateOnly(daysAgo(10, 10, 0)),
      collectionTime: '10:00 AM',
      resultsDate: dateOnly(daysAgo(10, 11, 30)),
      sampleId: 'LAB-2026-0840',
      sampleType: 'Blood',
      receiptNumber: 'REC-010150',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'hb_electro_sickling',
        priceCents: 20000, // GH₵ 200.00
        selectedParameterIds: ['hbes_pattern', 'hbes_sickling'],
        results: { hbes_pattern: 'AA', hbes_sickling: 'Negative' },
      },
      {
        testId: 'blood_grouping',
        priceCents: 7500, // GH₵ 75.00
        selectedParameterIds: ['abo_group', 'rh_factor'],
        results: { abo_group: 'B', rh_factor: 'Positive' },
      },
    ],
    createdAt: daysAgo(10, 11, 30),
    updatedAt: daysAgo(10, 11, 30),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_30d_02',
    status: 'completed',
    patient: {
      name: 'ISAAC BADU',
      sex: 'Male',
      age: '58',
      sampleCollectionDate: dateOnly(daysAgo(15, 9, 30)),
      collectionTime: '09:30 AM',
      resultsDate: dateOnly(daysAgo(15, 11, 0)),
      sampleId: 'LAB-2026-0815',
      sampleType: 'Blood',
      receiptNumber: 'REC-010110',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'rft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['urea', 'creatinine', 'egfr'],
        results: { urea: '5.8', creatinine: '105.0', egfr: '74' },
      },
      {
        testId: 'lipid_profile',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['tc', 'tg', 'hdl', 'ldl'],
        results: { tc: '5.4', tg: '1.6', hdl: '1.1', ldl: '3.6' },
      },
      {
        testId: 'hba1c',
        priceCents: 15000, // GH₵ 150.00
        selectedParameterIds: ['hba1c_val'],
        results: { hba1c_val: '6.8' },
      },
    ],
    createdAt: daysAgo(15, 11, 0),
    updatedAt: daysAgo(15, 11, 0),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_30d_03',
    status: 'completed',
    patient: {
      name: 'JOYCE KODUA',
      sex: 'Female',
      age: '30',
      sampleCollectionDate: dateOnly(daysAgo(20, 11, 0)),
      collectionTime: '11:00 AM',
      resultsDate: dateOnly(daysAgo(20, 12, 15)),
      sampleId: 'LAB-2026-0790',
      sampleType: 'Blood',
      receiptNumber: 'REC-010075',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'anc_labs',
        priceCents: 60000, // GH₵ 600.00
        selectedParameterIds: ['anc_fbc', 'anc_urine', 'anc_group', 'anc_sickling', 'anc_g6pd'],
        results: { anc_fbc: 'HGB: 12.1', anc_urine: 'Normal', anc_group: 'A Rh D Pos', anc_sickling: 'Negative', anc_g6pd: 'No Defect' },
      },
    ],
    createdAt: daysAgo(20, 12, 15),
    updatedAt: daysAgo(20, 12, 15),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_30d_04',
    status: 'completed',
    patient: {
      name: 'DANIEL OKAI',
      sex: 'Male',
      age: '44',
      sampleCollectionDate: dateOnly(daysAgo(25, 9, 0)),
      collectionTime: '09:00 AM',
      resultsDate: dateOnly(daysAgo(25, 10, 30)),
      sampleId: 'LAB-2026-0760',
      sampleType: 'Blood',
      receiptNumber: 'REC-010040',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'clotting_profile',
        priceCents: 20000, // GH₵ 200.00
        selectedParameterIds: ['pt_time', 'inr_val', 'aptt_time'],
        results: { pt_time: '12.4', inr_val: '1.02', aptt_time: '31.5' },
      },
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '6.4', hgb: '14.0', plt: '255' },
      },
    ],
    createdAt: daysAgo(25, 10, 30),
    updatedAt: daysAgo(25, 10, 30),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  // Month 2
  {
    id: 'rep_m2_01',
    status: 'completed',
    patient: {
      name: 'RITA ASAMOAH',
      sex: 'Female',
      age: '37',
      sampleCollectionDate: dateOnly(daysAgo(45, 10, 0)),
      collectionTime: '10:00 AM',
      resultsDate: dateOnly(daysAgo(45, 11, 30)),
      sampleId: 'LAB-2026-0690',
      sampleType: 'Blood',
      receiptNumber: 'REC-009850',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'tft',
        priceCents: 24500, // GH₵ 245.00
        selectedParameterIds: ['t3', 't4', 'tsh'],
        results: { t3: '1.9', t4: '120', tsh: '2.1' },
      },
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '5.9', hgb: '13.1', plt: '240' },
      },
    ],
    createdAt: daysAgo(45, 11, 30),
    updatedAt: daysAgo(45, 11, 30),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_m2_02',
    status: 'completed',
    patient: {
      name: 'KOJO DANSO',
      sex: 'Male',
      age: '52',
      sampleCollectionDate: dateOnly(daysAgo(55, 9, 0)),
      collectionTime: '09:00 AM',
      resultsDate: dateOnly(daysAgo(55, 10, 45)),
      sampleId: 'LAB-2026-0650',
      sampleType: 'Blood',
      receiptNumber: 'REC-009780',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'lft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['alt', 'ast', 'alp', 'tb'],
        results: { alt: '25', ast: '22', alp: '78', tb: '11' },
      },
      {
        testId: 'rft',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['urea', 'creatinine', 'egfr'],
        results: { urea: '4.5', creatinine: '84', egfr: '95' },
      },
      {
        testId: 'fbs',
        priceCents: 3500, // GH₵ 35.00
        selectedParameterIds: ['fbs_val'],
        results: { fbs_val: '4.9' },
      },
    ],
    createdAt: daysAgo(55, 10, 45),
    updatedAt: daysAgo(55, 10, 45),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  // Month 3
  {
    id: 'rep_m3_01',
    status: 'completed',
    patient: {
      name: 'ESTHER TACKIE',
      sex: 'Female',
      age: '28',
      sampleCollectionDate: dateOnly(daysAgo(75, 10, 30)),
      collectionTime: '10:30 AM',
      resultsDate: dateOnly(daysAgo(75, 12, 0)),
      sampleId: 'LAB-2026-0580',
      sampleType: 'Blood',
      receiptNumber: 'REC-009620',
      requestedBy: 'Dr. Owusu',
    },
    selectedTests: [
      {
        testId: 'anc_labs',
        priceCents: 60000, // GH₵ 600.00
        selectedParameterIds: ['anc_fbc', 'anc_urine', 'anc_group', 'anc_sickling', 'anc_g6pd'],
        results: { anc_fbc: 'Normal', anc_urine: 'Clear', anc_group: 'O Positive', anc_sickling: 'Negative', anc_g6pd: 'No Defect' },
      },
    ],
    createdAt: daysAgo(75, 12, 0),
    updatedAt: daysAgo(75, 12, 0),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  {
    id: 'rep_m3_02',
    status: 'completed',
    patient: {
      name: 'SETH ANKRAH',
      sex: 'Male',
      age: '46',
      sampleCollectionDate: dateOnly(daysAgo(85, 9, 15)),
      collectionTime: '09:15 AM',
      resultsDate: dateOnly(daysAgo(85, 10, 30)),
      sampleId: 'LAB-2026-0520',
      sampleType: 'Blood',
      receiptNumber: 'REC-009540',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '6.9', hgb: '14.6', plt: '260' },
      },
      {
        testId: 'lipid_profile',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['tc', 'tg', 'hdl', 'ldl'],
        results: { tc: '4.8', tg: '1.3', hdl: '1.2', ldl: '3.0' },
      },
    ],
    createdAt: daysAgo(85, 10, 30),
    updatedAt: daysAgo(85, 10, 30),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  // Month 4
  {
    id: 'rep_m4_01',
    status: 'completed',
    patient: {
      name: 'BEATRICE AGYEI',
      sex: 'Female',
      age: '33',
      sampleCollectionDate: dateOnly(daysAgo(110, 11, 0)),
      collectionTime: '11:00 AM',
      resultsDate: dateOnly(daysAgo(110, 12, 20)),
      sampleId: 'LAB-2026-0440',
      sampleType: 'Blood',
      receiptNumber: 'REC-009420',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'tft',
        priceCents: 24500, // GH₵ 245.00
        selectedParameterIds: ['t3', 't4', 'tsh'],
        results: { t3: '1.7', t4: '105', tsh: '2.4' },
      },
      {
        testId: 'hormonal',
        priceCents: 17000, // GH₵ 170.00
        selectedParameterIds: ['h_fsh', 'h_lh', 'h_prolactin'],
        results: { h_fsh: '5.8', h_lh: '6.4', h_prolactin: '14.0' },
      },
    ],
    createdAt: daysAgo(110, 12, 20),
    updatedAt: daysAgo(110, 12, 20),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  // Month 5
  {
    id: 'rep_m5_01',
    status: 'completed',
    patient: {
      name: 'VICTOR KPORHA',
      sex: 'Male',
      age: '50',
      sampleCollectionDate: dateOnly(daysAgo(140, 9, 30)),
      collectionTime: '09:30 AM',
      resultsDate: dateOnly(daysAgo(140, 11, 0)),
      sampleId: 'LAB-2026-0360',
      sampleType: 'Blood',
      receiptNumber: 'REC-009310',
      requestedBy: 'Dr. Mensah',
    },
    selectedTests: [
      {
        testId: 'ddimer',
        priceCents: 30000, // GH₵ 300.00
        selectedParameterIds: ['d_dimer_val'],
        results: { d_dimer_val: '0.35' },
      },
      {
        testId: 'fbc',
        priceCents: 8000, // GH₵ 80.00
        selectedParameterIds: ['wbc', 'hgb', 'plt'],
        results: { wbc: '7.5', hgb: '15.0', plt: '240' },
      },
    ],
    createdAt: daysAgo(140, 11, 0),
    updatedAt: daysAgo(140, 11, 0),
    performedBy: 'Dorean',
    performedByName: 'Dorean',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
  // Month 6
  {
    id: 'rep_m6_01',
    status: 'completed',
    patient: {
      name: 'MERCY APPIAGYEI',
      sex: 'Female',
      age: '29',
      sampleCollectionDate: dateOnly(daysAgo(170, 10, 0)),
      collectionTime: '10:00 AM',
      resultsDate: dateOnly(daysAgo(170, 11, 15)),
      sampleId: 'LAB-2026-0280',
      sampleType: 'Blood',
      receiptNumber: 'REC-009200',
      requestedBy: 'Dr. Darko',
    },
    selectedTests: [
      {
        testId: 'anc_labs',
        priceCents: 60000, // GH₵ 600.00
        selectedParameterIds: ['anc_fbc', 'anc_urine', 'anc_group', 'anc_sickling', 'anc_g6pd'],
        results: { anc_fbc: 'Normal', anc_urine: 'Clear', anc_group: 'B Pos', anc_sickling: 'Negative', anc_g6pd: 'No Defect' },
      },
    ],
    createdAt: daysAgo(170, 11, 15),
    updatedAt: daysAgo(170, 11, 15),
    performedBy: 'Hawa',
    performedByName: 'Hawa',
    performedByTitle: 'Medical Laboratory Scientist',
    facilitySettings: DUMMY_FACILITY,
  },
];
