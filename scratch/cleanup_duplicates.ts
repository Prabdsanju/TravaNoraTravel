import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING CLEANUP OF DUPLICATE DESTINATIONS ---');

  // 1. Get all destinations
  const destinations = await prisma.destination.findMany();
  
  // Group by trimmed, lowercase name
  const groups: { [key: string]: typeof destinations } = {};
  for (const dest of destinations) {
    const key = dest.name.trim().toLowerCase();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(dest);
  }

  for (const [key, group] of Object.entries(groups)) {
    if (group.length > 1) {
      console.log(`\nFound duplicate group for: "${key}"`);
      
      // Determine canonical destination (prefer the one with hardcoded id like 'dest-*')
      let canonical = group.find(d => d.id.startsWith('dest-'));
      if (!canonical) {
        canonical = group[0]; // fallback to first
      }

      console.log(`Canonical destination: "${canonical.name}" (ID: ${canonical.id})`);

      // Find duplicates to remove
      const duplicates = group.filter(d => d.id !== canonical!.id);

      for (const dupe of duplicates) {
        console.log(`Duplicate to remove: "${dupe.name}" (ID: ${dupe.id})`);

        // Check if duplicate has a custom image or custom description we should copy
        const updates: any = {};
        if (dupe.imageUrl && (dupe.imageUrl.includes('/uploads/') || !canonical!.imageUrl)) {
          updates.imageUrl = dupe.imageUrl;
          console.log(`- Copying image: ${dupe.imageUrl} to canonical`);
        }
        if (dupe.description && dupe.description.length > 0) {
          updates.description = dupe.description;
          console.log(`- Copying description to canonical`);
        }

        // Apply updates to canonical
        if (Object.keys(updates).length > 0) {
          await prisma.destination.update({
            where: { id: canonical!.id },
            data: updates
          });
        }

        // Move any packages pointing to the duplicate
        const packagesToMove = await prisma.package.findMany({
          where: { destinationId: dupe.id }
        });

        if (packagesToMove.length > 0) {
          console.log(`- Moving ${packagesToMove.length} packages to canonical`);
          await prisma.package.updateMany({
            where: { destinationId: dupe.id },
            data: { destinationId: canonical!.id }
          });
        }

        // Delete duplicate destination
        await prisma.destination.delete({
          where: { id: dupe.id }
        });
        console.log(`- Deleted duplicate destination ${dupe.id}`);
      }
    }
  }

  console.log('\n--- CLEANUP COMPLETE ---');
}

main()
  .catch(err => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
