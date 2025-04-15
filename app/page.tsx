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
    debugInfo,
    isCapturing,
    localCapturedImage,
    hasPermission,
    isLoading,
    errorMessage,
    requestCameraPermission,
    handleRetake,
    handlePhotoCapture,
    downloadPhoto,
    setDebugInfo,
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
            errorMessage={errorMessage}
            debugInfo={debugInfo}
            onRequest={requestCameraPermission}
          />
        ) : isCapturing ? (
          <Camera onPhotoCapture={handlePhotoCapture} onDebug={setDebugInfo} />
        ) : localCapturedImage ? (
          <ImagePreview
            imageUrl={localCapturedImage}
            onRetake={handleRetake}
            onDownload={downloadPhoto}
          />
        ) : null}

        <AppInfo />
      </div>
    </main>
  );
}
