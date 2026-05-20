import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const malaysiaPackages = [
  {
    title: '05 Days Malaysia Tour Package',
    description: `Discover the best of Malaysia in 5 exciting days! Visit the iconic Petronas Twin Towers, explore the colorful Batu Caves, tour the King's Palace, and venture into the stunning Cameron Highlands. A perfect introduction to Malaysia's diverse culture and natural beauty.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, City Tours, Highlands Tour, Transfers`,
    price: 109900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '07 Days Langkawi Penang Tour',
    description: `Experience the best of Malaysia's island paradise with this 7-day Langkawi and Penang combo tour. Relax on Langkawi's pristine beaches, ride the iconic SkyBridge cable car, and explore Penang's rich heritage and world-famous street food scene. A perfect blend of relaxation and culture.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Tours, Cable Car, Heritage Walk, Ferry, Transfers`,
    price: 154900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '07 Days Penang Tour Package',
    description: `Immerse yourself in the cultural gem of Penang over 7 unforgettable days. Explore the UNESCO World Heritage Site of George Town, discover vibrant street art, savor award-winning street food, visit Kek Lok Si Temple, and enjoy the stunning Penang Hill views. The ultimate Penang experience.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Heritage Tours, Temple Visits, Penang Hill, Transfers`,
    price: 149900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Singapore Malaysia Tour',
    description: `Explore two incredible Southeast Asian countries in one amazing trip! Start in the ultra-modern city-state of Singapore with Marina Bay Sands, Gardens by the Bay, and Sentosa Island, then cross over to Malaysia for Kuala Lumpur's Petronas Towers, Batu Caves, and vibrant night markets.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, City Tours, Cross-border Transfer, Sightseeing, Transfers`,
    price: 169900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
];

async function main() {
  // Find or create Malaysia destination
  let malaysia = await prisma.destination.findFirst({
    where: { name: { contains: 'Malaysia' } },
  });

  if (!malaysia) {
    malaysia = await prisma.destination.create({
      data: {
        name: 'Malaysia',
        description: 'Discover your perfect Malaysia tour packages. King\'s Palace, Highlands Tour, Langkawi, Penang & more with our last-minute inclusive deals from Sri Lanka.',
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
      },
    });
    console.log('Created Malaysia destination:', malaysia.id);
  } else {
    console.log('Found existing Malaysia destination:', malaysia.id);
  }

  // Add all packages
  for (const pkg of malaysiaPackages) {
    const existing = await prisma.package.findFirst({
      where: { title: pkg.title, destinationId: malaysia.id },
    });

    if (existing) {
      console.log(`Skipping (already exists): ${pkg.title}`);
      continue;
    }

    await prisma.package.create({
      data: {
        ...pkg,
        destinationId: malaysia.id,
      },
    });
    console.log(`Added: ${pkg.title}`);
  }

  console.log('\nDone! All Malaysia packages have been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
