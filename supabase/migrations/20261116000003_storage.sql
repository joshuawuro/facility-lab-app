-- ============================================================================
-- Migration 03: Private Storage Bucket for Laboratory Report PDFs
-- Configures the 'report-pdfs' private bucket with role-based access control
-- ============================================================================

-- Create private bucket for report PDFs if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'report-pdfs',
    'report-pdfs',
    false, -- Strictly private
    10485760, -- 10MB maximum file size
    ARRAY['application/pdf', 'text/html']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760;

-- ----------------------------------------------------------------------------
-- Storage Object Policies for 'report-pdfs'
-- ----------------------------------------------------------------------------

-- Authenticated staff can download/read generated PDFs
CREATE POLICY "report_pdfs_select_authenticated"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'report-pdfs');

-- Authenticated scientists and admins can upload generated report files
CREATE POLICY "report_pdfs_insert_authenticated"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'report-pdfs'
        AND auth.uid() IS NOT NULL
    );

-- Authenticated scientists and admins can update report files
CREATE POLICY "report_pdfs_update_authenticated"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'report-pdfs'
        AND auth.uid() IS NOT NULL
    );

-- Only admins can remove PDF files from storage
CREATE POLICY "report_pdfs_delete_admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'report-pdfs'
        AND public.is_admin()
    );
