import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/utils/auth-server';

// Predefined categories
const categories = [
  { id: 1, name: 'Maquillaje de día' },
  { id: 2, name: 'Maquillaje de noche' },
  { id: 3, name: 'Novia' },
  { id: 4, name: 'Invitadas' },
  { id: 5, name: 'Fallera' },
  { id: 6, name: 'Maquillaje artístico' },
];

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
    // Return predefined categories
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Disable POST, PUT, DELETE since categories are predefined
export async function POST() {
  return NextResponse.json({ error: 'Categories are predefined and cannot be added' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Categories are predefined and cannot be modified' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Categories are predefined and cannot be deleted' }, { status: 405 });
}