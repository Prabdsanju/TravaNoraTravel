import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const malaysia = await prisma.destination.findFirst({
    where: { name: { contains: 'Malaysia' } }
  });

  if (malaysia) {
    console.log('Found Malaysia:', malaysia.id);
    await prisma.destination.update({
      where: { id: malaysia.id },
      data: { 
        description: 'Experience the vibrant blend of modern skyscrapers and traditional heritage in Malaysia. From the iconic Petronas Towers in Kuala Lumpur to the pristine beaches of Langkawi, Malaysia offers a diverse cultural and natural escape.'
      }
    });
    console.log('Successfully updated Malaysia description.');
  } else {
    console.log('Malaysia destination not found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
