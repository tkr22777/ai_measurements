'use client';

import { useState } from 'react';
import { useUser } from '@/components/UserContext';
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
      <div className="w-full max-w-md mx-auto mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">User ID:</p>
            <p className="font-medium text-green-800 dark:text-green-200">{userId}</p>
          </div>
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={tempUserId}
            onChange={(e) => setTempUserId(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!tempUserId.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {userId ? 'Update' : 'Set User ID'}
          </button>
          {userId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
