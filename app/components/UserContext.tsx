'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userId: string;
  setUserId: (id: string) => void;
}

// Default userId to use if none is found in localStorage
const DEFAULT_USER_ID = 'default';

// Create context with a default value
const UserContext = createContext<UserContextType>({
  userId: DEFAULT_USER_ID,
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with default value, will be populated from localStorage if available
  const [userId, setUserId] = useState<string>(DEFAULT_USER_ID);

  // Load saved userId from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        setUserId(savedUserId);
      } else {
        // If no userId is found in localStorage, set and save the default
        localStorage.setItem('userId', DEFAULT_USER_ID);
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
