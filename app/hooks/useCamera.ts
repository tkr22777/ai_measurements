import { useState, useRef, useEffect } from 'react';

interface UseCameraProps {
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  hasPermission: boolean | null;
  isLoading: boolean;
  errorMessage: string | null;
  facingMode: 'user' | 'environment';
  requestCameraPermission: () => Promise<void>;
  switchCamera: () => void;
  stopCamera: () => void;
}

export default function useCamera({ onError, onDebug }: UseCameraProps = {}): UseCameraReturn {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // Log debug messages if provided
  const logDebug = (message: string) => {
    if (onDebug) onDebug(message);
  };

  // Stop any active camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const requestCameraPermission = async () => {
    if (!isClient) {
      logDebug("Cannot access camera during server rendering");
      return;
    }

    if (!isMounted) {
      logDebug("Component not yet mounted, waiting...");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    logDebug("Starting camera request...");
    
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in your browser");
      }
      
      logDebug("MediaDevices API available, checking for existing stream...");
      
      // Close any existing stream
      stopCamera();
      
      logDebug("Requesting camera with facingMode: " + facingMode);
      
      const constraints = { 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      logDebug(`Requesting stream with constraints: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      logDebug("Camera stream obtained successfully");
      streamRef.current = stream;
      
      // Even if videoRef.current is null now, we can still proceed since 
      // we've moved the video element out of conditional rendering
      // This will ensure the stream is ready when the video element becomes available
      setTimeout(() => {
        if (videoRef.current) {
          logDebug("Setting video source object");
          videoRef.current.srcObject = stream;
          
          // Add event listeners to track video loading
          videoRef.current.onloadedmetadata = () => {
            logDebug("Video metadata loaded");
            videoRef.current?.play().catch(e => {
              logDebug(`Error playing video: ${e}`);
            });
          };
          
          videoRef.current.onloadeddata = () => {
            logDebug("Video data loaded, starting playback");
            setIsLoading(false);
            setHasPermission(true);
          };
          
          videoRef.current.onerror = (e) => {
            logDebug(`Video error: ${e}`);
            setErrorMessage("Error loading video stream");
            setIsLoading(false);
            setHasPermission(false);
          };
        } else {
          logDebug("Video element still not available after getting stream");
          // We'll set the state to proceed anyway, and the stream will be connected when the element renders
          setIsLoading(false);
          setHasPermission(true);
        }
      }, 50); // Short delay to ensure DOM updates have processed
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);
      setHasPermission(false);
      
      // Provide a more specific error message
      let message = 'Unexpected error accessing your camera. Please try again.';
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          message = 'Camera access was denied. Please check your browser permissions.';
          logDebug(`Permission error: ${err.message}`);
        } else if (err.name === 'NotFoundError') {
          message = 'No camera detected on this device.';
          logDebug(`No camera: ${err.message}`);
        } else if (err.name === 'NotReadableError') {
          message = 'Camera is already in use by another application.';
          logDebug(`Camera busy: ${err.message}`);
        } else {
          message = `Camera error: ${err.message}`;
          logDebug(`DOM error: ${err.name} - ${err.message}`);
        }
      } else {
        logDebug(`Unknown error: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      setErrorMessage(message);
      if (onError) onError(message);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };
  
  // Effect to request camera when facingMode changes
  useEffect(() => {
    if (isClient && isMounted && hasPermission !== false) {
      requestCameraPermission();
    }
  }, [facingMode, isMounted, isClient]);

  return {
    videoRef,
    streamRef,
    hasPermission,
    isLoading,
    errorMessage,
    facingMode,
    requestCameraPermission,
    switchCamera,
    stopCamera
  };
} 