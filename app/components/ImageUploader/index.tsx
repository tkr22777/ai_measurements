import React, { useState, useRef } from 'react';
import { cn, styles } from '@/utils/styles';
import { log } from '@/utils/logger';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  userId: string;
  isUploading?: boolean;
  uploadError?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  userId,
  isUploading = false,
  uploadError = null,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      log.user.error(userId, 'file_validation_failed', new Error('Invalid file type'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('type', 'manual');

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      onImageUpload(result.imageUrl);
      log.user.action(userId, 'manual_upload_success', { filename: file.name });
    } catch (error) {
      log.user.error(userId, 'manual_upload_failed', error as Error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Upload an image</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop or click to select
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              styles.button.base,
              styles.button.primary,
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </button>
        </div>
      </div>

      {uploadError && <div className={cn(styles.status.error, 'mt-4')}>{uploadError}</div>}
    </div>
  );
};

export default ImageUploader;
