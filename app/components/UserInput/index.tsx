'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';
import type { UserInputProps } from './types';

export default function UserInput({
  placeholder = 'Enter User ID',
  maxLength = 50,
}: UserInputProps = {}) {
  const { userId, setUserId } = useUser();
  const [tempUserId, setTempUserId] = useState(userId);
  const [isEditing, setIsEditing] = useState(!userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserId.trim()) {
      setUserId(tempUserId.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setTempUserId(userId);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempUserId(userId);
    setIsEditing(false);
  };

  if (!isEditing && userId) {
    return (
      <div
        className={cn(
          'w-full max-w-md mx-auto mb-6 p-4 border rounded-lg',
          'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        )}
      >
        <div className={styles.layout.between}>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">User ID:</p>
            <p className="font-medium text-green-800 dark:text-green-200">{userId}</p>
          </div>
          <button
            onClick={handleEdit}
            className={cn(
              styles.button.base,
              'px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700'
            )}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className={cn(styles.text.small, 'block font-medium mb-2')}>
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={tempUserId}
            onChange={(e) => setTempUserId(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(
              'w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            )}
            required
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!tempUserId.trim()}
            className={cn(
              styles.button.base,
              styles.button.primary,
              'flex-1 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {userId ? 'Update' : 'Set User ID'}
          </button>
          {userId && (
            <button
              type="button"
              onClick={handleCancel}
              className={cn(styles.button.base, styles.button.secondary)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
