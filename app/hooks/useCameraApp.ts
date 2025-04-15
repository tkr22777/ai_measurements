import { useState, useEffect, useCallback } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';

interface UseCameraAppReturn {
  isClient: boolean;
  isCapturing: boolean;
  localCapturedImage: string | null;
  hasPermission: boolean | null;
  isLoading: boolean;
  requestCameraPermission: () => void;
  stopCamera: () => void;
  uploadToServer: () => void;
  handleRetake: () => void;
  handlePhotoCapture: (imageUrl: string) => void;
}

export default function useCameraApp(): UseCameraAppReturn {
  const [isClient, setIsClient] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);

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
  // This is the only implementation of uploadToServer in the app
  const uploadToServer = useCallback(() => {
    if (!localCapturedImage) {
      console.log('No image available to upload');
      return;
    }

    // This would be where you'd implement the actual server upload
    console.log('Uploading photo to server...');

    // For demonstration purposes
    setTimeout(() => {
      console.log('Upload complete!');
    }, 500);
  }, [localCapturedImage]);

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
    requestCameraPermission,
    stopCamera,
    uploadToServer,
    handleRetake,
    handlePhotoCapture,
  };
}
