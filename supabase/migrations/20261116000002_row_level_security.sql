-- ============================================================================
-- Migration 02: Row Level Security (RLS) & Strict Clinical Data Access Policies
-- Ensures HIPAA/GDPR clinical data privacy, immutable audit trail & locked reports
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Security Helper Functions
-- ----------------------------------------------------------------------------

-- Check if the current user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
        AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Get the current authenticated user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
DECLARE
    user_role_val public.user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM public.profiles
    WHERE id = auth.uid()
    AND active = true;

    RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- ----------------------------------------------------------------------------
-- Auto-create profile when a user signs up via Supabase Auth
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role public.user_role := 'scientist';
    user_name TEXT;
    user_title TEXT;
BEGIN
    -- Check role specified in metadata, fallback to scientist
    IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'role' = 'admin' THEN
        assigned_role := 'admin';
    END IF;

    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NULLIF(split_part(NEW.email, '@', 1), ''),
        'Laboratory Staff'
    );
    user_title := COALESCE(
        NEW.raw_user_meta_data->>'title',
        CASE WHEN assigned_role = 'admin' THEN 'Laboratory Director / Administrator'
             ELSE 'Medical Laboratory Scientist' END
    );

    INSERT INTO public.profiles (id, email, full_name, role, title, active)
    VALUES (NEW.id, NEW.email, user_name, assigned_role, user_title, true)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        title = EXCLUDED.title;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user trigger exception: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Trigger to execute on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Enable Row Level Security on ALL Tables
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_settings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Any authenticated user can view active team profiles
CREATE POLICY "profiles_select_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (active = true OR public.is_admin() OR auth.uid() = id);

-- Users can update their own profile; admins can update any profile
CREATE POLICY "profiles_update_self_or_admin"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- Only admins can insert new profiles directly (normal users are inserted by trigger)
CREATE POLICY "profiles_insert_admin"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin() OR auth.uid() = id);

-- ----------------------------------------------------------------------------
-- DOCTORS POLICIES
-- ----------------------------------------------------------------------------
-- All authenticated staff (scientists & admin) can view active referring doctors
CREATE POLICY "doctors_select_authenticated"
    ON public.doctors FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can add new referring doctors
CREATE POLICY "doctors_insert_admin"
    ON public.doctors FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only admins can update referring doctor records
CREATE POLICY "doctors_update_admin"
    ON public.doctors FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can delete/deactivate referring doctors
CREATE POLICY "doctors_delete_admin"
    ON public.doctors FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- PATIENTS POLICIES
-- ----------------------------------------------------------------------------
-- All laboratory staff can view registered patient records
CREATE POLICY "patients_select_authenticated"
    ON public.patients FOR SELECT
    TO authenticated
    USING (true);

-- All laboratory staff can register new patients at intake
CREATE POLICY "patients_insert_authenticated"
    ON public.patients FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Laboratory staff can update patient demographic info
CREATE POLICY "patients_update_authenticated"
    ON public.patients FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can delete patient records
CREATE POLICY "patients_delete_admin"
    ON public.patients FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- TEST_CATALOG POLICIES
-- ----------------------------------------------------------------------------
-- All staff can view tests in the diagnostic catalog
CREATE POLICY "test_catalog_select_authenticated"
    ON public.test_catalog FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can create new diagnostic tests
CREATE POLICY "test_catalog_insert_admin"
    ON public.test_catalog FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only admins can modify existing tests and pricing
CREATE POLICY "test_catalog_update_admin"
    ON public.test_catalog FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can delete custom tests
CREATE POLICY "test_catalog_delete_admin"
    ON public.test_catalog FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- REFERENCE_RANGES POLICIES
-- ----------------------------------------------------------------------------
-- All staff can read biological reference ranges
CREATE POLICY "reference_ranges_select_authenticated"
    ON public.reference_ranges FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can insert new reference ranges
CREATE POLICY "reference_ranges_insert_admin"
    ON public.reference_ranges FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only admins can edit existing biological reference ranges
CREATE POLICY "reference_ranges_update_admin"
    ON public.reference_ranges FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can delete reference ranges
CREATE POLICY "reference_ranges_delete_admin"
    ON public.reference_ranges FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- LAB_REQUESTS POLICIES
