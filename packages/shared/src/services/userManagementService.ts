import { Profile, UserRole } from '../types';

export interface UserManagementFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserAuditLog {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  ip_address?: string;
  user_agent?: string;
}

export class UserManagementService {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: UserManagementFilters): Promise<{ users: Profile[]; totalCount: number; error?: any }> {
    try {
      let query = this.supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.page && filters?.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { 
        users: data as Profile[], 
        totalCount: count || 0,
        error: null 
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], totalCount: 0, error };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ user: Profile | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { user: data as Profile, error: null };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { user: null, error };
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<Profile>): Promise<{ user: Profile | null; error?: any }> {
    try {
      // Log the update action
      await this.logUserAction(userId, 'update_user', { updates });

      const { data, error } = await this.supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { user: data as Profile, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { user: null, error };
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Log the deactivation action
      await this.logUserAction(userId, 'deactivate_user', {});

      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return { success: false, error };
    }
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Log the activation action
      await this.logUserAction(userId, 'activate_user', {});

      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error activating user:', error);
      return { success: false, error };
    }
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; error?: any }> {
    try {
      // Log the role change action
      await this.logUserAction(userId, 'change_role', { newRole });

      const { error } = await this.supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error changing user role:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user audit logs
   */
  async getUserAuditLogs(userId: string, limit: number = 50): Promise<{ logs: UserAuditLog[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('user_audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { logs: data as UserAuditLog[], error: null };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { logs: [], error };
    }
  }

  /**
   * Get all audit logs
   */
  async getAllAuditLogs(filters?: { 
    userId?: string; 
    action?: string; 
    startDate?: Date; 
    endDate?: Date;
    limit?: number 
  }): Promise<{ logs: UserAuditLog[]; error?: any }> {
    try {
      let query = this.supabase
        .from('user_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      if (filters?.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { logs: data as UserAuditLog[], error: null };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { logs: [], error };
    }
  }

  /**
   * Log user action for audit trail
   */
  private async logUserAction(userId: string, action: string, details: Record<string, any>): Promise<void> {
    try {
      const ipAddress = typeof window !== 'undefined' ? 
        (window as any).clientInformation?.ip || 'unknown' : 'server';

      await this.supabase
        .from('user_audit_logs')
        .insert({
          user_id: userId,
          action,
          details,
          timestamp: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
        });
    } catch (error) {
      console.error('Error logging user action:', error);
      // Don't throw error as this is just logging
    }
  }
}