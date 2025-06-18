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

      <main className="max-w-4xl mx-auto px-4 py-6">
        {title && (
          <div className="mb-6">
            <h1 className={cn(styles.text.heading, 'text-3xl font-bold mb-2')}>{title}</h1>
            {description && <p className={cn(styles.text.muted, 'text-lg')}>{description}</p>}
          </div>
        )}

        <div className={cn(styles.card.base, 'p-6 shadow-sm')}>{children}</div>
      </main>
    </div>
  );
}
