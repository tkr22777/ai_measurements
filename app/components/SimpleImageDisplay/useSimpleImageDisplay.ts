import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/components/UserContext';
import { log } from '@/utils/logger';
import { eventBus } from '@/utils/eventBus';
import type { SimpleImageDisplayState } from './types';

interface UseSimpleImageDisplayReturn extends SimpleImageDisplayState {
  handleFrontImageError: () => void;
  handleSideImageError: () => void;
}

export default function useSimpleImageDisplay(): UseSimpleImageDisplayReturn {
  const { userId } = useUser();
  const [frontPhotoUrl, setFrontPhotoUrl] = useState<string | null>(null);
  const [sidePhotoUrl, setSidePhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frontImageError, setFrontImageError] = useState(false);
  const [sideImageError, setSideImageError] = useState(false);

  // Function to fetch photo URLs
  const fetchPhotoUrls = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFrontImageError(false);
    setSideImageError(false);

    try {
      log.user.action(userId, 'simple_display_fetch_start', { types: ['front', 'side'] });

      // Fetch front photo
      const frontResponse = await fetch(
        `/api/images?userId=${encodeURIComponent(userId)}&type=front`
      );
      let frontUrl = null;

      if (frontResponse.ok) {
        const frontData = await frontResponse.json();
        if (frontData.success && frontData.imageUrl) {
          frontUrl = frontData.imageUrl;
        }
      }

      // Fetch side photo
      const sideResponse = await fetch(
        `/api/images?userId=${encodeURIComponent(userId)}&type=side`
      );
      let sideUrl = null;

      if (sideResponse.ok) {
        const sideData = await sideResponse.json();
        if (sideData.success && sideData.imageUrl) {
          sideUrl = sideData.imageUrl;
        }
      }

      setFrontPhotoUrl(frontUrl);
      setSidePhotoUrl(sideUrl);

      log.user.action(userId, 'simple_display_fetch_complete', {
        frontLoaded: !!frontUrl,
        sideLoaded: !!sideUrl,
      });

      if (!frontResponse.ok && !sideResponse.ok) {
        throw new Error(`Failed to fetch photos: ${frontResponse.status}, ${sideResponse.status}`);
      }
    } catch (err) {
      log.user.error(userId, 'simple_display_fetch_failed', err as Error);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch photos when userId changes
  useEffect(() => {
    fetchPhotoUrls();
  }, [fetchPhotoUrls]);

  // Listen for image upload events to refresh photos
  useEffect(() => {
    const handleImageUploaded = () => {
      log.user.action(userId, 'simple_display_refresh_triggered', { reason: 'image_uploaded' });
      fetchPhotoUrls();
    };

    eventBus.on('image:uploaded', handleImageUploaded);

    return () => {
      eventBus.off('image:uploaded', handleImageUploaded);
    };
  }, [userId, fetchPhotoUrls]);

  const handleFrontImageError = () => {
    setFrontImageError(true);
  };

  const handleSideImageError = () => {
    setSideImageError(true);
  };

  return {
    frontPhotoUrl,
    sidePhotoUrl,
    error,
    isLoading,
    frontImageError,
    sideImageError,
    handleFrontImageError,
    handleSideImageError,
  };
}
