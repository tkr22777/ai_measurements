import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`Processing upload for file: ${file.name}, size: ${file.size} bytes`);

    // Create a unique filename with timestamp and random string
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `${timestamp}-${random}-${file.name}`;

    console.log(`Generated filename: ${filename}`);

    // Upload to Vercel Blob
    console.log('Uploading to Vercel Blob...');
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log('Upload successful:', JSON.stringify(blob, null, 2));

    // Return success response with blob data
    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
