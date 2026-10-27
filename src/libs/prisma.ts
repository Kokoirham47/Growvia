import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const existingPrisma = globalForPrisma.prisma

// Pastikan client di-refresh jika instance lama ter-cache sebelum field portfolioTheme ditambahkan
const isStaleClient =
  process.env.NODE_ENV === 'development' &&
  existingPrisma &&
  !(existingPrisma as any).profile?.fields?.portfolioTheme

export const prisma =
  existingPrisma && !isStaleClient
    ? existingPrisma
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
