import { useState, useRef } from 'react';

interface UsePhotoCaptureProps {
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

interface UsePhotoCaptureReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  capturedImage: string | null;
  capturePhoto: (
    video: HTMLVideoElement,
    facingMode: 'user' | 'environment',
    stopStream?: () => void
  ) => string | null;
  downloadPhoto: () => void;
  resetPhoto: () => void;
}

export default function usePhotoCapture({
  onError,
  onDebug,
}: UsePhotoCaptureProps = {}): UsePhotoCaptureReturn {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Log debug messages if provided
  const logDebug = (message: string) => {
    if (onDebug) onDebug(message);
  };

  const capturePhoto = (
    video: HTMLVideoElement,
    facingMode: 'user' | 'environment',
    stopStream?: () => void
  ) => {
    if (typeof window === 'undefined') return null; // Safe check for server-side

    if (canvasRef.current) {
      const canvas = canvasRef.current;

      try {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw current video frame to canvas
        const context = canvas.getContext('2d');
        if (context) {
          // If using front camera, flip the image horizontally for a mirror effect
          if (facingMode === 'user') {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Reset transformation if we applied any
          if (facingMode === 'user') {
            context.setTransform(1, 0, 0, 1, 0, 0);
          }

          // Convert canvas to data URL
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(imageDataUrl);

          // Stop the camera stream if provided
          if (stopStream) {
            stopStream();
          }

          return imageDataUrl;
        }
      } catch (err) {
        const errorMsg = `Error capturing photo: ${err instanceof Error ? err.message : String(err)}`;
        logDebug(errorMsg);
        console.error(errorMsg);
        if (onError) onError(errorMsg);
      }
    } else {
      const errorMsg = 'Cannot capture photo: Canvas element not available';
      logDebug(errorMsg);
      if (onError) onError(errorMsg);
    }

    return null;
  };

  const downloadPhoto = () => {
    if (typeof window === 'undefined' || !capturedImage) return;

    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `photo_${new Date().toISOString().replace(/:/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetPhoto = () => {
    setCapturedImage(null);
  };

  return {
    canvasRef,
    capturedImage,
    capturePhoto,
    downloadPhoto,
    resetPhoto,
  };
}
