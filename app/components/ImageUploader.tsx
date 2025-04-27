import { useState, useCallback, useRef } from 'react';
import { galleryEvents } from './ImageGallery';
import { useUser } from './UserContext';
import '../styles/ImageUploader.css';

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
      // Include the userId in the form data
      formData.append('userId', userId);

      // Send to the API
      const response = await fetch('/api/upload', {
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
      galleryEvents.triggerRefresh();

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
    <div className="uploader-container">
      <h2>Upload Image</h2>

      <div className="user-info-banner">
        <p>
          Uploading as: <span className="user-id">{userId}</span>
        </p>
      </div>

      <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button
              className="cancel-button"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <p>Drag & drop an image here, or click to select</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
          </div>
        )}
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      {uploadSuccess && <div className="success-message">Image uploaded successfully!</div>}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="upload-button"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}
