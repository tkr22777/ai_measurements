import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { log } from '@/utils/logger';

// GET handler to retrieve a specific image by user ID and type
export async function GET(request: Request) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    const url = new URL(request.url);
    userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type');

    log.api.request('GET', '/api/images', userId || undefined);

    // Validate parameters
    if (!userId) {
      log.api.error('GET', '/api/images', new Error('Missing userId parameter'));
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!type || (type !== 'front' && type !== 'side')) {
      log.api.error('GET', '/api/images', new Error(`Invalid type parameter: ${type}`));
      return NextResponse.json(
        { success: false, error: 'Valid photo type (front or side) is required' },
        { status: 400 }
      );
    }

    // Path pattern for listing to find the exact file
    const pathPattern = `images/${userId}/${type}`;
    log.image.process(userId, pathPattern, 'search');

    const { blobs } = await list({ prefix: pathPattern });

    if (blobs.length > 0) {
      const duration = Date.now() - startTime;
      log.api.response('GET', '/api/images', 200, duration);

      // Add cache-busting parameter to prevent browser caching issues
      const baseUrl = blobs[0].url;
      const separator = baseUrl.includes('?') ? '&' : '?';
      const cacheBuster = blobs[0].uploadedAt
        ? new Date(blobs[0].uploadedAt).getTime()
        : Date.now();
      const imageUrlWithCacheBuster = `${baseUrl}${separator}v=${cacheBuster}`;

      log.user.action(userId, 'image_retrieved', {
        type,
        blobUrl: blobs[0].url,
        cacheBustedUrl: imageUrlWithCacheBuster,
      });

      return NextResponse.json({
        success: true,
        imageUrl: imageUrlWithCacheBuster,
        uploadedAt: blobs[0].uploadedAt,
      });
    }

    // No image found
    const duration = Date.now() - startTime;
    log.api.response('GET', '/api/images', 404, duration);
    return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
  } catch (error) {
    const duration = Date.now() - startTime;
    log.api.error('GET', '/api/images', error as Error, userId || undefined);
    log.api.response('GET', '/api/images', 500, duration);

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve image' },
      { status: 500 }
    );
  }
}

// POST handler to upload images (both structured and general)
export async function POST(request: Request) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    // Parse multipart form data
    const formData = await request.formData();
    userId = formData.get('userId') as string;
    const type = formData.get('type') as string;
    const file = formData.get('file') as File;

    log.api.request('POST', '/api/images', userId || undefined);

    // Validate parameters
    if (!userId) {
      log.api.error('POST', '/api/images', new Error('Missing userId parameter'));
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!type) {
      log.api.error('POST', '/api/images', new Error('Missing type parameter'));
      return NextResponse.json({ success: false, error: 'Type is required' }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      log.api.error('POST', '/api/images', new Error('Missing or invalid file'));
      return NextResponse.json(
        { success: false, error: 'Valid image file is required' },
        { status: 400 }
      );
    }

    // Determine file extension from mime type or fallback to jpg
    let fileExtension = 'jpg';
    if (file.type) {
      const mimeMatch = file.type.match(/image\/(jpeg|jpg|png|webp)/i);
      if (mimeMatch) {
        fileExtension = mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1];
      }
    }

    let blobPath: string;

    // Handle structured uploads (front/side) vs general uploads
    if (type === 'front' || type === 'side') {
      // Structured naming for camera app
      blobPath = `images/${userId}/${type}.${fileExtension}`;
    } else {
      // General uploads with timestamp for uniqueness
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const random = Math.random().toString(36).substring(2, 10);
      blobPath = `images/${userId}/${timestamp}-${random}-${file.name}`;
    }

    log.image.upload(userId, file.name, file.size, file.type);

    // Upload to Vercel Blob Storage
    const result = await put(blobPath, file, {
      access: 'public', // Make it publicly accessible
      contentType: file.type || 'image/jpeg',
      addRandomSuffix: false, // Ensure we replace the file with the same name
      allowOverwrite: true, // Allow overwriting existing files with the same name
    });

    const duration = Date.now() - startTime;
    log.api.response('POST', '/api/images', 200, duration);
    log.user.action(userId, 'image_uploaded', {
      type,
      filename: file.name,
      size: file.size,
      blobPath,
      resultUrl: result.url,
    });

    // Return the successful response
    return NextResponse.json({
      success: true,
      message: `${type} image uploaded successfully`,
      imageUrl: result.url,
      contentType: result.contentType,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    log.api.error('POST', '/api/images', error as Error, userId || undefined);
    log.api.response('POST', '/api/images', 500, duration);

    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}

// DELETE handler to delete an image
export async function DELETE(request: Request) {
  const startTime = Date.now();
  let userId: string | null = null;

  try {
    const { url, pathname, userId: requestUserId } = await request.json();
    userId = requestUserId;

    log.api.request('DELETE', '/api/images', userId || undefined);

    if (!url || !pathname) {
      log.api.error('DELETE', '/api/images', new Error('Missing URL or pathname'));
      return NextResponse.json(
        { success: false, error: 'URL and pathname are required' },
        { status: 400 }
      );
    }

    // Extract the user ID from the pathname for verification
    // The path is images/userId/filename
    const pathParts = pathname.split('/');
    const pathUserId = pathParts.length > 1 ? pathParts[1] : null;

    // If the userId from the request doesn't match the pathname's userId, reject the request
    if (userId && pathUserId && userId !== pathUserId) {
      log.api.error(
        'DELETE',
        '/api/images',
        new Error(`User ${userId} attempted to delete image from user ${pathUserId}`),
        userId
      );
      return NextResponse.json(
        { success: false, error: 'You can only delete your own images' },
        { status: 403 }
      );
    }

    log.image.process(userId || 'unknown', pathname, 'delete');

    // Delete the blob using Vercel Blob API
    await del(pathname);

    const duration = Date.now() - startTime;
    log.api.response('DELETE', '/api/images', 200, duration);
    if (userId) {
      log.user.action(userId, 'image_deleted', { pathname });
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    log.api.error('DELETE', '/api/images', error as Error, userId || undefined);
    log.api.response('DELETE', '/api/images', 500, duration);

    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
