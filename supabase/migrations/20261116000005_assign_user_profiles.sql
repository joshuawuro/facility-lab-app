-- ============================================================================
-- Assign User Profiles (Roles, Names, and Titles)
-- Run this in the Supabase Dashboard SQL Editor to assign exact details to the staff
-- ============================================================================

-- 1. Admin Profile: Dr. Kwame Mensah
UPDATE public.profiles
SET 
    full_name = 'Dr. Kwame Mensah',
    role = 'admin',
    title = 'Laboratory Director & Pathologist',
    active = true
WHERE email = 'admin@carepolyclinic.com';

-- 2. Scientist Profile: Dorean
UPDATE public.profiles
SET 
    full_name = 'Dorean',
    role = 'scientist',
    title = 'Medical Laboratory Scientist',
    active = true
WHERE email = 'dorean@carepolyclinic.com';

-- 3. Scientist Profile: Hawa
UPDATE public.profiles
SET 
    full_name = 'Hawa',
    role = 'scientist',
    title = 'Medical Laboratory Scientist',
    active = true
WHERE email = 'hawa@carepolyclinic.com';

-- View updated profiles to confirm
SELECT email, full_name, role, title, active FROM public.profiles;
