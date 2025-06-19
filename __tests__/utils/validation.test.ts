import {
  UserId,
  PhotoType,
  ImageUrl,
  ValidationResult,
  UserRequest,
  validateUserId,
  validatePhotoType,
  validateImageUrl,
  validateUserRequest,
  validateImageFile,
} from '@/utils/validation';

describe('Validation Utilities', () => {
  describe('validateUserId', () => {
    it('should return valid result for valid user ID', () => {
      const result = validateUserId('user123');
      expect(result.isValid).toBe(true);
      expect(result.data).toBe('user123');
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for user ID with underscores', () => {
      const result = validateUserId('user_123');
      expect(result.isValid).toBe(true);
      expect(result.data).toBe('user_123');
    });

    it('should return valid result for user ID with hyphens', () => {
      const result = validateUserId('user-123');
      expect(result.isValid).toBe(true);
      expect(result.data).toBe('user-123');
    });

    it('should return error for empty string', () => {
      const result = validateUserId('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('User ID is required');
      expect(result.data).toBeUndefined();
    });

    it('should return error for null/undefined', () => {
      const result1 = validateUserId(null as any);
      const result2 = validateUserId(undefined as any);
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toBe('User ID is required');
      expect(result2.error).toBe('User ID is required');
    });

    it('should return error for user ID too short', () => {
      const result = validateUserId('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('User ID must be at least 2 characters');
    });

    it('should return error for invalid characters', () => {
      const result = validateUserId('user@domain.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'User ID can only contain letters, numbers, underscores, and hyphens'
      );
    });

    it('should return error for spaces', () => {
      const result = validateUserId('user 123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'User ID can only contain letters, numbers, underscores, and hyphens'
      );
    });
  });

  describe('validatePhotoType', () => {
    it('should return valid result for front', () => {
      const result = validatePhotoType('front');
      expect(result.isValid).toBe(true);
      expect(result.data).toBe('front');
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for side', () => {
      const result = validatePhotoType('side');
      expect(result.isValid).toBe(true);
      expect(result.data).toBe('side');
      expect(result.error).toBeUndefined();
    });

    it('should return error for invalid type', () => {
      const result = validatePhotoType('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Photo type must be either "front" or "side"');
      expect(result.data).toBeUndefined();
    });

    it('should return error for empty string', () => {
      const result = validatePhotoType('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Photo type is required');
    });

    it('should return error for null/undefined', () => {
      const result1 = validatePhotoType(null as any);
      const result2 = validatePhotoType(undefined as any);
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toBe('Photo type is required');
      expect(result2.error).toBe('Photo type is required');
    });
  });

  describe('validateImageUrl', () => {
    it('should return valid result for valid HTTPS URL', () => {
      const url = 'https://example.com/image.jpg';
      const result = validateImageUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(url);
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for valid HTTP URL', () => {
      const url = 'http://example.com/image.png';
      const result = validateImageUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(url);
    });

    it('should return valid result for blob URL', () => {
      const url = 'blob:https://example.com/12345';
      const result = validateImageUrl(url);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(url);
    });

    it('should return error for invalid URL', () => {
      const result = validateImageUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image URL format');
      expect(result.data).toBeUndefined();
    });

    it('should return error for empty string', () => {
      const result = validateImageUrl('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Image URL is required');
    });

    it('should return error for null/undefined', () => {
      const result1 = validateImageUrl(null as any);
      const result2 = validateImageUrl(undefined as any);
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toBe('Image URL is required');
      expect(result2.error).toBe('Image URL is required');
    });
  });

  describe('validateImageFile', () => {
    const createMockFile = (name: string, type: string, size: number): File => {
      const file = new File([''], name, { type });
      Object.defineProperty(file, 'size', { value: size });
      return file;
    };

    it('should return valid result for JPEG file', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 1024 * 1024); // 1MB
      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(file);
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for PNG file', () => {
      const file = createMockFile('test.png', 'image/png', 2 * 1024 * 1024); // 2MB
      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(file);
    });

    it('should return valid result for WebP file', () => {
      const file = createMockFile('test.webp', 'image/webp', 3 * 1024 * 1024); // 3MB
      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
      expect(result.data).toBe(file);
    });

    it('should return error for file too large', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 11 * 1024 * 1024); // 11MB
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size must be less than 10MB');
      expect(result.data).toBeUndefined();
    });

    it('should return error for invalid file type', () => {
      const file = createMockFile('test.gif', 'image/gif', 1024 * 1024);
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must be JPEG, PNG, or WebP format');
    });

    it('should return error for non-image file', () => {
      const file = createMockFile('test.txt', 'text/plain', 1024);
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must be an image');
    });

    it('should return error for null/undefined file', () => {
      const result1 = validateImageFile(null as any);
      const result2 = validateImageFile(undefined as any);
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result1.error).toBe('File is required');
      expect(result2.error).toBe('File is required');
    });
  });

  describe('validateUserRequest', () => {
    it('should return valid result for complete request', () => {
      const request: UserRequest = {
        userId: 'user123',
        photoType: 'front',
        imageUrl: 'https://example.com/image.jpg',
      };
      const result = validateUserRequest(request);
      expect(result.isValid).toBe(true);
      expect(result.data?.userId).toBe('user123');
      expect(result.data?.photoType).toBe('front');
      expect(result.data?.imageUrl).toBe('https://example.com/image.jpg');
      expect(result.error).toBeUndefined();
    });

    it('should return valid result for minimal request', () => {
      const request: UserRequest = {
        userId: 'user123',
      };
      const result = validateUserRequest(request);
      expect(result.isValid).toBe(true);
      expect(result.data?.userId).toBe('user123');
      expect(result.data?.photoType).toBeUndefined();
      expect(result.data?.imageUrl).toBeUndefined();
    });

    it('should return error for invalid user ID', () => {
      const request: UserRequest = {
        userId: '',
        photoType: 'front',
      };
      const result = validateUserRequest(request);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('User ID is required');
      expect(result.data).toBeUndefined();
    });

    it('should return error for invalid photo type', () => {
      const request: UserRequest = {
        userId: 'user123',
        photoType: 'invalid',
      };
      const result = validateUserRequest(request);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Photo type must be either "front" or "side"');
    });

    it('should return error for invalid image URL', () => {
      const request: UserRequest = {
        userId: 'user123',
        photoType: 'front',
        imageUrl: 'not-a-url',
      };
      const result = validateUserRequest(request);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid image URL format');
    });
  });

  describe('Type Safety', () => {
    it('should create branded types correctly', () => {
      const userIdResult = validateUserId('user123');
      const photoTypeResult = validatePhotoType('front');
      const imageUrlResult = validateImageUrl('https://example.com/image.jpg');

      if (userIdResult.isValid && photoTypeResult.isValid && imageUrlResult.isValid) {
        // TypeScript should enforce branded types
        const userId: UserId = userIdResult.data!;
        const photoType: PhotoType = photoTypeResult.data!;
        const imageUrl: ImageUrl = imageUrlResult.data!;

        expect(typeof userId).toBe('string');
        expect(typeof photoType).toBe('string');
        expect(typeof imageUrl).toBe('string');
      }
    });
  });
});
