import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFalleraDetailedDescription() {
  try {
    const updatedContent = await prisma.serviceContent.update({
      where: { title: 'Fallera' },
      data: {
        detailedDescription: 'TEST DETAILED DESCRIPTION FOR FALLERA\nCustom detailed description for Fallera service\nWith multiple lines to test the \\n handling',
        updatedAt: new Date()
      }
    });
    console.log('Updated Fallera detailed description');
  } catch (error) {
    console.error('Error updating Fallera detailed description:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFalleraDetailedDescription();