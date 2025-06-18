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

  // Handle taking a photo - simplified since user chooses type after capture
  const handleTakePhoto = () => {
    if (!userId) {
      alert('Please enter a User ID first');
      return;
    }
    setCurrentPhotoType('front'); // Default, but user can change in preview
    requestCameraPermission();
  };

  // Handle taking a photo for a specific type (still used by PhotoSpots)
  const handleTakePhotoType = (type: 'front' | 'side') => {
    if (!userId) {
      alert('Please enter a User ID first');
      return;
    }
    setCurrentPhotoType(type);
    requestCameraPermission();
  };

  // Create a wrapper for uploadToServer to fix type issues
  const handleUpload = async (photoType: string) => {
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
            {/* Simple Take Photo Button */}
            <div className="mb-6">
              <h2 className={cn(styles.text.heading, 'text-xl mb-4')}>Take New Photo</h2>
              <button
                onClick={handleTakePhoto}
                className={cn(
                  styles.button.base,
                  styles.button.primary,
                  'w-full py-4 text-lg font-medium'
                )}
              >
                📸 Take Photo
              </button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                You can choose whether it&apos;s a front or side photo after taking it
              </p>
            </div>

            {/* Photo Spots - Alternative way to take photos */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className={cn(styles.text.heading, 'text-xl mb-4')}>Or Browse Your Photos</h2>
              <PhotoSpots onTakePhoto={handleTakePhotoType} />
            </div>
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
            photoType={(currentPhotoType as 'front' | 'side') || 'front'}
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
