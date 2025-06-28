import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentTheme: ThemeColors;
  themePresets: ThemeColors[];
  setThemePreset: (index: number) => void;
  currentThemeIndex: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// AI-powered theme colors optimized for eye comfort
const lightThemes: ThemeColors[] = [
  {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#06B6D4',
    background: '#FEFEFE',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB'
  },
  {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0'
  },
  {
    primary: '#10B981',
    secondary: '#8B5CF6',
    accent: '#F97316',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#14532D',
    textSecondary: '#16A34A',
    border: '#BBF7D0'
  }
];

const darkThemes: ThemeColors[] = [
  {
    primary: '#A78BFA',
    secondary: '#F472B6',
    accent: '#22D3EE',
    background: '#0F0F23',
    surface: '#1A1A2E',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#334155'
  },
  {
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    background: '#0C1426',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#475569'
  },
  {
    primary: '#34D399',
    secondary: '#A78BFA',
    accent: '#FB923C',
    background: '#0A1F0A',
    surface: '#1A2E1A',
    text: '#ECFDF5',
    textSecondary: '#86EFAC',
    border: '#22C55E'
  }
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });
  
  const [currentThemeIndex, setCurrentThemeIndex] = useState(() => {
    const saved = localStorage.getItem('themeIndex');
    return saved ? JSON.parse(saved) : 0;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setThemePreset = (index: number) => {
    setCurrentThemeIndex(index);
  };

  const currentTheme = isDarkMode ? darkThemes[currentThemeIndex] : lightThemes[currentThemeIndex];
  const themePresets = isDarkMode ? darkThemes : lightThemes;

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('themeIndex', JSON.stringify(currentThemeIndex));
  }, [currentThemeIndex]);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-secondary', currentTheme.secondary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-background', currentTheme.background);
    root.style.setProperty('--theme-surface', currentTheme.surface);
    root.style.setProperty('--theme-text', currentTheme.text);
    root.style.setProperty('--theme-text-secondary', currentTheme.textSecondary);
    root.style.setProperty('--theme-border', currentTheme.border);
    
    // Apply dark/light class to body
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [currentTheme, isDarkMode]);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      currentTheme,
      themePresets,
      setThemePreset,
      currentThemeIndex
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};