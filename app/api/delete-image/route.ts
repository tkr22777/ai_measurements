import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, pathname, userId } = await request.json();

    if (!url || !pathname) {
      return NextResponse.json({ error: 'URL and pathname are required' }, { status: 400 });
    }

    // Extract the user ID from the pathname for verification
    // The path is now images/userId/filename
    const pathParts = pathname.split('/');
    const pathUserId = pathParts.length > 1 ? pathParts[1] : null;

    // If the userId from the request doesn't match the pathname's userId, reject the request
    if (userId && pathUserId && userId !== pathUserId) {
      console.error(`User ${userId} attempted to delete image from user ${pathUserId}`);
      return NextResponse.json(
        {
          error: 'You can only delete your own images',
        },
        { status: 403 }
      );
    }

    console.log(`Deleting blob: ${pathname} for user: ${userId || 'unknown'}`);

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
