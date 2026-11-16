import React, { useState } from 'react';
import {
  Settings,
  Building,
  Activity,
  Upload,
  Trash2,
  Save,
  RotateCcw,
  Plus,
  Check,
  Download,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Users,
} from './Icons';
import { FacilitySettings, LabTest, TestParameter, UserAccount } from '../types';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface SettingsModalProps {
  facilitySettings: FacilitySettings;
  onSaveFacilitySettings: (settings: FacilitySettings) => void;
  catalog: LabTest[];
  onSaveCatalog: (catalog: LabTest[]) => void;
  onResetCatalog: () => void;
  users: UserAccount[];
  onSaveUsers: (users: UserAccount[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  facilitySettings,
  onSaveFacilitySettings,
  catalog,
  onSaveCatalog,
  onResetCatalog,
  users,
  onSaveUsers,
  onClose,
}) => {
  const { showSuccess, showError, showWarning, askConfirm } = useToast();
  const [activeTab, setActiveTab] = useState<'facility' | 'ranges' | 'users' | 'backup'>('facility');

  // Facility Form State
  const [localSettings, setLocalSettings] = useState<FacilitySettings>({ ...facilitySettings });
  const [facilitySavedAlert, setFacilitySavedAlert] = useState(false);

  // Reference Ranges State
  const [localCatalog, setLocalCatalog] = useState<LabTest[]>([...catalog]);
  const [selectedTestId, setSelectedTestId] = useState<string>(catalog[0]?.id || 'fbc');
  const [rangesSavedAlert, setRangesSavedAlert] = useState(false);

  // Users State
  const [localUsers, setLocalUsers] = useState<UserAccount[]>([...users]);
  const [userSavedAlert, setUserSavedAlert] = useState(false);

  // New Parameter state
  const [showAddParam, setShowAddParam] = useState(false);
  const [newParamName, setNewParamName] = useState('');
  const [newParamUnit, setNewParamUnit] = useState('');
  const [newParamRefText, setNewParamRefText] = useState('');
  const [newParamMin, setNewParamMin] = useState('');
  const [newParamMax, setNewParamMax] = useState('');
  const [newParamIsSexSpecific, setNewParamIsSexSpecific] = useState(false);
  const [newParamMaleMin, setNewParamMaleMin] = useState('');
  const [newParamMaleMax, setNewParamMaleMax] = useState('');
  const [newParamFemaleMin, setNewParamFemaleMin] = useState('');
  const [newParamFemaleMax, setNewParamFemaleMax] = useState('');

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showWarning('Logo file must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLocalSettings((prev) => ({ ...prev, logoUrl: reader.result as string }));
        showSuccess('Logo loaded. Remember to click "Save Settings".');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLocalSettings((prev) => ({ ...prev, logoUrl: '' }));
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFacilitySettings(localSettings);
    showSuccess('Facility settings saved successfully!');
  };

  // Sync shared keys (T3, T4, TSH)
  const syncSharedParameters = (
    currentCatalog: LabTest[],
    changedParam: TestParameter
  ): LabTest[] => {
    if (!changedParam.sharedKey) return currentCatalog;

    return currentCatalog.map((test) => ({
      ...test,
      parameters: test.parameters.map((p) => {
        if (p.sharedKey === changedParam.sharedKey && p.id !== changedParam.id) {
          return {
            ...p,
            unit: changedParam.unit,
            referenceRangeText: changedParam.referenceRangeText,
            min: changedParam.min,
            max: changedParam.max,
            rangeType: changedParam.rangeType,
          };
        }
        return p;
      }),
    }));
  };

  const updateParameter = (
    testId: string,
    paramId: string,
    updates: Partial<TestParameter>
  ) => {
    let updatedCatalog = localCatalog.map((test) => {
      if (test.id !== testId) return test;
      return {
        ...test,
        parameters: test.parameters.map((p) => {
          if (p.id !== paramId) return p;
          const merged = { ...p, ...updates };
          return merged;
        }),
      };
    });

    const targetTest = localCatalog.find((t) => t.id === testId);
    const targetParam = targetTest?.parameters.find((p) => p.id === paramId);
    if (targetParam?.sharedKey) {
      const mergedParam = { ...targetParam, ...updates };
      updatedCatalog = syncSharedParameters(updatedCatalog, mergedParam);
    }

    setLocalCatalog(updatedCatalog);
  };

  const handleSaveRanges = () => {
    onSaveCatalog(localCatalog);
    showSuccess('Reference ranges saved successfully!');
  };

  const handleResetDefaults = async () => {
    const confirmed = await askConfirm({
      title: 'Reset All Reference Ranges?',
      message: 'Are you sure you want to reset all reference ranges to factory defaults?',
      confirmText: 'Reset Defaults',
      isDestructive: true,
    });
    if (confirmed) {
      onResetCatalog();
      setLocalCatalog([...catalog]);
      showSuccess('Reference ranges reset to factory defaults.');
    }
  };

  const handleAddNewParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParamName.trim()) {
      showWarning('Please enter a parameter name.');
      return;
    }

    const minNum = newParamMin ? parseFloat(newParamMin) : undefined;
    const maxNum = newParamMax ? parseFloat(newParamMax) : undefined;
    const mMinNum = newParamMaleMin ? parseFloat(newParamMaleMin) : undefined;
    const mMaxNum = newParamMaleMax ? parseFloat(newParamMaleMax) : undefined;
    const fMinNum = newParamFemaleMin ? parseFloat(newParamFemaleMin) : undefined;
    const fMaxNum = newParamFemaleMax ? parseFloat(newParamFemaleMax) : undefined;

    const newParam: TestParameter = {
      id: `p_${Date.now()}`,
      name: newParamName.trim(),
      unit: newParamUnit.trim(),
      rangeType: 'min_max',
      referenceRangeText:
        newParamRefText.trim() ||
        (newParamIsSexSpecific
          ? `Male ${newParamMaleMin}–${newParamMaleMax} | Female ${newParamFemaleMin}–${newParamFemaleMax}`
          : `${newParamMin}–${newParamMax}`),
      min: isNaN(minNum as number) ? undefined : minNum,
      max: isNaN(maxNum as number) ? undefined : maxNum,
      isSexSpecific: newParamIsSexSpecific,
      maleMin: isNaN(mMinNum as number) ? undefined : mMinNum,
      maleMax: isNaN(mMaxNum as number) ? undefined : mMaxNum,
      femaleMin: isNaN(fMinNum as number) ? undefined : fMinNum,
      femaleMax: isNaN(fMaxNum as number) ? undefined : fMaxNum,
    };

    const updated = localCatalog.map((t) => {
      if (t.id === selectedTestId) {
        return {
          ...t,
          parameters: [...t.parameters, newParam],
        };
      }
      return t;
    });

    setLocalCatalog(updated);
    onSaveCatalog(updated);

    setNewParamName('');
    setNewParamUnit('');
    setNewParamRefText('');
    setNewParamMin('');
    setNewParamMax('');
    setNewParamIsSexSpecific(false);
    setShowAddParam(false);
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `care_lab_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const success = importBackupJSON(reader.result as string);
        if (success) {
          showSuccess('Backup restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showError('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const currentTestDef = localCatalog.find((t) => t.id === selectedTestId) || localCatalog[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 mb-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-bold tracking-wider uppercase">System Configuration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lab Settings & Reference Ranges</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Configure header details, laboratory scientist accounts, custom ranges, and sex-specific bounds.
          </p>
        </div>

        <button
          onClick={onClose}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Return to Active Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-xl px-4 pt-3 space-x-4 transition-colors">
        <button
          onClick={() => setActiveTab('facility')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'facility'
              ? 'border-teal-700 dark:border-teal-400 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Facility & Header Info</span>
        </button>

        <button
          onClick={() => setActiveTab('ranges')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'ranges'
              ? 'border-teal-700 dark:border-teal-400 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Reference Ranges & Units</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'users'
              ? 'border-teal-700 dark:border-teal-400 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Scientists & Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'backup'
              ? 'border-teal-700 dark:border-teal-400 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Transfer</span>
        </button>
      </div>

      {/* TAB 1: FACILITY DETAILS */}
      {activeTab === 'facility' && (
        <div className="bg-white dark:bg-slate-900 rounded-b-xl shadow-xs border border-slate-200 dark:border-slate-800 border-t-0 p-6 sm:p-8 transition-colors">
          {facilitySavedAlert && (
            <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Facility details saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveFacility} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                Report Header (Printed on Every Page)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Facility Name (Header Left Line 1)
                  </label>
                  <input
                    type="text"
                    required
                    value={localSettings.facilityName}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, facilityName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    P.O. Box (Header Right Line 1)
                  </label>
                  <input
                    type="text"
                    value={localSettings.poBox}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, poBox: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Physical Address (Header Left Line 2)
                  </label>
                  <input
                    type="text"
                    value={localSettings.address}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, address: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telephone (Header Right Line 2)
                  </label>
                  <input
                    type="text"
                    value={localSettings.telephone}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, telephone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Subtitle (Centered Line 3)
                  </label>
                  <input
                    type="text"
                    value={localSettings.serviceTitle}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, serviceTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-600 font-bold tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Optional Logo Upload */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Facility Logo (Optional)
              </h3>

              <div className="flex items-center space-x-4">
                {localSettings.logoUrl ? (
                  <div className="relative group">
                    <div className="w-24 h-24 aspect-square rounded-full overflow-hidden border-2 border-teal-500 bg-white p-1 shadow-md flex items-center justify-center">
                      <img
                        src={localSettings.logoUrl}
                        alt="Facility Logo"
                        className="w-full h-full object-contain aspect-square rounded-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 aspect-square rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>Upload</span>
                  </div>
                )}

                <div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PNG, JPG or SVG under 2MB. Printed at top of report header.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Facility Header</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: REFERENCE RANGES & UNITS */}
      {activeTab === 'ranges' && (
        <div className="bg-white dark:bg-slate-900 rounded-b-xl shadow-xs border border-slate-200 dark:border-slate-800 border-t-0 p-6 sm:p-8 space-y-6 transition-colors">
          {rangesSavedAlert && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Reference ranges updated and stored!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Select Test:
                </label>
                <select
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-600"
                >
                  {localCatalog.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Price (GH₵):
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentTestDef.priceCents !== undefined ? (currentTestDef.priceCents / 100) : ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const cents = isNaN(val) ? 0 : Math.round(val * 100);
                    const updated = localCatalog.map((t) =>
                      t.id === currentTestDef.id ? { ...t, priceCents: cents } : t
                    );
                    setLocalCatalog(updated);
                    onSaveCatalog(updated);
                  }}
                  className="w-20 px-2 py-0.5 rounded text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddParam(!showAddParam)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Plus className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>Add Parameter</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-1.5 text-slate-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg text-xs font-medium flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Factory Reset</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Parameter Name</th>
                  <th className="py-2.5 px-2 w-20">Unit</th>
                  <th className="py-2.5 px-2 w-28">Range Type</th>
                  <th className="py-2.5 px-2">Numeric Limits / Sex Ranges</th>
                  <th className="py-2.5 px-3">Display Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentTestDef.parameters.map((param) => (
                  <tr key={param.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <input
                        type="text"
                        value={param.name}
                        onChange={(e) =>
                          updateParameter(currentTestDef.id, param.id, { name: e.target.value })
                        }
                        className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-600 bg-transparent"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={param.unit}
                        onChange={(e) =>
                          updateParameter(currentTestDef.id, param.id, { unit: e.target.value })
                        }
                        className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-600 font-mono text-[11px] bg-transparent text-slate-800 dark:text-slate-200"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <select
                        value={param.rangeType}
                        onChange={(e) =>
                          updateParameter(currentTestDef.id, param.id, {
                            rangeType: e.target.value as any,
                          })
                        }
                        className="w-full px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white"
                      >
                        <option value="min_max">Min–Max</option>
                        <option value="less_than">&lt; Upper Limit</option>
                        <option value="greater_than">&gt; Lower Limit</option>
                        <option value="qualitative">Qualitative</option>
                        <option value="text">Text / None</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-2">
                      {param.isSexSpecific ? (
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center space-x-1">
                            <span className="w-12 font-bold text-blue-700 dark:text-blue-400">Male:</span>
                            <input
                              type="text"
                              value={param.maleMin ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { maleMin: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                            <span>–</span>
                            <input
                              type="text"
                              value={param.maleMax ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { maleMax: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="w-12 font-bold text-rose-700 dark:text-rose-400">Female:</span>
                            <input
                              type="text"
                              value={param.femaleMin ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { femaleMin: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                            <span>–</span>
                            <input
                              type="text"
                              value={param.femaleMax ?? ''}
                              onChange={(e) => {
                                const num = e.target.value ? parseFloat(e.target.value) : undefined;
                                updateParameter(currentTestDef.id, param.id, { femaleMax: num });
                              }}
                              className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            placeholder="Min"
                            value={param.min ?? ''}
                            onChange={(e) => {
                              const num = e.target.value ? parseFloat(e.target.value) : undefined;
                              updateParameter(currentTestDef.id, param.id, { min: num });
                            }}
                            className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <span>–</span>
                          <input
                            type="text"
                            placeholder="Max"
                            value={param.max ?? ''}
                            onChange={(e) => {
                              const num = e.target.value ? parseFloat(e.target.value) : undefined;
                              updateParameter(currentTestDef.id, param.id, { max: num });
                            }}
                            className="w-14 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={param.referenceRangeText}
                        onChange={(e) =>
                          updateParameter(currentTestDef.id, param.id, {
                            referenceRangeText: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveRanges}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Reference Ranges</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SCIENTISTS & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-b-xl shadow-xs border border-slate-200 dark:border-slate-800 border-t-0 p-6 sm:p-8 space-y-6 transition-colors">
          {userSavedAlert && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>User accounts updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorized Laboratory Personnel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage accounts for Dorean, Hawa, and Admin. Passwords default to "password".
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {localUsers.map((u, idx) => (
                <div
                  key={u.username}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{u.displayName}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}
                    >
                      {u.role === 'admin' ? 'Admin' : 'Scientist'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                      Username
                    </label>
                    <input
                      type="text"
                      disabled
                      value={u.username}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                      Password
                    </label>
                    <input
                      type="text"
                      value={u.password || 'password'}
                      onChange={(e) => {
                        const updated = [...localUsers];
                        updated[idx].password = e.target.value;
                        setLocalUsers(updated);
                      }}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={u.title}
                      onChange={(e) => {
                        const updated = [...localUsers];
                        updated[idx].title = e.target.value;
                        setLocalUsers(updated);
                      }}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onSaveUsers(localUsers);
                  setUserSavedAlert(true);
                  setTimeout(() => setUserSavedAlert(false), 3000);
                }}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save User Accounts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & DATA TRANSFER */}
      {activeTab === 'backup' && (
        <div className="bg-white dark:bg-slate-900 rounded-b-xl shadow-xs border border-slate-200 dark:border-slate-800 border-t-0 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Export Lab Configuration & Archive</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Download a JSON backup with facility settings, user accounts, custom reference ranges, and saved patient records.
              </p>
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>Export Backup File (.json)</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Restore from Backup</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Upload a JSON backup file to restore records and settings on this machine.
              </p>
              <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors">
                <UploadCloud className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Choose Backup File (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
