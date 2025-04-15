import { useState, useRef } from 'react';
import { FilterConfig } from '../components/Camera/filterConfig';

interface UsePhotoCaptureProps {}

interface UsePhotoCaptureReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  capturedImage: string | null;
  capturePhoto: (
    video: HTMLVideoElement,
    facingMode: 'user' | 'environment',
    stopStream?: () => void,
    filterConfig?: FilterConfig
  ) => string | null;
  resetPhoto: () => void;
}

export default function usePhotoCapture({}: UsePhotoCaptureProps = {}): UsePhotoCaptureReturn {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const capturePhoto = (
    video: HTMLVideoElement,
    facingMode: 'user' | 'environment',
    stopStream?: () => void,
    filterConfig?: FilterConfig
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

          // Apply filter effects if provided
          if (filterConfig) {
            // Apply filter effect directly to pixel data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Apply the filter using the provided configuration
            applyFilter(imageData, filterConfig);
            context.putImageData(imageData, 0, 0);
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
        console.error(errorMsg);
      }
    } else {
      console.error('Cannot capture photo: Canvas element not available');
    }

    return null;
  };

  // Helper function to apply the filter effect to image data
  const applyFilter = (imageData: ImageData, config: FilterConfig) => {
    const data = imageData.data;
    const { contrast, brightness, saturation } = config;

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate luminance (brightness)
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

      // Apply saturation - first convert to HSL-like space
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = (max - min) / 255;
      const satLevel = delta * saturation;

      // Apply all adjustments
      let rr = r,
        gg = g,
        bb = b;

      // Saturation
      if (delta > 0) {
        const avgLuminance = (max + min) / 2 / 255;
        const satMult =
          satLevel > 0 ? (1 - avgLuminance) / avgLuminance : avgLuminance / (1 - avgLuminance);

        // Apply saturation adjustment
        if (r !== max && r !== min) {
          rr += (r - avgLuminance * 255) * satMult;
        }
        if (g !== max && g !== min) {
          gg += (g - avgLuminance * 255) * satMult;
        }
        if (b !== max && b !== min) {
          bb += (b - avgLuminance * 255) * satMult;
        }
      }

      // Apply contrast and brightness
      rr = ((rr / 255 - 0.5) * contrast + 0.5) * 255 * brightness;
      gg = ((gg / 255 - 0.5) * contrast + 0.5) * 255 * brightness;
      bb = ((bb / 255 - 0.5) * contrast + 0.5) * 255 * brightness;

      // Clamp values
      data[i] = Math.max(0, Math.min(255, Math.round(rr)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(gg)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(bb)));
    }
  };

  const resetPhoto = () => {
    setCapturedImage(null);
  };

  return {
    canvasRef,
    capturedImage,
    capturePhoto,
    resetPhoto,
  };
}
