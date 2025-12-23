import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const serviceContents = await prisma.serviceContent.findMany();
    console.log('Service contents in database:');
    console.log(JSON.stringify(serviceContents, null, 2));
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();