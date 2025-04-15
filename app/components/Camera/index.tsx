import React from 'react';
import styles from './styles.module.css';
import CameraControls from './CameraControls';
import useCameraCapture from '../../hooks/useCameraCapture';

interface CameraProps {
  onPhotoCapture: (imageUrl: string) => void;
  onError?: (message: string) => void;
  onDebug?: (message: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture, onError, onDebug }) => {
  const { isCapturing, videoRef, canvasRef, facingMode, switchCamera, handleCapturePhoto } =
    useCameraCapture({
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
