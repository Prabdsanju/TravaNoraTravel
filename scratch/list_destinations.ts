import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const destinations = await prisma.destination.findMany();
  console.log('--- ALL DESTINATIONS ---');
  destinations.forEach(d => {
    console.log(`[${d.name}]: ${d.description}`);
  });
}

main().finally(() => prisma.$disconnect());
