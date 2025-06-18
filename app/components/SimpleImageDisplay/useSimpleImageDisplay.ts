import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
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

  useEffect(() => {
    async function fetchPhotoUrls() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setFrontImageError(false);
      setSideImageError(false);

      try {
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

        if (!frontResponse.ok && !sideResponse.ok) {
          throw new Error(
            `Failed to fetch photos: ${frontResponse.status}, ${sideResponse.status}`
          );
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotoUrls();
  }, [userId]);

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
