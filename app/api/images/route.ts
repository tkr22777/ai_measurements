import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get userId from the query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';

    console.log(`Fetching images for userId: ${userId}`);

    // If userId is provided, use it as a prefix filter with the images/ prefix
    const options = userId ? { prefix: `images/${userId}/` } : { prefix: 'images/' };

    // List blobs, filtering by userId if provided
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