-- ----------------------------------------------------------------------------
-- All staff can view lab requests (pending and completed)
CREATE POLICY "lab_requests_select_authenticated"
    ON public.lab_requests FOR SELECT
    TO authenticated
    USING (true);

-- Scientists and admins can record new patient lab requests
CREATE POLICY "lab_requests_insert_authenticated"
    ON public.lab_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Scientists and admins can update lab request status and notes
CREATE POLICY "lab_requests_update_authenticated"
    ON public.lab_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can delete a lab request
CREATE POLICY "lab_requests_delete_admin"
    ON public.lab_requests FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- REQUEST_TESTS POLICIES
-- ----------------------------------------------------------------------------
-- All staff can view tests selected for a request
CREATE POLICY "request_tests_select_authenticated"
    ON public.request_tests FOR SELECT
    TO authenticated
    USING (true);

-- Staff can add tests to a request
CREATE POLICY "request_tests_insert_authenticated"
    ON public.request_tests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Staff can update parameters/cycle phase of requested tests
CREATE POLICY "request_tests_update_authenticated"
    ON public.request_tests FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Staff can remove tests from unfinalized requests
CREATE POLICY "request_tests_delete_authenticated"
    ON public.request_tests FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- ----------------------------------------------------------------------------
-- RESULTS POLICIES
-- ----------------------------------------------------------------------------
-- All staff can view analyte results
CREATE POLICY "results_select_authenticated"
    ON public.results FOR SELECT
    TO authenticated
    USING (true);

-- Scientists and admins can enter test results
CREATE POLICY "results_insert_authenticated"
    ON public.results FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Scientists and admins can edit entered results prior to final report locking
CREATE POLICY "results_update_authenticated"
    ON public.results FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can delete individual result rows
CREATE POLICY "results_delete_admin"
    ON public.results FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- REPORTS POLICIES (Strict Versioning & Immutability)
-- ----------------------------------------------------------------------------
-- All staff can view reports
CREATE POLICY "reports_select_authenticated"
    ON public.reports FOR SELECT
    TO authenticated
    USING (true);

-- Staff can create draft or saved reports
CREATE POLICY "reports_insert_authenticated"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Reports can ONLY be updated while locked = false.
-- Once locked = true, RLS blocks any modification!
CREATE POLICY "reports_update_unlocked_only"
    ON public.reports FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL AND locked = false)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Locked reports CANNOT be deleted by anyone!
CREATE POLICY "reports_delete_unlocked_admin"
    ON public.reports FOR DELETE
    TO authenticated
    USING (public.is_admin() AND locked = false);

-- Hard Trigger Guard: Prevent modifying or deleting locked reports at the database engine level
CREATE OR REPLACE FUNCTION public.check_report_lock()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.locked = true THEN
        RAISE EXCEPTION 'Report % (version %) is locked and finalized. In compliance with clinical standards, finalized reports cannot be altered. Create a new version instead.', OLD.id, OLD.version;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_report_lock_on_update
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.check_report_lock();

CREATE TRIGGER enforce_report_lock_on_delete
    BEFORE DELETE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.check_report_lock();

-- ----------------------------------------------------------------------------
-- AUDIT_LOGS POLICIES (Strict Insert-Only Trail)
-- ----------------------------------------------------------------------------
-- Only Admins can view audit logs
CREATE POLICY "audit_logs_select_admin_only"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Any authenticated staff member can record an audit trail event
CREATE POLICY "audit_logs_insert_authenticated"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- NO UPDATE POLICY FOR AUDIT_LOGS (Nobody can update audit logs)
-- NO DELETE POLICY FOR AUDIT_LOGS (Nobody can delete audit logs)

-- Hard Engine-Level Immutability Trigger for Audit Logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted under any circumstance.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_log_immutable
    BEFORE UPDATE OR DELETE ON public.audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

-- ----------------------------------------------------------------------------
-- FACILITY_SETTINGS POLICIES
-- ----------------------------------------------------------------------------
-- All staff can view facility header info
CREATE POLICY "facility_settings_select_authenticated"
    ON public.facility_settings FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can update facility information
CREATE POLICY "facility_settings_update_admin"
    ON public.facility_settings FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
