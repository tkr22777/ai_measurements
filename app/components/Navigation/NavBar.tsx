'use client';

import { cn, styles } from '@/utils/styles';
import { useNavigation } from './NavProvider';
import { NAVIGATION_ITEMS } from './types';

export default function NavBar() {
  const { currentPage, navigateTo } = useNavigation();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* App Title */}
          <div className="flex items-center">
            <h1 className={cn(styles.text.heading, 'text-sm md:text-lg font-semibold')}>
              📱 Body Measurement App
            </h1>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  currentPage === item.route
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                title={item.description}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Indicator */}
          <div className="md:hidden">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {NAVIGATION_ITEMS.find((item) => item.route === currentPage)?.icon || '🏠'}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Always visible with better touch targets */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-5 gap-1">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={cn(
                  'px-2 py-3 rounded-md text-xs font-medium transition-colors text-center',
                  'min-h-[60px] flex flex-col items-center justify-center', // Better touch targets
                  currentPage === item.route
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                title={item.description}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-[10px] leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
