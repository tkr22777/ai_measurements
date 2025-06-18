/**
 * ImageGallery utility functions
 */

/**
 * Format title for display by removing path and extension
 */
export function formatImageTitle(title: string): string {
  if (!title) return 'Untitled';
  return title.replace(/^images\//, '').replace(/\.[^/.]+$/, '');
}
