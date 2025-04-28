'use client';

import React, { useState } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onUpload: (photoType: string) => Promise<string | null>;
  isUploading: boolean;
  uploadError: string | null;
  uploadedImageUrl: string | null;
  userId: string;
  onUserChange: (userId: string) => void;
  photoType?: 'front' | 'side'; // Optional type prop
}

export default function ImagePreview({
  imageUrl,
  onRetake,
  onUpload,
  isUploading,
  uploadError,
  uploadedImageUrl,
  userId,
  onUserChange,
  photoType,
}: ImagePreviewProps) {
  console.log('ImagePreview rendering with photoType:', photoType);
  const [uploadType, setUploadType] = useState<'front' | 'side'>(photoType || 'front');

  const handleUpload = async () => {
    console.log('ImagePreview handleUpload called with type:', uploadType);
    try {
      await onUpload(uploadType);
    } catch (error) {
      console.error('Error in handleUpload:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 w-full">
        <img
          src={imageUrl}
          alt="Captured"
          className="w-full h-auto max-h-96 object-contain rounded-lg"
        />
      </div>

      {/* Photo Type Selector */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Photo Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUploadType('front')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              uploadType === 'front'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Front View
          </button>
          <button
            type="button"
            onClick={() => setUploadType('side')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              uploadType === 'side'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Side View
          </button>
        </div>
      </div>

      {/* User ID Input */}
      <div className="w-full mb-4">
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          User ID
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => onUserChange(e.target.value)}
          placeholder="Enter User ID"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
          disabled={isUploading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={onRetake}
          disabled={isUploading}
          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retake
        </button>
        <button
          onClick={handleUpload}
          disabled={isUploading || !userId}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Uploading...
            </div>
          ) : (
            'Save Photo'
          )}
        </button>
      </div>

      {/* Status Messages */}
      {uploadError && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md text-sm w-full">
          {uploadError}
        </div>
      )}

      {uploadedImageUrl && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md text-sm w-full">
          Photo uploaded successfully!
        </div>
      )}
    </div>
  );
}
