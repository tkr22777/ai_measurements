import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { log } from '@/utils/logger';

// Type definitions for Bodygram API
interface BodygramPhotoScan {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  frontPhoto: string;
  rightPhoto: string;
}

interface BodygramPayload {
  customScanId: string;
  photoScan: BodygramPhotoScan;
  noStatsPhotoScan: {
    frontPhoto: string;
    rightPhoto: string;
  };
  noWeightPhotoScan: Omit<BodygramPhotoScan, 'weight'>;
  statsEstimations: BodygramPhotoScan;
}

interface BodygramMeasurements {
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bmi?: number;
}

interface BodygramApiResponse {
  customScanId: string;
  measurements?: BodygramMeasurements;
  status: 'success' | 'error';
  error?: string;
  [key: string]: unknown;
}

interface Measurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bmi: number;
}

interface ProcessedResult {
  userId: string;
  height: number;
  timestamp: string;
  processedAt: string;
  measurements: Measurements;
  dataSource: string;
  bodygramData?: BodygramApiResponse;
  bodygramError?: string | null;
  blobUrl?: string | null;
}

// Bodygram API integration
const callBodygramAPI = async (userHeight: number): Promise<BodygramApiResponse> => {
  try {
    // Get Bodygram API credentials from environment variables
    const BODYGRAM_ORG_ID = process.env.BODYGRAM_ORG_ID;
    const BODYGRAM_API_KEY = process.env.BODYGRAM_API_KEY;

    if (!BODYGRAM_ORG_ID || !BODYGRAM_API_KEY) {
      console.error('Bodygram API credentials not found in environment variables');
      throw new Error('Bodygram API credentials not configured');
    }

    // Convert height from cm to mm for Bodygram API
    const heightInMm = Math.round(userHeight * 10);

    // Prepare the request payload
    const payload: BodygramPayload = {
      customScanId: `user_scan_${Date.now()}`,
      photoScan: {
        age: 29,
        weight: 75000,
        height: heightInMm,
        gender: 'male',
        frontPhoto: 'string',
        rightPhoto: 'string',
      },
      noStatsPhotoScan: {
        frontPhoto: 'string',
        rightPhoto: 'string',
      },
      noWeightPhotoScan: {
        age: 29,
        height: heightInMm,
        gender: 'male',
        frontPhoto: 'string',
        rightPhoto: 'string',
      },
      statsEstimations: {
        age: 29,
        weight: 75000,
        height: heightInMm,
        gender: 'male',
        frontPhoto: 'string',
        rightPhoto: 'string',
      },
    };

    // Make the API call to Bodygram
    const apiUrl = `https://platform.bodygram.com/api/orgs/${BODYGRAM_ORG_ID}/scans`;

    log.api.request('POST', '/api/process');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: BODYGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Bodygram API error: ${response.status}`);
      log.api.error('POST', '/api/process', error);
      throw error;
    }

    const bodygramData = (await response.json()) as BodygramApiResponse;
    log.api.response('POST', '/api/process', response.status);

    return bodygramData;
  } catch (error) {
    log.api.error('POST', '/api/process', error as Error);
    throw error;
  }
};

// Store data in Vercel Blob Storage
const storeInBlobStore = async (userId: string, data: ProcessedResult): Promise<string | null> => {
  try {
    // Create blob path
    const blobPath = `processing/${userId}/process_result.json`;

    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Upload to Vercel Blob Storage
    const result = await put(blobPath, blob, {
      access: 'public', // Make it publicly accessible (or use 'private' if needed)
    });

    log.api.response('POST', '/api/process/store', 200);

    return result.url;
  } catch (error) {
    log.api.error('POST', '/api/process/store', error as Error);
    return null;
  }
};

// Retrieve data from Vercel Blob Storage
const getFromBlobStore = async (userId: string): Promise<ProcessedResult | null> => {
  try {
    // Create blob path
    const blobPath = `processing/${userId}/process_result.json`;

    // Try to list items to see if our file exists
    const { blobs } = await list({ prefix: blobPath });

    if (blobs.length === 0) {
      return null; // No file found
    }

    // Get the blob URL from the first matching blob
    const blobUrl = blobs[0].url;

    if (!blobUrl) {
      return null;
    }

    // Get JSON data from the blob URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob data: ${response.status}`);
    }

    const data = (await response.json()) as ProcessedResult;
    return data;
  } catch (error) {
    log.api.error('GET', '/api/process/retrieve', error as Error);
    return null;
  }
};

