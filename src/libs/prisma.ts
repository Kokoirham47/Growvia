import { PrismaClient } from '@prisma/client'

// Sanitasi otomatis tanda kutip dan optimasi connection pooler Supabase untuk Vercel
if (process.env.DATABASE_URL) {
  let dbUrl = process.env.DATABASE_URL.replace(/^["']|["']$/g, '').trim()

  // Di Vercel / serverless: alihkan session mode (5432 limit 15 conn) ke transaction pooler (6543)
  if (dbUrl.includes('.pooler.supabase.com:5432') && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    dbUrl = dbUrl.replace(':5432', ':6543')
  }

  if (dbUrl.includes(':6543') && !dbUrl.includes('pgbouncer=true')) {
    dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1'
  }

  process.env.DATABASE_URL = dbUrl
}

if (process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DIRECT_URL.replace(/^["']|["']$/g, '').trim()
}

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
        datasources: process.env.DATABASE_URL
          ? {
              db: {
                url: process.env.DATABASE_URL
              }
            }
          : undefined,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
