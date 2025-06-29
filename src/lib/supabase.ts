import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          preferences: {
            favoriteCategories?: string[]
            size?: string
            style?: string[]
          } | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          preferences?: {
            favoriteCategories?: string[]
            size?: string
            style?: string[]
          } | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          preferences?: {
            favoriteCategories?: string[]
            size?: string
            style?: string[]
          } | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']

// Helper functions for profile operations
export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Create user profile (usually handled by trigger, but useful for manual creation)
  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('profiles')
      .insert(profile);

    if (error) {
      console.error('Error creating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Update user preferences
  async updatePreferences(userId: string, preferences: { favoriteCategories?: string[]; size?: string; style?: string[] }): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('profiles')
      .update({
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
};