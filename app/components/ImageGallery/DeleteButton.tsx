import { cn, styles } from '@/utils/styles';
import type { DeleteButtonProps } from './types';

export default function DeleteButton({
  imageId,
  imageUrl,
  isDeleting,
  onDelete,
}: DeleteButtonProps) {
  return (
    <button
      onClick={() => onDelete(imageId, imageUrl)}
      disabled={isDeleting}
      className={cn(
        'absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full transition-opacity duration-200',
        'opacity-0 group-hover:opacity-100 hover:bg-red-600 disabled:opacity-50'
      )}
      title="Delete image"
    >
      {isDeleting ? (
        <div
          className={cn(styles.loading.spinner, 'w-4 h-4 border-white border-t-transparent')}
        ></div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
}
