/* In the print dialog choose A4, scale 100%, margins None, and turn off Headers and footers. */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Save,
  PlusCircle,
  Edit3,
  CheckCircle,
  FileCheck2,
} from './Icons';
import {
  LabTest,
  SelectedTestState,
  PatientDetails,
  FacilitySettings,
  UserAccount,
} from '../types';
import { evaluateFlag, getDisplayReferenceRange } from '../utils/flagging';
import { useToast } from '../context/ToastContext';

interface Step4PreviewReportProps {
  catalog: LabTest[];
  selectedTests: SelectedTestState[];
  patient: PatientDetails;
  facilitySettings: FacilitySettings;
  currentUser?: UserAccount;
  isAlreadySaved?: boolean;
  onEdit: () => void;
  onSaveReport: () => void;
  onNewPatient: () => void;
}

const DEFAULT_LOGO_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#0f766e"/>
      <path d="M50 20v60M20 50h60" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="14" fill="#ffffff"/>
      <circle cx="50" cy="50" r="8" fill="#0f766e"/>
    </svg>`
  );

export const Step4PreviewReport: React.FC<Step4PreviewReportProps> = ({
  catalog,
  selectedTests,
  patient,
  facilitySettings,
  currentUser,
  isAlreadySaved = false,
  onEdit,
  onSaveReport,
  onNewPatient,
}) => {
  const { showWarning, showSuccess } = useToast();
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isSaved, setIsSaved] = useState<boolean>(isAlreadySaved);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    setIsSaved(isAlreadySaved);
  }, [isAlreadySaved]);

  // Format current date and time: e.g. 16 Nov 2026, 09:30
  const formattedPrintDate = useMemo(() => {
    const now = new Date();
    return (
      now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA: Single central JavaScript object driving the laboratory report
  // ─────────────────────────────────────────────────────────────────────────────
  const reportData = useMemo(() => {
    // Process tests and rows dynamically
    const processedTests = selectedTests
      .map((st) => {
        const def = catalog.find((c) => c.id === st.testId);
        if (!def) return null;

        const activeParamIds = st.selectedParameterIds || [];
        const rows = def.parameters
          .filter((p) => {
            const isTicked = activeParamIds.includes(p.id);
            const val = st.results ? st.results[p.id] : undefined;
            return isTicked && val !== undefined && val !== null && val.trim() !== '';
          })
          .map((p) => {
            const rawVal = st.results[p.id].trim();
            const low = p.isSexSpecific
              ? patient.sex === 'Male'
                ? p.maleMin
                : p.femaleMin
              : p.min;
            const high = p.isSexSpecific
              ? patient.sex === 'Male'
                ? p.maleMax
                : p.femaleMax
              : p.max;
            const refText = getDisplayReferenceRange(p, patient.sex);

            // Automatic flag evaluation
            let flag: 'H' | 'L' | 'ABNORMAL' | null = null;
            const num = parseFloat(rawVal);
            if (!isNaN(num)) {
              if (high !== undefined && high !== null && num > high) {
                flag = 'H';
              } else if (low !== undefined && low !== null && num < low) {
                flag = 'L';
              }
            }
            if (!flag) {
              const evalFlag = evaluateFlag(p, rawVal, patient.sex);
              if (evalFlag === 'H' || evalFlag === 'L' || evalFlag === 'ABNORMAL') {
                flag = evalFlag;
              }
            }

            const isAbnormal = flag !== null;

            return {
              parameter: p.name + (p.subCategory ? ` (${p.subCategory})` : ''),
              result: rawVal,
              unit: p.unit || '',
              low,
              high,
              refText,
              flag,
              isAbnormal,
            };
          });

        if (rows.length === 0) return null;

        return {
          title: def.name,
          comments: st.comments || '',
          cyclePhase: st.cyclePhase || '',
          rows,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    return {
      clinic: {
        name: facilitySettings.facilityName || 'CARE AND SOCIAL POLYCLINIC',
        servicesLine: facilitySettings.serviceTitle || 'Laboratory Service',
        address: facilitySettings.address || 'Adjacent Puma Filling Station, Madina Estate',
        poBox: facilitySettings.poBox || 'P. O. Box 2425',
        phone: facilitySettings.telephone || '053 197 6621',
        logo: facilitySettings.logoUrl || DEFAULT_LOGO_SVG,
      },
      patient: {
        name: patient.name || '-',
        sex: patient.sex || '-',
        age: patient.age ? `${patient.age} yrs` : '-',
        sampleId: patient.sampleId || '-',
        sampleType:
          patient.sampleType === 'Other' && patient.customSampleType
            ? patient.customSampleType
            : patient.sampleType || 'Blood',
        receiptNumber: patient.receiptNumber || '-',
        collectionDate: patient.sampleCollectionDate || '-',
        collectionTime: patient.collectionTime || '-',
        reportDate: patient.resultsDate || '-',
        requestedBy: patient.requestedBy || 'Self',
      },
      tests: processedTests,
      scientist: {
        name: currentUser?.displayName || facilitySettings.scientistName || 'Kwame Mensah, MLS',
        title: currentUser?.title || facilitySettings.scientistTitle || 'Medical Laboratory Scientist',
      },
      printedAt: formattedPrintDate,
    };
  }, [catalog, selectedTests, patient, facilitySettings, currentUser, formattedPrintDate]);

  // ─────────────────────────────────────────────────────────────────────────────
  // A4 MULTI-PAGE FLOW ENGINE
  // Intelligently partitions tests across A4 sheets so content never cuts off
  // ─────────────────────────────────────────────────────────────────────────────
  interface SheetPage {
    pageNumber: number;
    totalPages: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    tests: Array<{
      title: string;
      isContinuation?: boolean;
      comments?: string;
      cyclePhase?: string;
      rows: Array<{
        parameter: string;
        result: string;
        unit: string;
        low?: number;
        high?: number;
        refText: string;
        flag: 'H' | 'L' | 'ABNORMAL' | null;
        isAbnormal: boolean;
      }>;
    }>;
  }

  const sheets: SheetPage[] = useMemo(() => {
    const rawTests = reportData.tests;
    if (rawTests.length === 0) {
      return [
        {
          pageNumber: 1,
          totalPages: 1,
          isFirstPage: true,
          isLastPage: true,
          tests: [],
        },
      ];
    }

    const pages: SheetPage[] = [];
    const PAGE1_ROW_LIMIT = 28; // Page 1 comfortably holds up to 26-28 rows with headers & patient block
    const SUBSEQUENT_PAGE_ROW_LIMIT = 36; // Page 2+ holds up to 36 rows with compact header

    let currentPageTests: SheetPage['tests'] = [];
    let currentRowCount = 0;
    let isFirst = true;

    for (const test of rawTests) {
      let remainingRows = [...test.rows];
      let isFirstChunkOfTest = true;

      while (remainingRows.length > 0) {
        const currentLimit = isFirst ? PAGE1_ROW_LIMIT : SUBSEQUENT_PAGE_ROW_LIMIT;
        const availableCapacity = currentLimit - currentRowCount;
        const titleWeight = isFirstChunkOfTest ? 1.5 : 1;

        // If not enough room for test title + at least 1 row, break to new sheet
        if (availableCapacity < (titleWeight + 1) && currentRowCount > 0) {
          pages.push({
            pageNumber: pages.length + 1,
            totalPages: 1,
            isFirstPage: isFirst,
            isLastPage: false,
            tests: currentPageTests,
          });
          currentPageTests = [];
          currentRowCount = 0;
          isFirst = false;
          continue;
        }

        const effectiveCapacity = Math.floor(currentLimit - currentRowCount - titleWeight);
        const rowsToTake = Math.max(1, Math.min(remainingRows.length, effectiveCapacity));

        const chunkRows = remainingRows.slice(0, rowsToTake);
        remainingRows = remainingRows.slice(rowsToTake);

        currentPageTests.push({
          title: isFirstChunkOfTest ? test.title : `${test.title} (Continued)`,
          isContinuation: !isFirstChunkOfTest,
          comments: remainingRows.length === 0 ? test.comments : '',
          cyclePhase: test.cyclePhase,
          rows: chunkRows,
        });

        currentRowCount += chunkRows.length + titleWeight;
        isFirstChunkOfTest = false;

        if (currentRowCount >= currentLimit && remainingRows.length > 0) {
          pages.push({
            pageNumber: pages.length + 1,
            totalPages: 1,
            isFirstPage: isFirst,
            isLastPage: false,
            tests: currentPageTests,
          });
          currentPageTests = [];
          currentRowCount = 0;
          isFirst = false;
        }
      }
    }

    if (currentPageTests.length > 0) {
      pages.push({
        pageNumber: pages.length + 1,
        totalPages: 1,
        isFirstPage: isFirst,
        isLastPage: true,
        tests: currentPageTests,
      });
    }

    const total = pages.length;
    return pages.map((p, idx) => ({
      ...p,
      pageNumber: idx + 1,
      totalPages: total,
      isLastPage: idx === total - 1,
    }));
  }, [reportData]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Action Handlers (Save, Print, Download)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    onSaveReport();
    setIsSaved(true);
    showSuccess('Report saved successfully! Print and Download are now enabled.');
  };

  const handlePrint = () => {
    if (!isSaved) {
      showWarning('Cannot print report: Please click "Save Report" first before printing.');
      return;
    }
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!isSaved) {
      showWarning('Cannot download report: Please click "Save Report" first before downloading.');
      return;
    }

    setIsDownloading(true);
    const element = printAreaRef.current;
    if (!element) {
      setIsDownloading(false);
      return;
    }

    const patientSafeName = (reportData.patient.name || 'Patient')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${patientSafeName}_Lab_Report_${reportData.patient.sampleId || Date.now()}`;

    // Direct standalone HTML/PDF download trigger
    const triggerDirectDownload = () => {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportData.patient.name} - Laboratory Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #f1f5f9;
      font-family: 'Figtree', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @media print {
      body { background: #fff !important; }
      .a4-print-sheet {
        margin: 0 auto !important;
        box-shadow: none !important;
        page-break-after: always;
        break-after: page;
      }
      .a4-print-sheet:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
    .a4-print-sheet {
      width: 210mm;
      height: 296mm;
      min-height: 296mm;
      max-height: 296mm;
      padding: 12mm 16mm 10mm 16mm;
      box-sizing: border-box;
      overflow: hidden;
      background: #ffffff;
      margin: 10px auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .tabular-nums { font-variant-numeric: tabular-nums; }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
      showSuccess(`Laboratory report downloaded as "${fileName}.html"`);
    };

    // If html2pdf library is present
    if ((window as any).html2pdf) {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      (window as any)
        .html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          setIsDownloading(false);
          showSuccess(`Laboratory report downloaded as "${fileName}.pdf"`);
        })
        .catch(() => triggerDirectDownload());
      return;
    }

    // Dynamic load of html2pdf bundle
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      (window as any)
        .html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          setIsDownloading(false);
          showSuccess(`Laboratory report downloaded as "${fileName}.pdf"`);
        })
        .catch(() => triggerDirectDownload());
    };
    script.onerror = () => {
      triggerDirectDownload();
    };
    document.head.appendChild(script);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* ── TOP ACTION BAR (Hidden on print) ── */}
      <div className="no-print bg-white rounded-2xl shadow-xs border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            Step 4 of 4 &bull; Final Report
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mt-1">
            <FileCheck2 className="w-5 h-5 text-teal-700" />
            <span>Laboratory Report Preview &amp; Print</span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            A4 print-ready layout. Click &quot;Save Report&quot; first to enable instant download or printing.
          </p>
        </div>

        {/* Action Buttons & Status Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isSaved ? (
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved &bull; Save first</span>
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Report Saved</span>
            </span>
          )}

          <button
            onClick={onEdit}
            className="px-3.5 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Results</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-full text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300 animate-pulse'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Update Saved Report' : 'Save Report'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={!isSaved || isDownloading}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
              isSaved && !isDownloading
                ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
            }`}
            title={isSaved ? 'Automatically download report file' : 'Save report first to enable download'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!isSaved}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
              isSaved
                ? 'bg-slate-900 hover:bg-black text-white cursor-pointer active:scale-95'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
            }`}
            title={isSaved ? 'Print report' : 'Save report first to enable printing'}
          >
            <Printer className="w-3.5 h-3.5 text-teal-300" />
            <span>Print</span>
          </button>

          <button
            onClick={onNewPatient}
            className="px-3.5 py-2 rounded-full border border-teal-600 text-teal-800 hover:bg-teal-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* ── PRINTABLE A4 SHEETS CONTAINER (Screen grey background with soft shadow) ── */}
      <div className="bg-slate-200/80 p-2 sm:p-8 rounded-2xl flex flex-col items-center gap-6 overflow-x-auto no-print-bg">
        <div id="printable-report" ref={printAreaRef} className="w-full flex flex-col items-center gap-8">
          {sheets.map((sheet) => (
            <div
              key={`sheet-${sheet.pageNumber}`}
              className="a4-print-sheet bg-white text-slate-900 shadow-xl border border-slate-300/80 mx-auto"
              style={{
                width: '210mm',
                height: '296mm',
                minHeight: '296mm',
                maxHeight: '296mm',
                padding: '12mm 16mm 10mm 16mm',
                boxSizing: 'border-box',
                overflow: 'hidden',
                fontFamily: 'Figtree, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#0f172a',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              {/* TOP SECTION: Header, Title, Patient Block, Test Tables */}
              <div>
                {/* 1. HEADER */}
                {sheet.isFirstPage ? (
                  // Full Header on Page 1
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Logo & Clinic Name */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={reportData.clinic.logo}
                          alt="Clinic Logo"
                          className="w-10 h-10 object-contain shrink-0 rounded-sm"
                        />
                        <div>
                          <h1
                            className="font-bold leading-tight uppercase"
                            style={{ fontSize: '15pt', color: '#0f766e' }}
                          >
                            {reportData.clinic.name}
                          </h1>
                          <p
                            className="font-semibold uppercase tracking-wider"
                            style={{ fontSize: '8.5pt', color: '#64748b' }}
                          >
                            {reportData.clinic.servicesLine}
                          </p>
                        </div>
                      </div>

                      {/* Right: Address, PO Box, Phone */}
                      <div
                        className="text-right leading-tight"
                        style={{ fontSize: '8.5pt', color: '#64748b' }}
                      >
                        <div>{reportData.clinic.address}</div>
                        <div>{reportData.clinic.poBox}</div>
                        <div>Tel: {reportData.clinic.phone}</div>
                      </div>
                    </div>

                    {/* 2px Teal Rule */}
                    <div
                      style={{
                        height: '2px',
                        backgroundColor: '#0f766e',
                        marginTop: '3mm',
                        marginBottom: '3mm',
                      }}
                    />
                  </div>
                ) : (
                  // Compact Header on Page 2+
                  <div>
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center space-x-2">
                        <img
                          src={reportData.clinic.logo}
                          alt="Clinic Logo"
                          className="w-6 h-6 object-contain shrink-0"
                        />
                        <span
                          className="font-bold uppercase"
                          style={{ fontSize: '11pt', color: '#0f766e' }}
                        >
                          {reportData.clinic.name}
                        </span>
                        <span style={{ fontSize: '8.5pt', color: '#64748b' }}>
                          &bull; Laboratory Report (Continued)
                        </span>
                      </div>
                      <div
                        className="text-right font-medium"
                        style={{ fontSize: '8.5pt', color: '#64748b' }}
                      >
                        <span>Patient: <strong style={{ color: '#0f172a' }}>{reportData.patient.name}</strong></span>
                        <span className="mx-2">&bull;</span>
                        <span>Sample ID: <strong style={{ color: '#0f172a' }}>{reportData.patient.sampleId}</strong></span>
                      </div>
                    </div>
                    {/* 2px Teal Rule */}
                    <div
                      style={{
                        height: '2px',
                        backgroundColor: '#0f766e',
                        marginTop: '1.5mm',
                        marginBottom: '3mm',
                      }}
                    />
                  </div>
                )}

                {/* 2. TITLE: "Laboratory report" (Page 1 only) */}
                {sheet.isFirstPage && (
                  <div style={{ marginBottom: '3mm' }}>
                    <h2
                      className="font-bold tracking-tight"
                      style={{ fontSize: '13pt', color: '#0f172a' }}
                    >
                      Laboratory report
                    </h2>
                  </div>
                )}

                {/* 3. PATIENT BLOCK (Page 1 only, 2-column grid, light grey rounded box) */}
                {sheet.isFirstPage && (
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '3mm 4mm',
                      marginBottom: '4mm',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {/* Left Column: Patient, Sex / Age, Collected, Reported */}
                      <div className="space-y-2">
                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Patient
                          </div>
                          <div
                            className="font-bold uppercase tracking-tight"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.name}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Sex / Age
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.sex} / {reportData.patient.age}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Collected
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.collectionDate}{' '}
                            <span style={{ fontSize: '8.5pt', color: '#64748b', fontWeight: 500 }}>
                              {reportData.patient.collectionTime}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Reported
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.reportDate}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Sample ID, Sample type, Receipt no., Requested by */}
                      <div className="space-y-2">
                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Sample ID
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.sampleId}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Sample type
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.sampleType}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Receipt no.
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.receiptNumber}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '8.5pt', color: '#64748b', lineHeight: 1 }}>
                            Requested by
                          </div>
                          <div
                            className="font-bold"
                            style={{ fontSize: '10pt', color: '#0f172a', lineHeight: 1.25 }}
                          >
                            {reportData.patient.requestedBy}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TEST TABLES */}
                <div className="space-y-3">
                  {sheet.tests.length === 0 ? (
                    <div
                      className="py-12 text-center italic"
                      style={{ fontSize: '10pt', color: '#64748b' }}
                    >
                      No lab results entered yet. Click &quot;Edit Results&quot; to enter findings.
                    </div>
                  ) : (
                    sheet.tests.map((test, tIdx) => (
                      <div key={`${test.title}-${tIdx}`} className="space-y-1">
                        {/* Section Title */}
                        <div
                          className="font-bold test-title-heading"
                          style={{
                            fontSize: '12pt',
                            color: '#0f766e',
                            marginTop: tIdx === 0 ? '0' : '3mm',
                            marginBottom: '1.5mm',
                            pageBreakAfter: 'avoid',
                            breakAfter: 'avoid',
                          }}
                        >
                          {test.title}
                        </div>

                        {/* Parameter Table */}
                        <table
                          className="w-full text-left"
                          style={{
                            borderCollapse: 'collapse',
                            fontSize: '10pt',
                            width: '100%',
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                color: '#64748b',
                                fontSize: '8.5pt',
                                fontWeight: 600,
                              }}
                            >
                              <th style={{ padding: '3px 6px', textAlign: 'left', width: '38%' }}>
                                Parameter
                              </th>
                              <th style={{ padding: '3px 6px', textAlign: 'right', width: '18%' }}>
                                Result
                              </th>
                              <th style={{ padding: '3px 6px', textAlign: 'left', width: '16%' }}>
                                Unit
                              </th>
                              <th style={{ padding: '3px 6px', textAlign: 'left', width: '22%' }}>
                                Reference range
                              </th>
                              <th style={{ padding: '3px 4px', textAlign: 'center', width: '6%' }}>
                                Flag
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {test.rows.map((row, rIdx) => {
                              const isAbnormal = row.isAbnormal;

                              return (
                                <tr
                                  key={`${row.parameter}-${rIdx}`}
                                  style={{
                                    borderBottom: '1px solid #e2e8f0',
                                    backgroundColor: isAbnormal ? '#fef2f2' : 'transparent',
                                    color: isAbnormal ? '#dc2626' : '#0f172a',
                                    fontWeight: isAbnormal ? 700 : 400,
                                    borderLeft: isAbnormal ? '3px solid #dc2626' : '3px solid transparent',
                                    pageBreakInside: 'avoid',
                                    breakInside: 'avoid',
                                  }}
                                >
                                  {/* Parameter */}
                                  <td
                                    style={{
                                      padding: '3px 6px',
                                      fontSize: '9pt',
                                    }}
                                  >
                                    {row.parameter}
                                  </td>

                                  {/* Result (right-aligned, tabular numbers) */}
                                  <td
                                    className="tabular-nums"
                                    style={{
                                      padding: '3px 6px',
                                      textAlign: 'right',
                                      fontSize: '9.5pt',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    {row.result}
                                  </td>

                                  {/* Unit */}
                                  <td
                                    style={{
                                      padding: '3px 6px',
                                      fontSize: '8.5pt',
                                      color: isAbnormal ? '#dc2626' : '#64748b',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {row.unit || '-'}
                                  </td>

                                  {/* Reference Range (same weight in every table) */}
                                  <td
                                    style={{
                                      padding: '3px 6px',
                                      fontSize: '8.5pt',
                                      color: '#64748b',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {row.refText}
                                  </td>

                                  {/* Flag Badge */}
                                  <td
                                    style={{
                                      padding: '4px 2px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {isAbnormal && row.flag && (
                                      <span
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '16px',
                                          height: '16px',
                                          borderRadius: '9999px',
                                          backgroundColor: '#fee2e2',
                                          color: '#dc2626',
                                          border: '1px solid #fca5a5',
                                          fontSize: '7.5pt',
                                          fontWeight: 800,
                                          lineHeight: 1,
                                        }}
                                      >
                                        {row.flag === 'ABNORMAL' ? '*' : row.flag}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Optional cycle phase or comments */}
                        {test.cyclePhase && test.cyclePhase !== 'None' && (
                          <div
                            style={{
                              fontSize: '8.5pt',
                              color: '#64748b',
                              fontStyle: 'italic',
                              padding: '2px 4px',
                            }}
                          >
                            Cycle phase: {test.cyclePhase}
                          </div>
                        )}
                        {test.comments && (
                          <div
                            style={{
                              fontSize: '8.5pt',
                              color: '#334155',
                              padding: '2px 4px',
                            }}
                          >
                            <span className="font-bold">Comments:</span> {test.comments}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTTOM SECTION: End of Report, Footer (Printed, Legend, Signature) */}
              <div style={{ marginTop: 'auto', paddingTop: '1.5mm' }}>
                {/* 6. "End of report" centred, small and grey (Last page only) */}
                {sheet.isLastPage && (
                  <div
                    className="text-center"
                    style={{
                      fontSize: '8pt',
                      color: '#94a3b8',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginTop: '2mm',
                      marginBottom: '2mm',
                    }}
                  >
                    *** End of report ***
                  </div>
                )}

                {/* 7. FOOTER */}
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '2mm',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Left: Printed timestamp, Legend, Page Number */}
                  <div style={{ fontSize: '8pt', color: '#64748b', lineHeight: 1.35 }}>
                    <div>Printed {reportData.printedAt}</div>
                    <div style={{ fontSize: '7.5pt', color: '#94a3b8' }}>
                      H = above reference range, L = below reference range
                    </div>
                    <div style={{ fontSize: '8pt', fontWeight: 600, color: '#475569', marginTop: '0.5mm' }}>
                      Page {sheet.pageNumber} of {sheet.totalPages}
                    </div>
                  </div>

                  {/* Right: Signature Block (Last page only) */}
                  <div className="text-right">
                    {sheet.isLastPage ? (
                      <div style={{ display: 'inline-block', textAlign: 'center', width: '180px' }}>
                        {/* Space for handwritten signature */}
                        <div style={{ height: '18px' }} />
                        {/* Dark line */}
                        <div style={{ borderBottom: '1px solid #334155', width: '100%', marginBottom: '3px' }} />
                        <div
                          className="font-bold uppercase"
                          style={{ fontSize: '9.5pt', color: '#0f172a', lineHeight: 1.2 }}
                        >
                          {reportData.scientist.name}
                        </div>
                        <div
                          style={{
                            fontSize: '8pt',
                            color: '#64748b',
                            lineHeight: 1.2,
                          }}
                        >
                          {reportData.scientist.title}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="italic font-medium"
                        style={{ fontSize: '8pt', color: '#64748b' }}
                      >
                        [Continued on Page {sheet.pageNumber + 1}...]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
