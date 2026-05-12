import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    where: { 
      OR: [
        { description: { contains: 'adsadsd' } },
        { title: { contains: 'adsadsd' } }
      ]
    }
  });

  if (packages.length > 0) {
    console.log(`Found ${packages.length} packages with placeholder text.`);
    for (const pkg of packages) {
      console.log(`Updating package: ${pkg.title}`);
      await prisma.package.update({
        where: { id: pkg.id },
        data: { 
          description: pkg.description.replace(/adsadsd s/g, '').replace(/adsadsd/g, '')
        }
      });
    }
    console.log('Successfully cleaned up packages.');
  } else {
    console.log('No packages found with that placeholder text.');
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
