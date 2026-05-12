import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const thailandPackages = [
  {
    title: '04 Days Best of Bangkok',
    description: `Explore the best of Bangkok in just 4 days! Visit the iconic Grand Palace, Wat Pho, vibrant floating markets, and enjoy the electrifying nightlife of Khao San Road. This compact tour gives you a complete Bangkok experience with comfortable accommodations and guided city tours.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Sightseeing, Transfers`,
    price: 89900,
    days: 4,
    nights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '05 Days Phuket Tour Package',
    description: `Discover the tropical paradise of Phuket over 5 unforgettable days. Relax on pristine beaches, explore the stunning Phi Phi Islands, enjoy water sports, and savor fresh Thai seafood. This package includes island hopping, city tours, and plenty of leisure time.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Tours, Transfers`,
    price: 124900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: '07 Days Phuket Krabi Tour',
    description: `Experience the best of southern Thailand with this 7-day Phuket and Krabi combo tour. Enjoy stunning limestone cliffs, crystal-clear waters, and tropical islands. Visit Railay Beach, the Four Islands, and the famous James Bond Island.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Hopping, Transfers between cities`,
    price: 164900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Andaman Delight',
    description: `Embark on an island hopping adventure through the stunning Andaman Sea. Explore hidden lagoons, snorkel in crystal-clear waters, and relax on white sand beaches. This 5-day package covers the most beautiful islands including Koh Phi Phi, Koh Lanta, and more.\n\nSeason: October - March\nIncludes: Hotel, Breakfast, Island Hopping, Snorkeling, Transfers`,
    price: 139900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Bangkok Family Savari',
    description: `A perfect family-friendly tour of Bangkok! Enjoy theme parks, cultural visits, shopping at mega malls, and kid-friendly dining experiences. This 5-day package is designed for families looking for a mix of fun, culture, and relaxation.\n\nSeason: October - March\nIncludes: Hotel, Breakfast, Safari World, Dream World, Transfers`,
    price: 119900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Bangkok Singapore Tour',
    description: `Explore two incredible Asian cities in one trip! Start with the vibrant streets and temples of Bangkok, then fly to the ultra-modern city-state of Singapore. Visit Marina Bay Sands, Sentosa Island, Gardens by the Bay, and more.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, City Tours, Flights between cities, Transfers`,
    price: 174900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Bliss in Phuket Tour',
    description: `Unwind and rejuvenate in the tropical paradise of Phuket. This 5-day tour focuses on relaxation with spa treatments, beach time, and leisurely island tours. Enjoy sunset cruises, Thai cooking classes, and the vibrant Patong nightlife.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Spa Treatment, Island Tour, Transfers`,
    price: 129900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Classic Vietnam and Bangkok',
    description: `The ultimate Southeast Asian adventure combining Vietnam and Bangkok. Explore the ancient charm of Hanoi, cruise through Ha Long Bay, wander the streets of Ho Chi Minh City, and finish with the energy of Bangkok. An 11-day journey through two fascinating countries.\n\nSeason: October - March\nIncludes: Hotel, Breakfast, Ha Long Bay Cruise, City Tours, Flights, Transfers`,
    price: 249900,
    days: 11,
    nights: 10,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Dream World Bangkok with Lunch',
    description: `A thrilling day tour to Dream World, Bangkok's premier amusement park! Enjoy roller coasters, water rides, snow town, and live shows. This package includes Super Visa entry and a delicious lunch buffet.\n\nSeason: November - March\nDay Tour - No overnight stay\nIncludes: Entry Tickets, Lunch Buffet, Transfers`,
    price: 14900,
    days: 1,
    nights: 0,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Pattaya Bangkok Tour Package',
    description: `Combine the beach vibes of Pattaya with the cultural richness of Bangkok in this 5-day tour. Visit Coral Island, enjoy the Alcazar Cabaret Show, explore Nong Nooch Garden, and then experience Bangkok's temples, markets, and nightlife.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Coral Island Tour, City Tours, Transfers`,
    price: 114900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Phuket Bangkok Tour Package',
    description: `The perfect blend of beach paradise and city excitement! Spend time in Phuket's tropical beaches and then explore the vibrant streets of Bangkok. This 7-day tour covers island hopping, temple visits, floating markets, and shopping.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Tour, Temple Tours, Domestic Flight, Transfers`,
    price: 159900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Phuket Koh Samui Tour',
    description: `Experience two of Thailand's most beautiful islands! Explore Phuket's stunning beaches and nightlife, then head to the tranquil Koh Samui for a more relaxed island experience. Enjoy snorkeling, temple visits, and Thai wellness retreats.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Tours, Ferry/Flight, Transfers`,
    price: 169900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Phuket Pattaya Bangkok Tour',
    description: `The ultimate Thailand experience covering three iconic destinations over 10 days! Start with Phuket's islands, move to Pattaya's beach life and nightlife, and finish in Bangkok with temple tours and shopping. Everything Thailand has to offer in one trip.\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Island Tours, City Tours, Domestic Flights, Transfers`,
    price: 219900,
    days: 10,
    nights: 9,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Relax in Pattaya',
    description: `The perfect beach getaway to Pattaya! Enjoy 4 days of sun, sand, and vibrant nightlife. Visit Coral Island, watch the famous cabaret shows, explore Walking Street, and relax at beautiful beach resorts. Best Night Life destination in Thailand!\n\nSeason: October - March\nIncludes: Hotel, Breakfast, Coral Island Trip, City Tour, Transfers`,
    price: 84900,
    days: 4,
    nights: 3,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Temple & City Tour: Wat Pho & Grand Palace',
    description: `A full-day guided tour of Bangkok's most iconic landmarks. Visit the magnificent Grand Palace, the sacred Wat Pho with the Reclining Buddha, and the stunning Emerald Buddha Temple. Includes professional English-speaking guide and hotel transfers.\n\nSeason: November - March\nDay Tour - No overnight stay\nIncludes: Entry Tickets, English Guide, Hotel Transfers`,
    price: 9900,
    days: 1,
    nights: 0,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
  {
    title: 'Thailand Bangkok Tour Package',
    description: `A comprehensive 5-day exploration of Bangkok and its surroundings. Visit ancient temples, floating markets, enjoy Thai cooking experiences, explore Chinatown, and shop at the famous Chatuchak Weekend Market. The perfect introduction to Thailand!\n\nSeason: November - March\nIncludes: Hotel, Breakfast, Temple Tours, Market Visits, Transfers`,
    price: 109900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
  },
];

async function main() {
  // Find Thailand destination
  let thailand = await prisma.destination.findFirst({
    where: { name: { contains: 'Thailand' } },
  });

  // Create Thailand destination if it doesn't exist
  if (!thailand) {
    thailand = await prisma.destination.create({
      data: {
        name: 'Thailand',
        description: 'Enjoy the beauty of Thailand with our tour packages from Sri Lanka. Discover your perfect Thailand tour packages with our last-minute inclusive deals.',
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000',
      },
    });
    console.log('Created Thailand destination:', thailand.id);
  } else {
    console.log('Found existing Thailand destination:', thailand.id);
  }

  // Add all packages
  for (const pkg of thailandPackages) {
    const existing = await prisma.package.findFirst({
      where: { title: pkg.title, destinationId: thailand.id },
    });

    if (existing) {
      console.log(`Skipping (already exists): ${pkg.title}`);
      continue;
    }

    await prisma.package.create({
      data: {
        ...pkg,
        destinationId: thailand.id,
      },
    });
    console.log(`Added: ${pkg.title}`);
  }

  console.log('\nDone! All Thailand packages have been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
