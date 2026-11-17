-- ============================================================================
-- Migration 01: Initial Core Schema for Care & Social Polyclinic LIS
-- Postgres tables with UUID primary keys and timestamp tracking
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'scientist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('draft', 'pending', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('draft', 'saved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flag_type AS ENUM ('H', 'L', 'ABNORMAL', 'NORMAL', 'NO_RANGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE patient_sex AS ENUM ('Male', 'Female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Linked 1-to-1 with auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'scientist',
    title TEXT NOT NULL DEFAULT 'Medical Laboratory Scientist',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(active);

-- ----------------------------------------------------------------------------
-- 2. DOCTORS (Referring Physicians Directory)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors(name);
CREATE INDEX IF NOT EXISTS idx_doctors_active ON public.doctors(active);

-- ----------------------------------------------------------------------------
-- 3. PATIENTS (Patient Demographics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sex patient_sex NOT NULL,
    age TEXT NOT NULL,
    age_unit TEXT NOT NULL DEFAULT 'years',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON public.patients(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. TEST_CATALOG (Panels & Diagnostic Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    layout_type TEXT NOT NULL DEFAULT 'standard',
    price_cents INTEGER NOT NULL DEFAULT 0,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_catalog_category ON public.test_catalog(category);
CREATE INDEX IF NOT EXISTS idx_test_catalog_code ON public.test_catalog(code);

-- ----------------------------------------------------------------------------
-- 5. REFERENCE_RANGES (Analyte Parameters & Clinical Ranges)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reference_ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.test_catalog(id) ON DELETE CASCADE,
    parameter_id TEXT NOT NULL,
    parameter_name TEXT NOT NULL,
    unit TEXT,
    range_type TEXT NOT NULL DEFAULT 'min_max',
    reference_range_text TEXT,
    min NUMERIC,
    max NUMERIC,
    less_than NUMERIC,
    greater_than NUMERIC,
    is_sex_specific BOOLEAN NOT NULL DEFAULT false,
    male_min NUMERIC,
    male_max NUMERIC,
    male_reference_range_text TEXT,
    female_min NUMERIC,
    female_max NUMERIC,
    female_reference_range_text TEXT,
    qualitative_options TEXT[],
    qualitative_normal_values TEXT[],
    shared_key TEXT,
    sub_category TEXT,
    cycle_phase TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_test_parameter UNIQUE (test_id, parameter_id)
);

CREATE INDEX IF NOT EXISTS idx_reference_ranges_test_id ON public.reference_ranges(test_id);
CREATE INDEX IF NOT EXISTS idx_reference_ranges_parameter_id ON public.reference_ranges(parameter_id);

-- ----------------------------------------------------------------------------
-- 6. LAB_REQUESTS (Patient Lab Intake Workups)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lab_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE RESTRICT,
    sample_id TEXT NOT NULL,
    sample_type TEXT NOT NULL DEFAULT 'Blood',
    sample_types TEXT[] NOT NULL DEFAULT ARRAY['Blood']::TEXT[],
    custom_sample_type TEXT,
    collection_datetime TIMESTAMPTZ NOT NULL DEFAULT now(),
    results_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_number TEXT,
    requested_by TEXT NOT NULL DEFAULT 'Self',
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    status request_status NOT NULL DEFAULT 'pending',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lab_requests_patient_id ON public.lab_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_requests_status ON public.lab_requests(status);
CREATE INDEX IF NOT EXISTS idx_lab_requests_sample_id ON public.lab_requests(sample_id);
CREATE INDEX IF NOT EXISTS idx_lab_requests_created_at ON public.lab_requests(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. REQUEST_TESTS (Selected Tests for each Lab Request)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.lab_requests(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.test_catalog(id) ON DELETE RESTRICT,
    test_code TEXT NOT NULL,
    selected_parameter_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    comments TEXT,
    cycle_phase TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_request_test UNIQUE (request_id, test_id)
);

CREATE INDEX IF NOT EXISTS idx_request_tests_request_id ON public.request_tests(request_id);

-- ----------------------------------------------------------------------------
-- 8. RESULTS (Analyte Results and Calculated Flags)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.lab_requests(id) ON DELETE CASCADE,
    parameter_id TEXT NOT NULL,
    test_code TEXT NOT NULL,
    value TEXT NOT NULL,
    flag flag_type,
    entered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_request_result_param UNIQUE (request_id, parameter_id)
);

CREATE INDEX IF NOT EXISTS idx_results_request_id ON public.results(request_id);

-- ----------------------------------------------------------------------------
-- 9. REPORTS (Finalized Clinical Lab Reports with Versioning and Lock Flag)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.lab_requests(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    status report_status NOT NULL DEFAULT 'draft',
    locked BOOLEAN NOT NULL DEFAULT false,
    pdf_storage_path TEXT,
    performed_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    performed_by_name TEXT NOT NULL,
    performed_by_title TEXT NOT NULL,
    facility_snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
    saved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    saved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_request_version UNIQUE (request_id, version)
);

CREATE INDEX IF NOT EXISTS idx_reports_request_id ON public.reports(request_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. AUDIT_LOGS (Append-Only Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    before_data JSONB,
    after_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_name, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 11. FACILITY_SETTINGS (Clinic Information Header & Defaults)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.facility_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_name TEXT NOT NULL DEFAULT 'CARE AND SOCIAL POLYCLINIC',
    service_title TEXT NOT NULL DEFAULT 'LABORATORY SERVICE',
    address TEXT NOT NULL DEFAULT 'ADJACENT PUMA FILLING STATION, MADINA ESTATE',
    po_box TEXT NOT NULL DEFAULT 'P. O. BOX 2425',
    telephone TEXT NOT NULL DEFAULT '053 197 6621',
    scientist_name TEXT NOT NULL DEFAULT 'Kwame Mensah, MLS',
    scientist_title TEXT NOT NULL DEFAULT 'Medical Laboratory Scientist',
    logo_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all editable tables
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_test_catalog_updated_at BEFORE UPDATE ON public.test_catalog FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_reference_ranges_updated_at BEFORE UPDATE ON public.reference_ranges FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_lab_requests_updated_at BEFORE UPDATE ON public.lab_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_facility_settings_updated_at BEFORE UPDATE ON public.facility_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
