import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    select: {
      id: true,
      title: true,
      destinationId: true,
      destination: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  console.log('--- ALL PACKAGES ---');
  console.log(JSON.stringify(packages, null, 2));
}

main().finally(() => prisma.$disconnect());
