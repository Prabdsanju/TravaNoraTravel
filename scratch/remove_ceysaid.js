const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany();
  let updateCount = 0;

  for (const pkg of packages) {
    let changed = false;
    let newTitle = pkg.title;
    let newDesc = pkg.description;

    if (newTitle.match(/ceysaid/i)) {
      newTitle = newTitle.replace(/ceysaid/gi, 'Travanora');
      changed = true;
    }
    if (newDesc.match(/ceysaid/i)) {
      newDesc = newDesc.replace(/ceysaid/gi, 'Travanora');
      changed = true;
    }

    if (changed) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: { title: newTitle, description: newDesc }
      });
      updateCount++;
    }
  }

  const destinations = await prisma.destination.findMany();
  for (const dest of destinations) {
    let changed = false;
    let newName = dest.name;
    let newDesc = dest.description || '';

    if (newName.match(/ceysaid/i)) {
      newName = newName.replace(/ceysaid/gi, 'Travanora');
      changed = true;
    }
    if (newDesc.match(/ceysaid/i)) {
      newDesc = newDesc.replace(/ceysaid/gi, 'Travanora');
      changed = true;
    }

    if (changed) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: { name: newName, description: newDesc }
      });
      updateCount++;
    }
  }

  console.log(`Successfully updated ${updateCount} records to remove "Ceysaid" references.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
