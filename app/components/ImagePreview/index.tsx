import React from 'react';
import styles from './styles.module.css';

interface ImagePreviewProps {
  imageUrl: string;
  onRetake: () => void;
  onUpload: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onRetake, onUpload }) => {
  return (
    <div className={styles.imagePreviewContainer}>
      <img src={imageUrl} alt="Captured" className={styles.imagePreview} />
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={onRetake}>
          Retake
        </button>
        <button className={`${styles.button} ${styles.primaryButton}`} onClick={onUpload}>
          Upload to Server
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
