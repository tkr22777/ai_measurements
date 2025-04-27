# Mobile Camera App

This is a mobile-friendly [Next.js](https://nextjs.org/) application that requests camera access and allows users to take photos using their device's camera.

## Features

- Request camera permission with clear error feedback
- Mobile-friendly responsive design with PWA support
- Live camera preview with fullscreen experience
- Capture high-quality photos
- Upload photos to Vercel Blob Storage
- Image gallery with thumbnail views
- Download captured photos directly to your device
- Loading indicators for better UX
- Responsive UI for all device sizes
- Dark mode support
- PWA support for home screen installation

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Variables

Copy the `.env.example` file to `.env.local` and add your Vercel Blob token:

```bash
cp .env.example .env.local
```

Then update the `.env.local` file with your Vercel Blob token:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

To obtain a Vercel Blob token:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage > Create a new Blob Store (or use an existing one)
3. Under the Blob Store settings, you can generate a token with read/write permissions

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. The app will automatically request camera access when loaded
2. Grant permission when prompted by your browser
3. Once the camera preview is visible, click the large red button to take a photo
4. Review the captured photo and choose to "Retake" or "Upload to Server"
5. If you choose "Upload to Server", the photo will be stored in Vercel Blob Storage
6. After successful upload, you'll see a confirmation with a link to view the uploaded image

## Mobile Installation

For the best experience on mobile devices:

1. Visit the app in your mobile browser
2. Add it to your home screen (iOS: share > Add to Home Screen, Android: menu > Add to Home Screen)
3. Launch from your home screen for a fullscreen camera experience

## Important Notes

- Camera access requires HTTPS in production. For local development, http://localhost is trusted.
- Not all browsers support the camera API, particularly some older mobile browsers.
- Users must explicitly grant camera permissions for the app to work.
- For iOS users, PWA camera access is supported in iOS 14.3 and later.
- For Vercel Blob Storage to work in development, you need a valid BLOB_READ_WRITE_TOKEN in your .env.local file.
- When deploying to Vercel, add the BLOB_READ_WRITE_TOKEN to your environment variables in the Vercel dashboard.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Vercel Blob Storage

This app uses [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for storing captured images. When deploying to Vercel:

1. Create a Blob Store in your Vercel dashboard
2. Add your BLOB_READ_WRITE_TOKEN to your project's environment variables
3. Vercel will automatically handle the integration between your app and Blob storage

In different environments (development, preview, production), your images will be stored in separate directories automatically.
