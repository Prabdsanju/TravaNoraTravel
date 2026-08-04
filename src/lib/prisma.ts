import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = "file:./dev.db";

if (process.env.NODE_ENV === 'production') {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const tmpPath = path.join('/tmp', 'dev.db');
    
    if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpPath);
    }
    dbUrl = "file:/tmp/dev.db";
  } catch (error) {
    console.error("Failed to copy SQLite to /tmp", error);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
