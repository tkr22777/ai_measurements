/**
 * Focused hook for image upload functionality
 * Uses service layer for business logic
 */

import { useState, useCallback } from 'react';
import { prepareImageForUpload, uploadImageToServer } from '@/services/imageService';

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
      // Step 1: Reset state
      setIsUploading(true);
      setUploadError(null);

      // Step 2: Prepare image for upload
      const prepareResult = prepareImageForUpload(imageDataUrl, userId, photoType);
      if (!prepareResult.success) {
        setUploadError(prepareResult.error!);
        setIsUploading(false);
        return null;
      }

      // Step 3: Upload to server
      const uploadResult = await uploadImageToServer(prepareResult.data!.formData);
      if (!uploadResult.success) {
        setUploadError(uploadResult.error!);
        setIsUploading(false);
        return null;
      }

      // Step 4: Update success state
      setUploadedImageUrl(uploadResult.data!);
      setIsUploading(false);
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
