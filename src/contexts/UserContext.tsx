import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load premium status from localStorage or default to false
  const [isPremium, setIsPremiumState] = useState(() => {
    try {
      const savedPremiumStatus = localStorage.getItem('isPremium');
      return savedPremiumStatus === 'true';
    } catch (error) {
      console.error('Error loading premium status from localStorage:', error);
      return false;
    }
  });

  const [userName, setUserNameState] = useState(() => {
    try {
      const savedUserName = localStorage.getItem('userName');
      return savedUserName || 'Supriya Korukonda';
    } catch (error) {
      console.error('Error loading user name from localStorage:', error);
      return 'Supriya Korukonda';
    }
  });

  const setIsPremium = (premium: boolean) => {
    try {
      localStorage.setItem('isPremium', premium.toString());
      setIsPremiumState(premium);
    } catch (error) {
      console.error('Error saving premium status to localStorage:', error);
      setIsPremiumState(premium);
    }
  };

  const setUserName = (name: string) => {
    try {
      localStorage.setItem('userName', name);
      setUserNameState(name);
    } catch (error) {
      console.error('Error saving user name to localStorage:', error);
      setUserNameState(name);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isPremium,
        setIsPremium,
        userName,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};