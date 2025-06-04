'use client';

import { useUser } from '../UserContext';
import useMeasurementAPI from './useMeasurementAPI';
import MeasurementResultDisplay from './MeasurementResultDisplay';
import MeasurementInputForm from './MeasurementInputForm';
import LoadingSpinner from './LoadingSpinner';

export default function BodyMeasurement() {
  const { userId } = useUser();

  const {
    measurementResult,
    isFetching,
    isProcessing,
    result,
    error,
    processMeasurement,
    resetMeasurement,
  } = useMeasurementAPI({ userId });

  // Show loading state while fetching
  if (isFetching) {
    return <LoadingSpinner message="Loading measurements..." />;
  }

  // If we have results, show them instead of the input form
  if (measurementResult) {
    return (
      <MeasurementResultDisplay
        measurementResult={measurementResult}
        onNewMeasurement={resetMeasurement}
      />
    );
  }

  // Otherwise show the input form
  return (
    <MeasurementInputForm
      onProcess={processMeasurement}
      isProcessing={isProcessing}
      result={result}
      error={error}
    />
  );
}
