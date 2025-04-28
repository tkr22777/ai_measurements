'use client';

import { useState, useEffect } from 'react';
import { useUser } from './UserContext';

type PhotoType = 'front' | 'side';

interface PhotoSpotsProps {
  onTakePhoto?: (type: PhotoType) => void;
}

export default function PhotoSpots({ onTakePhoto }: PhotoSpotsProps) {
  console.log('PhotoSpots component rendering');

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

        // Attempt to fetch front photo
        const frontResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=front`
        );
        if (frontResponse.ok) {
          const frontData = await frontResponse.json();
          if (frontData.success && frontData.imageUrl) {
            console.log('Front photo URL:', frontData.imageUrl);
            setFrontPhoto(frontData.imageUrl);
          } else {
            setFrontPhoto(null);
          }
        } else {
          setFrontPhoto(null);
        }

        // Attempt to fetch side photo
        const sideResponse = await fetch(
          `/api/images?userId=${encodeURIComponent(userId)}&type=side`
        );
        if (sideResponse.ok) {
          const sideData = await sideResponse.json();
          if (sideData.success && sideData.imageUrl) {
            console.log('Side photo URL:', sideData.imageUrl);
            setSidePhoto(sideData.imageUrl);
          } else {
            setSidePhoto(null);
          }
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

  // Handle clicking on a photo spot
  const handlePhotoClick = (type: PhotoType) => {
    if (onTakePhoto) {
      onTakePhoto(type);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full my-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Body Photos</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 rounded-full border-l-blue-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Body Photos</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Front Photo Spot */}
        <div className="flex-1 flex flex-col items-center">
          <div
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handlePhotoClick('front')}
          >
            {frontPhoto ? (
              <img src={frontPhoto} alt="Front view" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">Front View</span>
                <span className="text-xs mt-1">Tap to add photo</span>
              </div>
            )}
          </div>
          <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">
            Front View
          </span>
        </div>

        {/* Side Photo Spot */}
        <div className="flex-1 flex flex-col items-center">
          <div
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handlePhotoClick('side')}
          >
            {sidePhoto ? (
              <img src={sidePhoto} alt="Side view" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">Side View</span>
                <span className="text-xs mt-1">Tap to add photo</span>
              </div>
            )}
          </div>
          <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">
            Side View
          </span>
        </div>
      </div>
    </div>
  );
}
