import { useState, useRef, useEffect, useCallback } from 'react';
import { log } from '@/utils/logger';

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
    if (!isClient || !isMounted) {
      return;
    }

    setIsLoading(true);
    log.user.action('camera', 'request_permission', { facingMode });

    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = new Error('Camera API is not supported in your browser');
        log.user.error('camera', 'api_not_supported', error);
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      // Close any existing stream
      stopCamera();

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Set up video element when ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((e) => {
              log.user.error('camera', 'video_play_failed', e as Error);
            });
          };

          videoRef.current.onloadeddata = () => {
            setIsLoading(false);
            setHasPermission(true);
            log.user.action('camera', 'permission_granted', { facingMode });
          };

          videoRef.current.onerror = (e) => {
            const error = new Error(`Video error: ${e}`);
            log.user.error('camera', 'video_error', error);
            setIsLoading(false);
            setHasPermission(false);
          };
        } else {
          // Stream ready but video element not available yet
          setIsLoading(false);
          setHasPermission(true);
        }
      }, 50);
    } catch (err) {
      const error = err as Error;
      setIsLoading(false);
      setHasPermission(false);

      // Log specific error types
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          log.user.error('camera', 'permission_denied', error);
        } else if (err.name === 'NotFoundError') {
          log.user.error('camera', 'no_camera_found', error);
        } else if (err.name === 'NotReadableError') {
          log.user.error('camera', 'camera_busy', error);
        } else {
          log.user.error('camera', 'dom_error', error);
        }
      } else {
        log.user.error('camera', 'unknown_error', error);
      }
    }
  }, [isClient, isMounted, facingMode]);

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    log.user.action('camera', 'switch_camera', {
      newFacingMode: facingMode === 'user' ? 'environment' : 'user',
    });
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
