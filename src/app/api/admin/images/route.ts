import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { checkAuth } from '@/lib/utils/auth-server';

// Ensure the images directory exists
const ensureDirExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

export async function POST(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const category = formData.get('category') as string | null;
    const type = formData.get('type') as string || 'gallery'; // gallery, hero

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File is not an image' }, { status: 400 });
    }

    // Sanitize category name for use as directory name
    const sanitizeForPath = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    };

    // If it's a gallery image and category is specified, use category as the subdirectory
    let uploadDir: string;
    if (type === 'gallery' && category) {
      const sanitizedCategory = sanitizeForPath(category);
      uploadDir = path.join(process.cwd(), 'public', 'images', type, sanitizedCategory);
    } else {
      uploadDir = path.join(process.cwd(), 'public', 'images', type);
    }

    await ensureDirExists(uploadDir);

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(imageFile.name) || '.jpg'; // Default to .jpg if no extension
    const fileName = `${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert blob to buffer and save to disk
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    // Ensure the imageUrl starts with a forward slash for proper Next.js public file serving
    const imageUrl = type === 'gallery' && category
      ? `/images/${type}/${sanitizeForPath(category)}/${fileName}`
      : `/images/${type}/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'gallery';
    const category = searchParams.get('category'); // Optional category parameter

    // Sanitize category name for use as directory name
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

      const imagePaths = imageFiles.map(fileName => ({
        name: fileName,
        url: type === 'gallery' && category ? `/images/${type}/${sanitizeForPath(category)}/${fileName}` : `/images/${type}/${fileName}`,
        size: 0, // Will need to get actual size if needed
        uploadDate: '', // Will need to get actual date if needed
      }));

      return NextResponse.json({ images: imagePaths });
    } catch (error) {
      // If directory doesn't exist, return empty array
      return NextResponse.json({ images: [] });
    }
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Verify authentication first
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const type = searchParams.get('type') || 'gallery';
    const category = searchParams.get('category'); // Optional category parameter

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    // Sanitize category name for use as directory name
    const sanitizeForPath = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    };

    let filePath: string;

    if (type === 'gallery' && category) {
      // If it's gallery type and category is specified, delete from the category folder
      const sanitizedCategory = sanitizeForPath(category);
      filePath = path.join(process.cwd(), 'public', 'images', type, sanitizedCategory, fileName);
    } else {
      // Otherwise delete from the general type directory
      filePath = path.join(process.cwd(), 'public', 'images', type, fileName);
    }

    // Verify the file exists before trying to delete
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete the file
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}