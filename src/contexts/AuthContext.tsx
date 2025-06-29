import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, type Profile, profileService } from '../lib/supabase';
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences?: {
    favoriteCategories: string[];
    size: string;
    style: string[];
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (preferences: { favoriteCategories?: string[]; size?: string; style?: string[] }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user + profile to our User type
  const convertToUser = (supabaseUser: SupabaseUser, profile?: Profile): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
      avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      createdAt: supabaseUser.created_at,
      preferences: profile?.preferences || {
        favoriteCategories: [],
        size: '',
        style: []
      }
    };
  };

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const profile = await profileService.getProfile(userId);
      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const profile = await profileService.getProfile(user.id);
      if (profile) {
        setProfile(profile);
        // Update user state with fresh profile data
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          const updatedUser = convertToUser(supabaseUser, profile);
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user.id);
          const userData = convertToUser(session.user, profile || undefined);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const userData = convertToUser(session.user, profile || undefined);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate input before making request
      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        
        // Handle specific error cases
        if (error.message === 'Invalid login credentials') {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please check your email and confirm your account before signing in.' };
        }
        
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please wait a moment and try again.' };
        }
        
        // Generic error handling
        return { 
          success: false, 
          error: error.message || 'Authentication failed. Please try again.' 
        };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        const userData = convertToUser(data.user, profile || undefined);
        setUser(userData);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validate inputs
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required.' };
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      if (!name.trim()) {
        return { success: false, error: 'Name is required.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: name.trim()
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
        }
        
        if (error.message.includes('Password should be')) {
          return { success: false, error: 'Password does not meet security requirements. Please choose a stronger password.' };
        }
        
        if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        
        return { success: false, error: error.message || 'Account creation failed. Please try again.' };
      }

      if (data.user) {
        // Profile will be created automatically by the database trigger
        // Fetch the profile to ensure it was created
        const profile = await fetchUserProfile(data.user.id);
        const userData = convertToUser(data.user, profile || undefined);
        setUser(userData);
        return { success: true };
      }

      return { success: false, error: 'Signup failed. Please try again.' };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return { 
          success: false, 
          error: error.message || 'Google sign-in failed. Please try again.' 
        };
      }

      // OAuth redirect will handle the rest
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      setProfile(null);
      await supabase.auth.signOut();
      // Force page reload to reset all app state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and reload
      setUser(null);
      setProfile(null);
      window.location.reload();
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const profileUpdates: any = {};
      
      if (updates.name) profileUpdates.full_name = updates.name;
      if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
      if (updates.preferences) profileUpdates.preferences = updates.preferences;

      const result = await profileService.updateProfile(user.id, profileUpdates);
      
      if (!result.success) {
        return result;
      }

      // Refresh profile data
      await refreshProfile();

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const updatePreferences = async (preferences: { favoriteCategories?: string[]; size?: string; style?: string[] }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const result = await profileService.updatePreferences(user.id, preferences);
      
      if (!result.success) {
        return result;
      }

      // Refresh profile data
      await refreshProfile();

      return { success: true };
    } catch (error) {
      console.error('Preferences update error:', error);
      return { success: false, error: 'Failed to update preferences. Please try again.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    updatePreferences,
    resetPassword,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};