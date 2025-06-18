import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '@/utils/eventBus';

interface ImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface UseImageGalleryProps {
  userId: string;
}

interface UseImageGalleryReturn {
  images: ImageItem[];
  isLoading: boolean;
  error: string | null;
  isDeletingId: string | null;
  deleteError: string | null;
  deleteImage: (imageId: string, imageUrl: string) => Promise<void>;
  refreshGallery: () => void;
}

export default function useImageGallery({ userId }: UseImageGalleryProps): UseImageGalleryReturn {
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

  // Listen to global events
  useEffect(() => {
    eventBus.on('gallery:refresh', refreshGallery);
    eventBus.on('image:uploaded', refreshGallery);

    return () => {
      eventBus.off('gallery:refresh', refreshGallery);
      eventBus.off('image:uploaded', refreshGallery);
    };
  }, [refreshGallery]);

  // Fetch images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true);
        console.log('Fetching images from API...');

        const endpoint = userId
          ? `/api/images?userId=${userId}`
          : `/api/images?userId=&showAll=false`;

        console.log(`Using API endpoint: ${endpoint}`);
        const response = await fetch(endpoint);

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
  }, [refreshTrigger, userId]);

  // Delete image function
  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      setIsDeletingId(imageId);
      setDeleteError(null);

      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          pathname: new URL(imageUrl).pathname,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Refresh the gallery to reflect the change
      refreshGallery();
    } catch (err) {
      console.error('Error deleting image:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    images,
    isLoading,
    error,
    isDeletingId,
    deleteError,
    deleteImage,
    refreshGallery,
  };
}
