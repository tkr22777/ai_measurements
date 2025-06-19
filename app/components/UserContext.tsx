'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { UserMetadata } from '../../types/user';
import logger from '../utils/logger';

interface UserContextType {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  userImage: string | null;
  userMetadata: UserMetadata | null;
  loading: boolean;
}

// Create context with a default value
const UserContext = createContext<UserContextType>({
  userId: '',
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
          logger.error(
            { userId: session.user.id, status: response.status },
            'Failed to fetch user metadata'
          );
          setUserMetadata(null);
        }
      } catch (error) {
        logger.error({ userId: session.user.id, error }, 'Error fetching user metadata');
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

  return (
    <UserContext.Provider
      value={{
        userId,
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
