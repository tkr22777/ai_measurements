import React from 'react';
import Image from 'next/image';
import '../../styles/ImageUploader.css'; // Import the styles for user-info-banner

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
  const handleUpload = async () => {
    try {
      await onUpload(photoType);
    } catch (error) {
      console.error('Error in handleUpload:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <img
        src={imageUrl}
        alt="Captured"
        className="w-full max-h-[70vh] object-contain rounded-lg mb-4 shadow-sm"
      />

      {/* User info banner */}
      {!uploadedImageUrl && (
        <div className="user-info-banner mb-4 w-full">
          <p>
            Uploading as: <span className="user-id">{userId}</span>
          </p>
        </div>
      )}

      {uploadedImageUrl ? (
        <div className="mt-2 w-full text-center">
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md p-3 mb-4">
            <p className="font-medium">Upload successful!</p>
            <a
              href={uploadedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline text-sm mt-1 inline-block"
            >
              View uploaded image
            </a>
          </div>
          <button
            className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
            onClick={onRetake}
          >
            Take New Photo
          </button>
        </div>
      ) : uploadError ? (
        <div className="mt-2 w-full text-center">
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md p-3 mb-4">
            <p className="font-medium">Upload failed</p>
            <p className="text-sm mt-1">{uploadError}</p>
          </div>
          <div className="flex justify-center gap-4 mt-2 w-full">
            <button
              className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
              onClick={onRetake}
            >
              Retake
            </button>
            <button
              className="bg-green-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-green-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
              onClick={handleUpload}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4 mt-2 w-full">
          <button
            className="bg-blue-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none hover:bg-blue-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none"
            onClick={onRetake}
          >
            Retake
          </button>
          <button
            className={`bg-green-600 text-white border-none rounded-md py-3 px-6 text-base font-medium cursor-pointer transition-all duration-200 m-2 outline-none ${
              !isUploading
                ? 'hover:bg-green-700 hover:translate-y-[-1px] hover:shadow-sm active:translate-y-0 active:shadow-none'
                : 'opacity-75 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
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
                Uploading...
              </span>
            ) : (
              'Upload to Server'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
