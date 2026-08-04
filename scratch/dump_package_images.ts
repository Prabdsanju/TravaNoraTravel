import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    where: { destinationId: 'dest-srilanka' },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      images: {
        select: {
          id: true,
          url: true
        }
      }
    }
  });
  console.log('--- SRI LANKA PACKAGES & IMAGES ---');
  console.log(JSON.stringify(packages, null, 2));
}

main().finally(() => prisma.$disconnect());
