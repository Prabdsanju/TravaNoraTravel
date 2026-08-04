import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const srilankaPackages = [
  {
    id: 'pkg-sl-1',
    title: '05 Days Sri Lanka Wonders Tour',
    description: 'Experience the magical highlights of Sri Lanka in 5 days! Journey from the bustling capital of Colombo to the cultural capital of Kandy. Climb the legendary Sigiriya Rock Fortress, visit the Temple of the Sacred Tooth Relic, and stroll through Royal Botanical Gardens.',
    price: 99900,
    days: 5,
    nights: 4,
    imageUrl: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=1000',
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
  {
    id: 'pkg-sl-2',
    title: '07 Days Sri Lanka Heritage & Beach Tour',
    description: 'A perfect 7-day blend of history, breathtaking hill country, and pristine beaches. Explore Sigiriya, Kandy, Nuwara Eliya (Little England), take the iconic train ride to Ella, and relax on the golden shores of Mirissa/Galle.',
    price: 144900,
    days: 7,
    nights: 6,
    imageUrl: 'https://images.unsplash.com/photo-1568122507028-40fe1267b621?w=1000',
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
  }
];

async function main() {
  // Find or create Sri Lanka destination
  let srilanka = await prisma.destination.findFirst({
    where: { name: { contains: 'Sri Lanka' } },
  });

  if (!srilanka) {
    srilanka = await prisma.destination.create({
      data: {
        id: 'dest-srilanka',
        name: 'Sri Lanka',
        description: 'The Pearl of the Indian Ocean — pristine beaches, ancient temples, lush tea plantations, and abundant wildlife. Discover your perfect Sri Lanka tour packages with our custom travel itineraries.',
        imageUrl: 'https://images.unsplash.com/photo-1588598126707-dc30790b8fca?w=1000',
      },
    });
    console.log('Created Sri Lanka destination:', srilanka.id);
  } else {
    console.log('Found existing Sri Lanka destination:', srilanka.id);
  }

  // Add all packages
  for (const pkg of srilankaPackages) {
    const existing = await prisma.package.findUnique({
      where: { id: pkg.id },
    });

    if (existing) {
      console.log(`Updating existing package: ${pkg.title}`);
      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          ...pkg,
          destinationId: srilanka.id,
        }
      });
      continue;
    }

    await prisma.package.create({
      data: {
        ...pkg,
        destinationId: srilanka.id,
      },
    });
    console.log(`Added: ${pkg.title}`);
  }

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

  console.log('\nDone! All Sri Lanka packages have been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
