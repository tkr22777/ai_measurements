// Shared TypeScript interfaces for Body Measurement feature

export interface Measurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bmi: number;
}

export interface BodygramMeasurements {
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bmi?: number;
}

export interface BodygramApiResponse {
  customScanId: string;
  measurements?: BodygramMeasurements;
  status: 'success' | 'error';
  error?: string;
  [key: string]: unknown;
}

export interface MeasurementResult {
  userId: string;
  height: number;
  processedAt: string;
  measurements: Measurements;
  dataSource: string;
  bodygramData?: BodygramApiResponse;
  bodygramError?: string;
  bodygramStatus?: 'success' | 'error' | 'not_called';
  blobUrl?: string;
}

export interface ProcessMeasurementResponse {
  success: boolean;
  message?: string;
  userId: string;
  height: number;
  processedAt: string;
  measurements: Measurements;
  dataSource: string;
  bodygramData?: BodygramApiResponse;
  bodygramError?: string;
  bodygramStatus?: 'success' | 'error' | 'not_called';
  blobUrl?: string;
}
