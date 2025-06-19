'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn, styles } from '@/utils/styles';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Create user account
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          provider: 'credentials',
        }),
      });

      if (response.ok) {
        // User created successfully, redirect to sign-in
        router.push('/auth/signin?message=Account created successfully. Please sign in.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create account');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={cn(styles.layout.center, 'min-h-screen bg-gray-50 dark:bg-gray-900 p-4')}>
      <div className={cn(styles.card.base, styles.card.padding, 'max-w-md w-full shadow-lg')}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={cn(styles.text.heading, 'text-2xl font-bold mb-2')}>Create Account</h1>
          <p className={cn(styles.text.muted, 'text-sm')}>Sign up for Body Measurement App</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={cn(styles.text.small, 'block font-medium mb-1')}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={cn(styles.text.small, 'block font-medium mb-1')}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
              required
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={cn(styles.text.small, 'block font-medium mb-1')}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            disabled={loading}
            className={cn(
              styles.button.base,
              styles.button.primary,
              'w-full py-3',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className={cn(styles.text.small, 'text-gray-600 dark:text-gray-400')}>
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
