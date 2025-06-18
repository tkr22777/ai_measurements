'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { NavigationState, PageRoute } from './types';

const NavigationContext = createContext<NavigationState | null>(null);

interface NavProviderProps {
  children: React.ReactNode;
}

export function NavProvider({ children }: NavProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<PageRoute>(pathname as PageRoute);

  // Sync state with URL changes
  useEffect(() => {
    setCurrentPage(pathname as PageRoute);
  }, [pathname]);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    router.push(page);
  };

  const value: NavigationState = {
    currentPage,
    setCurrentPage,
    navigateTo,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationState {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavProvider');
  }
  return context;
}
