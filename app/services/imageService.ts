/**
 * Image service layer - Pure business logic functions
 * Each function has a single responsibility (3-4 steps max)
 */

import { dataURLtoFile, generateFilename } from '@/utils/imageUtils';
import {
  validateUserRequest,
  validateImageFile,
  type UserId,
  type PhotoType,
} from '@/utils/validation';
import { eventBus } from '@/utils/eventBus';

// Service response type
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Prepares image file for upload
 * Steps: 1. Validate input 2. Generate filename 3. Convert to File 4. Return prepared data
 */
export function prepareImageForUpload(
  imageDataUrl: string,
  userId: string,
  photoType: string
): ServiceResult<{ file: File; formData: FormData }> {
  // Step 1: Validate inputs
  const validation = validateUserRequest({ userId, photoType });
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  // Step 2: Generate filename
  const filename = generateFilename();

  // Step 3: Convert data URL to File
  const file = dataURLtoFile(imageDataUrl, filename);

  // Step 4: Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', validation.data!.userId);
  formData.append('type', validation.data!.photoType!);

  return {
    success: true,
    data: { file, formData },
  };
}

/**
 * Uploads image to server
 * Steps: 1. Send request 2. Parse response 3. Handle result 4. Emit event
 */
export async function uploadImageToServer(formData: FormData): Promise<ServiceResult<string>> {
  try {
    // Step 1: Send request
    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData,
    });

    // Step 2: Parse response
    const result = await response.json();

    // Step 3: Handle result
    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' };
    }

    // Step 4: Emit success event
    eventBus.emit('image:uploaded');

    return { success: true, data: result.imageUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Fetches user images from server
 * Steps: 1. Build endpoint 2. Fetch data 3. Parse response 4. Return images
 */
export async function fetchUserImages(userId: string): Promise<ServiceResult<any[]>> {
  try {
    // Step 1: Build endpoint
    const endpoint = userId ? `/api/images?userId=${userId}` : `/api/images?userId=&showAll=false`;

    // Step 2: Fetch data
    const response = await fetch(endpoint);

    // Step 3: Parse response
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch images' };
    }

    const data = await response.json();

    // Step 4: Return images
    return { success: true, data: data.images || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Deletes image from server
 * Steps: 1. Validate URL 2. Send delete request 3. Handle response 4. Emit refresh event
 */
export async function deleteImageFromServer(
  imageUrl: string,
  userId: string
): Promise<ServiceResult> {
  try {
    // Step 1: Validate URL
    const validation = validateUserRequest({ userId, imageUrl });
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Step 2: Send delete request
    const response = await fetch('/api/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        pathname: new URL(imageUrl).pathname,
        userId,
      }),
    });

    // Step 3: Handle response
    if (!response.ok) {
      return { success: false, error: 'Failed to delete image' };
    }

    // Step 4: Emit refresh event
    eventBus.emit('gallery:refresh');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
