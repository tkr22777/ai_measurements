'use client';

import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { NavProvider } from '@/components/Navigation';
import { UserProvider } from '@/components/UserContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ['/auth/signin', '/auth/signup', '/auth/error'];

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (isPublicPath) {
    // Public pages don't need auth protection or navigation
    return <>{children}</>;
  }

  // Protected pages need auth guard, navigation, and user context
  return (
    <AuthGuard>
      <NavProvider>
        <UserProvider>{children}</UserProvider>
      </NavProvider>
    </AuthGuard>
  );
}
