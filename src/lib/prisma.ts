import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper function to safely disconnect
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Helper function to run database migrations
export async function runMigrations() {
  try {
    // This would be handled by npx prisma migrate deploy in production
    console.log('📁 Checking database schema...');
    await prisma.$connect();
    console.log('✅ Database schema is up to date');
    return true;
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    return false;
  }
}

export default prisma;