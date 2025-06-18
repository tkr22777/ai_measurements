'use client';

import PageLayout from '@/components/Layout/PageLayout';
import UserInput from '@/components/UserInput';
import AppInfo from '@/components/AppInfo';
import { cn, styles } from '@/utils/styles';

export default function SettingsPage() {
  return (
    <PageLayout title="Settings" description="User preferences and app information">
      <div className="space-y-6">
        {/* User Settings */}
        <div>
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            👤 User Settings
          </h3>
          <UserInput />
        </div>

        {/* App Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className={cn(styles.text.heading, 'text-xl font-semibold mb-4')}>
            ℹ️ App Information
          </h3>
          <AppInfo />
        </div>
      </div>
    </PageLayout>
  );
}
