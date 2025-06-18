/**
 * SimpleImageDisplay component types
 */

export interface PhotoDisplayProps {
  title: string;
  photoUrl: string | null;
  imageError: boolean;
  onImageError: () => void;
  placeholderImage: string;
}

export interface SimpleImageDisplayState {
  frontPhotoUrl: string | null;
  sidePhotoUrl: string | null;
  error: string | null;
  isLoading: boolean;
  frontImageError: boolean;
  sideImageError: boolean;
}
