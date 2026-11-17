-- ============================================================================
-- Migration: Ensure all staff members (scientists & admins) can record audit logs
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Drop any previous conflicting insert policies on audit_logs
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_admin" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;

-- 2. Allow any authenticated user (scientist or admin) to insert audit records
CREATE POLICY "audit_logs_insert_authenticated"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. Ensure audit_logs has Row Level Security active
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Verify the policy was applied successfully
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_logs';
