import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAudit } from './auditService';
import { loadFacilitySettings, saveFacilitySettings } from '../utils/storage';
import { DEFAULT_DOCTORS } from '../data/defaultCatalog';

export const fetchDoctorsList = async (): Promise<string[]> => {
  if (!isSupabaseConfigured()) {
    const settings = loadFacilitySettings();
    return settings.doctors && settings.doctors.length > 0 ? settings.doctors : DEFAULT_DOCTORS;
  }

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('name')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      const settings = loadFacilitySettings();
      return settings.doctors && settings.doctors.length > 0 ? settings.doctors : DEFAULT_DOCTORS;
    }

    return data.map((d: { name: string }) => d.name);
  } catch (err) {
    console.error('Error fetching doctors from Supabase:', err);
    const settings = loadFacilitySettings();
    return settings.doctors && settings.doctors.length > 0 ? settings.doctors : DEFAULT_DOCTORS;
  }
};

export const addDoctorSupabase = async (name: string): Promise<string[]> => {
  const cleanName = name.trim();
  if (!cleanName) return fetchDoctorsList();

  // Local sync
  const currentSettings = loadFacilitySettings();
  const currentList = currentSettings.doctors || [...DEFAULT_DOCTORS];
  if (!currentList.includes(cleanName)) {
    const updated = [...currentList, cleanName];
    saveFacilitySettings({ ...currentSettings, doctors: updated });
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert({ name: cleanName, active: true })
        .select()
        .single();

      if (!error && data) {
        await logAudit('doctor_added', 'doctors', data.id, null, { name: cleanName });
      }
    } catch (err) {
      console.error('Error adding doctor to Supabase:', err);
    }
  }

  return fetchDoctorsList();
};

export const deleteDoctorSupabase = async (name: string): Promise<string[]> => {
  const cleanName = name.trim();
  if (!cleanName) return fetchDoctorsList();

  // Local sync
  const currentSettings = loadFacilitySettings();
  const currentList = currentSettings.doctors || [...DEFAULT_DOCTORS];
  const updated = currentList.filter((d) => d !== cleanName);
  saveFacilitySettings({ ...currentSettings, doctors: updated });

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('doctors')
        .select('id')
        .eq('name', cleanName)
        .single();

      if (data) {
        await supabase.from('doctors').update({ active: false }).eq('id', data.id);
        await logAudit('doctor_removed', 'doctors', data.id, { name: cleanName }, { active: false });
      }
    } catch (err) {
      console.error('Error removing doctor in Supabase:', err);
    }
  }

  return updated;
};
