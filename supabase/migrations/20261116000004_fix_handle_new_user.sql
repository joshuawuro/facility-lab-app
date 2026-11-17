-- ============================================================================
-- Quick Fix: Fix handle_new_user Trigger Function for Supabase Dashboard Users
-- Run this in the Supabase Dashboard SQL Editor to allow user creation to succeed
-- ============================================================================

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

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
