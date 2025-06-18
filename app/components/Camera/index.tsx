import React from 'react';
// Remove CSS module import
// import styles from './styles.module.css';
import CameraControls from './CameraControls';
import useCameraCapture from '../../hooks/useCameraCapture';
import { cn } from '@/utils/styles';

// The camera uses a dramatic filter with: contrast(140%) brightness(90%) saturate(130%)

interface CameraProps {
  onPhotoCapture: (imageUrl: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoCapture }) => {
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
  });

  return (
    <div className="w-full flex flex-col items-center mb-4 relative">
      <video
        ref={videoRef}
        className={cn(
          'w-full max-h-[70vh] object-cover rounded-lg bg-black',
          facingMode === 'user' && 'scale-x-[-1]',
          isCapturing ? 'block' : 'hidden'
        )}
        style={{ filter: filterCssValue }}
        autoPlay
        playsInline
        muted
      />

      {isCapturing && <CameraControls onCapture={handleCapturePhoto} onSwitch={switchCamera} />}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Camera;
