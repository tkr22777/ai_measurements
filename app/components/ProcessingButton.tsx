'use client';

import { useState } from 'react';
import { useUser } from './UserContext';

interface ProcessingButtonProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export default function ProcessingButton({ onSuccess, onError }: ProcessingButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState<string>('');
  const { userId } = useUser();

  const handleProcessing = async () => {
    try {
      // Validate that userId exists
      if (!userId) {
        setError('Please enter a User ID before processing');
        return;
      }

      // Validate height input
      if (height && !/^\d+(\.\d+)?$/.test(height)) {
        setError('Please enter a valid height number');
        return;
      }

      setIsProcessing(true);
      setResult(null);
      setError(null);

      // Call backend API endpoint
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          height: height ? parseFloat(height) : null,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.message || 'Processing completed successfully');

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-4 mb-2">
      <div className="w-full max-w-md mb-3">
        <div className="flex items-center">
          <label
            htmlFor="height-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
          >
            Height:
          </label>
          <div className="relative flex-1">
            <input
              id="height-input"
              type="text"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm pr-8"
              disabled={isProcessing}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400 text-sm">
              cm
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleProcessing}
        disabled={isProcessing}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          isProcessing
            ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-800'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Process Body Measurement'
        )}
      </button>

      {result && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm">
          {result}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
