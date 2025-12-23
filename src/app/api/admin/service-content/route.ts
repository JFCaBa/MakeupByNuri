import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAuth } from '@/lib/utils/auth-server';

const prisma = new PrismaClient();

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
    const serviceContents = await prisma.serviceContent.findMany({
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json({ serviceContents });
  } catch (error: any) {
    console.error('Error fetching service content:', error);
    return NextResponse.json({ error: 'Failed to fetch service content' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

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
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || body.description === undefined) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Check if service content already exists
    const existingContent = await prisma.serviceContent.findUnique({
      where: { title: body.title },
    });

    if (existingContent) {
      // Update existing content
      const updatedContent = await prisma.serviceContent.update({
        where: { title: body.title },
        data: {
          description: body.description,
          detailedDescription: body.detailedDescription || null,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Service content updated successfully',
        serviceContent: updatedContent 
      });
    } else {
      // Create new content
      const newContent = await prisma.serviceContent.create({
        data: {
          title: body.title,
          description: body.description,
          detailedDescription: body.detailedDescription || null,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Service content created successfully',
        serviceContent: newContent 
      });
    }
  } catch (error: any) {
    console.error('Error saving service content:', error);
    return NextResponse.json({ error: 'Failed to save service content' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
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
    const title = searchParams.get('title');

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await prisma.serviceContent.delete({
      where: { title },
    });

    return NextResponse.json({
      success: true,
      message: 'Service content deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting service content:', error);
    return NextResponse.json({ error: 'Failed to delete service content' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}