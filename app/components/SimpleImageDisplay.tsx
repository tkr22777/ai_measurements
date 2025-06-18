'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';

// Constants
const PLACEHOLDER_IMAGE = '/placeholder-image.svg';

export default function SimpleImageDisplay() {
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
            console.log('Front photo URL:', frontUrl);
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
            console.log('Side photo URL:', sideUrl);
          }
        }

        setFrontPhotoUrl(frontUrl);
        setSidePhotoUrl(sideUrl);

        // Only set error if both requests failed with error status
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
    console.error('Front image failed to load:', frontPhotoUrl);
    setFrontImageError(true);
  };

  const handleSideImageError = () => {
    console.error('Side image failed to load:', sidePhotoUrl);
    setSideImageError(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
        <span>Loading photos...</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-md">
        Please enter a user ID above and click Submit to view photos
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Simple Image Display</h2>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>}

      <div className="flex flex-wrap gap-6">
        <div className="w-full md:w-1/2 mb-4">
          <h3 className="text-lg font-medium mb-2">Front Photo</h3>
          {frontPhotoUrl ? (
            <div className="relative">
              <img
                src={frontImageError ? PLACEHOLDER_IMAGE : frontPhotoUrl}
                alt="Front view"
                className={`w-full h-auto rounded border ${frontImageError ? 'border-red-300 bg-gray-50' : 'border-gray-300'}`}
                onError={handleFrontImageError}
              />
              <div className="mt-2 text-sm break-all bg-gray-100 p-2 rounded">
                {frontImageError ? (
                  <span className="text-red-500">Failed to load image from URL:</span>
                ) : (
                  <span>URL:</span>
                )}
                <br />
                {frontPhotoUrl}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
              No front photo available
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 mb-4">
          <h3 className="text-lg font-medium mb-2">Side Photo</h3>
          {sidePhotoUrl ? (
            <div className="relative">
              <img
                src={sideImageError ? PLACEHOLDER_IMAGE : sidePhotoUrl}
                alt="Side view"
                className={`w-full h-auto rounded border ${sideImageError ? 'border-red-300 bg-gray-50' : 'border-gray-300'}`}
                onError={handleSideImageError}
              />
              <div className="mt-2 text-sm break-all bg-gray-100 p-2 rounded">
                {sideImageError ? (
                  <span className="text-red-500">Failed to load image from URL:</span>
                ) : (
                  <span>URL:</span>
                )}
                <br />
                {sidePhotoUrl}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
              No side photo available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
