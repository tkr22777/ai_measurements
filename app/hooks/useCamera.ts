import { useState, useRef, useEffect, useCallback } from 'react';

interface UseCameraProps {}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  hasPermission: boolean | null;
  isLoading: boolean;
  facingMode: 'user' | 'environment';
  requestCameraPermission: () => Promise<void>;
  switchCamera: () => void;
  stopCamera: () => void;
}

export default function useCamera({}: UseCameraProps = {}): UseCameraReturn {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Set mounted state and check if we're on client when component loads
  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      stopCamera();
    };
  }, []);

  // Stop any active camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const requestCameraPermission = useCallback(async () => {
    if (!isClient) {
      console.log('Cannot access camera during server rendering');
      return;
    }

    if (!isMounted) {
      console.log('Component not yet mounted, waiting...');
      return;
    }

    setIsLoading(true);
    console.log('Starting camera request...');

    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API is not supported in your browser');
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      console.log('MediaDevices API available, checking for existing stream...');

      // Close any existing stream
      stopCamera();

      console.log('Requesting camera with facingMode: ' + facingMode);

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      console.log(`Requesting stream with constraints: ${JSON.stringify(constraints)}`);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('Camera stream obtained successfully');
      streamRef.current = stream;

      // Even if videoRef.current is null now, we can still proceed since
      // we've moved the video element out of conditional rendering
      // This will ensure the stream is ready when the video element becomes available
      setTimeout(() => {
        if (videoRef.current) {
          console.log('Setting video source object');
          videoRef.current.srcObject = stream;

          // Add event listeners to track video loading
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            videoRef.current?.play().catch((e) => {
              console.error(`Error playing video: ${e}`);
            });
          };

          videoRef.current.onloadeddata = () => {
            console.log('Video data loaded, starting playback');
            setIsLoading(false);
            setHasPermission(true);
          };

          videoRef.current.onerror = (e) => {
            console.error(`Video error: ${e}`);
            setIsLoading(false);
            setHasPermission(false);
          };
        } else {
          console.log('Video element still not available after getting stream');
          // We'll set the state to proceed anyway, and the stream will be connected when the element renders
          setIsLoading(false);
          setHasPermission(true);
        }
      }, 50); // Short delay to ensure DOM updates have processed
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);
      setHasPermission(false);

      // Log detailed error information
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          console.error(`Permission error: Camera access was denied. ${err.message}`);
        } else if (err.name === 'NotFoundError') {
          console.error(`No camera: No camera detected on this device. ${err.message}`);
        } else if (err.name === 'NotReadableError') {
          console.error(
            `Camera busy: Camera is already in use by another application. ${err.message}`
          );
        } else {
          console.error(`DOM error: ${err.name} - ${err.message}`);
        }
      } else {
        console.error(`Unknown error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }, [isClient, isMounted, facingMode]);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Effect to request camera when facingMode changes
  useEffect(() => {
    if (isClient && isMounted && hasPermission !== false) {
      requestCameraPermission();
    }
  }, [facingMode, isMounted, isClient, hasPermission, requestCameraPermission]);

  return {
    videoRef,
    streamRef,
    hasPermission,
    isLoading,
    facingMode,
    requestCameraPermission,
    switchCamera,
    stopCamera,
  };
}
