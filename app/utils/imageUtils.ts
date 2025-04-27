/**
 * Convert a data URL to a File object
 *
 * @param dataUrl - The data URL string (e.g. from canvas.toDataURL)
 * @param filename - The filename to use
 * @returns File object that can be used in FormData
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  // Extract content type and base64 data
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
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
 * Get a timestamp-based filename with extension
 *
 * @param extension - File extension (without the dot)
 * @returns Generated filename
 */
export function generateFilename(extension: string = 'jpg'): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = Math.random().toString(36).substring(2, 10);
  return `image-${timestamp}-${random}.${extension}`;
}
