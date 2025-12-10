import { NextRequest, NextResponse } from 'next/server';

// Simple authentication without bcrypt for Edge Runtime compatibility
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Nuria,2001!';

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin panel
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    // Get the credentials from the Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return unauthorizedResponse();
    }

    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = atob(base64Credentials); // decode base64
      const [username, password] = credentials.split(':');

      // Verify credentials (for this simple implementation, we'll use direct comparison)
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Allow the request to proceed
        return NextResponse.next();
      } else {
        return unauthorizedResponse();
      }
    } catch (error) {
      return unauthorizedResponse();
    }
  }

  // For non-admin routes, allow the request to proceed
  return NextResponse.next();
}

function unauthorizedResponse() {
  // Return a 401 Unauthorized response
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};