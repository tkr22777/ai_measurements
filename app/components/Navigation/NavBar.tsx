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
            <h1 className={cn(styles.text.heading, 'text-lg font-semibold')}>
              📱 Body Measurement App
            </h1>
          </div>

          {/* Navigation Items */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className={cn(styles.button.base, 'p-2 rounded-md text-gray-600 dark:text-gray-300')}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={cn(
                  'px-3 py-2 rounded-md text-xs font-medium transition-colors',
                  currentPage === item.route
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
