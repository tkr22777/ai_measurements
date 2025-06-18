import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { log } from '@/utils/logger';
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
        log.user.action(userId, 'photos_fetch_start', { types: ['front', 'side'] });

        // Fetch front photo
        const frontResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=front`
        );
        if (frontResponse.ok) {
          const frontData = await frontResponse.json();
          const frontUrl = frontData.success && frontData.imageUrl ? frontData.imageUrl : null;
          setFrontPhoto(frontUrl);
          log.user.action(userId, 'photo_loaded', { type: 'front', hasPhoto: !!frontUrl });
        } else {
          setFrontPhoto(null);
          log.user.action(userId, 'photo_not_found', { type: 'front' });
        }

        // Fetch side photo
        const sideResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=side`
        );
        if (sideResponse.ok) {
          const sideData = await sideResponse.json();
          const sideUrl = sideData.success && sideData.imageUrl ? sideData.imageUrl : null;
          setSidePhoto(sideUrl);
          log.user.action(userId, 'photo_loaded', { type: 'side', hasPhoto: !!sideUrl });
        } else {
          setSidePhoto(null);
          log.user.action(userId, 'photo_not_found', { type: 'side' });
        }
      } catch (error) {
        log.user.error(userId, 'photos_fetch_failed', error as Error);
        setFrontPhoto(null);
        setSidePhoto(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  const handlePhotoClick = (type: PhotoType) => {
    log.user.action(userId, 'photo_spot_clicked', { type });
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
