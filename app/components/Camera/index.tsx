import React from 'react';
import styles from './styles.module.css';
import CameraControls from './CameraControls';
import useCameraCapture from '../../hooks/useCameraCapture';

// The camera uses a dramatic filter with: contrast(140%) brightness(90%) saturate(130%)

interface CameraProps {
  onPhotoCapture: (imageUrl: string) => void;
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture, onError, onDebug }) => {
  const {
    isCapturing,
    videoRef,
    canvasRef,
    facingMode,
    switchCamera,
    handleCapturePhoto,
    filterCssValue,
  } = useCameraCapture({
    onPhotoCapture,
    onError,
    onDebug,
  });

  return (
    <div className={styles.cameraContainer}>
      <video
        ref={videoRef}
        className={`${styles.videoPreview} ${facingMode === 'user' ? styles.mirror : ''} ${
          isCapturing ? styles.active : styles.hidden
        }`}
        style={{ filter: filterCssValue }}
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
