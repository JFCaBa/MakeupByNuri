import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if testimonials already exist
  const count = await prisma.testimonial.count();

  if (count === 0) {
    // Seed existing testimonials (shortened to fit 75 character limit)
    await prisma.testimonial.createMany({
      data: [
        {
          name: "María González",
          email: "maria@example.com",
          text: "Absolutamente maravillosa. Mi maquillaje de boda fue perfecto.",
          rating: 5,
          published: true
        },
        {
          name: "Ana Rodríguez",
          email: "ana@example.com",
          text: "Profesionalismo increíble. Me sentí hermosa en mi evento.",
          rating: 5,
          published: true
        },
        {
          name: "Carmen López",
          email: "carmen@example.com",
          text: "Experiencia demostrable y resultados excelentes. Muy recomendada.",
          rating: 5,
          published: true
        }
      ]
    });

    console.log('✅ Seeded 3 existing testimonials');
  } else {
    console.log('ℹ️ Testimonials already exist, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
