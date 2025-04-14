'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // Default to front camera
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let streamRef = useRef<MediaStream | null>(null);

  // Set mounted state and check if we're on client when component loads
  useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const requestCameraPermission = async () => {
    if (!isClient) {
      setDebugInfo("Cannot access camera during server rendering");
      return;
    }

    if (!isMounted) {
      setDebugInfo("Component not yet mounted, waiting...");
      return;
    }

    if (!videoRef.current) {
      setDebugInfo("Video element reference not available yet. Waiting a moment...");
      // Try again in a moment
      setTimeout(() => {
        if (isMounted) {
          requestCameraPermission();
        }
      }, 500);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setDebugInfo("Starting camera request...");
    
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in your browser");
      }
      
      setDebugInfo("MediaDevices API available, checking for existing stream...");
      
      // Close any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setDebugInfo("Requesting camera with facingMode: " + facingMode);
      
      const constraints = { 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      setDebugInfo(`Requesting stream with constraints: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setDebugInfo("Camera stream obtained successfully");
      streamRef.current = stream;
      
      if (videoRef.current) {
        setDebugInfo("Setting video source object");
        videoRef.current.srcObject = stream;
        
        // Add event listeners to track video loading
        videoRef.current.onloadedmetadata = () => {
          setDebugInfo("Video metadata loaded");
          // Start playing the video after metadata is loaded
          videoRef.current?.play().catch(e => {
            setDebugInfo(`Error playing video: ${e}`);
          });
        };
        
        videoRef.current.onloadeddata = () => {
          setDebugInfo("Video data loaded, starting playback");
          setIsLoading(false);
          setHasPermission(true);
          setIsCapturing(true);
        };
        
        videoRef.current.onerror = (e) => {
          setDebugInfo(`Video error: ${e}`);
          setErrorMessage("Error loading video stream");
          setIsLoading(false);
          setHasPermission(false);
        };
      } else {
        setDebugInfo("Video element is not available even after getting stream");
        throw new Error("Video element is not available");
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);
      setHasPermission(false);
      
      // Provide a more specific error message
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Camera access was denied. Please check your browser permissions.');
          setDebugInfo(`Permission error: ${err.message}`);
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('No camera detected on this device.');
          setDebugInfo(`No camera: ${err.message}`);
        } else if (err.name === 'NotReadableError') {
          setErrorMessage('Camera is already in use by another application.');
          setDebugInfo(`Camera busy: ${err.message}`);
        } else {
          setErrorMessage(`Camera error: ${err.message}`);
          setDebugInfo(`DOM error: ${err.name} - ${err.message}`);
        }
      } else {
        setErrorMessage('Unexpected error accessing your camera. Please try again.');
        setDebugInfo(`Unknown error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };
  
  // Effect to request camera when facingMode changes
  useEffect(() => {
    if (isClient && isMounted && (isCapturing || hasPermission === null)) {
      requestCameraPermission();
    }
  }, [facingMode, isMounted, isClient]);

  const capturePhoto = () => {
    if (!isClient) return;
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
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
          setIsCapturing(false);
          
          // Stop the camera stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      } catch (err) {
        setDebugInfo(`Error capturing photo: ${err instanceof Error ? err.message : String(err)}`);
        console.error("Error capturing photo:", err);
      }
    } else {
      setDebugInfo("Cannot capture photo: Video or canvas element not available");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    requestCameraPermission();
  };

  const downloadPhoto = () => {
    if (!isClient) return;
    
    if (capturedImage) {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `selfie_${new Date().toISOString().replace(/:/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const manuallyAllowCamera = () => {
    if (!isClient) return;
    
    setDebugInfo("Manual permission request initiated");
    setHasPermission(null);
    setIsLoading(false);
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (isMounted) {
        requestCameraPermission();
      }
    }, 100);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isClient && streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isClient]);

  // Automatically request camera permission on component mount, but only on client
  useEffect(() => {
    if (isClient && isMounted && hasPermission === null && !isLoading) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        requestCameraPermission();
      }, 100);
    }
  }, [isMounted, hasPermission, isLoading, isClient]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mobile Camera</h1>
        
        {!isClient ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading camera interface...</p>
          </div>
        ) : isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Accessing camera...</p>
            {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
            <button 
              className={styles.button}
              onClick={manuallyAllowCamera}
            >
              Retry Camera Access
            </button>
          </div>
        ) : hasPermission === null ? (
          <div className={styles.permissionRequest}>
            <p>This app needs access to your camera to take photos.</p>
            <button 
              className={styles.button}
              onClick={manuallyAllowCamera}
            >
              Allow Camera Access
            </button>
            {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
          </div>
        ) : hasPermission === false ? (
          <div className={styles.permissionDenied}>
            <p>{errorMessage || 'Camera access was denied. Please grant permission to use this feature.'}</p>
            <button 
              className={styles.button} 
              onClick={manuallyAllowCamera}
            >
              Try Again
            </button>
            {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
          </div>
        ) : isCapturing ? (
          <div className={styles.cameraContainer}>
            <video 
              ref={videoRef} 
              className={`${styles.videoPreview} ${facingMode === 'user' ? styles.mirror : ''}`}
              autoPlay 
              playsInline 
              muted
            />
            <div className={styles.controls}>
              <button 
                className={styles.switchButton}
                onClick={switchCamera}
                aria-label="Switch Camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 15l4-4-4-4M8 9l-4 4 4 4M12 3v18"/>
                </svg>
              </button>
              <button 
                className={styles.captureButton} 
                onClick={capturePhoto}
                aria-label="Take Photo"
              />
            </div>
          </div>
        ) : capturedImage ? (
          <div className={styles.imagePreviewContainer}>
            <img 
              src={capturedImage} 
              alt="Captured" 
              className={styles.imagePreview} 
            />
            <div className={styles.buttonGroup}>
              <button 
                className={styles.button} 
                onClick={retakePhoto}
              >
                Retake
              </button>
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={downloadPhoto}
              >
                Download
              </button>
            </div>
          </div>
        ) : null}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </main>
  );
} 