'use client';

import PhotoDisplay from './PhotoDisplay';
import useSimpleImageDisplay from './useSimpleImageDisplay';

const PLACEHOLDER_IMAGE = '/placeholder-image.svg';

export default function SimpleImageDisplay() {
  const {
    frontPhotoUrl,
    sidePhotoUrl,
    error,
    isLoading,
    frontImageError,
    sideImageError,
    handleFrontImageError,
    handleSideImageError,
  } = useSimpleImageDisplay();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
        <span>Loading photos...</span>
      </div>
    );
  }

  if (!frontPhotoUrl && !sidePhotoUrl && !error) {
    return (
      <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md">
        Please enter a user ID above and click Submit to view photos
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Simple Image Display</h2>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>}

      <div className="flex flex-wrap gap-6">
        <PhotoDisplay
          title="Front Photo"
          photoUrl={frontPhotoUrl}
          imageError={frontImageError}
          onImageError={handleFrontImageError}
          placeholderImage={PLACEHOLDER_IMAGE}
        />
        <PhotoDisplay
          title="Side Photo"
          photoUrl={sidePhotoUrl}
          imageError={sideImageError}
          onImageError={handleSideImageError}
          placeholderImage={PLACEHOLDER_IMAGE}
        />
      </div>
    </div>
  );
}
