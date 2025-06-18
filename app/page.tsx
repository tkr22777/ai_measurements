'use client';

import Camera from '@/components/Camera';
import ImagePreview from '@/components/ImagePreview';
import PermissionRequest from '@/components/PermissionRequest';
import AppInfo from '@/components/AppInfo';
import PhotoSpots from '@/components/PhotoSpots';
import UserIdInput from '@/components/UserIdInput';
import BodyMeasurement from '@/components/BodyMeasurement';
import SimpleImageDisplay from '@/components/SimpleImageDisplay';
import useCameraApp from '@/hooks/useCameraApp';
import { useUser } from '@/components/UserContext';

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
    <main className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-lg flex flex-col items-center bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-4 overflow-hidden md:rounded-lg md:shadow-md md:p-6 sm:rounded-none sm:shadow-none sm:p-4 sm:m-0 sm:min-h-screen sm:justify-start">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100 sm:mt-2">
          Mobile Camera
        </h1>

        {/* User ID Input Form */}
        <UserIdInput />

        {/* Camera Interface - Conditionally shown */}
        {!isClient ? (
          <div className="flex flex-col items-center justify-center text-center p-4 gap-4 w-full min-h-[200px]">
            <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 rounded-full border-l-blue-600 animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading camera interface...</p>
          </div>
        ) : !isCapturing && !localCapturedImage ? (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Take New Photos
            </h2>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Your Photos
          </h2>
          <SimpleImageDisplay />
        </div>

        <BodyMeasurement />
        <AppInfo />

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-5 text-center">
          {isClient ? 'Client initialized' : 'Loading...'}
        </div>
      </div>
    </main>
  );
}
