'use client';

import PageLayout from '@/components/Layout/PageLayout';
import { useNavigation, NAVIGATION_ITEMS } from '@/components/Navigation';
import { cn, styles } from '@/utils/styles';

export default function Home() {
  const { navigateTo } = useNavigation();

  const dashboardItems = NAVIGATION_ITEMS.filter((item) => item.route !== '/');

  return (
    <PageLayout title="Dashboard" description="Body measurement app overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {dashboardItems.map((item) => (
          <div
            key={item.route}
            className={cn(
              styles.card.base,
              'p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700',
              'min-h-[120px] md:min-h-[140px]' // Ensure good touch targets on mobile
            )}
            onClick={() => navigateTo(item.route)}
          >
            <div className={cn(styles.layout.centerCol, 'text-center h-full justify-center')}>
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">{item.icon}</div>
              <h3
                className={cn(styles.text.heading, 'text-lg md:text-xl font-semibold mb-1 md:mb-2')}
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

      <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className={cn(styles.text.heading, 'text-base md:text-lg font-semibold mb-2')}>
          🚀 Multi-Page Navigation
        </h3>
        <p className={cn(styles.text.body, 'text-xs md:text-sm leading-relaxed')}>
          The app now supports both URL routing and internal navigation. Click on any section above
          or use the navigation bar to explore different pages.
        </p>
      </div>
    </PageLayout>
  );
}
