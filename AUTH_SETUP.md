# Authentication Setup Documentation

## Overview

This app uses NextAuth.js with a custom user management system built on Vercel Blob storage.

## User Storage Structure

User data is stored in Vercel Blob with the following structure:

- **User Metadata**: Stored at `users/{userId}/metadata.json`
- **User Images**: Stored at `users/{userId}/images/`

## Authentication Flow

1. **OAuth Sign-in**: Creates user automatically on first sign-in
2. **Credentials Sign-in**: Validates email exists in system
3. **Sign-up**: Creates new user with email/password

## File Structure

```
blob storage/
├── users/
│   ├── user_abc123_def456/
│   │   ├── metadata.json
│   │   └── images/
│   │       ├── front_photo.jpg
│   │       └── side_photo.jpg
│   └── user_xyz789_ghi012/
│       ├── metadata.json
│       └── images/
```

## User Management Functions

- `getUserById(userId)` - Fetch user by ID
- `createUser(userData)` - Create new user
- `updateUser(userId, updates)` - Update user data
- `isEmailRegistered(email)` - Check if email exists (for credentials auth)
- `deleteUser(userId)` - Remove user and data

## Environment Variables

- `NEXTAUTH_SECRET` - NextAuth session secret
- `NEXTAUTH_URL` - App URL for callbacks
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth (optional)
- `GITHUB_ID` / `GITHUB_SECRET` - OAuth (optional)

## API Routes

- `POST /api/users` - Create user
- `GET /api/users?id={userId}` - Get user by ID
- `/api/auth/[...nextauth]` - NextAuth handlers
