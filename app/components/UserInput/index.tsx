'use client';

import { signOut, useSession } from 'next-auth/react';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function UserInput() {
  const { data: session } = useSession();
  const { userId, userEmail, userName, userImage, userMetadata, loading } = useUser();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  if (loading) {
    return (
      <div className={cn(styles.card.base, styles.card.padding, 'max-w-md mx-auto mb-6')}>
        <div className={cn(styles.layout.center, 'py-4')}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          <p className={cn(styles.text.body, 'text-gray-600 dark:text-gray-300')}>
            Loading user data...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={cn(styles.card.base, styles.card.padding, 'max-w-md mx-auto mb-6')}>
        <p className={cn(styles.text.body, 'text-center text-gray-600 dark:text-gray-300')}>
          No user session found
        </p>
      </div>
    );
  }

  return (
    <div className={cn(styles.card.base, styles.card.padding, 'max-w-md mx-auto mb-6')}>
      {/* User Avatar */}
      <div className="flex items-center space-x-4 mb-4">
        {userImage ? (
          <img
            src={userImage}
            alt={userName || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={cn(styles.layout.center, 'w-12 h-12 bg-blue-500 text-white rounded-full')}
          >
            <span className="text-lg font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : '👤'}
            </span>
          </div>
        )}
        <div>
          <h3 className={cn(styles.text.body, 'font-semibold')}>{userName || 'User'}</h3>
          <p className={cn(styles.text.small, 'text-gray-600 dark:text-gray-400')}>
            {userEmail || 'No email'}
          </p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3 mb-4">
        <div>
          <label
            className={cn(styles.text.small, 'block font-medium text-gray-700 dark:text-gray-300')}
          >
            Generated User ID
          </label>
          <div
            className={cn(
              'mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md',
              'border border-gray-200 dark:border-gray-600'
            )}
          >
            <code className={cn(styles.text.small, 'text-gray-800 dark:text-gray-200')}>
              {userId}
            </code>
          </div>
          <p className={cn(styles.text.small, 'text-gray-500 dark:text-gray-400 mt-1')}>
            This unique ID is used for all API calls and photo storage
          </p>
        </div>

        {userMetadata && (
          <>
            <div>
              <label
                className={cn(
                  styles.text.small,
                  'block font-medium text-gray-700 dark:text-gray-300'
                )}
              >
                Account Created
              </label>
              <div
                className={cn(
                  'mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md',
                  'border border-gray-200 dark:border-gray-600'
                )}
              >
                <span className={cn(styles.text.small, 'text-gray-800 dark:text-gray-200')}>
                  {new Date(userMetadata.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <label
                className={cn(
                  styles.text.small,
                  'block font-medium text-gray-700 dark:text-gray-300'
                )}
              >
                Authentication Provider
              </label>
              <div
                className={cn(
                  'mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md',
                  'border border-gray-200 dark:border-gray-600'
                )}
              >
                <span className={cn(styles.text.small, 'text-gray-800 dark:text-gray-200')}>
                  {userMetadata.provider === 'oauth' ? 'OAuth Provider' : 'Development Login'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className={cn(
          styles.button.base,
          'w-full py-2 bg-red-600 text-white hover:bg-red-700',
          'transition-colors duration-200'
        )}
      >
        Sign Out
      </button>
    </div>
  );
}
