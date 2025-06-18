'use client';

import PageLayout from '@/components/Layout/PageLayout';
import PhotoSpots from '@/components/PhotoSpots';
import SimpleImageDisplay from '@/components/SimpleImageDisplay';
import { useNavigation } from '@/components/Navigation';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function GalleryPage() {
  const { navigateTo } = useNavigation();
  const { userId } = useUser();

  // Handle taking a photo for a specific type (redirects to camera)
  const handleTakePhotoType = (type: 'front' | 'side') => {
    if (!userId) {
      alert('Please go to Settings to enter your User ID first');
      return;
    }
    // Navigate to camera page - we could pass the type as a query param in the future
    navigateTo('/camera');
  };

  return (
    <PageLayout title="Photo Gallery" description="View and manage your photos">
      <div className="space-y-6">
        {/* User ID Required Message */}
        {!userId && (
          <div className={cn(styles.status.warning, 'mb-4')}>
            <p>Please go to Settings to enter your User ID to view your photos.</p>
          </div>
        )}

        {/* Photo Spots - Interactive photo management */}
        <div>
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            📷 Your Photo Collection
          </h3>
          <PhotoSpots onTakePhoto={handleTakePhotoType} />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
            Click on any photo spot to take a new photo or view existing ones
          </p>
        </div>

        {/* Simple Image Display - Detailed view */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            🖼️ Detailed View
          </h3>
          <SimpleImageDisplay />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigateTo('/camera')}
              className={cn(styles.button.base, styles.button.primary, 'py-3 text-center')}
            >
              📸 Take New Photo
            </button>
            <button
              onClick={() => navigateTo('/measurements')}
              disabled={!userId}
              className={cn(
                styles.button.base,
                userId ? styles.button.secondary : 'bg-gray-300 cursor-not-allowed',
                'py-3 text-center'
              )}
            >
              📏 View Measurements
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
