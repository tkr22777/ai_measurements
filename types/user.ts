export interface UserMetadata {
  id: string; // Generated user ID (e.g., "user_123abc")
  email: string;
  name: string;
  image?: string;
  provider: 'oauth' | 'credentials';
  createdAt: string;
  updatedAt: string;
  settings?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    [key: string]: any;
  };
}

export interface CreateUserRequest {
  email: string;
  name: string;
  image?: string;
  provider: 'oauth' | 'credentials';
}

export interface UpdateUserRequest {
  name?: string;
  image?: string;
  settings?: Record<string, any>;
}
