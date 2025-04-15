import { useState, useEffect } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';

interface UseCameraAppReturn {
  isClient: boolean;
  debugInfo: string | null;
  isCapturing: boolean;
  localCapturedImage: string | null;
  hasPermission: boolean | null;
  isLoading: boolean;
  errorMessage: string | null;
  requestCameraPermission: () => void;
  stopCamera: () => void;
  downloadPhoto: () => void;
  handleRetake: () => void;
  handlePhotoCapture: (imageUrl: string) => void;
  setDebugInfo: (message: string | null) => void;
}

export default function useCameraApp(): UseCameraAppReturn {
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);

  // Set client state when component loads
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize camera hook with debug handler
  const { hasPermission, isLoading, errorMessage, requestCameraPermission, stopCamera } = useCamera(
    {
      onDebug: setDebugInfo,
    }
  );

  // Initialize photo capture hook
  const { downloadPhoto, resetPhoto } = usePhotoCapture({
    onDebug: setDebugInfo,
  });

  // When permission changes, update capturing state
  useEffect(() => {
    if (hasPermission === true && !isLoading) {
      setIsCapturing(true);
    } else {
      setIsCapturing(false);
    }
  }, [hasPermission, isLoading]);

  // Handle retake action
  const handleRetake = () => {
    setLocalCapturedImage(null);
    resetPhoto();
    requestCameraPermission();
  };

  // Handle photo capture
  const handlePhotoCapture = (imageUrl: string) => {
    setIsCapturing(false);
    setLocalCapturedImage(imageUrl);
  };

  return {
    isClient,
    debugInfo,
    isCapturing,
    localCapturedImage,
    hasPermission,
    isLoading,
    errorMessage,
    requestCameraPermission,
    stopCamera,
    downloadPhoto,
    handleRetake,
    handlePhotoCapture,
    setDebugInfo,
  };
}
