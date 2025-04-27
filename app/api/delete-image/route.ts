import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, pathname } = await request.json();

    if (!url || !pathname) {
      return NextResponse.json({ error: 'URL and pathname are required' }, { status: 400 });
    }

    console.log(`Deleting blob: ${pathname}`);

    // Delete the blob using Vercel Blob API
    await del(pathname);

    console.log(`Successfully deleted blob: ${pathname}`);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image from Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
