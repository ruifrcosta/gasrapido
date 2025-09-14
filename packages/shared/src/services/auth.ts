import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Profile, UserRole } from '../types';

export class AuthService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData: {
    full_name?: string;
    phone?: string;
    role?: UserRole;
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;

      // Create profile after successful signup
      if (data.user) {
        await this.createProfile(data.user.id, {
          email,
          ...userData,
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in with phone OTP
  async signInWithPhone(phone: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithOtp({
        phone,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Verify OTP
  async verifyOtp(phone: string, token: string) {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Get current user profile
  async getCurrentProfile(): Promise<{ profile: Profile | null; error: any }> {
    try {
      const { user, error: userError } = await this.getCurrentUser();
      
      if (userError || !user) {
        return { profile: null, error: userError };
      }

      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return { profile, error };
    } catch (error) {
      return { profile: null, error };
    }
  }

  // Create user profile
  async createProfile(userId: string, profileData: {
    email: string;
    full_name?: string;
    phone?: string;
    role?: UserRole;
    address?: string;
    location?: { lat: number; lng: number };
  }) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData,
          role: profileData.role || 'client',
          location: profileData.location 
            ? `POINT(${profileData.location.lng} ${profileData.location.lat})`
            : null,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Change password
  async changePassword(newPassword: string) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Get session
  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error };
    }
  }

  // Check if user has specific role
  async hasRole(role: UserRole): Promise<boolean> {
    const { profile } = await this.getCurrentProfile();
    return profile?.role === role;
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  // Check if user is vendor
  async isVendor(): Promise<boolean> {
    return this.hasRole('vendor');
  }

  // Check if user is courier
  async isCourier(): Promise<boolean> {
    return this.hasRole('courier');
  }

  // Check if user is client
  async isClient(): Promise<boolean> {
    return this.hasRole('client');
  }
}