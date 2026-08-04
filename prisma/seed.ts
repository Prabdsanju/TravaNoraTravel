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

  const srilanka = await prisma.destination.upsert({
    where: { id: 'dest-srilanka' },
    update: {},
    create: {
      id: 'dest-srilanka',
      name: 'Sri Lanka',
      description: 'The Pearl of the Indian Ocean — pristine beaches, ancient temples, lush tea plantations, and abundant wildlife. Discover your perfect Sri Lanka tour packages with our custom travel itineraries.',
      imageUrl: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=800&q=80',
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

  // Seed Sri Lanka packages
  await prisma.package.upsert({
    where: { id: 'pkg-sl-1' },
    update: {},
    create: {
      id: 'pkg-sl-1',
      title: '05 Days Sri Lanka Wonders Tour',
      description: 'Experience the magical highlights of Sri Lanka in 5 days! Journey from the bustling capital of Colombo to the cultural capital of Kandy. Climb the legendary Sigiriya Rock Fortress, visit the Temple of the Sacred Tooth Relic, and stroll through Royal Botanical Gardens.',
      price: 99900,
      days: 5,
      nights: 4,
      destinationId: srilanka.id,
      imageUrl: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=800&q=80',
      itinerary: `Day 01 - Arrival & Colombo City Tour
Meet and greet at the airport. Proceed to Colombo. Enjoy a city tour including Gangaramaya Temple, Galle Face Green, and Independence Square. Overnight stay in Colombo.
Day 02 - Colombo to Sigiriya via Pinnawala
Travel to Sigiriya. En-route visit Pinnawala Elephant Orphanage. Climb the Sigiriya Rock Fortress, a UNESCO World Heritage site, in the evening. Overnight stay in Sigiriya.
Day 03 - Sigiriya to Kandy
Drive to Kandy. En-route visit Dambulla Cave Temple and a spice garden in Matale. Visit the Temple of the Sacred Tooth Relic in the evening and watch a traditional cultural dance show. Overnight stay in Kandy.
Day 04 - Kandy to Bentota
Proceed to the coastal town of Bentota. Relax on the sandy beaches or take a boat safari along the Madu River. Enjoy water sports in the evening. Overnight stay in Bentota.
Day 05 - Departure
Enjoy breakfast by the beach. Transfer to the Colombo international airport for departure.`,
      inclusions: `4-star hotel accommodations
Daily breakfast
Private air-conditioned vehicle transfers
English-speaking chauffeur guide
All destination entrance fees (Sigiriya, Tooth Relic, Madu River Boat Safari)
Complimentary water bottle daily`,
      exclusions: `Lunch and dinner
Personal expenses (laundry, telephone calls, tips)
Camera & video permits
Travel insurance`,
    },
  });

  await prisma.package.upsert({
    where: { id: 'pkg-sl-2' },
    update: {},
    create: {
      id: 'pkg-sl-2',
      title: '07 Days Sri Lanka Heritage & Beach Tour',
      description: 'A perfect 7-day blend of history, breathtaking hill country, and pristine beaches. Explore Sigiriya, Kandy, Nuwara Eliya (Little England), take the iconic train ride to Ella, and relax on the golden shores of Mirissa/Galle.',
      price: 144900,
      days: 7,
      nights: 6,
      destinationId: srilanka.id,
      imageUrl: 'https://images.unsplash.com/photo-1568122507028-40fe1267b621?w=800&q=80',
      itinerary: `Day 01 - Arrival & Colombo
Welcome at the airport. Transfer to hotel in Colombo. In the evening, do a shopping tour and walk along Galle Face Green. Overnight in Colombo.
Day 02 - Colombo to Sigiriya
Proceed to Sigiriya. Climb the Sigiriya Rock Fortress and explore the ancient water gardens. Optional village safari with traditional lunch. Overnight in Sigiriya.
Day 03 - Sigiriya to Kandy
Travel to Kandy. Visit the Dambulla Cave Temple and Temple of the Tooth. Stroll around Kandy Lake. Overnight in Kandy.
Day 04 - Kandy to Nuwara Eliya
Drive to Nuwara Eliya, enjoying views of lush tea plantations and waterfalls. Visit a tea factory and enjoy a freshly brewed cup of Ceylon tea. Walk around Lake Gregory. Overnight in Nuwara Eliya.
Day 05 - Nuwara Eliya to Ella by Train
Take the scenic train ride from Nanu Oya to Ella (regarded as one of the most beautiful train journeys in the world). Hike Little Adam's Peak and view the Nine Arch Bridge. Overnight in Ella.
Day 06 - Ella to Galle
Proceed to the historic city of Galle. Visit the UNESCO-listed Galle Fort, walk the cobblestone streets, and watch the sunset from the lighthouse. Overnight in Galle.
Day 07 - Departure
Enjoy breakfast at the hotel. Transfer to the airport for your flight back home.`,
      inclusions: `6 nights accommodation in 3/4-star hotels
Daily breakfast
Private AC car/van with driver-guide
Scenic train tickets from Nanu Oya to Ella
Entrance fees to Sigiriya, Kandy Temple, Gregory Lake
All airport transfers`,
      exclusions: `International flights
Lunch & dinner
Tipping for driver-guide
Optional activities (village tour, water sports)`,
    },
  });

  // Update hero_slides_json in settings to include Sri Lanka
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'hero_slides_json' },
  });

  if (setting) {
    try {
      const slides = JSON.parse(setting.value);
      const hasSriLanka = slides.some((s: any) => s.title.toUpperCase().replace(/\s+/g, '') === 'SRILANKA');
      if (!hasSriLanka) {
        slides.push({
          title: 'SRI LANKA',
          spots: '2 Packages',
          description: 'The Pearl of the Indian Ocean — pristine beaches, ancient temples, and lush tea plantations.',
          image: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=800',
          link: '/destinations/dest-srilanka'
        });
        await prisma.siteSetting.update({
          where: { key: 'hero_slides_json' },
          data: { value: JSON.stringify(slides) },
        });
        console.log('Added Sri Lanka to hero_slides_json in settings.');
      }
    } catch (e) {
      console.error('Failed to update hero_slides_json in settings:', e);
    }
  }

  console.log('✅ Seeding complete!');
  console.log(`   • ${await prisma.destination.count()} destinations`);
  console.log(`   • ${await prisma.package.count()} packages`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
