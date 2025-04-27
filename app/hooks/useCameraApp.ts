import { useState, useEffect, useCallback } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';
import { dataURLtoFile, generateFilename } from '../utils/imageUtils';
import { galleryEvents } from '../components/ImageGallery';
import { useUser } from '../components/UserContext';

interface UseCameraAppReturn {
  isClient: boolean;
  isCapturing: boolean;
  localCapturedImage: string | null;
  hasPermission: boolean | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadError: string | null;
  uploadedImageUrl: string | null;
  requestCameraPermission: () => void;
  stopCamera: () => void;
  uploadToServer: () => Promise<void>;
  handleRetake: () => void;
  handlePhotoCapture: (imageUrl: string) => void;
}

export default function useCameraApp(): UseCameraAppReturn {
  const [isClient, setIsClient] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Get userId from shared context
  const { userId } = useUser();

  // Set client state when component loads
  useEffect(() => {
    setIsClient(true);
    console.log('Camera app initialized on client');
  }, []);

  // Initialize camera hook
  const { hasPermission, isLoading, requestCameraPermission, stopCamera } = useCamera();

  // Initialize photo capture hook
  const { capturePhoto, resetPhoto } = usePhotoCapture();

  // Upload functionality is centralized here
  const uploadToServer = useCallback(async () => {
    if (!localCapturedImage) {
      console.log('No image available to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      console.log('Preparing to upload photo to Vercel Blob storage...');

      // Convert data URL to File
      const filename = generateFilename();
      const file = dataURLtoFile(localCapturedImage, filename);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      // Include userId in the form data
      formData.append('userId', userId);

      // Upload to our API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      console.log('Upload complete!', result);
      setUploadedImageUrl(result.url);

      // Trigger gallery refresh
      galleryEvents.triggerRefresh();
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [localCapturedImage, userId]);

  // When permission changes, update capturing state
  useEffect(() => {
    if (hasPermission === true && !isLoading) {
      setIsCapturing(true);
      console.log('Camera permission granted, ready to capture');
    } else if (hasPermission === false) {
      setIsCapturing(false);
      console.log('Camera permission denied');
    }
  }, [hasPermission, isLoading]);

  // Handle retake action
  const handleRetake = () => {
    console.log('Retaking photo');
    setLocalCapturedImage(null);
    setUploadedImageUrl(null);
    setUploadError(null);
    resetPhoto();
    requestCameraPermission();
  };

  // Handle photo capture
  const handlePhotoCapture = (imageUrl: string) => {
    console.log('Photo captured successfully');
    setIsCapturing(false);
    setLocalCapturedImage(imageUrl);
  };

  return {
    isClient,
    isCapturing,
    localCapturedImage,
    hasPermission,
    isLoading,
    isUploading,
    uploadError,
    uploadedImageUrl,
    requestCameraPermission,
    stopCamera,
    uploadToServer,
    handleRetake,
    handlePhotoCapture,
  };
}
