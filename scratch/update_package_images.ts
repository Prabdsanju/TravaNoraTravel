import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- ADDING GALLERY IMAGES TO SRI LANKA PACKAGES ---');

  // Package 1 Gallery Images (Wonders Tour)
  const pkg1Images = [
    'https://images.unsplash.com/photo-1578590494538-ea5f29d102e3?w=800', // Sigiriya Rock
    'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800', // Tea Gardens Ella
    'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800'  // Pinnawala Elephants
  ];

  // Package 2 Gallery Images (Heritage & Beach Tour)
  const pkg2Images = [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', // Sigiriya fortress
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800', // Nine Arch Bridge Ella
    'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800', // Galle Fort Lighthouse
    'https://images.unsplash.com/photo-1560935571-0814f964344c?w=800'  // Mirissa beach coconut tree hill
  ];

  // Clean existing images for these packages to prevent duplicates
  await prisma.packageImage.deleteMany({
    where: {
      packageId: { in: ['pkg-sl-1', 'pkg-sl-2'] }
    }
  });

  // Insert Package 1 images
  for (const url of pkg1Images) {
    await prisma.packageImage.create({
      data: {
        url,
        packageId: 'pkg-sl-1'
      }
    });
  }
  console.log('Added 3 gallery images for pkg-sl-1 (05 Days Sri Lanka Wonders Tour)');

  // Insert Package 2 images
  for (const url of pkg2Images) {
    await prisma.packageImage.create({
      data: {
        url,
        packageId: 'pkg-sl-2'
      }
    });
  }
  console.log('Added 4 gallery images for pkg-sl-2 (07 Days Sri Lanka Heritage & Beach Tour)');

  console.log('--- GALLERY IMAGES UPDATE COMPLETE ---');
}

main()
  .catch(err => {
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
