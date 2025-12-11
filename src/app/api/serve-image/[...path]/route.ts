import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Join the path segments to create the full image path
    const imagePath = params.path.join('/');
    const filePath = path.join(process.cwd(), 'public', 'images', imagePath);

    // Security: Ensure the resolved path is within the public/images directory
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(publicImagesDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
