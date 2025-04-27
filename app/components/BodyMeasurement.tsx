'use client';

import { useState, useEffect } from 'react';
import { useUser } from './UserContext';

interface BodyMeasurementProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface MeasurementResult {
  userId: string;
  height: number;
  processedAt: string;
  measurements: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
    bmi: number;
  };
  blobUrl?: string;
}

export default function BodyMeasurement({ onSuccess, onError }: BodyMeasurementProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState<string>('');
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const { userId } = useUser();

  // Fetch existing results when component mounts or userId changes
  useEffect(() => {
    const fetchExistingResults = async () => {
      if (!userId) return;

      try {
        setIsFetching(true);
        setError(null);

        const response = await fetch(`/api/process?userId=${encodeURIComponent(userId)}`);

        if (!response.ok) {
          if (response.status === 404) {
            // No results found is not an error - just means we should show the input form
            setMeasurementResult(null);
            return;
          }
          throw new Error(`Error fetching results: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.result) {
          setMeasurementResult(data.result);
        } else {
          setMeasurementResult(null);
        }
      } catch (err) {
        console.error('Error fetching measurement results:', err);
        // Don't show error to user, just fall back to input form
        setMeasurementResult(null);
      } finally {
        setIsFetching(false);
      }
    };

    fetchExistingResults();
  }, [userId]);

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

      // Store the result for display
      if (data.success && data.measurements) {
        setMeasurementResult({
          userId: data.userId,
          height: data.height,
          processedAt: data.processedAt,
          measurements: data.measurements,
          blobUrl: data.blobUrl,
        });
      }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleNewMeasurement = () => {
    setMeasurementResult(null);
    setResult(null);
    setError(null);
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="w-full flex flex-col items-center mt-4 mb-2 p-4">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin mr-2"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading measurements...</p>
        </div>
      </div>
    );
  }

  // If we have results, show them instead of the input form
  if (measurementResult) {
    return (
      <div className="w-full flex flex-col items-center mt-4 mb-2">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Body Measurements</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(measurementResult.processedAt)}
            </span>
          </div>

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

          <button
            onClick={handleNewMeasurement}
            className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md text-sm font-medium transition-colors dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
          >
            Take New Measurement
          </button>

          {measurementResult.blobUrl && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              <span>Data stored in Vercel Blob Storage</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise show the input form
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
