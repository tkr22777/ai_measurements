import { useState, useEffect, useCallback } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';
import useImageUpload from './useImageUpload';
import { useUser } from '@/components/UserContext';
import { log } from '@/utils/logger';

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
    log.app.start();
  }, []);

  // Camera permission effect
  useEffect(() => {
    if (hasPermission === true && !isLoading) {
      setIsCapturing(true);
      log.user.action(userId, 'camera_permission_granted', { photoType: currentPhotoType });
    } else if (hasPermission === false) {
      setIsCapturing(false);
      log.user.action(userId, 'camera_permission_denied', { photoType: currentPhotoType });
    }
  }, [hasPermission, isLoading, userId, currentPhotoType]);

  // Upload function - now much simpler
  const uploadToServer = useCallback(
    async (photoType: string): Promise<string | null> => {
      if (!localCapturedImage) {
        log.user.error(userId, 'upload_no_image', new Error('No image available to upload'));
        return null;
      }

      log.user.action(userId, 'upload_start', { photoType });
      return uploadImage(localCapturedImage, userId, photoType);
    },
    [localCapturedImage, userId, uploadImage]
  );

  // Retake handler
  const handleRetake = useCallback(() => {
    log.user.action(userId, 'photo_retake', { photoType: currentPhotoType });
    setLocalCapturedImage(null);
    resetUploadState();
    resetPhoto();
    requestCameraPermission();
  }, [resetUploadState, resetPhoto, requestCameraPermission, userId, currentPhotoType]);

  // Photo capture handler
  const handlePhotoCapture = useCallback(
    (imageUrl: string) => {
      log.user.action(userId, 'photo_captured', { photoType: currentPhotoType });
      setIsCapturing(false);
      setLocalCapturedImage(imageUrl);
    },
    [userId, currentPhotoType]
  );

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
