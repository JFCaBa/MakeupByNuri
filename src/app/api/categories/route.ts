import { NextRequest, NextResponse } from 'next/server';

// This is a public endpoint (no auth required) that reads from the admin categories
// We'll need to import the categories from the admin route
// For now, we'll create a shared data store

// Import the categories from admin (we'll need to export them from there)
export async function GET(request: NextRequest) {
  try {
    // Make an internal request to the admin API with credentials
    const adminUsername = 'admin';
    const adminPassword = 'Nuria,2001!';
    const credentials = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');

    // For internal fetch in standalone Next.js, use the server instance directly
    // Using the same host as the incoming request
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const fullApiUrl = `${protocol}://${host}/api/admin/categories`;

    const response = await fetch(fullApiUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ categories: [] }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ categories: data.categories || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: [] }, { status: 200 });
  }
}
