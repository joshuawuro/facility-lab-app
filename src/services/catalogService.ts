import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LabTest, TestParameter, RangeType } from '../types';
import { logAudit } from './auditService';
import { loadTestCatalog, saveTestCatalog, resetTestCatalog as resetLocalTestCatalog } from '../utils/storage';
import { DEFAULT_TEST_CATALOG } from '../data/defaultCatalog';

export const fetchCatalogSupabase = async (): Promise<LabTest[]> => {
  if (!isSupabaseConfigured()) {
    return loadTestCatalog();
  }

  try {
    // 1. Fetch active tests
    const { data: testsData, error: testsError } = await supabase
      .from('test_catalog')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (testsError || !testsData || testsData.length === 0) {
      console.warn('Supabase test_catalog is empty, falling back to local catalog.');
      return loadTestCatalog();
    }

    // 2. Fetch all reference ranges
    const { data: rangesData, error: rangesError } = await supabase
      .from('reference_ranges')
      .select('*')
      .order('sort_order', { ascending: true });

    if (rangesError || !rangesData) {
      return loadTestCatalog();
    }

    // 3. Assemble tests with parameters
    const catalog: LabTest[] = testsData.map((t: any) => {
      const testRanges = rangesData.filter((r: any) => r.test_id === t.id);
      const parameters: TestParameter[] = testRanges.map((r: any) => ({
        id: r.parameter_id,
        name: r.parameter_name,
        unit: r.unit || '',
        rangeType: (r.range_type as RangeType) || 'min_max',
        referenceRangeText: r.reference_range_text || '',
        min: r.min !== null ? Number(r.min) : undefined,
        max: r.max !== null ? Number(r.max) : undefined,
        lessThan: r.less_than !== null ? Number(r.less_than) : undefined,
        greaterThan: r.greater_than !== null ? Number(r.greater_than) : undefined,
        isSexSpecific: Boolean(r.is_sex_specific),
        maleMin: r.male_min !== null ? Number(r.male_min) : undefined,
        maleMax: r.male_max !== null ? Number(r.male_max) : undefined,
        maleReferenceRangeText: r.male_reference_range_text || undefined,
        femaleMin: r.female_min !== null ? Number(r.female_min) : undefined,
        femaleMax: r.female_max !== null ? Number(r.female_max) : undefined,
        femaleReferenceRangeText: r.female_reference_range_text || undefined,
        qualitativeOptions: r.qualitative_options || undefined,
        qualitativeNormalValues: r.qualitative_normal_values || undefined,
        sharedKey: r.shared_key || undefined,
        subCategory: r.sub_category || undefined,
      }));

      return {
        id: t.code,
        name: t.name,
        category: t.category,
        description: t.description || '',
        layoutType: t.layout_type || 'standard',
        priceCents: t.price_cents || 0,
        isCustom: Boolean(t.is_custom),
        parameters,
      };
    });

    // Also persist in local storage for instant offline availability
    saveTestCatalog(catalog);
    return catalog;
  } catch (err) {
    console.error('Error fetching catalog from Supabase:', err);
    return loadTestCatalog();
  }
};

export const updateReferenceRangeSupabase = async (
  testCode: string,
  parameterId: string,
  updates: Partial<TestParameter>,
  beforeState?: any
): Promise<void> => {
  // Update local storage
  const currentCatalog = loadTestCatalog();
  const updatedCatalog = currentCatalog.map((t) => {
    if (t.id !== testCode) return t;
    return {
      ...t,
      parameters: t.parameters.map((p) => (p.id === parameterId ? { ...p, ...updates } : p)),
    };
  });
  saveTestCatalog(updatedCatalog);

  if (!isSupabaseConfigured()) return;

  try {
    // 1. Find test_catalog ID
    const { data: testRecord } = await supabase
      .from('test_catalog')
      .select('id')
      .eq('code', testCode)
      .single();

    if (!testRecord) return;

    // 2. Update reference_ranges
    const payload: any = {};
    if (updates.name !== undefined) payload.parameter_name = updates.name;
    if (updates.unit !== undefined) payload.unit = updates.unit;
    if (updates.min !== undefined) payload.min = updates.min;
    if (updates.max !== undefined) payload.max = updates.max;
    if (updates.lessThan !== undefined) payload.less_than = updates.lessThan;
    if (updates.greaterThan !== undefined) payload.greater_than = updates.greaterThan;
    if (updates.isSexSpecific !== undefined) payload.is_sex_specific = updates.isSexSpecific;
    if (updates.maleMin !== undefined) payload.male_min = updates.maleMin;
    if (updates.maleMax !== undefined) payload.male_max = updates.maleMax;
    if (updates.femaleMin !== undefined) payload.female_min = updates.femaleMin;
    if (updates.femaleMax !== undefined) payload.female_max = updates.femaleMax;
    if (updates.referenceRangeText !== undefined) payload.reference_range_text = updates.referenceRangeText;

    const { error } = await supabase
      .from('reference_ranges')
      .update(payload)
      .eq('test_id', testRecord.id)
      .eq('parameter_id', parameterId);

    if (!error) {
      await logAudit(
        'reference_range_changed',
        'reference_ranges',
        `${testCode}:${parameterId}`,
        beforeState,
        updates
      );
    }
  } catch (err) {
    console.error('Error updating reference range in Supabase:', err);
  }
};

export const createCustomTestSupabase = async (newTest: LabTest): Promise<void> => {
  // Local sync
  const currentCatalog = loadTestCatalog();
  saveTestCatalog([...currentCatalog, newTest]);

  if (!isSupabaseConfigured()) return;

  try {
    const { data: testRecord, error: testErr } = await supabase
      .from('test_catalog')
      .insert({
        code: newTest.id,
        name: newTest.name,
        category: newTest.category || 'Custom Tests',
        description: newTest.description || '',
        price_cents: newTest.priceCents || 0,
        is_custom: true,
      })
      .select()
      .single();

    if (testErr || !testRecord) return;

    const rangesToInsert = newTest.parameters.map((p, idx) => ({
      test_id: testRecord.id,
      parameter_id: p.id,
      parameter_name: p.name,
      unit: p.unit || '',
      range_type: p.rangeType || 'min_max',
      reference_range_text: p.referenceRangeText || '',
      min: p.min ?? null,
      max: p.max ?? null,
      sort_order: idx + 1,
    }));

    await supabase.from('reference_ranges').insert(rangesToInsert);
  } catch (err) {
    console.error('Error creating custom test in Supabase:', err);
  }
};
