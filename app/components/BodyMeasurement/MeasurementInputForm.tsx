'use client';

import { useState } from 'react';
import { cn, styles } from '@/utils/styles';

interface MeasurementInputFormProps {
  onProcess: (height: string) => Promise<void>;
  isProcessing: boolean;
  result: string | null;
  error: string | null;
}

export default function MeasurementInputForm({
  onProcess,
  isProcessing,
  result,
  error,
}: MeasurementInputFormProps) {
  const [height, setHeight] = useState<string>('');

  const handleSubmit = async () => {
    await onProcess(height);
  };

  return (
    <div className={cn(styles.layout.centerCol, 'w-full mt-4 mb-2')}>
      <div className="w-full max-w-md mb-3">
        <div className={styles.layout.center}>
          <label htmlFor="height-input" className={cn(styles.text.small, 'block font-medium mr-2')}>
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
              className={cn(
                'w-full px-3 py-2 border rounded-md shadow-sm text-sm pr-8',
                'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white',
                'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              )}
              disabled={isProcessing}
            />
            <span
              className={cn(
                styles.text.muted,
                'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm'
              )}
            >
              cm
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={cn(
          styles.button.base,
          isProcessing
            ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-700 dark:hover:bg-indigo-800'
        )}
      >
        {isProcessing ? (
          <div className={styles.layout.center}>
            <div className={cn(styles.loading.spinner, 'w-4 h-4 border-t-indigo-500 mr-2')}></div>
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
