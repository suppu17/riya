import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in production, this would be a real backend)
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'demo@riya.ai',
    password: 'demo123',
    name: 'Demo User',
    avatar: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_1.png',
    createdAt: '2024-01-01T00:00:00Z',
    preferences: {
      favoriteCategories: ['Clothing', 'Bags'],
      size: 'M',
      style: ['Modern', 'Elegant']
    }
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const savedUser = localStorage.getItem('riya_user');
        const sessionToken = localStorage.getItem('riya_session');
        
        if (savedUser && sessionToken) {
          const userData = JSON.parse(savedUser);
          // Verify session is still valid (in production, verify with backend)
          const sessionData = JSON.parse(sessionToken);
          const now = new Date().getTime();
          
          if (sessionData.expiresAt > now) {
            setUser(userData);
          } else {
            // Session expired
            localStorage.removeItem('riya_user');
            localStorage.removeItem('riya_session');
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        localStorage.removeItem('riya_user');
        localStorage.removeItem('riya_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'User not found. Please check your email or sign up.' };
      }
      
      if (foundUser.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      
      // Create user session
      const { password: _, ...userWithoutPassword } = foundUser;
      const sessionData = {
        token: `session_${Date.now()}_${Math.random()}`,
        expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      
      // Save to localStorage (in production, use secure storage)
      localStorage.setItem('riya_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('riya_session', JSON.stringify(sessionData));
      
      setUser(userWithoutPassword);
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      
      // Validate inputs
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      
      if (!name.trim()) {
        return { success: false, error: 'Name is required.' };
      }
      
      // Create new user
      const newUser: User & { password: string } = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        password,
        name: name.trim(),
        createdAt: new Date().toISOString(),
        preferences: {
          favoriteCategories: [],
          size: '',
          style: []
        }
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Create session
      const { password: _, ...userWithoutPassword } = newUser;
      const sessionData = {
        token: `session_${Date.now()}_${Math.random()}`,
        expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      
      localStorage.setItem('riya_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('riya_session', JSON.stringify(sessionData));
      
      setUser(userWithoutPassword);
      return { success: true };
      
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('riya_user');
    localStorage.removeItem('riya_session');
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates };
      
      // Update mock database
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      }
      
      // Update local storage
      localStorage.setItem('riya_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        return { success: false, error: 'No account found with this email address.' };
      }
      
      // In production, this would send an actual email
      console.log(`Password reset email sent to ${email}`);
      return { success: true };
      
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword
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