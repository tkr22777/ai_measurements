import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

// GET handler to retrieve a specific image by user ID and type
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type');

    console.log(`[GET] /api/images - Requested image for userId: ${userId}, type: ${type}`);

    // Validate parameters
    if (!userId) {
      console.log('[GET] /api/images - Missing userId parameter');
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!type || (type !== 'front' && type !== 'side')) {
      console.log(`[GET] /api/images - Invalid type parameter: ${type}`);
      return NextResponse.json(
        { success: false, error: 'Valid photo type (front or side) is required' },
        { status: 400 }
      );
    }

    // Path pattern for listing to find the exact file
    const pathPattern = `images/${userId}/${type}`;
    console.log(`[GET] /api/images - Searching for blobs with prefix: ${pathPattern}`);

    const { blobs } = await list({ prefix: pathPattern });
    console.log(`[GET] /api/images - Found ${blobs.length} matching blobs`);

    if (blobs.length > 0) {
      console.log(`[GET] /api/images - Returning blob URL: ${blobs[0].url}`);
      return NextResponse.json({
        success: true,
        imageUrl: blobs[0].url,
        uploadedAt: blobs[0].uploadedAt,
      });
    }

    // No image found
    console.log(`[GET] /api/images - No image found for ${pathPattern}`);
    return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
  } catch (error) {
    console.error('[GET] /api/images - Error retrieving image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve image' },
      { status: 500 }
    );
  }
}

// POST handler to upload a new image by type
export async function POST(request: Request) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as string;
    const file = formData.get('file') as File;

    console.log(`[POST] /api/images - Uploading image for userId: ${userId}, type: ${type}`);
    console.log(
      `[POST] /api/images - File received: ${file?.name}, size: ${file?.size}, type: ${file?.type}`
    );

    // Validate parameters
    if (!userId) {
      console.log('[POST] /api/images - Missing userId parameter');
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!type || (type !== 'front' && type !== 'side')) {
      console.log(`[POST] /api/images - Invalid type parameter: ${type}`);
      return NextResponse.json(
        { success: false, error: 'Valid photo type (front or side) is required' },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      console.log('[POST] /api/images - Missing or invalid file');
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

    // Define the blob path with the appropriate extension
    const blobPath = `images/${userId}/${type}.${fileExtension}`;
    console.log(`[POST] /api/images - Uploading to blob path: ${blobPath}`);

    // Upload to Vercel Blob Storage
    const result = await put(blobPath, file, {
      access: 'public', // Make it publicly accessible
      contentType: file.type || 'image/jpeg',
      addRandomSuffix: false, // Ensure we replace the file with the same name
      allowOverwrite: true, // Allow overwriting existing files with the same name
    });

    console.log(`[POST] /api/images - Upload successful. URL: ${result.url}`);

    // Return the successful response
    return NextResponse.json({
      success: true,
      message: `${type} photo uploaded successfully`,
      imageUrl: result.url,
      contentType: result.contentType,
    });
  } catch (error) {
    console.error('[POST] /api/images - Error uploading image:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}
