'use client';

import PageLayout from '@/components/Layout/PageLayout';
import Camera from '@/components/Camera';
import ImagePreview from '@/components/ImagePreview';
import useCameraApp from '@/hooks/useCameraApp';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function CameraPage() {
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

  // Create a wrapper for uploadToServer to fix type issues
  const handleUpload = async (photoType: string) => {
    return uploadToServer(photoType);
  };

  return (
    <PageLayout title="Camera" description="Take photos for body measurements">
      {/* User ID Required Message */}
      {!userId && (
        <div className={cn(styles.status.warning, 'mb-4')}>
          <p>Please go to Settings to enter your User ID before taking photos.</p>
        </div>
      )}

      {/* Camera Interface */}
      {!isClient ? (
        <div className={cn(styles.layout.centerCol, 'text-center p-4 gap-4 w-full min-h-[200px]')}>
          <div className={cn(styles.loading.spinner, 'w-10 h-10 border-l-blue-600 mb-4')}></div>
          <p className={styles.text.body}>Loading camera interface...</p>
        </div>
      ) : !isCapturing && !localCapturedImage ? (
        <div className="w-full">
          {/* Take Photo Button */}
          <div className="mb-6">
            <button
              onClick={handleTakePhoto}
              disabled={!userId}
              className={cn(
                styles.button.base,
                userId ? styles.button.primary : 'bg-gray-300 cursor-not-allowed',
                'w-full py-4 text-lg font-medium'
              )}
            >
              📸 Take Photo
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              You can choose whether it&apos;s a front or side photo after taking it
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className={cn(styles.text.heading, 'text-lg font-semibold mb-2')}>
              📋 How to Take Photos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Ensure good lighting for best results</li>
              <li>• Stand against a plain background</li>
              <li>• Keep the camera steady when capturing</li>
              <li>• You&apos;ll choose photo type (front/side) after capture</li>
            </ul>
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
    </PageLayout>
  );
}
