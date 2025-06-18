'use client';

import PhotoSpot from './PhotoSpot';
import usePhotoSpots from './usePhotoSpots';
import type { PhotoSpotsProps } from './types';

export default function PhotoSpots({ onTakePhoto }: PhotoSpotsProps) {
  console.log('PhotoSpots component rendering');

  const { isLoading, frontPhoto, sidePhoto, handlePhotoClick } = usePhotoSpots(onTakePhoto);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full my-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Body Photos</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 rounded-full border-l-blue-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Body Photos</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <PhotoSpot type="front" photoUrl={frontPhoto} onPhotoClick={handlePhotoClick} />
        <PhotoSpot type="side" photoUrl={sidePhoto} onPhotoClick={handlePhotoClick} />
      </div>
    </div>
  );
}
