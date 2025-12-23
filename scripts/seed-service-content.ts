import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedServiceContent() {
  try {
    // Service contents to seed
    const serviceContents = [
      {
        title: 'Novia',
        description: 'El día más especial merece un maquillaje impecable, duradero y fotogénico. Incluye prueba previa (<150 €)',
        detailedDescription: 'Sobre este servicio\nNuestro servicio de maquillaje para novias está diseñado para uno de los días más importantes de tu vida. Creamos un look personalizado que refleje tu esencia, estilo y personalidad, cuidando cada detalle para que te sientas tú misma y radiante.\n\nEl servicio incluye una reunión previa para conocernos, escuchar tus ideas, resolver dudas y entender tus gustos, así como una prueba de maquillaje antes del día de la boda, donde definiremos juntas el look final para que el gran día todo sea perfecto y sin sorpresas.',
      },
      {
        title: 'Maquillaje de día',
        description: 'Look natural y luminoso ideal para eventos diurnos con acabados frescos y de larga duración (35 €)',
        detailedDescription: null,
      },
      {
        title: 'Maquillaje de noche',
        description: 'Maquillaje intenso y llamativo para eventos nocturnos con iluminación dramática y colores vibrantes (45 €)',
        detailedDescription: null,
      },
      {
        title: 'Invitadas',
        description: 'Maquillaje elegante y personalizado para destacar en cualquier evento especial como boda, comunión o fiesta (40 €)',
        detailedDescription: null,
      },
      {
        title: 'Fallera',
        description: 'Maquillaje tradicional para la festividad de las Fallas, con colores vivos y detalles que realzan la belleza del traje (45 €)',
        detailedDescription: null,
      },
      {
        title: 'Maquillaje artístico',
        description: 'Diseños creativos y personalizados para ocasiones únicas, incluyendo efectos especiales y caracterizaciones (45€ - 70€)',
        detailedDescription: null,
      },
    ];

    for (const content of serviceContents) {
      await prisma.serviceContent.upsert({
        where: { title: content.title },
        update: {
          description: content.description,
          detailedDescription: content.detailedDescription,
        },
        create: {
          title: content.title,
          description: content.description,
          detailedDescription: content.detailedDescription,
        },
      });
    }

    console.log('Service content seeded successfully!');
  } catch (error) {
    console.error('Error seeding service content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServiceContent();