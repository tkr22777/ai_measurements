import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

// Bodygram API integration
const callBodygramAPI = async (userHeight: number) => {
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
    const payload = {
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
      },
    };

    // Make the API call to Bodygram
    const apiUrl = `https://platform.bodygram.com/api/orgs/${BODYGRAM_ORG_ID}/scans`;

    console.log(`Calling Bodygram API at: ${apiUrl}`);

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
      console.error(`Bodygram API error (${response.status}): ${errorText}`);
      throw new Error(`Bodygram API error: ${response.status}`);
    }

    const bodygramData = await response.json();
    console.log('Bodygram API response:', bodygramData);

    return bodygramData;
  } catch (error) {
    console.error('Error calling Bodygram API:', error);
    throw error;
  }
};

// Store data in Vercel Blob Storage
const storeInBlobStore = async (userId: string, data: any) => {
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

    return result.url;
  } catch (error) {
    console.error('Error storing in Vercel Blob Storage:', error);
    return null;
  }
};

// Retrieve data from Vercel Blob Storage
const getFromBlobStore = async (userId: string) => {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving from Vercel Blob Storage:', error);
    return null;
  }
};

// Delete measurement data if needed
const deleteFromBlobStore = async (userId: string) => {
  try {
    // Note: Currently, the Vercel Blob API doesn't provide a direct delete method
    // This would require using the Vercel Blob Dashboard or implementing a workaround
    // For production use, you'd typically implement a proper deletion strategy
    console.warn('Deletion from Vercel Blob not implemented');
    return false;
  } catch (error) {
    console.error('Error deleting from Vercel Blob Storage:', error);
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
    console.error('Error retrieving measurement results:', error);
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
    let bodygramResponse = null;
    let bodygramError = null;

    try {
      bodygramResponse = await callBodygramAPI(userHeight);
    } catch (error) {
      console.error('Error from Bodygram API:', error);
      bodygramError = error instanceof Error ? error.message : 'Unknown error from Bodygram API';
      // We'll continue with mock data if the Bodygram API fails
    }

    // Generate measurements (either from Bodygram API or fallback to mock data)
    let mockMeasurements;

    if (bodygramResponse) {
      // Use data from Bodygram API if available
      // This is a placeholder - you would extract actual measurements from bodygramResponse
      mockMeasurements = {
        height: userHeight, // cm
        weight: bodygramResponse.weight ? bodygramResponse.weight / 1000 : 75, // kg (converted from g)
        chest: bodygramResponse.chest || 95 + Math.floor(Math.random() * 5), // cm
        waist: bodygramResponse.waist || 80 + Math.floor(Math.random() * 5), // cm
        hips: bodygramResponse.hips || 100 + Math.floor(Math.random() * 5), // cm
        bmi: bodygramResponse.bmi || 75 / (userHeight / 100) ** 2, // kg/m²
      };
    } else {
      // Fallback to mock data if Bodygram API call failed
      const baseWeight = (userHeight - 100) * 0.9;
      mockMeasurements = {
        height: userHeight, // cm
        weight: baseWeight, // kg
        chest: 95 + Math.floor(Math.random() * 5), // cm
        waist: 80 + Math.floor(Math.random() * 5), // cm
        hips: 100 + Math.floor(Math.random() * 5), // cm
        bmi: baseWeight / (userHeight / 100) ** 2, // kg/m²
      };
    }

    // Create the result object to store
    interface ProcessedResult {
      userId: string;
      height: number;
      timestamp: string;
      processedAt: string;
      measurements: typeof mockMeasurements;
      bodygramData?: any;
      bodygramError?: string | null;
      blobUrl?: string | null;
    }

    const processedResult: ProcessedResult = {
      userId,
      height: userHeight,
      timestamp,
      processedAt: new Date().toISOString(),
      measurements: mockMeasurements,
    };

    // Include Bodygram data or error if available
    if (bodygramResponse) {
      processedResult.bodygramData = bodygramResponse;
    }
    if (bodygramError) {
      processedResult.bodygramError = bodygramError;
    }

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
