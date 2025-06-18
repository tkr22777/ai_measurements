import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import type { PhotoSpotState, PhotoType } from './types';

interface UsePhotoSpotsReturn extends PhotoSpotState {
  handlePhotoClick: (type: PhotoType) => void;
}

export default function usePhotoSpots(
  onTakePhoto?: (type: PhotoType) => void
): UsePhotoSpotsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  const { userId } = useUser();

  // Load existing photos whenever userId changes
  useEffect(() => {
    if (!userId) {
      setFrontPhoto(null);
      setSidePhoto(null);
      setIsLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      setIsLoading(true);

      try {
        console.log(`Fetching photos for user: ${userId}`);

        // Fetch front photo
        const frontResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=front`
        );
        if (frontResponse.ok) {
          const frontData = await frontResponse.json();
          setFrontPhoto(frontData.success && frontData.imageUrl ? frontData.imageUrl : null);
        } else {
          setFrontPhoto(null);
        }

        // Fetch side photo
        const sideResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=side`
        );
        if (sideResponse.ok) {
          const sideData = await sideResponse.json();
          setSidePhoto(sideData.success && sideData.imageUrl ? sideData.imageUrl : null);
        } else {
          setSidePhoto(null);
        }
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  const handlePhotoClick = (type: PhotoType) => {
    if (onTakePhoto) {
      onTakePhoto(type);
    }
  };

  return {
    isLoading,
    frontPhoto,
    sidePhoto,
    handlePhotoClick,
  };
}