// Delete measurement data if needed
const deleteFromBlobStore = async (userId: string) => {
  try {
    // Note: Currently, the Vercel Blob API doesn't provide a direct delete method
    // This would require using the Vercel Blob Dashboard or implementing a workaround
    // For production use, you'd typically implement a proper deletion strategy
    log.api.response('DELETE', '/api/process/delete', 501); // Not implemented
    return false;
  } catch (error) {
    log.api.error('DELETE', '/api/process/delete', error as Error);
    return false;
  }
};

// GET handler to retrieve stored measurement results
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Try to get the stored result from Vercel Blob Storage
    const storedResult = await getFromBlobStore(userId);

    if (!storedResult) {
      return NextResponse.json(
        { success: false, error: 'No measurement results found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: storedResult,
    });
  } catch (error) {
    log.api.error('GET', '/api/process', error as Error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve measurement results' },
      { status: 500 }
    );
  }
}

// POST handler to process measurements and store results
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId, height, timestamp } = body;

    // Validate that userId exists
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Validate height
    const userHeight = height || 175;
    if (isNaN(userHeight) || userHeight < 100 || userHeight > 250) {
      return NextResponse.json(
        { success: false, error: 'Invalid height value. Must be between 100 and 250 cm.' },
        { status: 400 }
      );
    }

    // Simulate some backend processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call Bodygram API for body measurements
    let bodygramResponse: BodygramApiResponse | null = null;
    let bodygramError: string | null = null;

    try {
      bodygramResponse = await callBodygramAPI(userHeight);
    } catch (error) {
      log.api.error('POST', '/api/process/bodygram', error as Error);
      bodygramError = error instanceof Error ? error.message : 'Unknown error from Bodygram API';
      // We'll continue with mock data if the Bodygram API fails
    }

    // Generate measurements (either from Bodygram API or fallback to mock data)
    let mockMeasurements: Measurements;
    let dataSource = 'bodygram'; // Default source

    if (bodygramResponse && bodygramResponse.measurements) {
      // Use data from Bodygram API if available
      const measurements = bodygramResponse.measurements;
      mockMeasurements = {
        height: userHeight, // cm
        weight: measurements.weight ? measurements.weight / 1000 : 75, // kg (converted from g)
        chest: measurements.chest || 95 + Math.floor(Math.random() * 5), // cm
        waist: measurements.waist || 80 + Math.floor(Math.random() * 5), // cm
        hips: measurements.hips || 100 + Math.floor(Math.random() * 5), // cm
        bmi: measurements.bmi || 75 / (userHeight / 100) ** 2, // kg/m²
      };
    } else {
      // Fallback to static mock data if Bodygram API call failed
      dataSource = 'mock/sample data';

      // Calculate a sensible weight based on height using BMI 22 (healthy middle)
      const healthyBmi = 22;
      const healthyWeight = healthyBmi * (userHeight / 100) ** 2;

      // Static measurements based on height proportions
      mockMeasurements = {
        height: userHeight, // cm
        weight: Math.round(healthyWeight * 10) / 10, // kg (rounded to 1 decimal)
        chest: Math.round(userHeight * 0.54), // cm - static proportion of height
        waist: Math.round(userHeight * 0.45), // cm - static proportion of height
        hips: Math.round(userHeight * 0.57), // cm - static proportion of height
        bmi: healthyBmi, // kg/m²
      };
    }

    // Create the result object to store
    const processedResult: ProcessedResult = {
      userId,
      height: userHeight,
      timestamp,
      processedAt: new Date().toISOString(),
      measurements: mockMeasurements,
      dataSource: dataSource,
      bodygramData: bodygramResponse || undefined,
      bodygramError: bodygramError,
      blobUrl: null,
    };

    // Store the result in Vercel Blob Storage
    const blobUrl = await storeInBlobStore(userId, processedResult);
    if (!blobUrl) {
      console.warn(
        'Failed to store measurement results in Vercel Blob, but continuing with response'
      );
    } else {
      console.log(`Measurement results stored at: ${blobUrl}`);
      processedResult.blobUrl = blobUrl;
    }

    // Return a response with the processed data
    return NextResponse.json({
      success: true,
      message: `Body measurements processed successfully for user ${userId}${height ? ' with height: ' + height + ' cm' : ''}`,
      bodygramStatus: bodygramResponse ? 'success' : bodygramError ? 'error' : 'not_called',
      ...processedResult,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process body measurements' },
      { status: 500 }
    );
  }
}
