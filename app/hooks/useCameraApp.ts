import { useState, useEffect, useCallback } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';
import useImageUpload from './useImageUpload';
import { useUser } from '@/components/UserContext';

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
  uploadToServer: (photoType: string) => Promise<string | null>;
  handleRetake: () => void;
  handlePhotoCapture: (imageUrl: string) => void;
  currentPhotoType: string | null;
  setCurrentPhotoType: (type: string | null) => void;
}

export default function useCameraApp(): UseCameraAppReturn {
  const [isClient, setIsClient] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);
  const [currentPhotoType, setCurrentPhotoType] = useState<string | null>(null);

  // Get userId from shared context
  const { userId } = useUser();

  // Initialize focused hooks
  const { hasPermission, isLoading, requestCameraPermission, stopCamera } = useCamera();
  const { capturePhoto, resetPhoto } = usePhotoCapture();
  const { isUploading, uploadError, uploadedImageUrl, uploadImage, resetUploadState } =
    useImageUpload();

  // Client initialization effect
  useEffect(() => {
    setIsClient(true);
    console.log('Camera app initialized on client');
  }, []);

  // Camera permission effect
  useEffect(() => {
    if (hasPermission === true && !isLoading) {
      setIsCapturing(true);
      console.log('Camera permission granted, ready to capture');
    } else if (hasPermission === false) {
      setIsCapturing(false);
      console.log('Camera permission denied');
    }
  }, [hasPermission, isLoading]);

  // Upload function - now much simpler
  const uploadToServer = useCallback(
    async (photoType: string): Promise<string | null> => {
      if (!localCapturedImage) {
        console.log('No image available to upload');
        return null;
      }

      return uploadImage(localCapturedImage, userId, photoType);
    },
    [localCapturedImage, userId, uploadImage]
  );

  // Retake handler
  const handleRetake = useCallback(() => {
    console.log('Retaking photo');
    setLocalCapturedImage(null);
    resetUploadState();
    resetPhoto();
    requestCameraPermission();
  }, [resetUploadState, resetPhoto, requestCameraPermission]);

  // Photo capture handler
  const handlePhotoCapture = useCallback((imageUrl: string) => {
    console.log('Photo captured successfully');
    setIsCapturing(false);
    setLocalCapturedImage(imageUrl);
  }, []);

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
    currentPhotoType,
    setCurrentPhotoType,
  };
}
