import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const singaporePackages = [
  {
    title: '03 Night Singapore Tour',
    description: `Experience the best of Singapore in this 3-night group tour! Visit the iconic Marina Bay Sands SkyPark, explore the breathtaking Gardens by the Bay with the famous Supertree Grove, enjoy Sentosa Island's Universal Studios, and take a cruise on the Singapore River.\n\nSeason: November - March\nDuration: 4 Days / 3 Nights\nTour Type: Group Tour\nIncludes: Hotel, Breakfast, City Tours, River Cruise, Transfers`,
    price: 129900,
    days: 4,
    nights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '03 Night Singapore with Night Safari',
    description: `Discover Singapore by day and night on this unforgettable 3-night adventure! Explore the iconic city sights including Gardens by the Bay, Sentosa Island, and Marina Bay Sands, then experience the world-famous Night Safari — the world's first nocturnal zoo, for a truly magical evening.\n\nSeason: October - March\nDuration: 4 Days / 3 Nights\nIncludes: Hotel, Breakfast, City Tours, Night Safari Entrance, Transfers`,
    price: 139900,
    days: 4,
    nights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '03 Nights Free and Easy in Singapore',
    description: `Enjoy the freedom of exploring Singapore at your own pace with this free and easy 3-night package! We take care of your flights, hotel, and transfers — you decide how to spend your days. Shop on Orchard Road, visit Chinatown, explore Little India, or relax on Sentosa's beaches.\n\nSeason: October - December\nDuration: 4 Days / 3 Nights\nIncludes: Hotel, Return Flights, Airport Transfers`,
    price: 119900,
    days: 4,
    nights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Bangkok Singapore Tour',
    description: `Combine the vibrant energy of Bangkok with the modern glamour of Singapore on this exciting 5-day two-country tour! Explore Bangkok's iconic temples including Wat Pho and the Grand Palace, then fly to Singapore for Marina Bay Sands, Gardens by the Bay, and Sentosa Island.\n\nSeason: November - March\nDuration: 5 Days\nTour Type: Two Countries\nIncludes: Hotel, Breakfast, Temple Tours, City Tours, Inter-city Flight, Transfers`,
    price: 179900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Pattaya Bangkok Tour Package',
    description: `Experience the ultimate Thailand getaway with this exciting 5-day Pattaya and Bangkok combo! Relax on Pattaya's golden beaches, visit Coral Island, enjoy thrilling water sports, then head to Bangkok to explore the Grand Palace, Wat Arun, and vibrant night markets.\n\nSeason: November - March\nDuration: 5 Days\nIncludes: Hotel, Breakfast, Beach Tour, Temple Tours, City Tours, Transfers`,
    price: 159900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Phuket Pattaya Bangkok Tour',
    description: `Explore the very best of Thailand with this epic 10-day journey across three stunning destinations! Begin in Phuket with its world-famous beaches and Phi Phi Islands, then experience Pattaya's vibrant beach scene, and conclude in Bangkok with its magnificent palaces and temples.\n\nSeason: November - March\nDuration: 10 Days\nIncludes: Hotel, Breakfast, Island Tours, Beach Excursions, Temple Tours, City Tours, Domestic Flights, Transfers`,
    price: 239900,
    days: 10,
    nights: 9,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Singapore 02 Night Stopover Tour',
    description: `Make the most of your Singapore stopover with this compact 2-night tour! Perfectly designed for transit travelers, this package covers the must-see highlights: Gardens by the Bay's Supertrees, Marina Bay Sands waterfront, Merlion Park, and a leisurely stroll through Chinatown.\n\nSeason: October - March\nDuration: 3 Days / 2 Nights\nIncludes: Hotel, Breakfast, Half-Day City Tour, Transfers`,
    price: 89900,
    days: 3,
    nights: 2,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Singapore Group Tour Package',
    description: `Join our popular group departure to Singapore and enjoy a fully guided, value-packed 5-day experience! Travel with like-minded adventurers and explore the Lion City's top attractions including Universal Studios Singapore, Gardens by the Bay, the Night Safari, Sentosa Island, and the spectacular Marina Bay waterfront.\n\nSeason: August, December\nDuration: 5 Days / 4 Nights\nTour Type: Group Tour\nIncludes: Hotel, Breakfast, All Entrance Fees, Expert Guide, Transfers`,
    price: 149900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Singapore Malaysia Tour',
    description: `Explore two incredible Southeast Asian countries in one amazing trip! Start in the ultra-modern city-state of Singapore with Marina Bay Sands, Gardens by the Bay, and Sentosa Island, then cross over to Malaysia for Kuala Lumpur's Petronas Towers, Batu Caves, and vibrant night markets.\n\nSeason: November - March\nDuration: 7 Days / 6 Nights\nTour Type: Two Countries\nIncludes: Hotel, Breakfast, City Tours, Cross-border Transfer, Sightseeing, Transfers`,
    price: 169900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Thailand Bangkok Tour Package',
    description: `Discover the magic of Thailand's vibrant capital on this exciting 5-day Bangkok tour! Marvel at the glittering Grand Palace and sacred Wat Phra Kaew, explore the ancient temple of Wat Pho, cruise along the Chao Phraya River, and immerse yourself in the energy of Bangkok's legendary night markets.\n\nSeason: November - March\nDuration: 5 Days\nIncludes: Hotel, Breakfast, Palace Tours, Temple Visits, River Cruise, Night Market Tour, Transfers`,
    price: 149900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
];

async function main() {
  // Find or create Singapore destination
  let singapore = await prisma.destination.findFirst({
    where: { name: { contains: 'Singapore' } },
  });

  if (!singapore) {
    singapore = await prisma.destination.create({
      data: {
        name: 'Singapore',
        description: 'Enjoy the beauty of Singapore with our tour packages from Sri Lanka. Discover futuristic architecture, lush green spaces, world-class food, and iconic attractions like Gardens by the Bay and Marina Bay Sands.',
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
      },
    });
    console.log('✅ Created Singapore destination:', singapore.id);
  } else {
    console.log('ℹ️  Found existing Singapore destination:', singapore.id);
  }

  // Add all packages
  let added = 0;
  let skipped = 0;

  for (const pkg of singaporePackages) {
    const existing = await prisma.package.findFirst({
      where: { title: pkg.title, destinationId: singapore.id },
    });

    if (existing) {
      console.log(`⏭️  Skipping (already exists): ${pkg.title}`);
      skipped++;
      continue;
    }

    await prisma.package.create({
      data: {
        ...pkg,
        destinationId: singapore.id,
      },
    });
    console.log(`✅ Added: ${pkg.title}`);
    added++;
  }

  console.log(`\n🎉 Done! Added ${added} packages, skipped ${skipped} duplicates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
