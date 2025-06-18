/**
 * PhotoSpots component types
 */

export type PhotoType = 'front' | 'side';

export interface PhotoSpotsProps {
  onTakePhoto?: (type: PhotoType) => void;
}

export interface PhotoSpotProps {
  type: PhotoType;
  photoUrl: string | null;
  onPhotoClick: (type: PhotoType) => void;
}

export interface PhotoSpotState {
  frontPhoto: string | null;
  sidePhoto: string | null;
  isLoading: boolean;
}
