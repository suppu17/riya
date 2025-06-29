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
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'snapstyle-app'
    }
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
          bio: string | null
          location: string | null
          join_date: string | null
          membership_type: string | null
          social_links: {
            instagram?: string
            twitter?: string
            linkedin?: string
            website?: string
          } | null
          stats: {
            posts?: number
            followers?: number
            following?: number
          } | null
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
          bio?: string | null
          location?: string | null
          join_date?: string | null
          membership_type?: string | null
          social_links?: {
            instagram?: string
            twitter?: string
            linkedin?: string
            website?: string
          } | null
          stats?: {
            posts?: number
            followers?: number
            following?: number
          } | null
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
          bio?: string | null
          location?: string | null
          join_date?: string | null
          membership_type?: string | null
          social_links?: {
            instagram?: string
            twitter?: string
            linkedin?: string
            website?: string
          } | null
          stats?: {
            posts?: number
            followers?: number
            following?: number
          } | null
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

// Helper functions for profile operations with better error handling
export const profileService = {
  // Get user profile with retry logic
  async getProfile(userId: string): Promise<Profile | null> {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // If profiles table doesn't exist, return null gracefully
          if (error.code === '42P01') {
            console.warn('Profiles table does not exist. User will authenticate without profile data.');
            return null;
          }
          
          // If no profile found, return null (this is normal for new users)
          if (error.code === 'PGRST116') {
            console.log('No profile found for user, this is normal for new users');
            return null;
          }
          
          throw error;
        }

        return data;
      } catch (error) {
        retryCount++;
        console.error(`Error fetching profile (attempt ${retryCount}):`, error);
        
        if (retryCount >= maxRetries) {
          console.error('Max retries reached for profile fetch');
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    return null;
  },

  // Update user profile with retry logic
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    try {
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
    } catch (error) {
      console.error('Network error updating profile:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Create user profile (usually handled by trigger, but useful for manual creation)
  async createProfile(profile: Database['public']['Tables']['profiles']['Insert']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert(profile);

      if (error) {
        console.error('Error creating profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Network error creating profile:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Update user preferences
  async updatePreferences(userId: string, preferences: { favoriteCategories?: string[]; size?: string; style?: string[] }): Promise<{ success: boolean; error?: string }> {
    try {
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
    } catch (error) {
      console.error('Network error updating preferences:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
};

// Test connection function for debugging
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to connect to Supabase' };
  }
};