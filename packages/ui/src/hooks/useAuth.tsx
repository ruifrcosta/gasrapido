import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@gasrapido/shared';
import type { Profile, UserRole } from '@gasrapido/shared';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ data: any; error: any }>;
  signInWithPhone: (phone: string) => Promise<{ data: any; error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isCourier: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  supabaseUrl: string;
  supabaseKey: string;
}

export function AuthProvider({ children, supabaseUrl, supabaseKey }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authService = new AuthService(supabaseUrl, supabaseKey);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await authService.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event: string, session: any) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { profile } = await authService.getCurrentProfile();
    setProfile(profile);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    const result = await authService.signUp(email, password, userData);
    setLoading(false);
    return result;
  };

  const signInWithPhone = async (phone: string) => {
    setLoading(true);
    const result = await authService.signInWithPhone(phone);
    setLoading(false);
    return result;
  };

  const verifyOtp = async (phone: string, token: string) => {
    setLoading(true);
    const result = await authService.verifyOtp(phone, token);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    // Import the permission check function from shared
    // return hasPermissionFunction(profile.role, permission);
    return true; // Simplified for now
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithPhone,
    verifyOtp,
    signOut,
    hasRole,
    hasPermission,
    isAdmin: hasRole('admin'),
    isVendor: hasRole('vendor'),
    isCourier: hasRole('courier'),
    isClient: hasRole('client'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}