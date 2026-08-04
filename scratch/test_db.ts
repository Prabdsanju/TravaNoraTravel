import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
  console.log('--- TABLES IN DB ---');
  console.log(JSON.stringify(result, null, 2));
}

main().finally(() => prisma.$disconnect());
