'use client';

import { useUser } from '@/components/UserContext';
import useImageGallery from '@/hooks/useImageGallery';
import ImageCard from './ImageCard';
import { formatImageTitle } from './utils';
import type { ImageGalleryProps } from './types';

export default function ImageGallery({ showHeader = true }: ImageGalleryProps = {}) {
  const { userId } = useUser();
  const { images, isLoading, error, isDeletingId, deleteError, deleteImage } = useImageGallery({
    userId,
  });

  return (
    <div className="image-gallery-container">
      {showHeader && (
        <div className="gallery-header">
          <h2>Image Gallery</h2>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <p className="loading-message">Loading images...</p>}

      {/* Error state */}
      {error && <p className="error-message">{error}</p>}

      {/* Images grid */}
      {!isLoading && !error && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isDeleting={isDeletingId === image.id}
              onDelete={deleteImage}
              formatTitle={formatImageTitle}
            />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {userId ? 'No images found for this user.' : 'Select a user to view images.'}
            </p>
          </div>
        )
      )}

      {/* Delete error */}
      {deleteError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">Error deleting image: {deleteError}</p>
        </div>
      )}
    </div>
  );
}
