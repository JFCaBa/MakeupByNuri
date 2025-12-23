import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFalleraContent() {
  try {
    const updatedContent = await prisma.serviceContent.update({
      where: { title: 'Fallera' },
      data: {
        description: 'Maquillaje tradicional para la festividad de las Fallas, con colores vivos y detalles que realzan la belleza del traje (45 €) - ¡ACTUALIZADO!',
        updatedAt: new Date()
      }
    });
    console.log('Updated Fallera content:');
    console.log(JSON.stringify(updatedContent, null, 2));
  } catch (error) {
    console.error('Error updating Fallera content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFalleraContent();