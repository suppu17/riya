import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  navigateToHome: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  currentView,
  setCurrentView,
}) => {
  const navigateToHome = () => {
    setCurrentView('home');
  };

  const value = {
    currentView,
    setCurrentView,
    navigateToHome,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};