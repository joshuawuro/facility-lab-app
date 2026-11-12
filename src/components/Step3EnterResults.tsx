import React, { useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Info,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from './Icons';
import { LabTest, SelectedTestState, PatientDetails, TestParameter } from '../types';
import { evaluateFlag, getDisplayReferenceRange, checkFbcConsistency } from '../utils/flagging';

interface Step3EnterResultsProps {
  catalog: LabTest[];
  selectedTests: SelectedTestState[];
  patient: PatientDetails;
  onChange: (updated: SelectedTestState[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3EnterResults: React.FC<Step3EnterResultsProps> = ({
  catalog,
  selectedTests,
  patient,
  onChange,
  onNext,
  onBack,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (containerRef.current) {
      const firstInput = containerRef.current.querySelector<HTMLInputElement | HTMLSelectElement>(
        '[data-lab-input="true"]'
      );
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, []);

  // Fast Keyboard Navigation (Enter or Tab key moves to next result field)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allInputs = Array.from(
        containerRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
          '[data-lab-input="true"]'
        ) || []
      );
      const currentIndex = allInputs.indexOf(e.currentTarget as HTMLInputElement | HTMLSelectElement);
      if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
      } else if (currentIndex === allInputs.length - 1) {
        onNext();
      }
    }
  };

  const updateResultValue = (testId: string, paramId: string, value: string) => {
    onChange(
      selectedTests.map((st) => {
        if (st.testId !== testId) return st;
        return {
          ...st,
          results: {
            ...st.results,
            [paramId]: value,
          },
        };
      })
    );
  };

  const updateComments = (testId: string, comments: string) => {
    onChange(
      selectedTests.map((st) => (st.testId === testId ? { ...st, comments } : st))
    );
  };

  const updateCyclePhase = (testId: string, cyclePhase: string) => {
    onChange(
      selectedTests.map((st) => (st.testId === testId ? { ...st, cyclePhase } : st))
    );
  };

  const getTestDef = (testId: string): LabTest | undefined => {
    return catalog.find((t) => t.id === testId);
  };

  // Inconsistency checks (e.g. FBC)
  const fbcState = selectedTests.find((st) => st.testId === 'fbc');
  const fbcNotices = useMemo(() => {
    if (!fbcState) return [];
    return checkFbcConsistency(fbcState.results);
  }, [fbcState]);

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner with Login Design Language */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2.25rem] shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 mb-1.5 shadow-2xs">
            Step 3 of 4 &bull; Clinical Entry
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            Enter Test Results
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
            Type values or select options. Flags compute instantly for patient sex: <span className="font-extrabold text-teal-700 dark:text-teal-300">{patient.sex}</span>.
          </p>
        </div>

        <div className="bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2 shadow-2xs">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-white">Pro-tip:</strong> Press <kbd className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full font-mono text-[11px] shadow-2xs">Enter</kbd> to rapidly leap to the next field.
          </span>
        </div>
      </div>

      {/* Gentle Consistency Warning Card if discrepancies detected */}
      {fbcNotices.length > 0 && (
        <div className="bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-teal-900 dark:text-teal-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span>Gentle Quality Alert (Informational only — does not prevent printing)</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {fbcNotices.map((n, i) => (
              <p key={i} className="text-teal-950 dark:text-teal-200">
                • <strong className="text-teal-950 dark:text-teal-100">{n.title}:</strong> {n.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Tests Results Entry List */}
      <div className="space-y-6">
        {selectedTests.map((selectedTest) => {
          const testDef = getTestDef(selectedTest.testId);
          if (!testDef) return null;

          const activeParams = testDef.parameters.filter((p) =>
            selectedTest.selectedParameterIds.includes(p.id)
          );

          if (activeParams.length === 0) return null;

          const isHormonal = testDef.id === 'hormonal';

          return (
            <div
              key={testDef.id}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2rem] shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
            >
              {/* Test Header */}
              <div className="bg-slate-50/80 dark:bg-slate-850 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-base tracking-tight">
                    {testDef.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    ({activeParams.length} analyte{activeParams.length > 1 ? 's' : ''})
                  </span>
                </div>

                {isHormonal && (
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Cycle Phase:</label>
                    <select
                      value={selectedTest.cyclePhase || 'Follicular'}
                      onChange={(e) => updateCyclePhase(testDef.id, e.target.value)}
                      className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                      <option value="Follicular">Follicular Phase</option>
                      <option value="Luteal">Luteal Phase</option>
                      <option value="Ovulatory / Mid-cycle">Ovulatory / Mid-cycle</option>
                      <option value="Menopausal">Post-Menopausal</option>
                      <option value="Pregnancy">Pregnancy</option>
                      <option value="Male baseline">Male Baseline</option>
                      <option value="None">None / General</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Table of parameters */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-5/12 sm:w-4/12">Parameter</th>
                      <th className="py-2.5 px-4 w-4/12 sm:w-3/12">Result</th>
                      <th className="py-2.5 px-3 w-1/12">Unit</th>
                      <th className="py-2.5 px-3 w-1/12 text-center">Flag</th>
                      <th className="py-2.5 px-4 w-3/12">Reference Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeParams.map((param) => {
                      const curVal = selectedTest.results[param.id] || '';
                      const flag = evaluateFlag(param, curVal, patient.sex);
                      const displayRange = getDisplayReferenceRange(param, patient.sex);
                      const isQualitative = param.rangeType === 'qualitative' && param.qualitativeOptions;

                      return (
                        <tr
                          key={param.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            flag === 'H'
                              ? 'bg-rose-50/40 dark:bg-rose-950/20'
                              : flag === 'L'
                              ? 'bg-sky-50/40 dark:bg-sky-950/20'
                              : flag === 'ABNORMAL'
                              ? 'bg-rose-50/40 dark:bg-rose-950/20'
                              : ''
                          }`}
                        >
                          {/* Parameter Name */}
                          <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            <span>{param.name}</span>
                            {param.subCategory && (
                              <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                {param.subCategory}
                              </span>
                            )}
                          </td>

                          {/* Result Input / Dropdown */}
                          <td className="py-2 px-4">
                            {isQualitative ? (
                              <select
                                data-lab-input="true"
                                value={curVal}
                                onChange={(e) => updateResultValue(testDef.id, param.id, e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={`w-full py-1.5 px-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                  flag === 'ABNORMAL'
                                    ? 'border-rose-400 dark:border-rose-600 bg-rose-50/60 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                                    : curVal
                                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                <option value="">-- Select result --</option>
                                {param.qualitativeOptions?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                data-lab-input="true"
                                type="text"
                                inputMode="decimal"
                                placeholder="Type result..."
                                value={curVal}
                                onChange={(e) => updateResultValue(testDef.id, param.id, e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={`w-full py-1.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                  flag === 'H'
                                    ? 'border-red-400 dark:border-red-600 bg-red-50/50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold'
                                    : flag === 'L'
                                    ? 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-teal-600'
                                }`}
                              />
                            )}
                          </td>

                          {/* Unit */}
                          <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
                            {param.unit || '-'}
                          </td>

                          {/* Flag column */}
                          <td className="py-2.5 px-3 text-center">
                            {flag === 'H' && (
                              <span className="inline-block px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 rounded font-black text-xs shadow-2xs">
                                H
                              </span>
                            )}
                            {flag === 'L' && (
                              <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded font-black text-xs shadow-2xs">
                                L
                              </span>
                            )}
                            {flag === 'ABNORMAL' && (
                              <span className="inline-block px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded font-black text-[11px] shadow-2xs">
                                ABNORMAL
                              </span>
                            )}
                            {flag === 'NO_RANGE' && (
                              <span className="text-[11px] italic text-slate-400 dark:text-slate-500">
                                no range set
                              </span>
                            )}
                            {flag === null && curVal !== '' && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">Normal</span>
                            )}
                          </td>

                          {/* Reference Range */}
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                            <span className={flag === 'NO_RANGE' ? 'text-slate-400 dark:text-slate-500 italic' : ''}>
                              {displayRange}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Optional Comments Box */}
              <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Comments / Notes for {testDef.name} (Optional)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Mild microcytic hypochromic picture seen. Repeat test in 2 weeks."
                  value={selectedTest.comments || ''}
                  onChange={(e) => updateComments(testDef.id, e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2.25rem] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between transition-colors">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Select Tests</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-sm font-extrabold transition-all flex items-center space-x-2 shadow-md shadow-teal-700/25 group cursor-pointer"
        >
          <span>Next: Preview & Print Report</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
