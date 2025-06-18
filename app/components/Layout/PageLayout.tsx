'use client';

import { cn, styles } from '@/utils/styles';
import { NavBar } from '@/components/Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {title && (
          <div className="mb-4 md:mb-6">
            <h1 className={cn(styles.text.heading, 'text-2xl md:text-3xl font-bold mb-1 md:mb-2')}>
              {title}
            </h1>
            {description && (
              <p className={cn(styles.text.muted, 'text-sm md:text-lg')}>{description}</p>
            )}
          </div>
        )}

        <div className={cn(styles.card.base, 'p-4 md:p-6 shadow-sm')}>{children}</div>
      </main>
    </div>
  );
}
