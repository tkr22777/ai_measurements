import React, { useState } from 'react';
import Image from 'next/image';
import { cn, styles } from '@/utils/styles';

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onUpload: (photoType: string) => Promise<string | null>;
  isUploading?: boolean;
  uploadError?: string | null;
  uploadedImageUrl?: string | null;
  userId?: string;
  onUserChange?: (userId: string) => void;
  photoType?: 'front' | 'side';
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRetake,
  onUpload,
  isUploading = false,
  uploadError = null,
  uploadedImageUrl = null,
  userId = 'user1',
  onUserChange,
  photoType = 'front',
}) => {
  // Local state for selected photo type - user can change this
  const [selectedPhotoType, setSelectedPhotoType] = useState<'front' | 'side'>(photoType);

  const handleUpload = async () => {
    try {
      await onUpload(selectedPhotoType);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const buttonClasses = cn(styles.button.base, 'py-3 px-6 text-base m-2');

  return (
    <div className={cn(styles.layout.centerCol, 'w-full')}>
      <img
        src={imageUrl}
        alt="Captured"
        className="w-full max-h-[70vh] object-contain rounded-lg mb-4 shadow-sm"
      />

      {/* Photo type selector */}
      <div
        className={cn(
          'bg-blue-50 dark:bg-blue-900/20 rounded-md p-4 mb-4 w-full',
          'border border-blue-200 dark:border-blue-700'
        )}
      >
        <p className="text-blue-700 dark:text-blue-300 font-medium mb-3 text-center">
          📸 Select Photo Type
        </p>
        <p className="text-blue-600 dark:text-blue-400 text-sm mb-3 text-center">
          User: <span className="font-semibold">{userId}</span>
        </p>

        {/* Radio button selector */}
        <div className="flex justify-center gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="photoType"
              value="front"
              checked={selectedPhotoType === 'front'}
              onChange={(e) => setSelectedPhotoType(e.target.value as 'front' | 'side')}
              className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-blue-700 dark:text-blue-300 font-medium">🫅 Front View</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="photoType"
              value="side"
              checked={selectedPhotoType === 'side'}
              onChange={(e) => setSelectedPhotoType(e.target.value as 'front' | 'side')}
              className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-blue-700 dark:text-blue-300 font-medium">👤 Side View</span>
          </label>
        </div>
      </div>

      {uploadedImageUrl ? (
        <div className="mt-2 w-full text-center">
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md p-3 mb-4">
            <p className="font-medium">
              ✅ {selectedPhotoType === 'front' ? 'Front' : 'Side'} photo uploaded successfully!
            </p>
            <a
              href={uploadedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline text-sm mt-1 inline-block"
            >
              View uploaded image
            </a>
          </div>
          <button className={cn(buttonClasses, styles.button.primary)} onClick={onRetake}>
            Take New Photo
          </button>
        </div>
      ) : uploadError ? (
        <div className="mt-2 w-full text-center">
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md p-3 mb-4">
            <p className="font-medium">
              ❌ {selectedPhotoType === 'front' ? 'Front' : 'Side'} photo upload failed
            </p>
            <p className="text-sm mt-1">{uploadError}</p>
          </div>
          <div className="flex justify-center gap-4 mt-2 w-full">
            <button className={cn(buttonClasses, styles.button.primary)} onClick={onRetake}>
              Retake
            </button>
            <button
              className={cn(buttonClasses, 'bg-green-600 text-white hover:bg-green-700')}
              onClick={handleUpload}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4 mt-2 w-full">
          <button className={cn(buttonClasses, styles.button.primary)} onClick={onRetake}>
            Retake
          </button>
          <button
            className={cn(
              buttonClasses,
              'bg-green-600 text-white',
              !isUploading ? 'hover:bg-green-700' : 'opacity-75 cursor-not-allowed'
            )}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className={styles.layout.center}>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Uploading {selectedPhotoType === 'front' ? 'Front' : 'Side'} Photo...
              </span>
            ) : (
              `Upload as ${selectedPhotoType === 'front' ? 'Front' : 'Side'} Photo`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
