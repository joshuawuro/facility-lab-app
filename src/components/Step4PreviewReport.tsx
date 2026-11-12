import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Save,
  PlusCircle,
  Edit3,
  FileCheck2,
  Activity,
  CheckCircle2,
} from './Icons';
import { LabTest, SelectedTestState, PatientDetails, FacilitySettings, UserAccount } from '../types';
import { evaluateFlag, getDisplayReferenceRange } from '../utils/flagging';

interface Step4PreviewReportProps {
  catalog: LabTest[];
  selectedTests: SelectedTestState[];
  patient: PatientDetails;
  facilitySettings: FacilitySettings;
  currentUser: UserAccount;
  onEdit: () => void;
  onSaveReport: () => void;
  onNewPatient: () => void;
}

export const Step4PreviewReport: React.FC<Step4PreviewReportProps> = ({
  catalog,
  selectedTests,
  patient,
  facilitySettings,
  currentUser,
  onEdit,
  onSaveReport,
  onNewPatient,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const getTestDef = (testId: string): LabTest | undefined => {
    return catalog.find((t) => t.id === testId);
  };

  const now = new Date();
  const formattedPrintDate =
    now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Filter tests with selected parameters
  const testsWithResults = selectedTests
    .map((st) => {
      const def = getTestDef(st.testId);
      if (!def) return null;

      const filledParams = def.parameters.filter((p) => {
        const isTicked = st.selectedParameterIds.includes(p.id);
        const val = st.results[p.id];
        return isTicked && val !== undefined && val.trim() !== '';
      });

      return {
        def,
        state: st,
        params: filledParams,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && item.params.length > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const isSingleTest = testsWithResults.length === 1;

  // Scientist name on signature: use current user's display name or facility setting
  const scientistSignatureName =
    currentUser.role === 'scientist'
      ? `${currentUser.displayName.toUpperCase()}, MLS (AHPC)`
      : facilitySettings.scientistName || 'KWAME MENSAH, MLS (AHPC)';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-teal-100 text-teal-900 mb-1">
            Step 4 of 4 &bull; A4 Ready
          </span>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            <span>Report Preview & Actions</span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Signed by: <span className="font-extrabold text-slate-900">{currentUser.displayName}</span> ({currentUser.title || 'Lab Scientist'})
          </p>
        </div>

        {/* Action Buttons as Rounded Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Results</span>
          </button>

          <button
            onClick={onSaveReport}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-sm shadow-teal-700/25 cursor-pointer"
            title="Download or Save as PDF via Print Dialog"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-black flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onNewPatient}
            className="px-4 py-2 rounded-full border border-teal-600/60 text-teal-800 hover:bg-teal-50 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container (Clean paper presentation without blue-gray padding box) */}
      <div className="flex justify-center overflow-x-auto py-2 print:block print:p-0 print:m-0">
        <div
          id="printable-report"
          ref={printAreaRef}
          className="bg-white text-slate-900 w-[210mm] max-w-full min-h-[297mm] p-8 sm:p-10 shadow-lg border border-slate-200 rounded-sm mx-auto font-sans leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0"
          style={{ boxSizing: 'border-box' }}
        >
          {/* FACILITY HEADER: Clean, Balanced Typography */}
          <div className="pb-3 text-center border-b border-slate-800/80 print:border-black">
            {facilitySettings.logoUrl && (
              <div className="flex justify-center mb-2.5">
                <div className="w-16 h-16 aspect-square rounded-full overflow-hidden border border-slate-300/80 bg-white p-1 shadow-2xs flex items-center justify-center">
                  <img
                    src={facilitySettings.logoUrl}
                    alt="Clinic Logo"
                    className="w-full h-full object-contain aspect-square rounded-full"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-[11px] font-bold text-slate-900 uppercase">
              {/* Left Column */}
              <div className="text-center sm:text-left mb-1 sm:mb-0">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                  {facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC'}
                </h1>
                <p className="text-[11px] font-semibold text-slate-700">
                  {facilitySettings.address || 'ADJACENT PUMA FILLING STATION'}
                </p>
              </div>

              {/* Right Column */}
              <div className="text-center sm:text-right">
                <p className="text-[11px] font-bold text-slate-900">
                  {facilitySettings.poBox || 'P. O. BOX 2425'}
                </p>
                <p className="text-[11px] font-semibold text-slate-700">
                  MADINA ESTATE &bull; {facilitySettings.telephone || 'TEL: 053 197 6621'}
                </p>
              </div>
            </div>

            {/* Full-width Green LABORATORY REPORT Banner */}
            <div className="lab-report-banner -mx-8 sm:-mx-11 mt-3.5 py-1.5 bg-[#15803d] text-white text-center font-black text-xs sm:text-sm tracking-[0.25em] uppercase shadow-xs" style={{backgroundColor: '#15803d', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
              LABORATORY REPORT
            </div>
          </div>

          {/* COMPACT PATIENT DETAILS (Clean clinical layout, no gray box in print) */}
          <div className="my-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-[11px] grid grid-cols-2 gap-x-8 gap-y-1 print:bg-white print:border-y print:border-x-0 print:border-black print:rounded-none print:p-2 print:text-black">
            {/* Left Column */}
            <div className="space-y-1">
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Name:</span>
                <span className="font-extrabold text-slate-950 uppercase flex-1 text-[11px] print:text-black">{patient.name || '-'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Sex / Age:</span>
                <span className="font-bold text-slate-900 uppercase flex-1 text-[11px] print:text-black">
                  {patient.sex || '-'} {patient.age ? `• ${patient.age} YRS` : ''}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Sample Date:</span>
                <span className="text-slate-800 flex-1 font-medium text-[11px] print:text-black">{patient.sampleCollectionDate || '-'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Results Date:</span>
                <span className="text-slate-800 flex-1 font-medium text-[11px] print:text-black">{patient.resultsDate || '-'}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Sample ID:</span>
                <span className="font-mono font-bold text-slate-950 flex-1 text-[11px] print:text-black">{patient.sampleId || '-'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Sample Type:</span>
                <span className="text-slate-800 uppercase flex-1 font-medium text-[11px] print:text-black">
                  {patient.sampleTypes && patient.sampleTypes.length > 0
                    ? patient.sampleTypes
                        .map((st) => (st === 'Other' && patient.customSampleType ? patient.customSampleType : st))
                        .join(', ')
                    : patient.sampleType === 'Other' && patient.customSampleType
                    ? patient.customSampleType
                    : patient.sampleType || 'Blood'}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Receipt No:</span>
                <span className="font-mono text-slate-800 flex-1 font-medium text-[11px] print:text-black">{patient.receiptNumber || '-'}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-28 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 print:text-black">Time / Req By:</span>
                <span className="text-slate-800 flex-1 font-medium text-[11px] truncate print:text-black">
                  {patient.collectionTime || '-'} {patient.requestedBy ? `• ${patient.requestedBy}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* TEST RESULTS (BORDERLESS, NO HARSH TABLE LINES) */}
          <div className="space-y-5">
            {testsWithResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs">
                No test results have been entered yet. Click "Edit Results" above to enter values.
              </div>
            ) : (
              testsWithResults.map(({ def, state, params }, testIndex) => {
                const isUrine = def.id === 'urine_re' || def.layoutType === 'urine_re';
                const isHormonal = def.id === 'hormonal';

                const testHeading = isSingleTest
                  ? def.name
                  : `TEST ${testIndex + 1}: ${def.name}`;

                // Modern 2-Column Borderless Layout for Urine Routine
                if (isUrine) {
                  const macroParams = def.parameters.filter(
                    (p) => p.subCategory === 'Macroscopy' && state.selectedParameterIds.includes(p.id)
                  );
                  const microParams = def.parameters.filter(
                    (p) => p.subCategory === 'Microscopy' && state.selectedParameterIds.includes(p.id)
                  );
                  const maxRows = Math.max(macroParams.length, microParams.length);

                  return (
                    <div key={def.id} className="avoid-break pt-1">
                      {/* Section Title */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-900 mb-2">
                        <span className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                          {testHeading}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Urinalysis
                        </span>
                      </div>

                      {/* Side by side Macroscopy & Microscopy without harsh grid lines */}
                      <div className="grid grid-cols-2 gap-x-8 text-[11px]">
                        {/* Macroscopy Column */}
                        <div>
                          <div className="flex justify-between items-center pb-1 mb-1 border-b border-slate-300 print:border-black font-extrabold text-[10px] uppercase tracking-wider text-slate-600 print:text-black">
                            <span>Macroscopy</span>
                            <span>Result</span>
                          </div>
                          <div className="space-y-1">
                            {macroParams.map((macro) => {
                              const val = state.results[macro.id] || '';
                              const flag = evaluateFlag(macro, val, patient.sex);
                              const isAbnormal = Boolean(flag);

                              return (
                                <div
                                  key={macro.id}
                                  className={`flex justify-between items-center py-0.5 px-1 rounded transition-colors ${
                                    isAbnormal ? 'font-bold text-red-700 bg-red-50/60' : 'text-slate-800'
                                  } print:bg-white print:text-black`}
                                >
                                  <span className="text-slate-700 font-medium print:text-black">{macro.name}</span>
                                  <span className={`font-bold ${isAbnormal ? 'text-red-700 font-black print:text-black' : 'text-slate-900 print:text-black'}`}>
                                    {val || '-'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Microscopy Column */}
                        <div>
                          <div className="flex justify-between items-center pb-1 mb-1 border-b border-slate-300 print:border-black font-extrabold text-[10px] uppercase tracking-wider text-slate-600 print:text-black">
                            <span>Microscopy</span>
                            <span>Result</span>
                          </div>
                          <div className="space-y-1">
                            {microParams.map((micro) => {
                              const val = state.results[micro.id] || '';
                              const flag = evaluateFlag(micro, val, patient.sex);
                              const isAbnormal = Boolean(flag);

                              return (
                                <div
                                  key={micro.id}
                                  className={`flex justify-between items-center py-0.5 px-1 rounded transition-colors ${
                                    isAbnormal ? 'font-bold text-red-700 bg-red-50/60' : 'text-slate-800'
                                  } print:bg-white print:text-black`}
                                >
                                  <span className="text-slate-700 font-medium print:text-black">{micro.name}</span>
                                  <span className={`font-bold ${isAbnormal ? 'text-red-700 font-black print:text-black' : 'text-slate-900 print:text-black'}`}>
                                    {val || '-'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Comments Callout */}
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-800 flex items-start space-x-2 print:bg-white print:border-none print:p-0 print:text-black">
                        <span className="font-extrabold uppercase text-[10px] text-slate-500 shrink-0 mt-0.5 print:text-black">
                          Comments:
                        </span>
                        <span className="font-medium print:text-black">
                          {state.comments || 'No significant abnormality detected.'}
                        </span>
                      </div>
                    </div>
                  );
                }

                // Standard Borderless Panel (FBC, Renal, Thyroid, Hormones, etc.)
                return (
                  <div key={def.id} className="avoid-break pt-1">
                    {/* Section Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-900 mb-1.5">
                      <span className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                        {testHeading}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {def.category}
                      </span>
                    </div>

                    {/* Table without box lines: Clean, open clinical layout */}
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 print:border-black text-slate-500 print:text-black text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="py-1.5 text-left font-extrabold w-4/12">Parameter</th>
                          <th className="py-1.5 text-left font-extrabold w-2/12">Result</th>
                          <th className="py-1.5 text-left font-extrabold w-2/12">Unit</th>
                          <th className="py-1.5 text-center font-extrabold w-1/12">Flag</th>
                          <th className="py-1.5 text-left font-extrabold w-3/12">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                        {params.map((param) => {
                          const val = state.results[param.id] || '';
                          const flag = evaluateFlag(param, val, patient.sex);
                          const isFlagged = flag === 'H' || flag === 'L' || flag === 'ABNORMAL';
                          const displayRange = getDisplayReferenceRange(param, patient.sex);

                          return (
                            <tr
                              key={param.id}
                              className={`transition-colors ${
                                isFlagged ? 'bg-rose-50/30 font-bold' : 'hover:bg-slate-50/50'
                              } print:bg-white`}
                            >
                              {/* Parameter Name */}
                              <td className="py-1 pr-2 font-medium text-slate-900">
                                <span>{param.name}</span>
                                {param.subCategory && (
                                  <span className="text-[9px] text-slate-400 ml-1">
                                    ({param.subCategory})
                                  </span>
                                )}
                              </td>

                              {/* Numeric Result */}
                              <td
                                className={`py-1 pr-2 font-bold ${
                                  flag === 'H'
                                    ? 'text-red-700 font-black'
                                    : flag === 'L'
                                    ? 'text-blue-700 font-black'
                                    : flag === 'ABNORMAL'
                                    ? 'text-rose-700 font-black'
                                    : 'text-slate-900'
                                }`}
                              >
                                {val}
                              </td>

                              {/* Unit */}
                              <td className="py-1 pr-2 font-mono text-[10px] text-slate-600">
                                {param.unit || '-'}
                              </td>

                              {/* Flag Badge (without grid lines) */}
                              <td className="py-1 text-center">
                                {flag === 'H' && (
                                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-red-100 text-red-800 print:bg-transparent print:text-black print:font-black">
                                    H
                                  </span>
                                )}
                                {flag === 'L' && (
                                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800 print:bg-transparent print:text-black print:font-black">
                                    L
                                  </span>
                                )}
                                {flag === 'ABNORMAL' && (
                                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-100 text-rose-800 print:bg-transparent print:text-black print:font-black">
                                    *
                                  </span>
                                )}
                              </td>

                              {/* Reference Range */}
                              <td className="py-1 text-[10px] text-slate-600 font-medium">
                                {displayRange}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Cycle phase note */}
                    {isHormonal && state.cyclePhase && state.cyclePhase !== 'None' && (
                      <p className="text-[10px] text-slate-700 italic pt-1">
                        <strong>Cycle phase / note:</strong> {state.cyclePhase} phase
                      </p>
                    )}

                    {/* Test Specific Comments */}
                    {state.comments && state.comments.trim() !== '' && (
                      <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] text-slate-800 print:bg-white print:border-none print:p-0 print:text-black">
                        <span className="font-extrabold uppercase text-slate-500 mr-1 print:text-black">Comments:</span>
                        <span className="print:text-black">{state.comments}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER (Date Printed & Signature) */}
          <div className="avoid-break pt-3 mt-4 border-t border-slate-800 text-[11px] grid grid-cols-2 gap-4 items-end font-sans">
            {/* Left: Date Printed */}
            <div>
              <p className="font-bold text-slate-900 uppercase text-[10px]">
                DATE PRINTED: <span className="font-mono">{formattedPrintDate}</span>
              </p>
            </div>

            {/* Right: Signature line with Scientist's Name */}
            <div className="text-right space-y-1">
              <div className="inline-block text-center w-56">
                <p className="tracking-widest text-slate-700 text-xs mb-1">………………………….</p>
                <p className="font-black text-slate-950 uppercase text-[11px]">
                  {scientistSignatureName}
                </p>
                <p className="text-[10px] text-slate-600 italic">
                  {currentUser.role === 'scientist' ? 'Medical Laboratory Scientist' : facilitySettings.scientistTitle || 'Lab Scientist'}
                </p>
              </div>
            </div>
          </div>

          {/* *** END OF REPORT *** AS THE VERY LAST THING AT THE END */}
          <div className="text-center mt-6 pt-2 pb-1">
            <span className="font-extrabold italic text-[11px] tracking-widest uppercase text-slate-600">
              *** END OF REPORT ***
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
