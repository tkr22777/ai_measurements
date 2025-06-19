import { dataURLtoFile, generateFilename } from '@/utils/imageUtils';

describe('Image Utilities', () => {
  describe('dataURLtoFile', () => {
    it('should convert JPEG data URL to File object', () => {
      const dataURL =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      const filename = 'test.jpg';

      const file = dataURLtoFile(dataURL, filename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe('image/jpeg');
      expect(file.size).toBeGreaterThan(0);
    });

    it('should convert PNG data URL to File object', () => {
      const dataURL =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const filename = 'test.png';

      const file = dataURLtoFile(dataURL, filename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe('image/png');
      expect(file.size).toBeGreaterThan(0);
    });

    it('should handle data URL without explicit MIME type', () => {
      const dataURL =
        'data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const filename = 'test.jpg';

      const file = dataURLtoFile(dataURL, filename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe(''); // Empty string when MIME type is not specified
    });

    it('should handle different filename extensions', () => {
      const dataURL = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      const filename = 'image.webp';

      const file = dataURLtoFile(dataURL, filename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe('image/webp');
    });

    it('should create file with correct byte content', () => {
      // Simple 1x1 pixel PNG data URL
      const dataURL =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const filename = 'pixel.png';

      const file = dataURLtoFile(dataURL, filename);

      // The base64 string should decode to a specific byte length
      const expectedSize = atob(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
      ).length;
      expect(file.size).toBe(expectedSize);
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with image prefix', () => {
      const filename = generateFilename();

      expect(filename).toMatch(/^image-/);
    });

    it('should generate filename with timestamp', () => {
      const filename = generateFilename();

      // Should contain timestamp (ISO format with special chars removed)
      expect(filename).toMatch(/^image-\d{8}T\d{6}\d{3}Z-/);
    });

    it('should generate filename with random string', () => {
      const filename = generateFilename();

      // Should contain random string before .jpg extension
      expect(filename).toMatch(/-[a-z0-9]{8}\.jpg$/);
    });

    it('should generate different filenames on consecutive calls', () => {
      const filename1 = generateFilename();
      const filename2 = generateFilename();

      expect(filename1).not.toBe(filename2);
    });

    it('should always end with .jpg extension', () => {
      const filename = generateFilename();

      expect(filename).toMatch(/\.jpg$/);
    });

    it('should generate filename with expected format', () => {
      const filename = generateFilename();

      // Full format: image-{timestamp}-{random}.jpg
      expect(filename).toMatch(/^image-\d{8}T\d{6}\d{3}Z-[a-z0-9]{8}\.jpg$/);
    });

    it('should generate filenames with consistent length structure', () => {
      const filename1 = generateFilename();
      const filename2 = generateFilename();

      // Both should have same length structure (timestamp part is same length)
      const parts1 = filename1.split('-');
      const parts2 = filename2.split('-');

      expect(parts1).toHaveLength(3); // image, timestamp, random.jpg
      expect(parts2).toHaveLength(3);
      expect(parts1[1].length).toBe(parts2[1].length); // timestamp length should be same
    });
  });

  describe('Integration', () => {
    it('should work together for data URL to file conversion with unique filename', () => {
      const dataURL =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      const uniqueFilename = generateFilename();

      const file = dataURLtoFile(dataURL, uniqueFilename);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(uniqueFilename);
      expect(file.type).toBe('image/jpeg');
      expect(file.name).toMatch(/^image-\d{8}T\d{6}\d{3}Z-[a-z0-9]{8}\.jpg$/);
    });
  });
});
