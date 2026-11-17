import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AuditAction =
  | 'user_login'
  | 'user_logout'
  | 'report_saved'
  | 'report_edited'
  | 'report_printed'
  | 'report_downloaded'
  | 'reference_range_changed'
  | 'doctor_added'
  | 'doctor_removed';

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  entity_name: string;
  entity_id: string;
  before_data: any;
  after_data: any;
  created_at: string;
}

export const logAudit = async (
  action: AuditAction,
  entityName: string,
  entityId: string,
  beforeData: any = null,
  afterData: any = null
): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.info(`[Audit Offline] ${action} on ${entityName}:${entityId}`);
    return;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();

    let userRole = (user?.user_metadata?.role as string) || null;
    if (!userRole && user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.role) {
        userRole = profile.role;
      }
    }

    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      user_email: user?.email || null,
      user_role: userRole,
      action,
      entity_name: entityName,
      entity_id: entityId,
      before_data: beforeData,
      after_data: afterData,
    });
  } catch (err) {
    // Audit logging should never crash the main clinical workflow
    console.error('Failed to record audit log:', err);
  }
};

export const fetchAuditLogs = async (limit: number = 100): Promise<AuditLogEntry[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return (data || []) as AuditLogEntry[];
};
