/**
 * Validation utilities with TypeScript branded types
 * Separates validation logic from business logic
 */

// Branded types for type safety
export type UserId = string & { readonly brand: unique symbol };
export type PhotoType = 'front' | 'side';
export type ImageUrl = string & { readonly brand: unique symbol };

// Validation result type
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

// User request validation
export interface UserRequest {
  userId: string;
  photoType?: string;
  imageUrl?: string;
}

/**
 * Validates user ID format and requirements
 */
export function validateUserId(userId: string): ValidationResult<UserId> {
  if (!userId || typeof userId !== 'string') {
    return { isValid: false, error: 'User ID is required' };
  }

  if (userId.trim().length < 2) {
    return { isValid: false, error: 'User ID must be at least 2 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
    return {
      isValid: false,
      error: 'User ID can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return { isValid: true, data: userId as UserId };
}

/**
 * Validates photo type
 */
export function validatePhotoType(photoType: string): ValidationResult<PhotoType> {
  if (!photoType) {
    return { isValid: false, error: 'Photo type is required' };
  }

  if (photoType !== 'front' && photoType !== 'side') {
    return { isValid: false, error: 'Photo type must be either "front" or "side"' };
  }

  return { isValid: true, data: photoType as PhotoType };
}

/**
 * Validates image URL format
 */
export function validateImageUrl(imageUrl: string): ValidationResult<ImageUrl> {
  if (!imageUrl) {
    return { isValid: false, error: 'Image URL is required' };
  }

  try {
    new URL(imageUrl);
    return { isValid: true, data: imageUrl as ImageUrl };
  } catch {
    return { isValid: false, error: 'Invalid image URL format' };
  }
}

/**
 * Validates complete user request object
 */
export function validateUserRequest(request: UserRequest): ValidationResult<{
  userId: UserId;
  photoType?: PhotoType;
  imageUrl?: ImageUrl;
}> {
  const userIdResult = validateUserId(request.userId);
  if (!userIdResult.isValid) {
    return { isValid: false, error: userIdResult.error };
  }

  let photoType: PhotoType | undefined;
  if (request.photoType) {
    const photoTypeResult = validatePhotoType(request.photoType);
    if (!photoTypeResult.isValid) {
      return { isValid: false, error: photoTypeResult.error };
    }
    photoType = photoTypeResult.data;
  }

  let imageUrl: ImageUrl | undefined;
  if (request.imageUrl) {
    const imageUrlResult = validateImageUrl(request.imageUrl);
    if (!imageUrlResult.isValid) {
      return { isValid: false, error: imageUrlResult.error };
    }
    imageUrl = imageUrlResult.data;
  }

  return {
    isValid: true,
    data: {
      userId: userIdResult.data!,
      photoType,
      imageUrl,
    },
  };
}

/**
 * Validates file for upload
 */
export function validateImageFile(file: File): ValidationResult<File> {
  if (!file) {
    return { isValid: false, error: 'File is required' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }

  // 10MB limit
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be JPEG, PNG, or WebP format' };
  }

  return { isValid: true, data: file };
}
