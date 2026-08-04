import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSetting.findMany();
  console.log('--- ALL SITE SETTINGS ---');
  settings.forEach(s => {
    console.log(`[${s.key}]: ${s.value}`);
  });
}

main().finally(() => prisma.$disconnect());
