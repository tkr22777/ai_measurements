import React from 'react';
import styles from './styles.module.css';

interface CameraControlsProps {
  onCapture: () => void;
  onSwitch: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({ onCapture, onSwitch }) => {
  return (
    <div className={styles.controls}>
      <button 
        className={styles.switchButton}
        onClick={onSwitch}
        aria-label="Switch Camera"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 15l4-4-4-4M8 9l-4 4 4 4M12 3v18"/>
        </svg>
      </button>
      <button 
        className={styles.captureButton} 
        onClick={onCapture}
        aria-label="Take Photo"
      />
    </div>
  );
};

export default CameraControls; 