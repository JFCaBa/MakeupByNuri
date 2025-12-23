import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFalleraContent() {
  try {
    const updatedContent = await prisma.serviceContent.update({
      where: { title: 'Fallera' },
      data: {
        description: 'TEST CHANGE - Maquillaje tradicional para la festividad de las Fallas (45 €)',
        updatedAt: new Date()
      }
    });
    console.log('Updated Fallera content to test value');
  } catch (error) {
    console.error('Error updating Fallera content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFalleraContent();