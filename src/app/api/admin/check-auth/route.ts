import { NextRequest } from 'next/server';
import { verifyCredentials } from '@/lib/utils/auth-server';

export async function GET(request: NextRequest) {
  // Get the credentials from the Authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials); // decode base64
    const [username, password] = credentials.split(':');

    // Verify credentials
    if (await verifyCredentials(username, password)) {
      // Return success response
      return new Response(JSON.stringify({ authenticated: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  } catch (error) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }
}