import { NextRequest, NextResponse } from 'next/server';

// Public endpoint to get images by type (gallery, hero) and optionally by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'gallery';
    const category = searchParams.get('category'); // Optional category parameter

    // Sanitize category name for URL
    const sanitizeForUrl = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    };

    // Make an internal request to the admin API with credentials
    const adminUsername = 'admin';
    const adminPassword = 'Nuria,2001!';
    const credentials = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');

    // In standalone server, use direct path instead of origin-based URL
    const apiUrl = `/api/admin/images?type=${type}`;
    if (category) {
      // Use the sanitized category name for the API request
      const sanitizedCategory = sanitizeForUrl(category);
      apiUrl += `&category=${encodeURIComponent(sanitizedCategory)}`;
    }

    // For internal fetch in standalone Next.js, we should use the server instance directly
    // Using the same host as the incoming request
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const fullApiUrl = `${protocol}://${host}${apiUrl}`;

    const response = await fetch(fullApiUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ images: data.images || [] });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
