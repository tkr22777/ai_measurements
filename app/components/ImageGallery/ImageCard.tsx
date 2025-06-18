import Image from 'next/image';
import DeleteButton from './DeleteButton';
import { cn, styles } from '@/utils/styles';
import type { ImageCardProps } from './types';

export default function ImageCard({ image, isDeleting, onDelete, formatTitle }: ImageCardProps) {
  return (
    <div
      className={cn(
        styles.card.base,
        styles.card.shadow,
        'relative group overflow-hidden transition-all duration-300'
      )}
    >
      <div className="relative h-36 w-full">
        <Image
          src={image.thumbnailUrl}
          alt={formatTitle(image.title)}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
          priority={parseInt(image.id) <= 3} // Priority load for first 3 images
          quality={80}
        />

        <DeleteButton
          imageId={image.id}
          imageUrl={image.url}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      </div>

      <div className={styles.card.padding}>
        <h3 className={cn(styles.text.heading, 'text-sm truncate')}>{formatTitle(image.title)}</h3>
      </div>
    </div>
  );
}
