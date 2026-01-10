import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAuth } from '@/lib/utils/auth-server';

const prisma = new PrismaClient();

// GET: Fetch all testimonials (admin view)
export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { published: 'asc' },  // Unpublished first
        { createdAt: 'desc' }   // Then newest first
      ]
    });

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Toggle publish status
export async function POST(request: NextRequest) {
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

    if (!body.id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
    }

    // Toggle published status
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: body.id }
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: body.id },
      data: {
        published: !testimonial.published
      }
    });

    return NextResponse.json({
      success: true,
      message: updatedTestimonial.published ? 'Reseña publicada' : 'Reseña ocultada',
      testimonial: updatedTestimonial
    });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Error al actualizar la reseña' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete testimonial
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Reseña eliminada correctamente'
    });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Error al eliminar la reseña' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
