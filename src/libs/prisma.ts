import { PrismaClient } from '@prisma/client'

// Sanitasi otomatis tanda kutip dan optimasi connection pooler Supabase untuk Vercel
if (process.env.DATABASE_URL) {
  let dbUrl = process.env.DATABASE_URL.replace(/^["']|["']$/g, '').trim()

  // Di Vercel / serverless: alihkan session mode (5432) ke transaction pooler (6543)
  if (dbUrl.includes('.pooler.supabase.com:5432')) {
    dbUrl = dbUrl.replace(':5432', ':6543')
  }

  // Tambahkan pgbouncer=true untuk transaction mode.
  // PENTING: connection_limit harus cukup besar agar Promise.all 9+ query tidak timeout
  // (dulu di-set ke 1 → menyebabkan semua query parallel timeout rebutan 1 koneksi)
  if (dbUrl.includes(':6543')) {
    if (!dbUrl.includes('pgbouncer=true')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true'
    }

    // Override connection_limit ke 10 agar 9 parallel dashboard queries tidak rebutan koneksi
    if (!dbUrl.includes('connection_limit=')) {
      dbUrl += '&connection_limit=10'
    } else {
      dbUrl = dbUrl.replace(/connection_limit=\d+/, 'connection_limit=10')
    }

    if (!dbUrl.includes('pool_timeout=')) {
      dbUrl += '&pool_timeout=30'
    }
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
