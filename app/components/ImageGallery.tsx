import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  pathname: string; // Added pathname for deletion
  uploadedAt?: string;
}

// Create a simple event system to refresh the gallery
export const galleryEvents = {
  onUpload: null as null | (() => void),
  triggerRefresh: () => {
    if (galleryEvents.onUpload) {
      galleryEvents.onUpload();
    }
  },
};

export default function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Function to refresh the gallery
  const refreshGallery = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Register the refresh function
  useEffect(() => {
    galleryEvents.onUpload = refreshGallery;
    return () => {
      galleryEvents.onUpload = null;
    };
  }, [refreshGallery]);

  // Fetch images from Vercel Blob
  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true);
        console.log('Fetching images from API...');
        const response = await fetch('/api/images');

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }

        const data = await response.json();
        console.log('API response:', data);
        console.log(`Received ${data.images?.length || 0} images from API`);

        setImages(data.images || []);
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Failed to load images');
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [refreshTrigger]);

  // Handle image deletion
  const handleDeleteImage = async (image: ImageItem) => {
    if (!confirm(`Are you sure you want to delete this image?`)) {
      return;
    }

    setIsDeletingId(image.id);
    setDeleteError(null);

    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: image.url,
          pathname: image.pathname,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      // Remove the image from the local state to avoid having to refresh
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));

      // Also trigger a refresh to ensure we're in sync with the server
      refreshGallery();
    } catch (err) {
      console.error('Error deleting image:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Format image title to be more readable
  const formatTitle = (title: string): string => {
    // Extract just the filename without path
    const filename = title.split('/').pop() || title;

    // Try to make the filename more readable by:
    // 1. Removing timestamps (which can be ISO date format or other formats)
    // 2. Removing random strings (which are typically alphanumeric)
    // 3. Cleaning up any resulting artifacts

    // Remove timestamp patterns and random strings
    const cleanedName = filename
      // Remove timestamp patterns (like 20250427T000748076Z)
      .replace(/\d{8}T\d{9}Z-[a-z0-9]{8}-/g, '')
      // Remove any remaining timestamps
      .replace(/\d{14}-[a-z0-9]{8}-/g, '')
      // Remove file extension
      .replace(/\.[^/.]+$/, '')
      // Replace dashes with spaces
      .replace(/-/g, ' ');

    return cleanedName || 'Uploaded Image';
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-100">
        {isLoading ? 'Loading Images...' : 'Image Gallery'}
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
          <p className="font-medium">Delete failed:</p>
          <p className="text-sm">{deleteError}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <div
              key={placeholder}
              className="relative h-36 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      ) : images.length > 0 ? (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image);
                  }}
                  disabled={isDeletingId === image.id}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 z-10"
                  aria-label="Delete image"
                >
                  {isDeletingId === image.id ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
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
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                <div className="p-2 w-full text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                  <h3 className="text-sm font-medium truncate">{formatTitle(image.title)}</h3>
                  {image.uploadedAt && (
                    <p className="text-xs opacity-75">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            No images found. Try capturing and uploading some photos!
          </p>
        </div>
      )}
    </div>
  );
}
