const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const placeholder = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000';

async function main() {
  const packages = await prisma.package.findMany();
  let updateCount = 0;

  for (const pkg of packages) {
    let changed = false;
    let newImageUrl = pkg.imageUrl;

    if (newImageUrl && newImageUrl.match(/ceysaid/i)) {
      newImageUrl = placeholder;
      changed = true;
    }

    if (changed) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: { imageUrl: newImageUrl }
      });
      updateCount++;
    }
  }

  const destinations = await prisma.destination.findMany();
  for (const dest of destinations) {
    let changed = false;
    let newImageUrl = dest.imageUrl;

    if (newImageUrl && newImageUrl.match(/ceysaid/i)) {
      newImageUrl = placeholder;
      changed = true;
    }

    if (changed) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: { imageUrl: newImageUrl }
      });
      updateCount++;
    }
  }

  console.log(`Successfully updated ${updateCount} records to remove "Ceysaid" image URLs.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
