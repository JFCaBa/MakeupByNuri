import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Public endpoint to get images by type (gallery, hero) and optionally by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'gallery';
    const category = searchParams.get('category'); // Optional category parameter

    // Sanitize category name for path
    const sanitizeForPath = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    };

    let imagesDir: string;

    if (type === 'gallery' && category) {
      // If it's gallery type and category is specified, get images from the category folder
      const sanitizedCategory = sanitizeForPath(category);
      imagesDir = path.join(process.cwd(), 'public', 'images', type, sanitizedCategory);
    } else {
      // Otherwise get from the general type directory
      imagesDir = path.join(process.cwd(), 'public', 'images', type);
    }

    try {
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });

      // Get file stats and sort by modification time (newest first)
      const filesWithStats = await Promise.all(
        imageFiles.map(async (fileName) => {
          const filePath = path.join(imagesDir, fileName);
          const stats = await fs.stat(filePath);
          return {
            name: fileName,
            url: type === 'gallery' && category ? `/images/${type}/${sanitizeForPath(category)}/${fileName}` : `/images/${type}/${fileName}`,
            size: stats.size,
            uploadDate: stats.mtime.toISOString(),
            mtime: stats.mtime.getTime(),
          };
        })
      );

      // Sort by modification time, newest first
      const sortedImages = filesWithStats.sort((a, b) => b.mtime - a.mtime);

      // Remove mtime from response
      const imagePaths = sortedImages.map(({ mtime, ...rest }) => rest);

      return NextResponse.json({ images: imagePaths });
    } catch (error) {
      // If directory doesn't exist, return empty array
      return NextResponse.json({ images: [] });
    }
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
