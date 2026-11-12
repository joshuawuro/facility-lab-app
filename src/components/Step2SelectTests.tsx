import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  ListFilter,
  CheckCircle2,
  Activity,
} from './Icons';
import { LabTest, SelectedTestState, TestParameter } from '../types';
import { useToast } from '../context/ToastContext';

interface Step2SelectTestsProps {
  catalog: LabTest[];
  selectedTests: SelectedTestState[];
  onChange: (updated: SelectedTestState[]) => void;
  onAddCustomTest: (test: LabTest) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2SelectTests: React.FC<Step2SelectTestsProps> = ({
  catalog,
  selectedTests,
  onChange,
  onAddCustomTest,
  onNext,
  onBack,
}) => {
  const { showWarning, showSuccess } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTestIds, setExpandedTestIds] = useState<Set<string>>(new Set(['hormonal']));
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);

  // New Custom Test Modal Form State
  const [customTestName, setCustomTestName] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom Tests');
  const [customParams, setCustomParams] = useState<Array<{ name: string; unit: string; refRange: string; min?: string; max?: string }>>([
    { name: '', unit: '', refRange: '', min: '', max: '' },
  ]);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [catalog]);

  // Filtered tests
  const filteredCatalog = useMemo(() => {
    return catalog.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.parameters.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [catalog, searchQuery, selectedCategory]);

  const isTestSelected = (testId: string) => {
    return selectedTests.some((st) => st.testId === testId);
  };

  const getSelectedState = (testId: string): SelectedTestState | undefined => {
    return selectedTests.find((st) => st.testId === testId);
  };

  const toggleTest = (test: LabTest) => {
    if (isTestSelected(test.id)) {
      onChange(selectedTests.filter((st) => st.testId !== test.id));
    } else {
      const newState: SelectedTestState = {
        testId: test.id,
        selectedParameterIds: test.parameters.map((p) => p.id),
        results: {},
        comments: '',
        cyclePhase: test.id === 'hormonal' ? 'Follicular' : undefined,
      };
      onChange([...selectedTests, newState]);

      if (test.parameters.length > 2) {
        setExpandedTestIds((prev) => new Set(prev).add(test.id));
      }
    }
  };

  const handleSelectAllCategory = (cat: string) => {
    const testsInCat = cat === 'All' ? catalog : catalog.filter((t) => t.category === cat);
    const newSelected = [...selectedTests];
    testsInCat.forEach((t) => {
      if (!newSelected.some((st) => st.testId === t.id)) {
        newSelected.push({
          testId: t.id,
          selectedParameterIds: t.parameters.map((p) => p.id),
          results: {},
          comments: '',
          cyclePhase: t.id === 'hormonal' ? 'Follicular' : undefined,
        });
      }
    });
    onChange(newSelected);
    showSuccess(`Selected all tests in ${cat}.`);
  };

  const handleClearCategory = (cat: string) => {
    const testsInCatIds = (cat === 'All' ? catalog : catalog.filter((t) => t.category === cat)).map((t) => t.id);
    onChange(selectedTests.filter((st) => !testsInCatIds.includes(st.testId)));
    showSuccess(`Cleared tests in ${cat}.`);
  };

  const handleClearAll = () => {
    onChange([]);
    showSuccess('Cleared all selected tests.');
  };

  const toggleExpand = (testId: string) => {
    setExpandedTestIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  const toggleParameter = (testId: string, paramId: string) => {
    const existing = getSelectedState(testId);
    if (!existing) {
      const newState: SelectedTestState = {
        testId,
        selectedParameterIds: [paramId],
        results: {},
        comments: '',
      };
      onChange([...selectedTests, newState]);
      return;
    }

    const isParamSelected = existing.selectedParameterIds.includes(paramId);
    let updatedParamIds: string[];

    if (isParamSelected) {
      updatedParamIds = existing.selectedParameterIds.filter((id) => id !== paramId);
    } else {
      updatedParamIds = [...existing.selectedParameterIds, paramId];
    }

    if (updatedParamIds.length === 0) {
      onChange(selectedTests.filter((st) => st.testId !== testId));
    } else {
      onChange(
        selectedTests.map((st) =>
          st.testId === testId ? { ...st, selectedParameterIds: updatedParamIds } : st
        )
      );
    }
  };

  const selectAllParameters = (test: LabTest) => {
    const existing = getSelectedState(test.id);
    const allIds = test.parameters.map((p) => p.id);
    if (existing) {
      onChange(
        selectedTests.map((st) =>
          st.testId === test.id ? { ...st, selectedParameterIds: allIds } : st
        )
      );
    } else {
      onChange([
        ...selectedTests,
        {
          testId: test.id,
          selectedParameterIds: allIds,
          results: {},
        },
      ]);
    }
  };

  const deselectAllParameters = (testId: string) => {
    onChange(selectedTests.filter((st) => st.testId !== testId));
  };

  const addCustomParamRow = () => {
    setCustomParams([...customParams, { name: '', unit: '', refRange: '', min: '', max: '' }]);
  };

  const removeCustomParamRow = (idx: number) => {
    if (customParams.length > 1) {
      setCustomParams(customParams.filter((_, i) => i !== idx));
    }
  };

  const handleSaveCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestName.trim()) {
      showWarning('Please enter a test name.');
      return;
    }

    const validParams: TestParameter[] = customParams
      .filter((p) => p.name.trim().length > 0)
      .map((p, idx) => {
        const minVal = p.min ? parseFloat(p.min) : undefined;
        const maxVal = p.max ? parseFloat(p.max) : undefined;
        const hasMinMax = !isNaN(minVal as number) || !isNaN(maxVal as number);

        return {
          id: `param_${Date.now()}_${idx}`,
          name: p.name.trim(),
          unit: p.unit.trim(),
          rangeType: hasMinMax ? 'min_max' : 'text',
          referenceRangeText: p.refRange.trim() || (hasMinMax ? `${p.min || ''}–${p.max || ''}` : '-'),
          min: isNaN(minVal as number) ? undefined : minVal,
          max: isNaN(maxVal as number) ? undefined : maxVal,
        };
      });

    if (validParams.length === 0) {
      showWarning('Please add at least one valid parameter with a name.');
      return;
    }

    const newTest: LabTest = {
      id: `custom_${Date.now()}`,
      name: customTestName.trim().toUpperCase(),
      category: customCategory.trim() || 'Custom Tests',
      isCustom: true,
      parameters: validParams,
    };

    onAddCustomTest(newTest);
    showSuccess(`Custom test "${newTest.name}" created!`);

    onChange([
      ...selectedTests,
      {
        testId: newTest.id,
        selectedParameterIds: newTest.parameters.map((p) => p.id),
        results: {},
      },
    ]);

    setCustomTestName('');
    setCustomParams([{ name: '', unit: '', refRange: '', min: '', max: '' }]);
    setShowAddCustomModal(false);
  };

  const totalSelectedCount = selectedTests.length;
  const totalParametersSelected = selectedTests.reduce((acc, st) => acc + st.selectedParameterIds.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Visual Hero Header Card with Background Image */}
      <div className="relative rounded-[2.25rem] sm:rounded-[2.75rem] overflow-hidden shadow-xl mb-6 bg-slate-900 border border-teal-100">
        {/* Background Medical Imagery */}
        <img
          src="/patient-intake.jpg"
          alt="Clinical Laboratory Diagnostics"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter brightness-75 contrast-105"
        />
        {/* Deep Clinical Teal-Slate Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-teal-950/85 to-slate-950/75" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-9 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-teal-500/30 text-teal-200 border border-teal-400/30 mb-2 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Step 2 of 4 &bull; Laboratory Test Selection</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Select Requested Laboratory Tests
              </h1>
              <p className="text-teal-100/80 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                Choose diagnostic panels or select individual analytes. Reference ranges auto-calibrate by patient sex.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(true)}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/25 flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-teal-300" />
                <span>Add Custom Test</span>
              </button>

              <div className="bg-teal-900/70 backdrop-blur-md border border-teal-500/40 px-4 py-2 rounded-full text-right shadow-md">
                <span className="text-xs text-teal-200 font-medium">Selected: </span>
                <span className="text-xs font-black text-white">
                  {totalSelectedCount} tests ({totalParametersSelected} analytes)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search nested in Hero */}
          <div className="relative max-w-2xl">
            <Search className="w-4 h-4 text-teal-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests or analytes (e.g. FBC, Urea, T3, Malaria, Urine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full border border-white/30 bg-white/20 backdrop-blur-md text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/30 transition-all placeholder:text-teal-200/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Left (Categories & Tests), Right (Dedicated Selected Tests Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Categories & Test List (8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Categories in their own row - wrapped, zero horizontal scroll */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-800 font-extrabold uppercase tracking-wider text-xs">
                <ListFilter className="w-4 h-4 text-teal-600" />
                <span>Diagnostic Categories</span>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAllCategory(selectedCategory)}
                  className="text-teal-700 hover:text-teal-900 font-bold text-xs cursor-pointer"
                >
                  + Select All ({selectedCategory})
                </button>
                <span className="text-slate-300">&bull;</span>
                <button
                  type="button"
                  onClick={() => handleClearCategory(selectedCategory)}
                  className="text-slate-500 hover:text-rose-600 font-bold text-xs cursor-pointer"
                >
                  Clear Category
                </button>
              </div>
            </div>

            {/* Category pills wrapping cleanly onto their own lines */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white shadow-xs shadow-teal-700/25 ring-2 ring-teal-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Showing <strong>{filteredCatalog.length}</strong> test{filteredCatalog.length !== 1 ? 's' : ''} in <strong className="text-teal-700">{selectedCategory}</strong>
              </span>
              {totalSelectedCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  Deselect All Tests
                </button>
              )}
            </div>
          </div>

          {/* Test Catalog List */}
          <div className="space-y-3.5">
            {filteredCatalog.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
                <p className="text-slate-500 text-sm">No tests found matching "{searchQuery}".</p>
                <button
                  onClick={() => setShowAddCustomModal(true)}
                  className="mt-3 px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-lg hover:bg-teal-800 cursor-pointer"
                >
                  Add as Custom Test
                </button>
              </div>
            ) : (
              filteredCatalog.map((test) => {
                const isSelected = isTestSelected(test.id);
                const state = getSelectedState(test.id);
                const isExpanded = expandedTestIds.has(test.id);
                const paramCount = test.parameters.length;
                const selectedParamCount = state?.selectedParameterIds.length || 0;
                const isMultiParam = paramCount > 1;

                return (
                  <div
                    key={test.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Main Test Row */}
                    <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
                      <div
                        className="flex items-start sm:items-center space-x-3.5 flex-1 cursor-pointer"
                        onClick={() => toggleTest(test)}
                      >
                        <div className="mt-0.5 sm:mt-0 text-teal-700 transition-transform active:scale-95 shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-teal-700" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-extrabold text-sm sm:text-base text-slate-900">
                              {test.name}
                            </span>
                            {test.isCustom && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-100 text-purple-700">
                                Custom
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              &bull; {test.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isMultiParam
                              ? `${paramCount} analytes included`
                              : test.parameters[0]?.referenceRangeText
                              ? `Ref Range: ${test.parameters[0].referenceRangeText} ${test.parameters[0].unit || ''}`
                              : 'Qualitative / Standard Test'}
                          </p>
                        </div>
                      </div>

                      {/* Actions / Parameters Tag */}
                      <div className="flex items-center space-x-2.5 shrink-0">
                        {isSelected && (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
                            {selectedParamCount} / {paramCount} Selected
                          </span>
                        )}

                        {isMultiParam && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(test.id)}
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                            title={isExpanded ? 'Collapse parameters' : 'Expand parameters'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub-parameters list */}
                    {isMultiParam && isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    <div className="flex items-center justify-between py-2 text-xs text-slate-500 font-medium">
                      <span>Select individual analytes for this patient:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => selectAllParameters(test)}
                          className="text-teal-700 hover:text-teal-900 font-bold text-[11px] cursor-pointer"
                        >
                          Select All
                        </button>
                        <span>&bull;</span>
                        <button
                          type="button"
                          onClick={() => deselectAllParameters(test.id)}
                          className="text-slate-500 hover:text-slate-800 font-bold text-[11px] cursor-pointer"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {test.parameters.map((param) => {
                        const isParamChecked =
                          state?.selectedParameterIds.includes(param.id) ?? false;
                        return (
                          <label
                            key={param.id}
                            className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isParamChecked
                                ? 'bg-white border-teal-400 text-teal-900 font-semibold shadow-2xs'
                                : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isParamChecked}
                              onChange={() => toggleParameter(test.id, param.id)}
                              className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                            />
                            <div className="truncate flex-1">
                              <div className="truncate font-semibold text-slate-800">{param.name}</div>
                              {param.unit && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {param.unit}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Navigation Footer (Static bottom of test list) */}
          <div className="mt-6 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Patient Details</span>
            </button>

            <button
              type="button"
              disabled={totalSelectedCount === 0}
              onClick={onNext}
              className={`px-8 py-3 rounded-full text-xs font-extrabold transition-all flex items-center space-x-2 shadow-sm ${
                totalSelectedCount > 0
                  ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/20 group cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Next: Enter Results</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Selected Tests Sidebar (4 cols on large screens, sticky) */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                  Patient Workup
                </span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span>Selected Tests ({totalSelectedCount})</span>
                </h3>
              </div>
              {totalSelectedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* List of Selected Tests */}
            {totalSelectedCount === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Square className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No tests selected yet</p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  Click any laboratory test from the catalog on the left to add it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {selectedTests.map((st) => {
                  const testDef = catalog.find((t) => t.id === st.testId);
                  if (!testDef) return null;
                  const paramCount = testDef.parameters.length;
                  const selectedParamCount = st.selectedParameterIds.length;
                  return (
                    <div
                      key={st.testId}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2.5 transition-all hover:bg-slate-100/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-xs text-slate-900 truncate">
                          {testDef.name}
                        </div>
                        <div className="text-[10px] text-teal-700 font-bold mt-0.5">
                          {selectedParamCount} of {paramCount} analyte{paramCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTest(testDef)}
                        className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center font-black text-sm transition-colors cursor-pointer shrink-0"
                        title={`Remove ${testDef.name}`}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary Box */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Total Diagnostic Panels:</span>
                <span className="font-extrabold text-slate-900">{totalSelectedCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Total Analytes to Measure:</span>
                <span className="font-extrabold text-teal-700">{totalParametersSelected}</span>
              </div>
            </div>

            {/* Primary Proceed CTA Button */}
            <button
              type="button"
              disabled={totalSelectedCount === 0}
              onClick={onNext}
              className={`w-full py-4 rounded-full text-xs font-black flex items-center justify-center space-x-2 shadow-md transition-all ${
                totalSelectedCount > 0
                  ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-700/25 cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Enter Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal: Add Custom Test */}
      {showAddCustomModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Add Custom Lab Test</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a custom laboratory test and define its analytes and ranges.
                </p>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomTest} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LIPID PROFILE"
                    value={customTestName}
                    onChange={(e) => setCustomTestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical Chemistry"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Test Parameters / Analytes
                  </label>
                  <button
                    type="button"
                    onClick={addCustomParamRow}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 cursor-pointer"
                  >
                    + Add Parameter
                  </button>
                </div>

                <div className="space-y-3">
                  {customParams.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Param #{idx + 1}</span>
                        {customParams.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCustomParamRow(idx)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Name (e.g. Total Cholesterol)"
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...customParams];
                            updated[idx].name = e.target.value;
                            setCustomParams(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Unit (e.g. mmol/L)"
                          value={p.unit}
                          onChange={(e) => {
                            const updated = [...customParams];
                            updated[idx].unit = e.target.value;
                            setCustomParams(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Ref Range Text (e.g. 3.0–5.2)"
                          value={p.refRange}
                          onChange={(e) => {
                            const updated = [...customParams];
                            updated[idx].refRange = e.target.value;
                            setCustomParams(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-lg hover:bg-teal-800 cursor-pointer"
                >
                  Save Custom Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
