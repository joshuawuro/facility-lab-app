import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SavedReport, PatientDetails, SelectedTestState, FacilitySettings, UserAccount } from '../types';
import { logAudit } from './auditService';
import { loadSavedReports, saveReport as saveLocalReport, deleteReport as deleteLocalReport } from '../utils/storage';

export const fetchAllReportsSupabase = async (): Promise<SavedReport[]> => {
  if (!isSupabaseConfigured()) {
    return loadSavedReports();
  }

  try {
    // 1. Fetch lab_requests with patient info
    const { data: requestsData, error: reqErr } = await supabase
      .from('lab_requests')
      .select(`
        id,
        sample_id,
        sample_type,
        sample_types,
        custom_sample_type,
        collection_datetime,
        results_date,
        receipt_number,
        requested_by,
        status,
        created_at,
        updated_at,
        created_by,
        patients (
          id,
          name,
          sex,
          age,
          age_unit
        )
      `)
      .order('created_at', { ascending: false });

    if (reqErr || !requestsData || requestsData.length === 0) {
      return loadSavedReports();
    }

    // 2. Fetch associated request_tests
    const { data: requestTestsData } = await supabase
      .from('request_tests')
      .select('*');

    // 3. Fetch associated results
    const { data: resultsData } = await supabase
      .from('results')
      .select('*');

    // 4. Fetch associated reports (versioned report snapshots)
    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .order('version', { ascending: false });

    // Assemble SavedReport objects
    const assembled: SavedReport[] = requestsData.map((req: any) => {
      const patientRecord = req.patients || {};
      const patient: PatientDetails = {
        name: patientRecord.name || '',
        sex: patientRecord.sex || 'Female',
        age: patientRecord.age || '',
        ageUnit: patientRecord.age_unit || 'years',
        sampleCollectionDate: req.collection_datetime ? req.collection_datetime.split('T')[0] : '',
        collectionTime: req.collection_datetime ? new Date(req.collection_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
        resultsDate: req.results_date || '',
        sampleId: req.sample_id || '',
        sampleType: req.sample_type || 'Blood',
        sampleTypes: req.sample_types || ['Blood'],
        customSampleType: req.custom_sample_type || undefined,
        receiptNumber: req.receipt_number || '',
        requestedBy: req.requested_by || 'Self',
      };

      const testsForReq = (requestTestsData || []).filter((rt: any) => rt.request_id === req.id);
      const resultsForReq = (resultsData || []).filter((r: any) => r.request_id === req.id);

      const selectedTests: SelectedTestState[] = testsForReq.map((rt: any) => {
        const resultsMap: Record<string, string> = {};
        resultsForReq
          .filter((res: any) => res.test_code === rt.test_code)
          .forEach((res: any) => {
            resultsMap[res.parameter_id] = res.value;
          });

        return {
          testId: rt.test_code,
          selectedParameterIds: rt.selected_parameter_ids || [],
          results: resultsMap,
          comments: rt.comments || '',
          cyclePhase: rt.cycle_phase || undefined,
          priceCents: rt.price_cents || 0,
        };
      });

      const reportRecord = (reportsData || []).find((rep: any) => rep.request_id === req.id);

      return {
        id: req.id,
        createdAt: req.created_at,
        updatedAt: req.updated_at,
        status: req.status as 'pending' | 'completed',
        performedBy: reportRecord?.performed_by_name || 'Scientist',
        performedByName: reportRecord?.performed_by_name || 'Medical Laboratory Scientist',
        performedByTitle: reportRecord?.performed_by_title || 'Medical Laboratory Scientist',
        patient,
        selectedTests,
        facilitySettings: reportRecord?.facility_snapshot || {
          facilityName: 'CARE AND SOCIAL POLYCLINIC',
          serviceTitle: 'LABORATORY SERVICE',
          address: 'ADJACENT PUMA FILLING STATION, MADINA ESTATE',
          poBox: 'P. O. BOX 2425',
          telephone: '053 197 6621',
          scientistName: 'Kwame Mensah, MLS',
          scientistTitle: 'Medical Laboratory Scientist',
        },
      };
    });

    return assembled;
  } catch (err) {
    console.error('Error fetching reports from Supabase:', err);
    return loadSavedReports();
  }
};

export const saveReportSupabase = async (
  report: SavedReport,
  currentUser: UserAccount | null
): Promise<SavedReport[]> => {
  // Always update local storage first so UI reacts instantly
  const updatedLocal = saveLocalReport(report);

  if (!isSupabaseConfigured()) {
    return updatedLocal;
  }

  try {
    const isCompleted = report.status === 'completed';

    // 1. Insert or update patient
    let patientId: string | null = null;
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('name', report.patient.name)
      .eq('sex', report.patient.sex)
      .limit(1)
      .maybeSingle();

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient } = await supabase
        .from('patients')
        .insert({
          name: report.patient.name,
          sex: report.patient.sex,
          age: report.patient.age,
          age_unit: report.patient.ageUnit || 'years',
        })
        .select('id')
        .single();
      patientId = newPatient?.id || null;
    }

    if (!patientId) return updatedLocal;

    // 2. Insert or update lab_requests
    const collectionDateTime = `${report.patient.sampleCollectionDate || new Date().toISOString().split('T')[0]}T${report.patient.collectionTime || '09:00'}:00Z`;

    const { data: requestRecord, error: reqErr } = await supabase
      .from('lab_requests')
      .upsert({
        sample_id: report.patient.sampleId || `LAB-${Date.now().toString().slice(-4)}`,
        patient_id: patientId,
        sample_type: report.patient.sampleType || 'Blood',
        sample_types: report.patient.sampleTypes || ['Blood'],
        custom_sample_type: report.patient.customSampleType || null,
        collection_datetime: collectionDateTime,
        results_date: report.patient.resultsDate || new Date().toISOString().split('T')[0],
        receipt_number: report.patient.receiptNumber || null,
        requested_by: report.patient.requestedBy || 'Self',
        status: report.status || 'pending',
      }, { onConflict: 'id' })
      .select()
      .single();

    const requestId = requestRecord?.id;
    if (!requestId) return updatedLocal;

    // 3. Upsert request_tests and results
    for (const st of report.selectedTests) {
      // Find catalog ID
      const { data: catRecord } = await supabase
        .from('test_catalog')
        .select('id')
        .eq('code', st.testId)
        .maybeSingle();

      if (catRecord) {
        await supabase.from('request_tests').upsert({
          request_id: requestId,
          test_id: catRecord.id,
          test_code: st.testId,
          selected_parameter_ids: st.selectedParameterIds,
          comments: st.comments || null,
          cycle_phase: st.cyclePhase || null,
          price_cents: st.priceCents || 0,
        }, { onConflict: 'request_id, test_id' });

        // Save entered results
        for (const [paramId, val] of Object.entries(st.results || {})) {
          if (val && val.trim() !== '') {
            await supabase.from('results').upsert({
              request_id: requestId,
              parameter_id: paramId,
              test_code: st.testId,
              value: val.trim(),
            }, { onConflict: 'request_id, parameter_id' });
          }
        }
      }
    }

    // 4. If completed, create or update finalized locked report
    if (isCompleted) {
      const { data: existingReport } = await supabase
        .from('reports')
        .select('*')
        .eq('request_id', requestId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newVersion = existingReport ? existingReport.version + 1 : 1;

      const { data: reportInsert } = await supabase
        .from('reports')
        .insert({
          request_id: requestId,
          version: newVersion,
          status: 'saved',
          locked: true,
          performed_by_name: currentUser?.displayName || report.performedByName || 'Medical Laboratory Scientist',
          performed_by_title: currentUser?.title || report.performedByTitle || 'Medical Laboratory Scientist',
          facility_snapshot: report.facilitySettings,
          saved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (reportInsert) {
        await logAudit('report_saved', 'reports', reportInsert.id, null, {
          patientName: report.patient.name,
          version: newVersion,
          sampleId: report.patient.sampleId,
        });
      }
    }
  } catch (err) {
    console.error('Error saving report to Supabase:', err);
  }

  return updatedLocal;
};

export const uploadReportPdfToStorage = async (
  reportId: string,
  pdfBlob: Blob,
  filename: string
): Promise<string | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const storagePath = `reports/${reportId}/${filename}`;

    const { error: uploadErr } = await supabase.storage
      .from('report-pdfs')
      .upload(storagePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadErr) {
      console.error('Error uploading PDF to Supabase Storage:', uploadErr);
      return null;
    }

    return storagePath;
  } catch (err) {
    console.error('Failed to upload PDF to Supabase Storage:', err);
    return null;
  }
};

export const getReportPdfUrl = async (storagePath: string): Promise<string | null> => {
  if (!isSupabaseConfigured() || !storagePath) return null;

  try {
    const { data, error } = await supabase.storage
      .from('report-pdfs')
      .createSignedUrl(storagePath, 3600); // 1-hour signed URL

    if (error || !data) return null;
    return data.signedUrl;
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return null;
  }
};

export const logReportPrintAction = async (reportId: string, patientName: string) => {
  await logAudit('report_printed', 'reports', reportId, null, { patientName });
};

export const logReportDownloadAction = async (reportId: string, patientName: string) => {
  await logAudit('report_downloaded', 'reports', reportId, null, { patientName });
};
