'use client';

import Camera from './components/Camera';
import ImagePreview from './components/ImagePreview';
import PermissionRequest from './components/PermissionRequest';
import AppInfo from './components/AppInfo';
import ImageGallery from './components/ImageGallery';
import UserIdInput from './components/UserIdInput';
import BodyMeasurement from './components/BodyMeasurement';
import useCameraApp from './hooks/useCameraApp';
import { useUser } from './components/UserContext';

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
  } = useCameraApp();

  // Use the shared user context instead of component-specific state
  const { userId, setUserId } = useUser();

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-lg flex flex-col items-center bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-4 overflow-hidden md:rounded-lg md:shadow-md md:p-6 sm:rounded-none sm:shadow-none sm:p-4 sm:m-0 sm:min-h-screen sm:justify-start">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100 sm:mt-2">
          Mobile Camera
        </h1>

        {/* User ID Input Form */}
        <UserIdInput />

        {!isClient ? (
          <div className="flex flex-col items-center justify-center text-center p-4 gap-4 w-full min-h-[200px]">
            <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 rounded-full border-l-blue-600 animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading camera interface...</p>
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
            isUploading={isUploading}
            uploadError={uploadError}
            uploadedImageUrl={uploadedImageUrl}
            userId={userId}
            onUserChange={setUserId}
          />
        ) : null}

        <ImageGallery />
        <BodyMeasurement />
        <AppInfo />

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-5 text-center">
          {isClient ? 'Client initialized' : 'Loading...'}
        </div>
      </div>
    </main>
  );
}
