'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { UserMetadata } from '../../types/user';

interface UserContextType {
  userId: string;
  setUserId: (id: string) => void;
  userEmail: string | null;
  userName: string | null;
  userImage: string | null;
  userMetadata: UserMetadata | null;
  loading: boolean;
}

// Function to sanitize user ID for API compatibility
// Converts email addresses to valid user IDs by replacing invalid characters
function sanitizeUserId(rawId: string): string {
  if (!rawId || rawId === 'anonymous') return rawId;

  // Replace @ and . with underscores, remove other invalid characters
  return rawId
    .toLowerCase()
    .replace(/@/g, '_at_')
    .replace(/\./g, '_dot_')
    .replace(/[^a-z0-9_-]/g, '_') // Replace any other invalid chars with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

// Create context with a default value
const UserContext = createContext<UserContextType>({
  userId: '',
  setUserId: () => {},
  userEmail: null,
  userName: null,
  userImage: null,
  userMetadata: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user metadata when session is available
  useEffect(() => {
    const fetchUserMetadata = async () => {
      if (status === 'loading') return;

      if (!session?.user?.id) {
        setUserMetadata(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?id=${session.user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setUserMetadata(userData);
        } else {
          console.error('Failed to fetch user metadata');
          setUserMetadata(null);
        }
      } catch (error) {
        console.error('Error fetching user metadata:', error);
        setUserMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetadata();
  }, [session?.user?.id, status]);

  // Use authenticated user's information
  const userId = userMetadata?.id || session?.user?.id || '';
  const userEmail = userMetadata?.email || session?.user?.email || null;
  const userName = userMetadata?.name || session?.user?.name || null;
  const userImage = userMetadata?.image || session?.user?.image || null;

  // setUserId is now a no-op since user ID comes from auth session
  const setUserId = () => {
    console.warn('setUserId is deprecated. User ID is now managed by authentication session.');
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        userEmail,
        userName,
        userImage,
        userMetadata,
        loading: loading || status === 'loading',
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  return context;
};
