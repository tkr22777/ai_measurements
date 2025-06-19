import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isEmailRegistered } from './userService';

export const authOptions: NextAuthOptions = {
  providers: [
    // Custom credentials provider for our user management
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if email is registered
        const emailExists = await isEmailRegistered(credentials.email);

        if (emailExists) {
          // For now, any password works if email is registered
          // In a real app, you'd validate the password hash
          return {
            id: 'temp-id', // This will be replaced in signIn callback
            email: credentials.email,
            name: 'User', // This will be replaced in signIn callback
          };
        }

        return null;
      },
    }),

    // OAuth providers (will be skipped if env vars not set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email) return false;

        // For OAuth providers, create/get user in our system
        if (account?.provider !== 'credentials') {
          const { createUser } = await import('./userService');

          // For OAuth, we'll create the user if they don't exist
          // Since we removed email lookup, we'll just create users on first OAuth sign-in
          try {
            const dbUser = await createUser({
              email: user.email,
              name: user.name || 'Unknown User',
              image: user.image || undefined,
              provider: 'oauth',
            });

            // Update the user object with our generated ID
            user.id = dbUser.id;
          } catch (error) {
            // If user creation fails (maybe already exists), just continue
            // In a real app, you'd handle this more gracefully
            console.error('Error creating OAuth user:', error);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Add user ID to session for easy access
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user ID in token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production',
};
