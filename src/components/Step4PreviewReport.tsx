import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Save,
  PlusCircle,
  Edit3,
  CheckCircle,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { LabTest, SelectedTestState, PatientDetails, FacilitySettings } from '../types';
import { evaluateFlag, getDisplayReferenceRange } from '../utils/flagging';

interface Step4PreviewReportProps {
  catalog: LabTest[];
  selectedTests: SelectedTestState[];
  patient: PatientDetails;
  facilitySettings: FacilitySettings;
  onEdit: () => void;
  onSaveReport: () => void;
  onNewPatient: () => void;
}

export const Step4PreviewReport: React.FC<Step4PreviewReportProps> = ({
  catalog,
  selectedTests,
  patient,
  facilitySettings,
  onEdit,
  onSaveReport,
  onNewPatient,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const getTestDef = (testId: string): LabTest | undefined => {
    return catalog.find((t) => t.id === testId);
  };

  const now = new Date();
  const formattedPrintDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Filter tests that have at least one non-empty result
  const testsWithResults = selectedTests
    .map((st) => {
      const def = getTestDef(st.testId);
      if (!def) return null;

      // Filter parameters that were ticked AND have a non-empty result entered
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
    // Standard best practice in modern browsers for pristine vector PDFs:
    // Invoke window.print() which prompts browser PDF printer with exact CSS,
    // or trigger save dialog.
    window.print();
  };

  const isSingleTest = testsWithResults.length === 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-700">Step 4 of 4</span>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            <span>Report Preview & Actions</span>
          </h2>
          <p className="text-slate-500 text-xs">
            A4 Print-Ready Document. Empty parameters are automatically omitted. Flags are bolded for B&W printing.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onEdit}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Results</span>
          </button>

          <button
            onClick={onSaveReport}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            title="Download or Save as PDF"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onNewPatient}
            className="px-3.5 py-2 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="bg-slate-200/70 p-2 sm:p-8 rounded-2xl flex justify-center overflow-x-auto no-print-bg">
        <div
          id="printable-report"
          ref={printAreaRef}
          className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-lg border border-slate-300 mx-auto font-sans leading-normal"
          style={{ boxSizing: 'border-box' }}
        >
          {/* 1. FACILITY HEADER (Centered, on every report) */}
          <div className="text-center space-y-0.5 pb-2">
            {facilitySettings.logoUrl && (
              <div className="flex justify-center mb-2">
                <img
                  src={facilitySettings.logoUrl}
                  alt="Clinic Logo"
                  className="h-16 max-w-xs object-contain"
                />
              </div>
            )}
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black uppercase font-serif">
              {facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC'}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-black">
              {facilitySettings.poBox || 'P. O. BOX 2425'}
            </p>
            <p className="text-xs sm:text-sm text-black">
              {facilitySettings.address || 'ADJACENT PUMA FILLING STATION, MADINA ESTATE'}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-black">
              {facilitySettings.telephone || 'TEL: 053 197 6621'}
            </p>
            <p className="text-xs sm:text-sm font-bold tracking-widest text-black uppercase pt-0.5">
              {facilitySettings.serviceTitle || 'LABORATORY SERVICE'}
            </p>
          </div>

          {/* Horizontal Rule */}
          <hr className="border-t-2 border-black my-3" />

          {/* 2. PATIENT BLOCK (Two columns) */}
          <div className="border border-black p-3 mb-4 text-xs sm:text-sm grid grid-cols-2 gap-x-6 gap-y-1">
            {/* Left Column */}
            <div className="space-y-1">
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">NAME:</span>
                <span className="font-bold text-black uppercase flex-1">{patient.name || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">SEX:</span>
                <span className="text-black uppercase flex-1">{patient.sex || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">AGE:</span>
                <span className="text-black uppercase flex-1">{patient.age ? `${patient.age} YEARS` : '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">COLLECTION DATE:</span>
                <span className="text-black flex-1">{patient.sampleCollectionDate || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">RESULTS DATE:</span>
                <span className="text-black flex-1">{patient.resultsDate || '-'}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">SAMPLE ID:</span>
                <span className="font-mono font-bold text-black flex-1">{patient.sampleId || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">SAMPLE TYPE:</span>
                <span className="text-black uppercase flex-1">
                  {patient.sampleType === 'Other' && patient.customSampleType
                    ? patient.customSampleType
                    : patient.sampleType}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">RECEIPT NO:</span>
                <span className="font-mono text-black flex-1">{patient.receiptNumber || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">TIME:</span>
                <span className="text-black flex-1">{patient.collectionTime || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-black uppercase">REQUESTED BY:</span>
                <span className="text-black flex-1 uppercase">{patient.requestedBy || '-'}</span>
              </div>
            </div>
          </div>

          {/* 3. LABORATORY REPORT HEADING */}
          <div className="text-center my-3">
            <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase border-b-2 border-black inline-block pb-0.5">
              LABORATORY REPORT
            </h2>
          </div>

          {/* TEST TABLES */}
          <div className="space-y-6">
            {testsWithResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-sm">
                No test results have been entered yet. Click \"Edit Results\" above to enter values.
              </div>
            ) : (
              testsWithResults.map(({ def, state, params }, testIndex) => {
                // Sequential Test Numbering:
                // If single test: show only title without number.
                // If multiple tests: TEST 1, TEST 2, ...
                const testHeading = isSingleTest
                  ? def.name
                  : `TEST ${testIndex + 1}: ${def.name}`;

                const isUrine = def.layoutType === 'urine_re';
                const isHormonal = def.id === 'hormonal';

                return (
                  <div key={def.id} className="avoid-break space-y-1.5 pt-1">
                    {/* Test Title */}
                    <div className="font-bold text-xs sm:text-sm text-black tracking-wide uppercase bg-slate-100 py-1 px-2 border-l-4 border-black">
                      {testHeading}
                    </div>

                    {/* Standard Table Layout */}
                    <table className="w-full border border-black text-[11px] sm:text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-black font-bold text-black uppercase">
                          <th className="py-1 px-2 text-left border-r border-black w-4/12">Parameter</th>
                          <th className="py-1 px-2 text-left border-r border-black w-2/12">Result</th>
                          <th className="py-1 px-2 text-left border-r border-black w-2/12">Unit</th>
                          <th className="py-1 px-2 text-center border-r border-black w-1/12">Flag</th>
                          <th className="py-1 px-2 text-left w-3/12">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map((param) => {
                          const val = state.results[param.id] || '';
                          const flag = evaluateFlag(param, val, patient.sex);
                          const isFlagged = flag === 'H' || flag === 'L' || flag === 'ABNORMAL';
                          const displayRange = getDisplayReferenceRange(param, patient.sex);

                          return (
                            <tr
                              key={param.id}
                              className={`border-b border-black/30 ${
                                isFlagged ? 'print-bold font-bold bg-slate-50' : ''
                              }`}
                            >
                              <td className="py-1 px-2 border-r border-black/30">
                                <span>{param.name}</span>
                                {param.subCategory && (
                                  <span className="text-[9px] text-slate-500 ml-1">
                                    ({param.subCategory})
                                  </span>
                                )}
                              </td>
                              <td
                                className={`py-1 px-2 border-r border-black/30 ${
                                  flag === 'H'
                                    ? 'text-red-700 print-black print-bold font-bold'
                                    : flag === 'L'
                                    ? 'text-blue-700 print-black print-bold font-bold'
                                    : flag === 'ABNORMAL'
                                    ? 'text-rose-700 print-black print-bold font-bold'
                                    : ''
                                }`}
                              >
                                {val}
                              </td>
                              <td className="py-1 px-2 border-r border-black/30 font-mono text-[10px]">
                                {param.unit || '-'}
                              </td>
                              <td className="py-1 px-2 border-r border-black/30 text-center">
                                {flag === 'H' && (
                                  <span className="font-black text-red-700 print-black print-bold">H</span>
                                )}
                                {flag === 'L' && (
                                  <span className="font-black text-blue-700 print-black print-bold">L</span>
                                )}
                                {flag === 'ABNORMAL' && (
                                  <span className="font-black text-rose-700 print-black print-bold">*</span>
                                )}
                                {flag === null && ''}
                              </td>
                              <td className="py-1 px-2 text-[10px] sm:text-[11px] text-slate-800">
                                {displayRange}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Hormonal Cycle phase / note printed below table */}
                    {isHormonal && state.cyclePhase && state.cyclePhase !== 'None' && (
                      <p className="text-[11px] text-black italic px-1">
                        <strong>Cycle phase / note:</strong> {state.cyclePhase} phase
                      </p>
                    )}

                    {/* Test Specific Comments */}
                    {state.comments && state.comments.trim() !== '' && (
                      <div className="text-[11px] text-black px-1 pt-0.5">
                        <span className="font-bold">Comments: </span>
                        <span>{state.comments}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 4. END OF REPORT */}
          <div className="text-center my-6 pt-4">
            <span className="font-bold italic text-xs tracking-widest uppercase">
              *** END OF REPORT ***
            </span>
          </div>

          {/* 5. FOOTER (Date Printed & Signature) */}
          <div className="avoid-break pt-4 mt-6 border-t border-black text-xs grid grid-cols-2 gap-4 items-end">
            {/* Left: Date Printed */}
            <div>
              <p className="font-bold text-black uppercase">DATE PRINTED:</p>
              <p className="font-mono text-slate-800 text-[11px]">{formattedPrintDate}</p>
            </div>

            {/* Right: Signature line */}
            <div className="text-right space-y-1">
              <div className="inline-block text-center w-56">
                <div className="border-b border-black mb-1 h-8 flex items-end justify-center">
                  {/* Signature line space */}
                </div>
                <p className="font-bold text-black uppercase text-xs">
                  {facilitySettings.scientistName || 'KWAME MENSAH, MLS (AHPC)'}
                </p>
                <p className="text-[11px] text-black italic">
                  {facilitySettings.scientistTitle || 'Lab Scientist'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
