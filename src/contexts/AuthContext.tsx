import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedAuth = localStorage.getItem('snapStyler_auth');
        const savedUser = localStorage.getItem('snapStyler_user');
        
        if (savedAuth === 'true' && savedUser) {
          const userData = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        // Clear corrupted data
        localStorage.removeItem('snapStyler_auth');
        localStorage.removeItem('snapStyler_user');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation - in real app, this would be server-side
      // For demo purposes, accept any valid email and password with at least 3 characters
      if (email && email.includes('@') && password.length >= 3) {
        const userData: User = {
          email,
          name: email.split('@')[0] // Extract name from email for demo
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('snapStyler_auth', 'true');
        localStorage.setItem('snapStyler_user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation for signup
      if (email && email.includes('@') && password.length >= 3) {
        const userData: User = {
          email,
          name: name || email.split('@')[0]
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('snapStyler_auth', 'true');
        localStorage.setItem('snapStyler_user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('snapStyler_auth');
    localStorage.removeItem('snapStyler_user');
    
    // Clear state
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};