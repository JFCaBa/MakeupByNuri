import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateNoviaDetailedDescription() {
  try {
    const updatedContent = await prisma.serviceContent.update({
      where: { title: 'Novia' },
      data: {
        detailedDescription: 'TEST DETAILED DESCRIPTION - Updated Novia service information with all details',
        updatedAt: new Date()
      }
    });
    console.log('Updated Novia detailed description');
    console.log('Updated content:', JSON.stringify(updatedContent, null, 2));
  } catch (error) {
    console.error('Error updating Novia detailed description:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateNoviaDetailedDescription();