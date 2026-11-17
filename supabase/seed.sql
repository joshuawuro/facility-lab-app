-- ============================================================================
-- Seed Data for Care & Social Polyclinic LIS
-- Diagnostic Test Catalog (55 Panels), Biological Reference Ranges & Doctors
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Facility Information Defaults
-- ----------------------------------------------------------------------------
INSERT INTO public.facility_settings (
    facility_name, service_title, address, po_box, telephone, scientist_name, scientist_title, logo_url
)
VALUES (
    'CARE AND SOCIAL POLYCLINIC',
    'LABORATORY SERVICE',
    'ADJACENT PUMA FILLING STATION, MADINA ESTATE',
    'P. O. BOX 2425',
    'TEL: 053 197 6621',
    'Kwame Mensah, MLS',
    'Lab Scientist',
    '/logo.png'
)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Referring Physicians Directory
-- ----------------------------------------------------------------------------
INSERT INTO public.doctors (name, active) VALUES
    ('Dr. Alex', true),
    ('Dr. Joshua', true),
    ('Dr. Obuobi', true),
    ('Dr. Jennifer', true),
    ('Self', true)
ON CONFLICT (name) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Diagnostic Test Catalog & Reference Ranges
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_test_id UUID;
BEGIN

    -- Test: FULL BLOOD COUNT (FBC) (fbc)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('fbc', 'FULL BLOOD COUNT (FBC)', 'Haematology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'fbc';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'wbc', 'WBC', '×10^9/L', 'min_max', '4.0–12.0',
        4, 12, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'lym_pct', 'LYM%', '%', 'min_max', '10.0–40.0',
        10, 40, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mid_pct', 'MID%', '%', 'min_max', '3.0–15.0',
        3, 15, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'gran_pct', 'GRAN%', '%', 'min_max', '50.0–70.0',
        50, 70, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'lym_hash', 'LYM#', '×10^9/L', 'min_max', '0.8–4.0',
        0.8, 4, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mid_hash', 'MID#', '×10^9/L', 'min_max', '0.1–1.5',
        0.1, 1.5, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 6
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'gran_hash', 'GRAN#', '×10^9/L', 'min_max', '2.0–7.0',
        2, 7, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 7
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rbc', 'RBC', '×10^12/L', 'min_max', '4.5–6.5',
        4.5, 6.5, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 8
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hgb', 'HGB', 'g/dL', 'min_max', '11.0–16.0',
        11, 16, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 9
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hct', 'HCT', '%', 'min_max', '37.0–54.0',
        37, 54, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 10
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mcv', 'MCV', 'fL', 'min_max', '76.0–100.0',
        76, 100, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 11
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mch', 'MCH', 'pg', 'min_max', '27.0–34.0',
        27, 34, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 12
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mchc', 'MCHC', 'g/dL', 'min_max', '32.0–36.2',
        32, 36.2, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 13
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rdw_sd', 'RDW-SD', 'fL', 'min_max', '35.0–56.0',
        35, 56, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 14
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rdw_cv', 'RDW-CV', '%', 'min_max', '11.0–16.0',
        11, 16, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 15
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'plt', 'PLT', '×10^9/L', 'min_max', '100–450',
        100, 450, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 16
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mpv', 'MPV', 'fL', 'min_max', '6.5–12.0',
        6.5, 12, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 17
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'pdw', 'PDW', '%', 'min_max', '5.0–25.0',
        5, 25, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 18
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'pct', 'PCT', '%', 'min_max', '0.10–0.28',
        0.1, 0.28, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 19
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'p_lcr', 'P-LCR', '%', 'min_max', '11.0–45.0',
        11, 45, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 20
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rcdw', 'RCDW', '%', 'min_max', '0.0–20.0',
        0, 20, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 21
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'lcdw', 'LCDW', '%', 'min_max', '0.0–30.0',
        0, 30, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 22
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: BLOOD FILM FOR MPs (malaria_bf)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('malaria_bf', 'BLOOD FILM FOR MPs', 'Haematology', '', 'standard', 6000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'malaria_bf';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'malaria_res', 'Malaria Parasite (BF)', NULL, 'qualitative', 'No MPs seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['No MPs seen','MPs seen (+)','MPs seen (++)','MPs seen (+++)']::TEXT[], ARRAY['No MPs seen']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: ESR (ERYTHROCYTE SEDIMENTATION RATE) (esr)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('esr', 'ESR (ERYTHROCYTE SEDIMENTATION RATE)', 'Haematology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'esr';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'esr_val', 'ESR', 'mm/hr', 'min_max', 'Male: 0–15 | Female: 0–20',
        NULL, NULL, NULL, NULL, true,
        0, 15, NULL,
        0, 20, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HB ELECTROPHORESIS (hb_electrophoresis)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hb_electrophoresis', 'HB ELECTROPHORESIS', 'Haematology', '', 'standard', 15000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hb_electrophoresis';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hb_pattern', 'Genotype / Pattern', NULL, 'text', 'AA',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HB ELECTROPHORESIS + SICKLING (hb_electro_sickling)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hb_electro_sickling', 'HB ELECTROPHORESIS + SICKLING', 'Haematology', '', 'standard', 20000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hb_electro_sickling';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hbes_pattern', 'Genotype Pattern', NULL, 'text', 'AA',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hbes_sickling', 'Sickling Status', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: SICKLING TEST (sickling)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('sickling', 'SICKLING TEST', 'Haematology', '', 'standard', 4500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'sickling';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'sickling_res', 'Sickling Test', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: G6PD SCREENING (g6pd)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('g6pd', 'G6PD SCREENING', 'Haematology', '', 'standard', 11500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'g6pd';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'g6pd_status', 'G6PD Status', NULL, 'qualitative', 'No Defect',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['No Defect','Partial Defect','Full Defect']::TEXT[], ARRAY['No Defect']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: CLOTTING PROFILE (clotting_profile)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('clotting_profile', 'CLOTTING PROFILE', 'Haematology', '', 'standard', 20000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'clotting_profile';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'pt_time', 'Prothrombin Time (PT)', 'sec', 'min_max', '11.0–14.0',
        11, 14, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'inr_val', 'INR', NULL, 'min_max', '0.8–1.2',
        0.8, 1.2, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'aptt_time', 'APTT', 'sec', 'min_max', '25.0–38.0',
        25, 38, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: D-DIMER (ddimer)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('ddimer', 'D-DIMER', 'Haematology', '', 'standard', 30000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'ddimer';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'd_dimer_val', 'D-Dimer', 'mg/L', 'less_than', '<0.5',
        NULL, NULL, 0.5, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: INR (inr)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('inr', 'INR', 'Haematology', '', 'standard', 15000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'inr';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'inr_single', 'INR', NULL, 'min_max', '0.8–1.2',
        0.8, 1.2, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HBsAG (HEPATITIS B) (hbsag)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hbsag', 'HBsAG (HEPATITIS B)', 'Serology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hbsag';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hbsag_res', 'HBsAg', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HCV (HEPATITIS C) (hcv)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hcv', 'HCV (HEPATITIS C)', 'Serology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hcv';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hcv_res', 'HCV Antibody', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: VDRL (SYPHILIS) (vdrl)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('vdrl', 'VDRL (SYPHILIS)', 'Serology', '', 'standard', 13000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'vdrl';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'vdrl_res', 'VDRL', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: RETRO SCREENING (HIV) (retro_screening)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('retro_screening', 'RETRO SCREENING (HIV)', 'Serology', '', 'standard', 13000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'retro_screening';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'retro_res', 'HIV 1 & 2 Screening', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: SPT (spt)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('spt', 'SPT', 'Serology', '', 'standard', 9000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'spt';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'spt_res', 'SPT Result', NULL, 'text', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: UPT (PREGNANCY TEST) (upt)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('upt', 'UPT (PREGNANCY TEST)', 'Serology', '', 'standard', 5000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'upt';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'upt_res', 'Urine hCG (UPT)', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: TYPHOID (IgM/IgG) (typhoid)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('typhoid', 'TYPHOID (IgM/IgG)', 'Serology', '', 'standard', 7000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'typhoid';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'typhoid_igg', 'IgG', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'typhoid_igm', 'IgM', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: BLOOD GROUPING (blood_grouping)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('blood_grouping', 'BLOOD GROUPING', 'Serology', '', 'standard', 7500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'blood_grouping';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'abo_group', 'ABO Group', NULL, 'qualitative', 'Reported',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['A','B','AB','O']::TEXT[], ARRAY['A','B','AB','O']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rh_factor', 'Rhesus (Rh D)', NULL, 'qualitative', 'Positive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Positive','Negative']::TEXT[], ARRAY['Positive']::TEXT[], NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: RHEUMATOID FACTOR (rf)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('rf', 'RHEUMATOID FACTOR', 'Serology', '', 'standard', 15000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'rf';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rf_res', 'Rheumatoid Factor', 'IU/mL', 'less_than', '<20',
        NULL, NULL, 20, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: H. PYLORI BLOOD (hpylori)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hpylori', 'H. PYLORI BLOOD', 'Serology', '', 'standard', 12000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hpylori';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hpylori_res', 'H. Pylori Antibody (Blood)', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: URINE R/E (urine_re)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('urine_re', 'URINE R/E', 'Microbiology', '', 'urine_re', 7000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'urine_re';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_appearance', 'Appearance', NULL, 'qualitative', 'Clear',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Clear','Slightly Turbid','Turbid','Cloudy']::TEXT[], ARRAY['Clear']::TEXT[], NULL, 'Macroscopy', 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_colour', 'Colour', NULL, 'qualitative', 'Straw / Amber',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Straw','Pale Yellow','Amber','Yellow','Deep Amber','Reddish']::TEXT[], ARRAY['Straw','Pale Yellow','Amber','Yellow']::TEXT[], NULL, 'Macroscopy', 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_ph', 'pH', NULL, 'min_max', '5.0–8.0',
        5, 8, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, 'Macroscopy', 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_sg', 'Specific Gravity', NULL, 'min_max', '1.005–1.030',
        1.005, 1.03, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, 'Macroscopy', 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_blood', 'Blood', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Trace','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_leukocyte', 'Leukocyte', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Trace','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 6
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_nitrite', 'Nitrite', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 7
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_glucose', 'Glucose', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Trace','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 8
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_bilirubin', 'Bilirubin', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 9
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_protein', 'Protein', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Trace','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 10
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_urobilinogen', 'Urobilinogen', NULL, 'qualitative', 'Normal',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Normal','Increased']::TEXT[], ARRAY['Normal']::TEXT[], NULL, 'Macroscopy', 11
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_ketone', 'Ketone', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','+','++','+++']::TEXT[], ARRAY['Negative']::TEXT[], NULL, 'Macroscopy', 12
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_pus', 'Pus Cells', '/hpf', 'text', '0–5 /hpf',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, 'Microscopy', 13
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_epithelial', 'Epithelial Cells', '/hpf', 'text', 'Few /hpf',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, 'Microscopy', 14
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_rbc', 'Red Blood Cells', '/hpf', 'text', '0–2 /hpf',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, 'Microscopy', 15
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_crystals', 'Crystals', NULL, 'qualitative', 'Not Seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Not Seen','Seen']::TEXT[], ARRAY['Not Seen']::TEXT[], NULL, 'Microscopy', 16
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_casts', 'Casts', NULL, 'qualitative', 'Not Seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Not Seen','Seen']::TEXT[], ARRAY['Not Seen']::TEXT[], NULL, 'Microscopy', 17
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_yeast', 'Yeast Cells', NULL, 'qualitative', 'Nil',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Nil','Seen']::TEXT[], ARRAY['Nil']::TEXT[], NULL, 'Microscopy', 18
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'u_bacteria', 'Bacteria', NULL, 'qualitative', 'Nil',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Nil','Seen']::TEXT[], ARRAY['Nil']::TEXT[], NULL, 'Microscopy', 19
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: URINE C/S (urine_cs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('urine_cs', 'URINE C/S', 'Microbiology', '', 'standard', 16500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'urine_cs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ucs_growth', 'Culture & Growth', NULL, 'text', 'No significant bacterial growth after 48hrs',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ucs_isolate', 'Organism Isolated', NULL, 'text', 'None',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: STOOL R/E (stool_re)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('stool_re', 'STOOL R/E', 'Microbiology', '', 'standard', 6500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'stool_re';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'st_colour', 'Colour', NULL, 'text', 'Brown',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'st_consistency', 'Consistency', NULL, 'text', 'Formed',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'st_micro', 'Microscopy', NULL, 'text', 'No ova or parasites seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: STOOL C/S (stool_cs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('stool_cs', 'STOOL C/S', 'Microbiology', '', 'standard', 25000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'stool_cs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'scs_growth', 'Culture & Growth', NULL, 'text', 'Normal enteric flora isolated',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: H. PYLORI STOOL (hpylori_stool)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hpylori_stool', 'H. PYLORI STOOL', 'Microbiology', '', 'standard', 13000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hpylori_stool';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hpstool_res', 'H. Pylori Antigen (Stool)', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HVS R/E (hvs_re)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hvs_re', 'HVS R/E', 'Microbiology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hvs_re';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hvs_pus', 'Pus Cells', '/hpf', 'text', 'Few',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hvs_yeast', 'Yeast Cells', NULL, 'qualitative', 'Not Seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Not Seen','Seen']::TEXT[], ARRAY['Not Seen']::TEXT[], NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hvs_tvag', 'T. vaginalis', NULL, 'qualitative', 'Not Seen',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Not Seen','Seen']::TEXT[], ARRAY['Not Seen']::TEXT[], NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HVS C/S (hvs_cs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hvs_cs', 'HVS C/S', 'Microbiology', '', 'standard', 16500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hvs_cs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hvs_cs_growth', 'Culture Result', NULL, 'text', 'No pathogenic growth',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: CHLAMYDIA (chlamydia)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('chlamydia', 'CHLAMYDIA', 'Microbiology', '', 'standard', 10000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'chlamydia';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'chlam_res', 'Chlamydia Rapid Ag', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: GONORRHEA (gonorrhea)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('gonorrhea', 'GONORRHEA', 'Microbiology', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'gonorrhea';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'gono_res', 'N. gonorrhoeae Test', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: RENAL FUNCTION TEST (BUE+CR) (rft)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('rft', 'RENAL FUNCTION TEST (BUE+CR)', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'rft';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'urea', 'Urea', 'mmol/L', 'min_max', '1.7–8.3',
        1.7, 8.3, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'creatinine', 'Creatinine', 'µmol/L', 'min_max', 'Male 50.0–120.0 | Female 65.4–119.5',
        NULL, NULL, NULL, NULL, true,
        50, 120, '50.0–120.0',
        65.4, 119.5, '65.4–119.5',
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'potassium', 'Potassium', 'mmol/L', 'min_max', '3.2–5.7',
        3.2, 5.7, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'sodium', 'Sodium', 'mmol/L', 'min_max', '130.0–150.0',
        130, 150, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'chlorides', 'Chlorides', 'mmol/L', 'min_max', '98.0–109.0',
        98, 109, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'egfr', 'eGFR', 'mL/min/1.73 m²', 'greater_than', '>60',
        NULL, NULL, NULL, 60, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 6
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: LIPID PROFILE (lipid_profile)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('lipid_profile', 'LIPID PROFILE', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'lipid_profile';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tc', 'Total Cholesterol', 'mmol/L', 'less_than', '<5.2',
        NULL, NULL, 5.2, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tg', 'Triglycerides', 'mmol/L', 'less_than', '<1.7',
        NULL, NULL, 1.7, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hdl', 'HDL Cholesterol', 'mmol/L', 'greater_than', '>1.0',
        NULL, NULL, NULL, 1, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ldl', 'LDL Cholesterol', 'mmol/L', 'less_than', '<3.4',
        NULL, NULL, 3.4, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: LIVER FUNCTION TEST (lft)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('lft', 'LIVER FUNCTION TEST', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'lft';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'alt', 'ALT (SGPT)', 'U/L', 'less_than', '<45',
        NULL, NULL, 45, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ast', 'AST (SGOT)', 'U/L', 'less_than', '<35',
        NULL, NULL, 35, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'alp', 'Alkaline Phosphatase (ALP)', 'U/L', 'min_max', '40–150',
        40, 150, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tb', 'Total Bilirubin', 'µmol/L', 'less_than', '<21',
        NULL, NULL, 21, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'db', 'Direct Bilirubin', 'µmol/L', 'less_than', '<5',
        NULL, NULL, 5, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tp', 'Total Protein', 'g/L', 'min_max', '60–80',
        60, 80, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 6
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'alb', 'Albumin', 'g/L', 'min_max', '35–50',
        35, 50, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 7
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: FASTING BLOOD SUGAR (fbs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('fbs', 'FASTING BLOOD SUGAR', 'Chemistry', '', 'standard', 3500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'fbs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'fbs_val', 'Fasting Blood Sugar', 'mmol/L', 'min_max', '3.9–6.1',
        3.9, 6.1, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: RANDOM BLOOD SUGAR (rbs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('rbs', 'RANDOM BLOOD SUGAR', 'Chemistry', '', 'standard', 3500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'rbs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'rbs_val', 'Random Blood Sugar', 'mmol/L', 'min_max', '4.0–7.8',
        4, 7.8, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HBA1C (hba1c)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hba1c', 'HBA1C', 'Chemistry', '', 'standard', 15000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hba1c';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'hba1c_val', 'HbA1c', '%', 'min_max', '4.0–6.0',
        4, 6, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: URIC ACID (uric_acid)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('uric_acid', 'URIC ACID', 'Chemistry', '', 'standard', 7000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'uric_acid';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ua_val', 'Uric Acid', 'µmol/L', 'min_max', 'Male: 200–420 | Female: 140–340',
        NULL, NULL, NULL, NULL, true,
        200, 420, NULL,
        140, 340, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: SERUM BILIRUBIN (serum_bilirubin)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('serum_bilirubin', 'SERUM BILIRUBIN', 'Chemistry', '', 'standard', 12000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'serum_bilirubin';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'sb_total', 'Total Bilirubin', 'µmol/L', 'less_than', '<21',
        NULL, NULL, 21, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'sb_direct', 'Direct Bilirubin', 'µmol/L', 'less_than', '<5',
        NULL, NULL, 5, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: TOTAL BILIRUBIN (total_bilirubin)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('total_bilirubin', 'TOTAL BILIRUBIN', 'Chemistry', '', 'standard', 6000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'total_bilirubin';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tb_only', 'Total Bilirubin', 'µmol/L', 'less_than', '<21',
        NULL, NULL, 21, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: DIRECT BILIRUBIN (direct_bilirubin)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('direct_bilirubin', 'DIRECT BILIRUBIN', 'Chemistry', '', 'standard', 6000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'direct_bilirubin';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'db_only', 'Direct Bilirubin', 'µmol/L', 'less_than', '<5',
        NULL, NULL, 5, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: FSH (fsh)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('fsh', 'FSH', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'fsh';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'fsh_val', 'FSH', 'mIU/mL', 'min_max', '1.5–12.4',
        1.5, 12.4, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: LH (lh)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('lh', 'LH', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'lh';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'lh_val', 'LH', 'mIU/mL', 'min_max', '1.7–8.6',
        1.7, 8.6, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: β-HCG (bhcg)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('bhcg', 'β-HCG', 'Chemistry', '', 'standard', 20000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'bhcg';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'bhcg_val', 'Beta-hCG', 'mIU/mL', 'less_than', '<5.0',
        NULL, NULL, 5, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: CORTISOL (cortisol)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('cortisol', 'CORTISOL', 'Chemistry', '', 'standard', 33000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'cortisol';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'cortisol_val', 'Cortisol (Morning)', 'nmol/L', 'min_max', '171–536',
        171, 536, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: PROLACTIN (prolactin)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('prolactin', 'PROLACTIN', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'prolactin';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'prl_val', 'Prolactin', 'ng/mL', 'min_max', 'Male: 2.1–17.7 | Female: 2.8–29.2',
        NULL, NULL, NULL, NULL, true,
        2.1, 17.7, NULL,
        2.8, 29.2, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: PSA (psa)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('psa', 'PSA', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'psa';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'psa_val', 'Total PSA', 'ng/mL', 'less_than', '<4.0',
        NULL, NULL, 4, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: TFT (THYROID FUNCTION TEST) (tft)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('tft', 'TFT (THYROID FUNCTION TEST)', 'Chemistry', '', 'standard', 24500, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'tft';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 't3', 'Total T3', 'nmol/L', 'min_max', '1.23–3.07',
        1.23, 3.07, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, 'T3', NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 't4', 'Total T4', 'nmol/L', 'min_max', '66–181',
        66, 181, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, 'T4', NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tsh', 'TSH', 'mIU/L', 'min_max', '0.3–4.2',
        0.3, 4.2, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, 'TSH', NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: TSH (tsh)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('tsh', 'TSH', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'tsh';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'tsh_single', 'TSH', 'mIU/L', 'min_max', '0.3–4.2',
        0.3, 4.2, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: T3 (t3)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('t3', 'T3', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 't3';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 't3_single', 'Total T3', 'nmol/L', 'min_max', '1.23–3.07',
        1.23, 3.07, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: T4 (t4)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('t4', 'T4', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 't4';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 't4_single', 'Total T4', 'nmol/L', 'min_max', '66–181',
        66, 181, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: CRP (crp)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('crp', 'CRP', 'Chemistry', '', 'standard', 15000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'crp';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'crp_val', 'C-Reactive Protein (CRP)', 'mg/L', 'less_than', '<6.0',
        NULL, NULL, 6, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: CALCIUM (calcium)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('calcium', 'CALCIUM', 'Chemistry', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'calcium';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'ca_val', 'Serum Calcium', 'mmol/L', 'min_max', '2.15–2.55',
        2.15, 2.55, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: MAGNESIUM (magnesium)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('magnesium', 'MAGNESIUM', 'Chemistry', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'magnesium';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'mg_val', 'Serum Magnesium', 'mmol/L', 'min_max', '0.70–1.05',
        0.7, 1.05, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: PHOSPHATE (phosphate)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('phosphate', 'PHOSPHATE', 'Chemistry', '', 'standard', 8000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'phosphate';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'phos_val', 'Serum Phosphate', 'mmol/L', 'min_max', '0.81–1.45',
        0.81, 1.45, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: HORMONAL PROFILE (hormonal)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('hormonal', 'HORMONAL PROFILE', 'Chemistry', '', 'standard', 17000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'hormonal';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'h_fsh', 'FSH', 'mIU/L', 'min_max', '3.0–9.0',
        3, 9, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'h_lh', 'LH', 'mIU/L', 'min_max', '2.0–10.0',
        2, 10, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'h_prolactin', 'Prolactin', 'ng/ml', 'min_max', '0.0–20.0',
        0, 20, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'h_progesterone', 'Progesterone', 'ng/ml', 'min_max', '5.0–20.0',
        5, 20, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'h_testosterone', 'Testosterone', 'ng/ml', 'min_max', '0.15–0.70',
        0.15, 0.7, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    -- Test: ANC LABS (COMPREHENSIVE PACKAGE) (anc_labs)
    INSERT INTO public.test_catalog (code, name, category, description, layout_type, price_cents, is_custom)
    VALUES ('anc_labs', 'ANC LABS (COMPREHENSIVE PACKAGE)', 'ANC Labs', '', 'standard', 60000, false)
    ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price_cents = EXCLUDED.price_cents
    RETURNING id INTO v_test_id;

    IF v_test_id IS NULL THEN
        SELECT id INTO v_test_id FROM public.test_catalog WHERE code = 'anc_labs';
    END IF;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_fbc', 'Full Blood Count (FBC)', NULL, 'text', 'Done',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 1
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_urine', 'Urine R/E', NULL, 'text', 'Done',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 2
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_stool', 'Stool R/E', NULL, 'text', 'Done',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 3
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_group', 'Blood Grouping', NULL, 'text', 'Reported',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        NULL, NULL, NULL, NULL, 4
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_sickling', 'Sickling', NULL, 'qualitative', 'Negative',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Negative','Positive']::TEXT[], ARRAY['Negative']::TEXT[], NULL, NULL, 5
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_g6pd', 'G6PD', NULL, 'qualitative', 'No Defect',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['No Defect','Partial Defect','Full Defect']::TEXT[], ARRAY['No Defect']::TEXT[], NULL, NULL, 6
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_vdrl', 'VDRL', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 7
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_hbsag', 'HBsAg', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 8
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

    INSERT INTO public.reference_ranges (
        test_id, parameter_id, parameter_name, unit, range_type, reference_range_text,
        min, max, less_than, greater_than, is_sex_specific,
        male_min, male_max, male_reference_range_text,
        female_min, female_max, female_reference_range_text,
        qualitative_options, qualitative_normal_values, shared_key, sub_category, sort_order
    ) VALUES (
        v_test_id, 'anc_retro', 'Retro Screening', NULL, 'qualitative', 'Non-Reactive',
        NULL, NULL, NULL, NULL, false,
        NULL, NULL, NULL,
        NULL, NULL, NULL,
        ARRAY['Non-Reactive','Reactive']::TEXT[], ARRAY['Non-Reactive']::TEXT[], NULL, NULL, 9
    )
    ON CONFLICT (test_id, parameter_id) DO UPDATE SET
        parameter_name = EXCLUDED.parameter_name,
        unit = EXCLUDED.unit,
        min = EXCLUDED.min,
        max = EXCLUDED.max,
        male_min = EXCLUDED.male_min,
        male_max = EXCLUDED.male_max,
        female_min = EXCLUDED.female_min,
        female_max = EXCLUDED.female_max,
        reference_range_text = EXCLUDED.reference_range_text;

END $$;
