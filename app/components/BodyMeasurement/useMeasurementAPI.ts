import { useState, useEffect } from 'react';
import type { MeasurementResult, ProcessMeasurementResponse } from './types';

interface UseMeasurementAPIProps {
  userId: string;
}

interface UseMeasurementAPIReturn {
  measurementResult: MeasurementResult | null;
  isFetching: boolean;
  isProcessing: boolean;
  result: string | null;
  error: string | null;
  processMeasurement: (height: string) => Promise<void>;
  resetMeasurement: () => void;
}

export default function useMeasurementAPI({
  userId,
}: UseMeasurementAPIProps): UseMeasurementAPIReturn {
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const processMeasurement = async (height: string) => {
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

      const data = (await response.json()) as ProcessMeasurementResponse;
      setResult(data.message || 'Processing completed successfully');

      // Store the result for display
      if (data.success && data.measurements) {
        setMeasurementResult({
          userId: data.userId,
          height: data.height,
          processedAt: data.processedAt,
          measurements: data.measurements,
          dataSource: data.dataSource,
          bodygramData: data.bodygramData,
          bodygramError: data.bodygramError,
          bodygramStatus: data.bodygramStatus,
          blobUrl: data.blobUrl,
        });
      }

      console.log('Body measurement processing successful:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Body measurement processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetMeasurement = () => {
    setMeasurementResult(null);
    setResult(null);
    setError(null);
  };

  return {
    measurementResult,
    isFetching,
    isProcessing,
    result,
    error,
    processMeasurement,
    resetMeasurement,
  };
}
