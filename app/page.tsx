'use client';

import PageLayout from '@/components/Layout/PageLayout';
import { useNavigation, NAVIGATION_ITEMS } from '@/components/Navigation';
import { useUser } from '@/components/UserContext';
import { cn, styles } from '@/utils/styles';

export default function Home() {
  const { navigateTo } = useNavigation();
  const { userId } = useUser();

  const dashboardItems = NAVIGATION_ITEMS.filter((item) => item.route !== '/');

  return (
    <PageLayout title="Dashboard" description="Body measurement app overview">
      <div className="space-y-6">
        {/* User Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
          <h3 className={cn(styles.text.heading, 'text-lg font-semibold mb-2')}>
            👋 Welcome {userId ? `back, ${userId}` : 'to Body Measurement App'}
          </h3>
          {userId ? (
            <p className={cn(styles.text.body, 'text-sm')}>
              Your account is set up. You can now take photos and process measurements.
            </p>
          ) : (
            <p className={cn(styles.text.body, 'text-sm')}>
              Please go to Settings to enter your User ID to get started.
            </p>
          )}
        </div>

        {/* Navigation Cards */}
        <div>
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>🚀 App Sections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {dashboardItems.map((item) => (
              <div
                key={item.route}
                className={cn(
                  styles.card.base,
                  'p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700',
                  'min-h-[120px] md:min-h-[140px]'
                )}
                onClick={() => navigateTo(item.route)}
              >
                <div className={cn(styles.layout.centerCol, 'text-center h-full justify-center')}>
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">{item.icon}</div>
                  <h3
                    className={cn(
                      styles.text.heading,
                      'text-lg md:text-xl font-semibold mb-1 md:mb-2'
                    )}
                  >
                    {item.label}
                  </h3>
                  <p className={cn(styles.text.muted, 'text-xs md:text-sm leading-tight')}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            🎯 Quick Start Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">1️⃣</div>
              <h4 className={cn(styles.text.heading, 'font-semibold mb-1')}>Set User ID</h4>
              <p className={cn(styles.text.muted, 'text-sm')}>
                Go to Settings and enter your unique User ID
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">2️⃣</div>
              <h4 className={cn(styles.text.heading, 'font-semibold mb-1')}>Take Photos</h4>
              <p className={cn(styles.text.muted, 'text-sm')}>
                Use Camera to take front and side photos
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">3️⃣</div>
              <h4 className={cn(styles.text.heading, 'font-semibold mb-1')}>Get Measurements</h4>
              <p className={cn(styles.text.muted, 'text-sm')}>
                Process your photos to get body measurements
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
