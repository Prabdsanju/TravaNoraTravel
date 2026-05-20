import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSetting.findMany();
  
  for (const s of settings) {
    if (s.value.includes('Prabod')) {
      const newValue = s.value.replace(/Prabod Pvt Ltd/g, 'TravaNora Travel PVT LTD').replace(/Prabod/g, 'TravaNora');
      console.log(`Updating setting [${s.key}]: ${newValue}`);
      await prisma.siteSetting.update({
        where: { key: s.key },
        data: { value: newValue }
      });
    }
  }
  console.log('Successfully updated all site settings with new branding.');
}

main().finally(() => prisma.$disconnect());
