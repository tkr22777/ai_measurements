'use client';

import Image from 'next/image';
import { useUser } from '@/components/UserContext';
import useImageGallery from '@/hooks/useImageGallery';

export default function ImageGallery() {
  const { userId } = useUser();
  const { images, isLoading, error, isDeletingId, deleteError, deleteImage } = useImageGallery({
    userId,
  });

  // Format title for display
  const formatTitle = (title: string) => {
    if (!title) return 'Untitled';
    return title.replace(/^images\//, '').replace(/\.[^/.]+$/, '');
  };

  return (
    <div className="image-gallery-container">
      <div className="gallery-header">
        <h2>Image Gallery</h2>
      </div>

      {/* Display loading state */}
      {isLoading && <p className="loading-message">Loading images...</p>}

      {/* Display error message if there is an error */}
      {error && <p className="error-message">{error}</p>}

      {/* Display images in a grid layout */}
      {!isLoading && !error && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={image.thumbnailUrl}
                  alt={formatTitle(image.title)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  priority={parseInt(image.id) <= 3} // Priority load for first 3 images
                  quality={80}
                />

                {/* Delete button overlay */}
                <button
                  onClick={() => deleteImage(image.id, image.url)}
                  disabled={isDeletingId === image.id}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                  title="Delete image"
                >
                  {isDeletingId === image.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {formatTitle(image.title)}
                </h3>
              </div>
            </div>
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

      {/* Display delete error if present */}
      {deleteError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">Error deleting image: {deleteError}</p>
        </div>
      )}
    </div>
  );
}
