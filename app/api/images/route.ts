import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // List all blob images (don't filter by prefix)
    console.log('Fetching all blobs from Vercel Blob storage...');
    const { blobs } = await list();

    console.log(`Found ${blobs.length} total blobs in storage`);

    // Transform the blobs data into a format that matches our ImageItem interface
    const images = blobs.map((blob, index) => ({
      id: String(index + 1),
      title: blob.pathname.split('/').pop() || 'Unnamed Image',
      url: blob.url,
      thumbnailUrl: blob.url,
      pathname: blob.pathname,
      uploadedAt: blob.uploadedAt,
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
