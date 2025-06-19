'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn, styles } from '@/utils/styles';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className={cn(styles.layout.center, 'min-h-screen')}>
        <div className={cn(styles.layout.centerCol, 'space-y-4')}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className={cn(styles.text.body, 'text-gray-600 dark:text-gray-300')}>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className={cn(styles.layout.center, 'min-h-screen')}>
        <div className={cn(styles.layout.centerCol, 'space-y-4')}>
          <p className={cn(styles.text.body, 'text-gray-600 dark:text-gray-300')}>
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
