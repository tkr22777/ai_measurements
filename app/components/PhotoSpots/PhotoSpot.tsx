import { cn, styles } from '@/utils/styles';
import type { PhotoSpotProps } from './types';

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 mb-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function PhotoSpot({ type, photoUrl, onPhotoClick }: PhotoSpotProps) {
  const displayName = type === 'front' ? 'Front View' : 'Side View';

  return (
    <div className={cn(styles.layout.centerCol, 'flex-1')}>
      <div
        className={cn(
          'w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer transition-opacity',
          'hover:opacity-90'
        )}
        onClick={() => onPhotoClick(type)}
      >
        {photoUrl ? (
          <img
            key={photoUrl}
            src={photoUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(styles.layout.centerCol, 'h-full text-gray-500 dark:text-gray-400')}>
            <CameraIcon />
            <span className={styles.text.small}>{displayName}</span>
            <span className="text-xs mt-1">Tap to add photo</span>
          </div>
        )}
      </div>
      <span className={cn(styles.text.small, 'font-medium mt-2')}>{displayName}</span>
    </div>
  );
}
