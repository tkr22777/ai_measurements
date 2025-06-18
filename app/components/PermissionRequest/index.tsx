import React from 'react';
import { cn, styles } from '@/utils/styles';

interface PermissionRequestProps {
  isLoading: boolean;
  hasPermission: boolean | null;
  onRequest: () => void;
}

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  isLoading,
  hasPermission,
  onRequest,
}) => {
  const containerClasses = cn(
    styles.layout.centerCol,
    'text-center p-4 gap-4 w-full min-h-[200px]'
  );
  const buttonClasses = cn(styles.button.base, styles.button.primary, 'py-3 px-6 text-base m-2');

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className={cn(styles.loading.spinner, 'w-10 h-10 mb-4')}></div>
        <p className={cn(styles.text.body, 'mb-4 leading-relaxed')}>Accessing camera...</p>
        <button className={buttonClasses} onClick={onRequest}>
          Retry Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className={containerClasses}>
        <p className={cn(styles.text.body, 'mb-4 leading-relaxed')}>
          This app needs access to your camera to take photos.
        </p>
        <button className={buttonClasses} onClick={onRequest}>
          Allow Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className={containerClasses}>
        <p className={cn(styles.text.body, 'mb-4 leading-relaxed')}>
          Camera access was denied. Please grant permission to use this feature.
        </p>
        <button className={buttonClasses} onClick={onRequest}>
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default PermissionRequest;
