'use client';

import { useState, FormEvent } from 'react';
import { useUser } from './UserContext';

export default function UserIdInput() {
  const { userId, setUserId } = useUser();
  const [inputValue, setInputValue] = useState(userId || '');
  const [isEditing, setIsEditing] = useState(!userId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserId(inputValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 w-full border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-800 dark:text-gray-200">User Identity</h2>
        {!isEditing && userId && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
          >
            Change
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="userId" className="text-sm text-gray-600 dark:text-gray-400">
              Enter a username to store and organize your images:
            </label>
            <div className="flex">
              <input
                id="userId"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter username (e.g., john, alice123)"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 
                         disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This username will be used to organize your uploads and filter your image gallery
            </p>
          </div>
        </form>
      ) : (
        <div className="mt-2">
          {userId ? (
            <div className="flex flex-col">
              <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Current user: </span>
                  <span className="font-mono font-medium text-gray-800 dark:text-gray-200 ml-1">
                    {userId}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                All images you upload will be stored under this username
              </p>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 text-center text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
            >
              Set up your username
            </button>
          )}
        </div>
      )}
    </div>
  );
}
