export type PageRoute = '/' | '/camera' | '/gallery' | '/measurements' | '/settings';

export interface NavigationItem {
  route: PageRoute;
  label: string;
  icon: string;
  description: string;
}

export interface NavigationState {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  navigateTo: (page: PageRoute) => void;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    route: '/',
    label: 'Home',
    icon: '🏠',
    description: 'Dashboard overview',
  },
  {
    route: '/camera',
    label: 'Camera',
    icon: '📸',
    description: 'Take photos',
  },
  {
    route: '/gallery',
    label: 'Gallery',
    icon: '🖼️',
    description: 'View photos',
  },
  {
    route: '/measurements',
    label: 'Measurements',
    icon: '📏',
    description: 'Body measurements',
  },
  {
    route: '/settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'User settings',
  },
];
