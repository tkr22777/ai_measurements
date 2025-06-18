/**
 * Image utility functions for file handling and processing
 */

/**
 * Converts a data URL to a File object
 *
 * @param dataURL - The data URL string (e.g. from canvas.toDataURL)
 * @param filename - The filename to use
 * @returns File object that can be used in FormData
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  // Convert to byte array
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Create File object
  return new File([u8arr], filename, { type: mime });
}

/**
 * Generates a unique filename for uploads
 */
export function generateFilename(): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = Math.random().toString(36).substring(2, 10);
  return `image-${timestamp}-${random}.jpg`;
}
