import { useState, useEffect } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';

interface UseCameraCaptureProps {
  onPhotoCapture: (imageUrl: string) => void;
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

interface UseCameraCaptureReturn {
  isCapturing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  facingMode: 'user' | 'environment';
  switchCamera: () => void;
  handleCapturePhoto: () => void;
}

export default function useCameraCapture({
  onPhotoCapture,
  onError,
  onDebug,
}: UseCameraCaptureProps): UseCameraCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize camera hook
  const { videoRef, hasPermission, isLoading, facingMode, switchCamera, stopCamera } = useCamera({
    onError,
    onDebug,
  });

  // Initialize photo capture hook
  const { canvasRef, capturePhoto } = usePhotoCapture({
    onError,
    onDebug,
  });

  // When camera is ready, set capturing state
  useEffect(() => {
    if (hasPermission === true && !isLoading) {
      setIsCapturing(true);
    } else {
      setIsCapturing(false);
    }
  }, [hasPermission, isLoading]);

  // Handle photo capture
  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const imageUrl = capturePhoto(videoRef.current, facingMode, stopCamera);
      setIsCapturing(false);

      if (imageUrl) {
        onPhotoCapture(imageUrl);
      }
    }
  };

  return {
    isCapturing,
    videoRef,
    canvasRef,
    facingMode,
    switchCamera,
    handleCapturePhoto,
  };
}
