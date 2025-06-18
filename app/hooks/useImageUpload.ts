/**
 * Focused hook for image upload functionality
 * Uses service layer for business logic
 */

import { useState, useCallback } from 'react';
import { prepareImageForUpload, uploadImageToServer } from '@/services/imageService';
import { log } from '@/utils/logger';

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadError: string | null;
  uploadedImageUrl: string | null;
  uploadImage: (imageDataUrl: string, userId: string, photoType: string) => Promise<string | null>;
  resetUploadState: () => void;
}

export default function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (imageDataUrl: string, userId: string, photoType: string): Promise<string | null> => {
      const startTime = Date.now();

      // Step 1: Reset state
      setIsUploading(true);
      setUploadError(null);

      log.user.action(userId, 'image_upload_start', { photoType });

      // Step 2: Prepare image for upload
      const prepareResult = prepareImageForUpload(imageDataUrl, userId, photoType);
      if (!prepareResult.success) {
        const error = new Error(prepareResult.error!);
        log.user.error(userId, 'image_prepare_failed', error);
        setUploadError(prepareResult.error!);
        setIsUploading(false);
        return null;
      }

      // Step 3: Upload to server
      const uploadResult = await uploadImageToServer(prepareResult.data!.formData);
      if (!uploadResult.success) {
        const error = new Error(uploadResult.error!);
        log.user.error(userId, 'image_upload_failed', error);
        setUploadError(uploadResult.error!);
        setIsUploading(false);
        return null;
      }

      // Step 4: Update success state
      const duration = Date.now() - startTime;
      setUploadedImageUrl(uploadResult.data!);
      setIsUploading(false);

      log.user.action(userId, 'image_upload_success', {
        photoType,
        duration,
        imageUrl: uploadResult.data!,
      });

      return uploadResult.data!;
    },
    []
  );

  const resetUploadState = useCallback(() => {
    setUploadError(null);
    setUploadedImageUrl(null);
  }, []);

  return {
    isUploading,
    uploadError,
    uploadedImageUrl,
    uploadImage,
    resetUploadState,
  };
}
