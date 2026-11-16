import React, { useState } from 'react';
import {
  User,
  Calendar,
  Clock,
  Hash,
  FileCheck,
  ArrowRight,
  Activity,
  Check,
  Sparkles,
  ChevronDown,
} from './Icons';
import { PatientDetails, SampleType, FacilitySettings } from '../types';
import { useToast } from '../context/ToastContext';

interface Step1PatientProps {
  patient: PatientDetails;
  facilitySettings?: FacilitySettings;
  onChange: (updated: PatientDetails) => void;
  onNext: () => void;
}

export const Step1Patient: React.FC<Step1PatientProps> = ({ patient, facilitySettings, onChange, onNext }) => {
  const { showWarning } = useToast();

  const defaultDoctors = ['Dr. Alex', 'Dr. Joshua', 'Dr. Obuobi', 'Dr. Jennifer', 'Self'];
  const doctorsList = facilitySettings?.doctors && facilitySettings.doctors.length > 0
    ? facilitySettings.doctors
    : defaultDoctors;

  const [isCustomDoctor, setIsCustomDoctor] = useState(
    patient.requestedBy ? !doctorsList.includes(patient.requestedBy) : false
  );

  const updateField = <K extends keyof PatientDetails>(key: K, value: PatientDetails[K]) => {
    onChange({ ...patient, [key]: value });
  };

  const sampleTypeOptions: SampleType[] = [
    'Blood',
    'Urine',
    'Stool',
    'Swab',
    'Serum',
    'Plasma',
    'Other',
  ];

  // Active selected sample types (fallback to [patient.sampleType] if sampleTypes is not yet populated)
  const currentSampleTypes: SampleType[] =
    patient.sampleTypes && patient.sampleTypes.length > 0
      ? patient.sampleTypes
      : [patient.sampleType || 'Blood'];

  const toggleSampleType = (type: SampleType) => {
    let updated: SampleType[];
    if (currentSampleTypes.includes(type)) {
      // Don't allow deselecting the last remaining sample type
      if (currentSampleTypes.length === 1) return;
      updated = currentSampleTypes.filter((t) => t !== type);
    } else {
      updated = [...currentSampleTypes, type];
    }
    onChange({
      ...patient,
      sampleTypes: updated,
      sampleType: updated[0] || 'Blood',
    });
  };

  const setTodayDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    onChange({
      ...patient,
      sampleCollectionDate: today,
      resultsDate: today,
      collectionTime: now,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient.name.trim()) {
      showWarning('Please enter the patient full name before continuing.');
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Outer Card with Login Split Concept Rounded Design */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-[2.25rem] sm:rounded-[2.75rem] shadow-2xl border border-teal-100/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-all">
        
        {/* LEFT COLUMN: Clinical Healthcare Intake Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-b from-teal-50/20 via-white to-cyan-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90">
          <div>
            {/* Top Step Pill */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                <span>Step 1 of 4 &bull; Patient Intake</span>
              </span>

              <button
                type="button"
                onClick={setTodayDates}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                title="Synchronize collection and result timestamps to current time"
              >
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Reset to Now</span>
              </button>
            </div>

            {/* Header Title */}
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                Patient &amp; Specimen Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Enter demographic records, select multiple sample types, and billing receipt numbers.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group 1: Patient Demographics */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Patient Demographics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  {/* Patient Name */}
                  <div className="sm:col-span-12">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Patient Full Name <span className="text-teal-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Ama Boateng / Kwasi Addo"
                        value={patient.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full pl-5 pr-11 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 shadow-2xs"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Sex Selection Pills */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Sex <span className="text-teal-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('sex', 'Female')}
                        className={`py-3 px-4 rounded-full text-xs font-black border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                          patient.sex === 'Female'
                            ? 'bg-teal-700 border-teal-700 text-white shadow-md shadow-teal-700/20 ring-1 ring-teal-500'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {patient.sex === 'Female' && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>Female</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField('sex', 'Male')}
                        className={`py-3 px-4 rounded-full text-xs font-black border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                          patient.sex === 'Male'
                            ? 'bg-teal-700 border-teal-700 text-white shadow-md shadow-teal-700/20 ring-1 ring-teal-500'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {patient.sex === 'Male' && <Check className="w-3.5 h-3.5 text-white" />}
                        <span>Male</span>
                      </button>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Age (years) <span className="text-teal-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 32"
                      value={patient.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      className="w-full px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-500 transition-all placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Specimen Selection (MULTIPLE SAMPLE TYPES) */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Activity className="w-3 h-3" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Specimen Types (Choose Multiple)
                  </h3>
                </div>

                {/* Multiple Sample Type Pills */}
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2.5 ml-1">
                    Click to toggle all specimen types submitted for this patient (e.g. Blood + Urine):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sampleTypeOptions.map((st) => {
                      const isSelected = currentSampleTypes.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => toggleSampleType(st)}
                          className={`py-2 px-4 rounded-full text-xs font-extrabold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-teal-700 border-teal-700 text-white shadow-md shadow-teal-700/25 ring-1 ring-teal-400'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                          <span>{st}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Sample input if Other selected */}
                  {currentSampleTypes.includes('Other') && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Specify custom specimen type (e.g. Sputum, CSF, Synovial Fluid)..."
                        value={patient.customSampleType || ''}
                        onChange={(e) => updateField('customSampleType', e.target.value)}
                        className="w-full px-5 py-3 rounded-full border border-teal-400 dark:border-teal-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
                      />
                    </div>
                  )}
                </div>

                {/* Sample ID, Receipt, Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Sample ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 0016116"
                        value={patient.sampleId}
                        onChange={(e) => updateField('sampleId', e.target.value)}
                        className="w-full font-mono font-bold pl-4 pr-9 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all placeholder:text-slate-400 shadow-2xs"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Hash className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Receipt No.
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 00452"
                        value={patient.receiptNumber}
                        onChange={(e) => updateField('receiptNumber', e.target.value)}
                        className="w-full font-mono pl-4 pr-9 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all placeholder:text-slate-400 shadow-2xs"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <FileCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 ml-1">
                      Requested By (Doctor)
                    </label>
                    <div className="relative">
                      <select
                        value={isCustomDoctor ? '__custom__' : patient.requestedBy || 'Self'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setIsCustomDoctor(true);
                            updateField('requestedBy', '');
                          } else {
                            setIsCustomDoctor(false);
                            updateField('requestedBy', val);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all shadow-2xs appearance-none cursor-pointer pr-10"
                      >
                        {doctorsList.map((doc) => (
                          <option key={doc} value={doc}>
                            {doc}
                          </option>
                        ))}
                        <option value="__custom__">+ Other (Type Doctor Name)...</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>

                    {isCustomDoctor && (
                      <input
                        type="text"
                        placeholder="Type referring doctor name..."
                        value={patient.requestedBy}
                        onChange={(e) => updateField('requestedBy', e.target.value)}
                        autoFocus
                        className="mt-2 w-full px-4 py-2.5 rounded-full border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-400 shadow-2xs"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Group 3: Timestamps */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Collection &amp; Results Dates
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 ml-1">
                      Collection Date
                    </label>
                    <input
                      type="date"
                      value={patient.sampleCollectionDate}
                      onChange={(e) => updateField('sampleCollectionDate', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 ml-1">
                      Collection Time
                    </label>
                    <input
                      type="time"
                      value={patient.collectionTime}
                      onChange={(e) => updateField('collectionTime', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 ml-1">
                      Results Date
                    </label>
                    <input
                      type="date"
                      value={patient.resultsDate}
                      onChange={(e) => updateField('resultsDate', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-black text-sm shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Select Tests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Hero Image Card with Live Patient Intake Preview (Login concept) */}
        <div className="lg:col-span-5 p-3 sm:p-4 lg:p-5 flex">
          <div className="relative w-full h-full min-h-[420px] lg:min-h-full rounded-[2rem] sm:rounded-[2.25rem] overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-slate-900 shadow-inner">
            
            {/* Background Medical Patient Intake Image */}
            <img
              src="/patient-intake.jpg"
              alt="Medical Consultation & Specimen Intake"
              className="absolute inset-0 w-full h-full object-cover object-top filter brightness-95 contrast-105"
            />
            {/* Clinical Teal-Slate Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-teal-950/35 to-slate-950/45" />

            {/* TOP ROW: Floating Medical Registry Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-teal-700/90 backdrop-blur-md text-white border border-teal-400/40 px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 font-bold text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                <div>
                  <div className="text-[11px] font-extrabold uppercase leading-tight tracking-tight">
                    Specimen Intake Registry
                  </div>
                  <div className="text-[9px] font-medium text-teal-200">
                    Clinical Range Verification
                  </div>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-xs font-black shadow-lg">
                #1
              </div>
            </div>

            {/* BOTTOM ROW: Live Intake Card Preview */}
            <div className="relative z-10 space-y-3 pt-8">
              {/* Floating Live Patient Card */}
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/40 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Live Intake Preview
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {patient.sex} &bull; {patient.age ? `${patient.age} yrs` : 'Age pending'}
                  </span>
                </div>

                <div>
                  <div className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-tight truncate">
                    {patient.name || 'Patient Full Name'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {patient.requestedBy ? `Req: ${patient.requestedBy}` : 'OPD / Self-Referral'}
                  </div>
                </div>

                {/* Selected Samples Badges */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Submitted Specimens ({currentSampleTypes.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSampleTypes.map((st) => (
                      <span
                        key={st}
                        className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 shadow-2xs"
                      >
                        {st === 'Other' && patient.customSampleType ? patient.customSampleType : st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample ID & Receipt summary */}
                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>ID: <strong className="text-slate-900 dark:text-white">{patient.sampleId || '-'}</strong></span>
                  <span>Rec: <strong className="text-slate-900 dark:text-white">{patient.receiptNumber || '-'}</strong></span>
                </div>
              </div>

              {/* Protocol accreditation banner */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white text-[11px] font-medium flex items-center justify-between shadow-xl">
                <span>Biological Range Calibration</span>
                <span className="font-bold text-teal-300 uppercase text-[10px]">Active</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
