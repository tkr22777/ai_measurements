import React from 'react';
import styles from './styles.module.css';

interface PermissionRequestProps {
  isLoading: boolean;
  hasPermission: boolean | null;
  errorMessage: string | null;
  debugInfo: string | null;
  onRequest: () => void;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  isLoading,
  hasPermission,
  errorMessage,
  debugInfo,
  onRequest
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Accessing camera...</p>
        {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
        <button 
          className={styles.button}
          onClick={onRequest}
        >
          Retry Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className={styles.permissionRequest}>
        <p>This app needs access to your camera to take photos.</p>
        <button 
          className={styles.button}
          onClick={onRequest}
        >
          Allow Camera Access
        </button>
        {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className={styles.permissionDenied}>
        <p>{errorMessage || 'Camera access was denied. Please grant permission to use this feature.'}</p>
        <button 
          className={styles.button} 
          onClick={onRequest}
        >
          Try Again
        </button>
        {debugInfo && <p className={styles.debugInfo}>{debugInfo}</p>}
      </div>
    );
  }

  return null;
};

export default PermissionRequest; 