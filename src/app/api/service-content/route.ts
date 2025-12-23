import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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