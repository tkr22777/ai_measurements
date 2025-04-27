import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
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
