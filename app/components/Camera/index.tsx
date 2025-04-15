import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import CameraControls from './CameraControls';
import useCamera from '../../hooks/useCamera';
import usePhotoCapture from '../../hooks/usePhotoCapture';

interface CameraProps {
  onPhotoCapture: (imageUrl: string) => void;
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture, onError, onDebug }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize camera hook
  const {
    videoRef,
    hasPermission,
    isLoading,
    errorMessage,
    facingMode,
    requestCameraPermission,
    switchCamera,
    stopCamera,
  } = useCamera({
    onError,
    onDebug,
  });

  // Initialize photo capture hook
  const { canvasRef, capturedImage, capturePhoto } = usePhotoCapture({
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

  return (
    <div className={styles.cameraContainer}>
      <video
        ref={videoRef}
        className={`${styles.videoPreview} ${facingMode === 'user' ? styles.mirror : ''} ${isCapturing ? styles.active : styles.hidden}`}
        autoPlay
        playsInline
        muted
      />

      {isCapturing && <CameraControls onCapture={handleCapturePhoto} onSwitch={switchCamera} />}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;
