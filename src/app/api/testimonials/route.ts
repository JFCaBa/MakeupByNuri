import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch published testimonials only
export async function GET(request: NextRequest) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        text: true,
        rating: true,
        createdAt: true
        // email excluded from public response
      }
    });

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Submit new testimonial (unpublished by default)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.name || !body.text || !body.rating) {
      return NextResponse.json(
        { error: 'Email, nombre, texto y valoración son obligatorios' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'La valoración debe estar entre 1 y 5 estrellas' },
        { status: 400 }
      );
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validate text length (max 75 characters)
    const trimmedText = body.text.trim();
    if (trimmedText.length < 10) {
      return NextResponse.json(
        { error: 'La reseña debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (trimmedText.length > 75) {
      return NextResponse.json(
        { error: 'La reseña no puede exceder 75 caracteres' },
        { status: 400 }
      );
    }

    // Create testimonial (unpublished by default)
    const testimonial = await prisma.testimonial.create({
      data: {
        email: body.email.toLowerCase().trim(),
        name: body.name.trim(),
        text: trimmedText,
        rating: parseInt(body.rating),
        published: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reseña enviada correctamente. Será publicada una vez verificada.',
      testimonial: {
        id: testimonial.id
      }
    });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Error al enviar la reseña' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
