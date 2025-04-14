'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Camera from './components/Camera';
import ImagePreview from './components/ImagePreview';
import PermissionRequest from './components/PermissionRequest';
import AppInfo from './components/AppInfo';
import useCamera from './hooks/useCamera';
import usePhotoCapture from './hooks/usePhotoCapture';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localCapturedImage, setLocalCapturedImage] = useState<string | null>(null);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const appInfoRef = useRef<React.ReactNode>(null);
  
  // Set client state when component loads
  useEffect(() => {
    setIsClient(true);
    // Create the AppInfo component only once
    if (!appInfoRef.current) {
      appInfoRef.current = <AppInfo />;
    }
  }, []);
  
  // Initialize camera hook with debug handler
  const {
    hasPermission,
    isLoading,
    errorMessage,
    requestCameraPermission,
    stopCamera
  } = useCamera({
    onDebug: setDebugInfo,
  });
  
  // Initialize photo capture hook
  const {
    capturedImage,
    downloadPhoto,
    resetPhoto
  } = usePhotoCapture({
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

  // Toggle App Info visibility
  const toggleAppInfo = () => {
    setShowAppInfo(!showAppInfo);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mobile Camera</h1>
        
        <button 
          onClick={toggleAppInfo} 
          className={styles.infoButton}
        >
          {showAppInfo ? 'Hide Info' : 'Show App Info'}
        </button>
        
        {!isClient ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading camera interface...</p>
          </div>
        ) : !isCapturing && !localCapturedImage ? (
          <PermissionRequest
            isLoading={isLoading}
            hasPermission={hasPermission}
            errorMessage={errorMessage}
            debugInfo={debugInfo}
            onRequest={requestCameraPermission}
          />
        ) : isCapturing ? (
          <Camera 
            onPhotoCapture={handlePhotoCapture}
            onDebug={setDebugInfo}
          />
        ) : localCapturedImage ? (
          <ImagePreview
            imageUrl={localCapturedImage}
            onRetake={handleRetake}
            onDownload={downloadPhoto}
          />
        ) : null}
        
        {showAppInfo && appInfoRef.current}
      </div>
    </main>
  );
} 