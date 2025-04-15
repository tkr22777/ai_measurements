import { useState, useEffect } from 'react';
import useCamera from './useCamera';
import usePhotoCapture from './usePhotoCapture';
import { dramaticFilter } from '../components/Camera/filterConfig';

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
  filterCssValue: string;
}

export default function useCameraCapture({
  onPhotoCapture,
  onError,
  onDebug,
}: UseCameraCaptureProps): UseCameraCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);

  // Create the CSS filter string for the video element
  const filterCssValue = `contrast(${dramaticFilter.contrast * 100}%) brightness(${dramaticFilter.brightness * 100}%) saturate(${dramaticFilter.saturation * 100}%)`;

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
      // Pass the same filter configuration that's applied to the video
      const imageUrl = capturePhoto(videoRef.current, facingMode, stopCamera, dramaticFilter);
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
    filterCssValue,
  };
}
