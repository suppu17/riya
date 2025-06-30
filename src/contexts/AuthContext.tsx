import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import mockData from '../data/mock-data.json';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('demo-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      
      console.log('🔄 Attempting mock login for:', email);
      
      // Check against demo user credentials
      if (email.toLowerCase().trim() === mockData.auth.demoCredentials.email && password === mockData.auth.demoCredentials.password) {
        const userData = mockData.users[0];
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('demo-user', JSON.stringify(userData));
        
        console.log('✅ Mock login successful');
        return { success: true };
      } else {
        console.log('❌ Invalid credentials');
        return { 
          success: false, 
          error: 'Invalid email or password. Use demo@example.com / demo123' 
        };
      }
    } catch (error) {
      console.error('❌ Mock login error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred during login. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Mock signup - not available in demo mode
    return { 
      success: false, 
      error: 'Signup is not available in demo mode. Please use the demo credentials: demo@example.com / demo123' 
    };
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('demo-user');
      console.log('✅ Mock logout successful');
    } catch (error) {
      console.error('❌ Mock logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('demo-user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};