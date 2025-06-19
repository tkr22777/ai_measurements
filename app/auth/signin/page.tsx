'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn, styles } from '@/utils/styles';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

function SignInContent() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const message = searchParams.get('message');

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      setLoading(false);
    };
    loadProviders();
  }, []);

  const handleOAuthSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/' });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      setError('Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return '🔍';
      case 'github':
        return '🐙';
      case 'credentials':
        return '📧';
      default:
        return '🔐';
    }
  };

  if (loading) {
    return (
      <div className={cn(styles.layout.center, 'min-h-screen')}>
        <div className={cn(styles.layout.centerCol, 'space-y-4')}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className={cn(styles.text.muted)}>Loading sign-in options...</p>
        </div>
      </div>
    );
  }

  const credentialsProvider = providers && providers['credentials'];
  const oauthProviders = providers
    ? Object.values(providers).filter((p) => p.id !== 'credentials')
    : [];

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={cn(styles.text.heading, 'text-2xl font-bold mb-2')}>Welcome Back</h1>
        <p className={cn(styles.text.muted, 'text-sm')}>
          Sign in to your Body Measurement App account
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Credentials Sign In Form */}
      {credentialsProvider && (
        <div className="mb-6">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className={cn(styles.text.small, 'block font-medium mb-1')}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
                  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={cn(styles.text.small, 'block font-medium mb-1')}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
                  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                styles.button.base,
                styles.button.primary,
                'w-full py-3',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      )}

      {/* OAuth Providers */}
      {oauthProviders.length > 0 && (
        <>
          {credentialsProvider && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={cn(styles.text.muted, 'bg-white dark:bg-gray-800 px-2')}>
                  Or continue with
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {oauthProviders.map((provider) => (
              <button
                key={provider.name}
                onClick={() => handleOAuthSignIn(provider.id)}
                className={cn(
                  styles.button.base,
                  'w-full py-3 px-4 border border-gray-300 dark:border-gray-600',
                  'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'transition-colors duration-200'
                )}
              >
                <span className={cn(styles.layout.center, 'space-x-3')}>
                  <span className="text-xl">{getProviderIcon(provider.id)}</span>
                  <span className="font-medium">Continue with {provider.name}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Sign Up Link */}
      <div className="text-center">
        <p className={cn(styles.text.small, 'text-gray-600 dark:text-gray-400')}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className={cn(styles.text.small, 'text-gray-500 dark:text-gray-400')}>
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </>
  );
}

export default function SignIn() {
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
          <SignInContent />
        </Suspense>
      </div>
    </div>
  );
}
