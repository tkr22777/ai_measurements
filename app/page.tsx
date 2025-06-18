'use client';

import PageLayout from '@/components/Layout/PageLayout';
import { useNavigation, NAVIGATION_ITEMS } from '@/components/Navigation';
import { cn, styles } from '@/utils/styles';

export default function Home() {
  const { navigateTo } = useNavigation();

  const dashboardItems = NAVIGATION_ITEMS.filter((item) => item.route !== '/');

  return (
    <PageLayout title="Dashboard" description="Body measurement app overview">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardItems.map((item) => (
          <div
            key={item.route}
            className={cn(
              styles.card.base,
              'p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700'
            )}
            onClick={() => navigateTo(item.route)}
          >
            <div className={cn(styles.layout.centerCol, 'text-center')}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-2')}>
                {item.label}
              </h3>
              <p className={cn(styles.text.muted, 'text-sm')}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className={cn(styles.text.heading, 'text-lg font-semibold mb-2')}>
          🚀 Multi-Page Navigation
        </h3>
        <p className={cn(styles.text.body, 'text-sm')}>
          The app now supports both URL routing and internal navigation. Click on any section above
          or use the navigation bar to explore different pages.
        </p>
      </div>
    </PageLayout>
  );
}
