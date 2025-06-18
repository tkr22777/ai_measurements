/**
 * ImageGallery component types
 */

export interface ImageItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface ImageGalleryProps {
  userId?: string;
  showHeader?: boolean;
  maxImages?: number;
}

export interface DeleteButtonProps {
  imageId: string;
  imageUrl: string;
  isDeleting: boolean;
  onDelete: (imageId: string, imageUrl: string) => Promise<void>;
}

export interface ImageCardProps {
  image: ImageItem;
  isDeleting: boolean;
  onDelete: (imageId: string, imageUrl: string) => Promise<void>;
  formatTitle: (title: string) => string;
}
