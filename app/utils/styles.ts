/**
 * Simple utility for composing Tailwind classes
 * This is the only styling utility you need
 */

/**
 * Combines class names, filtering out falsy values
 * Usage: cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Common reusable class combinations
 * These replace the most repetitive long class strings
 */
export const styles = {
  // Buttons - replaces 90% of button styling
  button: {
    base: 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  },

  // Cards - replaces card patterns
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm hover:shadow-md transition-shadow',
    padding: 'p-4',
  },

  // Text - replaces common text patterns
  text: {
    heading: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    body: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    small: 'text-sm text-gray-500 dark:text-gray-400',
  },

  // Layout - replaces common flex patterns
  layout: {
    center: 'flex items-center justify-center',
    centerCol: 'flex flex-col items-center justify-center',
    between: 'flex items-center justify-between',
  },

  // Loading - replaces spinner patterns
  loading: {
    spinner: 'w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin',
    container: 'flex items-center justify-center p-4',
  },

  // Status messages - replaces alert/status patterns
  status: {
    success: 'p-3 rounded-md bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200',
    error: 'p-3 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200',
    warning: 'p-3 rounded-md bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
    info: 'p-3 rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
  },
};
