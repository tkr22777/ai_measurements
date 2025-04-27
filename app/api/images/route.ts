import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get userId from the query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';
    const showAllImages = searchParams.get('showAll') === 'true';

    console.log(`Fetching images for userId: ${userId || 'all users'}`);

    // If userId is empty or not provided, return an empty array unless showAll is true
    if (!userId && !showAllImages) {
      console.log('No userId provided and showAll is false, returning empty array');
      return NextResponse.json({ images: [] });
    }

    // Use userId as a prefix filter with the images/ prefix
    // If userId is empty and showAll is true, just use the images/ prefix to get all images
    const options = {
      prefix: userId ? `images/${userId}/` : showAllImages ? 'images/' : `images/${userId}/`,
    };

    // List blobs, filtering by userId
    const { blobs } = await list(options);

    console.log(`Found ${blobs.length} total blobs for userId: ${userId || 'all users'}`);

    // Transform the blobs data into a format that matches our ImageItem interface
    const images = blobs.map((blob, index) => ({
      id: String(index + 1),
      title: blob.pathname.split('/').pop() || 'Unnamed Image',
      url: blob.url,
      thumbnailUrl: blob.url,
      pathname: blob.pathname,
      uploadedAt: blob.uploadedAt,
      userId: blob.pathname.split('/')[1], // Extract userId from the pathname (now at index 1)
    }));

    // Sort by most recently uploaded first
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    console.log(`Returning ${images.length} formatted images`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images from Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
