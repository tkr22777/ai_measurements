import { put, del, list } from '@vercel/blob';
import type { UserMetadata, CreateUserRequest, UpdateUserRequest } from '../types/user';
import logger from '../app/utils/logger';

// Generate a unique user ID
function generateUserId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `user_${timestamp}_${randomPart}`;
}

// Get blob path for user metadata
function getUserMetadataPath(userId: string): string {
  return `users/${userId}/metadata.json`;
}

// Check if email is registered (simple check without complex mapping)
export async function isEmailRegistered(email: string): Promise<boolean> {
  try {
    // List all user metadata files and check if any contain this email
    const { blobs } = await list({ prefix: 'users/', limit: 1000 });

    for (const blob of blobs) {
      if (blob.pathname.endsWith('/metadata.json')) {
        try {
          const response = await fetch(blob.url);
          if (response.ok) {
            const userData = await response.json();
            if (userData.email === email) {
              return true;
            }
          }
        } catch {
          // Skip this file if it can't be read
          continue;
        }
      }
    }

    return false;
  } catch (error) {
    logger.error({ email, error }, 'Error checking email registration');
    return false;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserMetadata | null> {
  try {
    const metadataPath = getUserMetadataPath(userId);

    const response = await fetch(`https://blob.vercel-storage.com/${metadataPath}`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData as UserMetadata;
  } catch (error) {
    logger.error({ userId, error }, 'Error fetching user by ID');
    return null;
  }
}

// Create new user
export async function createUser(userData: CreateUserRequest): Promise<UserMetadata> {
  try {
    const userId = generateUserId();
    const now = new Date().toISOString();

    const userMetadata: UserMetadata = {
      id: userId,
      email: userData.email,
      name: userData.name,
      image: userData.image,
      provider: userData.provider,
      createdAt: now,
      updatedAt: now,
      settings: {
        notifications: true,
        theme: 'system',
      },
    };

    // Store user metadata
    const metadataPath = getUserMetadataPath(userId);
    const metadataBlob = new Blob([JSON.stringify(userMetadata, null, 2)], {
      type: 'application/json',
    });

    await put(metadataPath, metadataBlob, {
      access: 'public',
    });

    logger.info(
      { userId, email: userData.email, provider: userData.provider },
      'User created successfully'
    );
    return userMetadata;
  } catch (error) {
    logger.error({ userData, error }, 'Error creating user');
    throw new Error('Failed to create user');
  }
}

// Update user
export async function updateUser(
  userId: string,
  updates: UpdateUserRequest
): Promise<UserMetadata> {
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser: UserMetadata = {
      ...existingUser,
      ...updates,
      updatedAt: new Date().toISOString(),
      settings: {
        ...existingUser.settings,
        ...updates.settings,
      },
    };

    const metadataPath = getUserMetadataPath(userId);
    const metadataBlob = new Blob([JSON.stringify(updatedUser, null, 2)], {
      type: 'application/json',
    });

    await put(metadataPath, metadataBlob, {
      access: 'public',
    });

    logger.info({ userId, fields: Object.keys(updates) }, 'User updated successfully');
    return updatedUser;
  } catch (error) {
    logger.error({ userId, updates, error }, 'Error updating user');
    throw new Error('Failed to update user');
  }
}

// Delete user (cleanup)
export async function deleteUser(userId: string): Promise<void> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete user metadata
    const metadataPath = getUserMetadataPath(userId);
    await del(metadataPath);

    logger.info({ userId, email: user.email }, 'User deleted successfully');
  } catch (error) {
    logger.error({ userId, error }, 'Error deleting user');
    throw new Error('Failed to delete user');
  }
}
