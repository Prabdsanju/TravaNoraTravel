import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert destinations
  const thailand = await prisma.destination.upsert({
    where: { id: 'dest-thailand' },
    update: {},
    create: {
      id: 'dest-thailand',
      name: 'Thailand',
      description: 'The Land of Smiles — temples, tropical beaches, bustling night markets, and world-class street food. From the golden spires of Bangkok to the turquoise waters of Phuket, Thailand is a feast for all senses.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    },
  });

  const singapore = await prisma.destination.upsert({
    where: { id: 'dest-singapore' },
    update: {},
    create: {
      id: 'dest-singapore',
      name: 'Singapore',
      description: 'A gleaming city-state where futuristic skyscrapers meet lush gardens. Experience Michelin-starred hawker stalls, Marina Bay Sands, Gardens by the Bay, and impeccably efficient hospitality.',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    },
  });

  const malaysia = await prisma.destination.upsert({
    where: { id: 'dest-malaysia' },
    update: {},
    create: {
      id: 'dest-malaysia',
      name: 'Malaysia',
      description: 'A vibrant tapestry of Malay, Chinese, and Indian cultures. Explore the Petronas Twin Towers, ancient rainforests, pristine islands like Langkawi, and a legendary street-food scene in Penang.',
      imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    },
  });

  const vietnam = await prisma.destination.upsert({
    where: { id: 'dest-vietnam' },
    update: {},
    create: {
      id: 'dest-vietnam',
      name: 'Vietnam',
      description: 'A country of breathtaking natural beauty — from the emerald waters of Ha Long Bay to the golden lanterns of Hoi An. Vietnam offers rich history, stunning landscapes, and incredible cuisine.',
      imageUrl: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Seed Thailand packages
  await prisma.package.upsert({
    where: { id: 'pkg-thai-1' },
    update: {},
    create: {
      id: 'pkg-thai-1',
      title: 'Bangkok & Chiang Mai Explorer',
      description: 'Immerse yourself in the contrasts of Thailand. Marvel at the Grand Palace and Wat Pho in Bangkok, then head north to Chiang Mai for elephant sanctuaries, trekking in lush hills, and serene temple-hopping. Includes cooking class and a longtail boat ride on the Chao Phraya River.',
      price: 899,
      days: 7,
      nights: 6,
      destinationId: thailand.id,
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-thai-2' },
    update: {},
    create: {
      id: 'pkg-thai-2',
      title: 'Phuket Island Paradise',
      description: 'Unwind on Phuket\'s world-famous beaches — Patong, Kata, and Karon. Island-hop to Phi Phi Islands by speedboat, snorkel in crystal-clear Andaman water, enjoy sunset dinners, and experience vibrant nightlife. Perfect for couples and beach lovers.',
      price: 1099,
      days: 6,
      nights: 5,
      destinationId: thailand.id,
      imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Seed Singapore packages
  await prisma.package.upsert({
    where: { id: 'pkg-sg-1' },
    update: {},
    create: {
      id: 'pkg-sg-1',
      title: 'Singapore City Highlights',
      description: 'Experience the best of the Lion City. Visit Marina Bay Sands SkyPark, Gardens by the Bay, Sentosa Island, Universal Studios, and the colourful streets of Little India and Chinatown. Includes a Singapore Flyer ride and a sunset harbour cruise.',
      price: 1199,
      days: 5,
      nights: 4,
      destinationId: singapore.id,
      imageUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-sg-2' },
    update: {},
    create: {
      id: 'pkg-sg-2',
      title: 'Singapore Luxury Escape',
      description: 'Indulge in Singapore\'s finest experiences — private yacht charter around the harbour, afternoon tea at Raffles Hotel, personalised shopping in Orchard Road, award-winning restaurants, and a private guided tour of the UNESCO-listed Botanic Gardens.',
      price: 2499,
      days: 4,
      nights: 3,
      destinationId: singapore.id,
      imageUrl: 'https://images.unsplash.com/photo-1612257416648-2932f4a11b40?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Seed Malaysia packages
  await prisma.package.upsert({
    where: { id: 'pkg-my-1' },
    update: {},
    create: {
      id: 'pkg-my-1',
      title: 'Kuala Lumpur & Penang Discovery',
      description: 'Explore KL\'s iconic Petronas Twin Towers, Batu Caves, and vibrant Bukit Bintang. Then travel to Penang — a UNESCO heritage city famed for street art, colonial shophouses, and legendary hawker food (char kway teow, asam laksa, nasi kandar).',
      price: 799,
      days: 6,
      nights: 5,
      destinationId: malaysia.id,
      imageUrl: 'https://images.unsplash.com/photo-1519011985575-7d85e0974a43?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-my-2' },
    update: {},
    create: {
      id: 'pkg-my-2',
      title: 'Langkawi Island Retreat',
      description: 'Escape to the Jewel of Kedah. Relax on duty-free Langkawi\'s pristine beaches, ride the Langkawi Sky Bridge cable car, explore Kilim Karst Geoforest by boat, and enjoy fresh seafood overlooking the turquoise Andaman Sea.',
      price: 949,
      days: 5,
      nights: 4,
      destinationId: malaysia.id,
      imageUrl: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Seed Vietnam packages
  await prisma.package.upsert({
    where: { id: 'pkg-vn-1' },
    update: {},
    create: {
      id: 'pkg-vn-1',
      title: 'Ha Long Bay & Hanoi Adventure',
      description: 'Cruise through the UNESCO World Heritage Ha Long Bay on a traditional junk boat — kayak into hidden grottoes, watch sunrise over limestone karsts, and taste fresh seafood on deck. Explore Hanoi\'s Old Quarter, Hoan Kiem Lake, and vibrant street food scene.',
      price: 849,
      days: 7,
      nights: 6,
      destinationId: vietnam.id,
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-vn-2' },
    update: {},
    create: {
      id: 'pkg-vn-2',
      title: 'Hoi An & Da Nang Cultural Tour',
      description: 'Stroll the magical lantern-lit streets of ancient Hoi An, take a cooking class learning to make fresh pho and banh mi, cycle through rice paddies, and relax on Da Nang\'s My Khe beach — rated one of Asia\'s most beautiful beaches.',
      price: 749,
      days: 5,
      nights: 4,
      destinationId: vietnam.id,
      imageUrl: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✅ Seeding complete!');
  console.log(`   • ${await prisma.destination.count()} destinations`);
  console.log(`   • ${await prisma.package.count()} packages`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
