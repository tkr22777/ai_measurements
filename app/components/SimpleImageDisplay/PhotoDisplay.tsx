import { cn, styles } from '@/utils/styles';
import type { PhotoDisplayProps } from './types';

export default function PhotoDisplay({
  title,
  photoUrl,
  imageError,
  onImageError,
  placeholderImage,
}: PhotoDisplayProps) {
  if (!photoUrl) {
    return (
      <div className="w-full md:w-1/2 mb-4">
        <h3 className={cn(styles.text.heading, 'text-lg mb-2')}>{title}</h3>
        <div className={cn(styles.text.muted, 'bg-gray-100 p-8 rounded text-center')}>
          No {title.toLowerCase()} available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 mb-4">
      <h3 className={cn(styles.text.heading, 'text-lg mb-2')}>{title}</h3>
      <div className="relative">
        <img
          src={imageError ? placeholderImage : photoUrl}
          alt={title}
          className={cn(
            'w-full h-auto rounded border',
            imageError ? 'border-red-300 bg-gray-50' : 'border-gray-300'
          )}
          onError={onImageError}
        />
        <div className={cn(styles.text.small, 'mt-2 break-all bg-gray-100 p-2 rounded')}>
          {imageError ? (
            <span className="text-red-500">Failed to load image from URL:</span>
          ) : (
            <span>URL:</span>
          )}
          <br />
          {photoUrl}
        </div>
      </div>
    </div>
  );
}
