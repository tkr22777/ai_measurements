'use client';

import PageLayout from '@/components/Layout/PageLayout';
import BodyMeasurement from '@/components/BodyMeasurement';
import { useNavigation } from '@/components/Navigation';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function MeasurementsPage() {
  const { navigateTo } = useNavigation();
  const { userId } = useUser();

  return (
    <PageLayout title="Body Measurements" description="Process and view your measurements">
      <div className="space-y-6">
        {/* User ID Required Message */}
        {!userId && (
          <div className={cn(styles.status.warning, 'mb-4')}>
            <p>Please go to Settings to enter your User ID to process measurements.</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className={cn(styles.text.heading, 'text-lg font-semibold mb-2')}>
            📋 How to Get Measurements
          </h3>
          <ul className="space-y-2 text-sm">
            <li>• Take both front and side photos in the Gallery</li>
            <li>• Ensure photos show your full body clearly</li>
            <li>• Use good lighting and plain background</li>
            <li>• Click &quot;Process Measurements&quot; below when ready</li>
          </ul>
        </div>

        {/* Body Measurement Component */}
        <div>
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            📏 Measurement Processing
          </h3>
          <BodyMeasurement />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigateTo('/gallery')}
              className={cn(styles.button.base, styles.button.secondary, 'py-3 text-center')}
            >
              🖼️ View Photos
            </button>
            <button
              onClick={() => navigateTo('/camera')}
              className={cn(styles.button.base, styles.button.primary, 'py-3 text-center')}
            >
              📸 Take More Photos
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
