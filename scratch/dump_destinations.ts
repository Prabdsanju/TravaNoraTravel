import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const destinations = await prisma.destination.findMany({
    orderBy: { position: 'asc' }
  });
  console.log('--- ALL DESTINATIONS ---');
  console.log(JSON.stringify(destinations, null, 2));
}

main().finally(() => prisma.$disconnect());
