import { PrismaClient } from '@prisma/client';

// Initialize prisma client with global caching to prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
