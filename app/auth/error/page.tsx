'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { cn, styles } from '@/utils/styles';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <>
      {/* Error Icon */}
      <div className="text-center mb-6">
        <div
          className={cn(
            styles.layout.center,
            'w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-4'
          )}
        >
          <span className="text-2xl">❌</span>
        </div>
        <h1 className={cn(styles.text.heading, 'text-xl font-bold text-red-600 dark:text-red-400')}>
          Authentication Error
        </h1>
      </div>

      {/* Error Message */}
      <div className="text-center mb-6">
        <p className={cn(styles.text.body, 'text-gray-600 dark:text-gray-300')}>{errorMessage}</p>
        {error && (
          <p className={cn(styles.text.small, 'text-gray-500 dark:text-gray-400 mt-2')}>
            Error code: {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href="/auth/signin"
          className={cn(styles.button.base, styles.button.primary, 'w-full py-3 text-center block')}
        >
          Try Again
        </Link>
        <Link
          href="/"
          className={cn(
            styles.button.base,
            styles.button.secondary,
            'w-full py-3 text-center block'
          )}
        >
          Go Home
        </Link>
      </div>
    </>
  );
}

export default function AuthError() {
  return (
    <div className={cn(styles.layout.center, 'min-h-screen bg-gray-50 dark:bg-gray-900 p-4')}>
      <div className={cn(styles.card.base, styles.card.padding, 'max-w-md w-full shadow-lg')}>
        <Suspense
          fallback={
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={cn(styles.text.muted, 'mt-2')}>Loading...</p>
            </div>
          }
        >
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
