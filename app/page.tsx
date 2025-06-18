'use client';

import Camera from '@/components/Camera';
import ImagePreview from '@/components/ImagePreview';
import PermissionRequest from '@/components/PermissionRequest';
import AppInfo from '@/components/AppInfo';
import PhotoSpots from '@/components/PhotoSpots';
import UserInput from '@/components/UserInput';
import BodyMeasurement from '@/components/BodyMeasurement';
import SimpleImageDisplay from '@/components/SimpleImageDisplay';
import useCameraApp from '@/hooks/useCameraApp';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function Home() {
  const {
    isClient,
    isCapturing,
    localCapturedImage,
    hasPermission,
    isLoading,
    isUploading,
    uploadError,
    uploadedImageUrl,
    requestCameraPermission,
    handleRetake,
    handlePhotoCapture,
    uploadToServer,
    currentPhotoType,
    setCurrentPhotoType,
  } = useCameraApp();

  // Use the shared user context instead of component-specific state
  const { userId, setUserId } = useUser();

  console.log('Home component rendering with state:', {
    isClient,
    isCapturing,
    hasLocalImage: !!localCapturedImage,
    userId,
  });

  // Handle taking a photo for a specific type
  const handleTakePhoto = (type: 'front' | 'side') => {
    console.log(`handleTakePhoto called for type: ${type}`);

    if (!userId) {
      alert('Please enter a User ID first');
      return;
    }
    setCurrentPhotoType(type);
    requestCameraPermission();
  };

  // Create a wrapper for uploadToServer to fix type issues
  const handleUpload = async (photoType: string) => {
    console.log(`Handling upload for ${photoType}`);
    return uploadToServer(photoType);
  };

  return (
    <main
      className={cn(
        styles.layout.centerCol,
        'justify-start min-h-screen p-4 bg-gray-100 dark:bg-black'
      )}
    >
      <div
        className={cn(
          styles.card.base,
          styles.layout.centerCol,
          'w-full max-w-lg shadow-md p-6 my-4 overflow-hidden',
          'md:rounded-lg md:shadow-md md:p-6 sm:rounded-none sm:shadow-none sm:p-4 sm:m-0 sm:min-h-screen sm:justify-start'
        )}
      >
        <h1 className={cn(styles.text.heading, 'text-2xl mb-6 text-center sm:mt-2')}>
          Mobile Camera
        </h1>

        {/* User ID Input Form */}
        <UserInput />

        {/* Camera Interface - Conditionally shown */}
        {!isClient ? (
          <div
            className={cn(styles.layout.centerCol, 'text-center p-4 gap-4 w-full min-h-[200px]')}
          >
            <div className={cn(styles.loading.spinner, 'w-10 h-10 border-l-blue-600 mb-4')}></div>
            <p className={styles.text.body}>Loading camera interface...</p>
          </div>
        ) : !isCapturing && !localCapturedImage ? (
          <div className="w-full">
            <h2 className={cn(styles.text.heading, 'text-xl mb-4')}>Take New Photos</h2>
            <PhotoSpots onTakePhoto={handleTakePhoto} />
          </div>
        ) : isCapturing ? (
          <Camera onPhotoCapture={handlePhotoCapture} />
        ) : localCapturedImage ? (
          <ImagePreview
            imageUrl={localCapturedImage}
            onRetake={handleRetake}
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadedImageUrl={uploadedImageUrl}
            userId={userId}
            onUserChange={setUserId}
            photoType={currentPhotoType as 'front' | 'side'}
          />
        ) : null}

        {/* User's Photos - Always shown, now positioned after camera interface */}
        <div className="w-full p-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className={cn(styles.text.heading, 'text-xl mb-4')}>Your Photos</h2>
          <SimpleImageDisplay />
        </div>

        <BodyMeasurement />
        <AppInfo />

        <div className={cn(styles.text.small, 'mt-5 text-center')}>
          {isClient ? 'Client initialized' : 'Loading...'}
        </div>
      </div>
    </main>
  );
}
