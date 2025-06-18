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
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
          No {title.toLowerCase()} available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 mb-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="relative">
        <img
          src={imageError ? placeholderImage : photoUrl}
          alt={title}
          className={`w-full h-auto rounded border ${
            imageError ? 'border-red-300 bg-gray-50' : 'border-gray-300'
          }`}
          onError={onImageError}
        />
        <div className="mt-2 text-sm break-all bg-gray-100 p-2 rounded">
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
