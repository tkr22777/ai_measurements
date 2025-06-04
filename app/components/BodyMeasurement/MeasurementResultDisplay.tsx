'use client';

import type { MeasurementResult } from './types';

interface MeasurementResultDisplayProps {
  measurementResult: MeasurementResult;
  onNewMeasurement: () => void;
}

export default function MeasurementResultDisplay({
  measurementResult,
  onNewMeasurement,
}: MeasurementResultDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="w-full flex flex-col items-center mt-4 mb-2">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Body Measurements</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(measurementResult.processedAt)}
          </span>
        </div>

        {/* Data Source Badge */}
        {measurementResult.dataSource === 'mock/sample data' && (
          <div className="mb-3 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {measurementResult.dataSource}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Height</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.height.toFixed(1)} cm
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Weight</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.weight.toFixed(1)} kg
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Chest</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.chest.toFixed(1)} cm
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Waist</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.waist.toFixed(1)} cm
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Hips</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.hips.toFixed(1)} cm
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">BMI</span>
            <span className="text-md font-medium">
              {measurementResult.measurements.bmi.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Bodygram API status */}
        <div className="mb-4 p-2 rounded text-sm">
          {measurementResult.bodygramStatus === 'success' ? (
            <div className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded">
              ✓ Processed with Bodygram API
            </div>
          ) : measurementResult.dataSource === 'mock/sample data' ? (
            <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              Note: Using mock/sample data
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              ℹ Using standard measurement estimation
            </div>
          )}
        </div>

        <button
          onClick={onNewMeasurement}
          className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium transition-colors dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
        >
          Take New Measurement
        </button>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          {measurementResult.blobUrl && <span>Data stored in Vercel Blob Storage</span>}
        </div>
      </div>
    </div>
  );
}
