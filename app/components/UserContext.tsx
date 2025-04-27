'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userId: string;
  setUserId: (id: string) => void;
}

// Create context with a default value
const UserContext = createContext<UserContextType>({
  userId: '',
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with empty string, will be populated from localStorage if available
  const [userId, setUserId] = useState<string>('');

  // Load saved userId from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }
  }, []);

  // Save userId to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  return context;
};
