import { useState, useCallback, useRef } from 'react';
import { eventBus } from '@/utils/eventBus';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the shared user context
  const { userId } = useUser();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Verify file is an image
      if (!file.type.match('image.*')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Reset states
      setUploadError(null);
      setUploadSuccess(false);
      setSelectedFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId);
      formData.append('type', 'general'); // Use 'general' type for generic uploads

      // Send to the consolidated API
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Handle success
      setSelectedFile(null);
      setPreview(null);
      setUploadSuccess(true);
      // Refresh the gallery to show new image
      eventBus.emit('image:uploaded');

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle file drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!file.type.match('image.*')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className={cn(styles.card.base, styles.card.padding, 'my-8 w-full shadow-sm')}>
      <h2 className={styles.text.heading}>Upload Images</h2>

      {/* Drag and drop area */}
      <div
        className={cn(
          'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white mb-6 transition-all duration-200',
          'hover:border-blue-400 hover:bg-blue-50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className={cn(styles.layout.centerCol, 'w-full')}>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-48 mb-4 rounded object-cover"
            />
            <p className={styles.text.muted}>Click to change or drag another image</p>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-lg mb-2">Click to select an image or drag and drop here</p>
            <p className={styles.text.small}>Supports JPEG, PNG, WebP</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload button */}
      {selectedFile && (
        <div className="mb-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={cn(
              styles.button.base,
              uploading ? 'bg-blue-400 cursor-not-allowed' : styles.button.primary
            )}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      )}

      {/* Status messages */}
      {uploadError && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 mb-4">{uploadError}</div>
      )}
      {uploadSuccess && (
        <div className="p-3 rounded-md bg-green-50 text-green-700 mb-4">
          Image uploaded successfully!
        </div>
      )}
    </div>
  );
}
