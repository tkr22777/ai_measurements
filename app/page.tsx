'use client';

import styles from './page.module.css';
import Camera from './components/Camera';
import ImagePreview from './components/ImagePreview';
import PermissionRequest from './components/PermissionRequest';
import AppInfo from './components/AppInfo';
import useCameraApp from './hooks/useCameraApp';

export default function Home() {
  const {
    isClient,
    isCapturing,
    localCapturedImage,
    hasPermission,
    isLoading,
    requestCameraPermission,
    handleRetake,
    handlePhotoCapture,
    uploadToServer,
  } = useCameraApp();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mobile Camera</h1>

        {!isClient ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading camera interface...</p>
          </div>
        ) : !isCapturing && !localCapturedImage ? (
          <PermissionRequest
            isLoading={isLoading}
            hasPermission={hasPermission}
            onRequest={requestCameraPermission}
          />
        ) : isCapturing ? (
          <Camera onPhotoCapture={handlePhotoCapture} />
        ) : localCapturedImage ? (
          <ImagePreview
            imageUrl={localCapturedImage}
            onRetake={handleRetake}
            onUpload={uploadToServer}
          />
        ) : null}

        <AppInfo />

        <div style={{ fontSize: '12px', color: '#666', marginTop: '20px', textAlign: 'center' }}>
          {isClient ? 'Client initialized' : 'Loading...'}
        </div>
      </div>
    </main>
  );
}
