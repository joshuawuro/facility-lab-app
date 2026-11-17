import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserAccount, UserRole } from '../types';
import { logAudit } from './auditService';
import { getCurrentUser as getLocalCurrentUser, setCurrentUser as setLocalCurrentUser, clearCurrentUser as clearLocalCurrentUser } from '../utils/storage';

export interface AuthProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  title: string;
  active: boolean;
}

export const signInWithSupabase = async (
  email: string,
  password: string
): Promise<{ user: UserAccount | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Laboratory system is not yet connected to the server. Please contact the administrator.' };
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Authentication failed. No user returned.' };
    }

    // Fetch user profile from public.profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      // Fallback to auth metadata if profile query fails
      const role = (data.user.user_metadata?.role as UserRole) || 'scientist';
      const displayName = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
      const title = data.user.user_metadata?.title || (role === 'admin' ? 'Laboratory Administrator' : 'Medical Laboratory Scientist');

      const appUser: UserAccount = {
        username: cleanEmail.split('@')[0],
        displayName,
        role,
        title,
      };

      setLocalCurrentUser(appUser);
      await logAudit(
        'user_login',
        'profiles',
        data.user.id,
        null,
        { email: cleanEmail, role, displayName },
        { id: data.user.id, email: cleanEmail, role }
      );
      return { user: appUser, error: null };
    }

    const appUser: UserAccount = {
      username: profileData.email ? profileData.email.split('@')[0] : cleanEmail.split('@')[0],
      displayName: profileData.full_name || 'Laboratory Scientist',
      role: profileData.role || 'scientist',
      title: profileData.title || 'Medical Laboratory Scientist',
    };

    setLocalCurrentUser(appUser);
    await logAudit(
      'user_login',
      'profiles',
      profileData.id,
      null,
      {
        email: cleanEmail,
        full_name: profileData.full_name,
        role: profileData.role,
      },
      { id: profileData.id, email: cleanEmail, role: profileData.role }
    );

    return { user: appUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'An unexpected authentication error occurred.' };
  }
};

export const signOutSupabase = async (currentUser?: UserAccount | null): Promise<void> => {
  if (isSupabaseConfigured()) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;
      const userEmail = user?.email || (currentUser?.username?.includes('@') ? currentUser.username : (currentUser?.username ? `${currentUser.username}@carepolyclinic.com` : null));
      const userRole = currentUser?.role || (user?.user_metadata?.role as UserRole) || 'scientist';

      if (userId || userEmail) {
        await logAudit(
          'user_logout',
          'profiles',
          userId || 'staff_session',
          null,
          {
            email: userEmail,
            displayName: currentUser?.displayName || null,
            role: userRole,
          },
          {
            id: userId,
            email: userEmail,
            role: userRole,
          }
        );
      }
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during Supabase signOut:', err);
    }
  }
  clearLocalCurrentUser();
};

export const getActiveUserSession = async (): Promise<UserAccount | null> => {
  if (!isSupabaseConfigured()) {
    return getLocalCurrentUser();
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getLocalCurrentUser();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const appUser: UserAccount = {
        username: profile.email ? profile.email.split('@')[0] : 'user',
        displayName: profile.full_name,
        role: profile.role,
        title: profile.title,
      };
      setLocalCurrentUser(appUser);
      return appUser;
    }

    return getLocalCurrentUser();
  } catch {
    return getLocalCurrentUser();
  }
};

export const fetchStaffProfiles = async (): Promise<UserAccount[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((p: any) => ({
      username: p.email ? p.email.split('@')[0] : p.full_name,
      displayName: p.full_name,
      role: p.role,
      title: p.title,
    }));
  } catch (err) {
    console.error('Error in fetchStaffProfiles:', err);
    return [];
  }
};

export const updateStaffProfile = async (
  username: string,
  displayName: string,
  title: string
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return true;

  try {
    const emailPattern = username.includes('@') ? username : `${username}@carepolyclinic.com`;
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: displayName,
        title,
      })
      .or(`email.eq.${emailPattern},full_name.eq.${displayName}`);

    if (error) {
      console.error('Failed to update staff profile:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error updating staff profile:', err);
    return false;
  }
};

