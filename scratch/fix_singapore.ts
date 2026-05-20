import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const singapore = await prisma.destination.findFirst({
    where: { name: { contains: 'Singapore' } }
  });

  if (singapore) {
    console.log('Found Singapore:', singapore.id);
    await prisma.destination.update({
      where: { id: singapore.id },
      data: { 
        description: 'Explore the futuristic skyline and lush green spaces of Singapore. A global hub of culture, cuisine, and innovation, Singapore offers everything from the world-renowned Gardens by the Bay to the vibrant streets of Little India and Chinatown.'
      }
    });
    console.log('Successfully updated Singapore description.');
  } else {
    console.log('Singapore destination not found.');
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
