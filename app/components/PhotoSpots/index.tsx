'use client';

import PhotoSpot from './PhotoSpot';
import usePhotoSpots from './usePhotoSpots';
import { cn, styles } from '@/utils/styles';
import type { PhotoSpotsProps } from './types';

export default function PhotoSpots({ onTakePhoto }: PhotoSpotsProps) {
  const { isLoading, frontPhoto, sidePhoto, handlePhotoClick } = usePhotoSpots(onTakePhoto);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full my-6">
        <h2 className={cn(styles.text.heading, 'text-lg mb-4')}>Body Photos</h2>
        <div className={cn(styles.layout.center, 'flex-col sm:flex-row gap-4')}>
          <div
            className={cn(
              styles.layout.center,
              'w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg'
            )}
          >
            <div className={cn(styles.loading.spinner, 'w-8 h-8 border-l-blue-600')}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      <h2 className={cn(styles.text.heading, 'text-lg mb-4')}>Body Photos</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <PhotoSpot type="front" photoUrl={frontPhoto} onPhotoClick={handlePhotoClick} />
        <PhotoSpot type="side" photoUrl={sidePhoto} onPhotoClick={handlePhotoClick} />
      </div>
    </div>
  );
}
