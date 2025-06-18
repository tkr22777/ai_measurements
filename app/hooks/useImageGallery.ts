import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '@/utils/eventBus';
import { fetchUserImages, deleteImageFromServer } from '@/services/imageService';

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

  // Gallery refresh function
  const refreshGallery = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Event listeners setup
  useEffect(() => {
    eventBus.on('gallery:refresh', refreshGallery);
    eventBus.on('image:uploaded', refreshGallery);

    return () => {
      eventBus.off('gallery:refresh', refreshGallery);
      eventBus.off('image:uploaded', refreshGallery);
    };
  }, [refreshGallery]);

  // Fetch images effect - now much simpler
  useEffect(() => {
    async function loadImages() {
      setIsLoading(true);
      setError(null);

      const result = await fetchUserImages(userId);

      if (result.success) {
        setImages(result.data!);
      } else {
        setError(result.error!);
        setImages([]);
      }

      setIsLoading(false);
    }

    loadImages();
  }, [refreshTrigger, userId]);

  // Delete image function - now much simpler
  const deleteImage = useCallback(
    async (imageId: string, imageUrl: string) => {
      setIsDeletingId(imageId);
      setDeleteError(null);

      const result = await deleteImageFromServer(imageUrl, userId);

      if (result.success) {
        refreshGallery();
      } else {
        setDeleteError(result.error!);
      }

      setIsDeletingId(null);
    },
    [userId, refreshGallery]
  );

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
