import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding default Growvia admin account...')

  const email = 'admin@growvia.id'
  const rawPassword = 'AdminGrowvia2026!'
  const passwordHash = await bcrypt.hash(rawPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      passwordHash,
      name: 'Super Admin Growvia'
    },
    create: {
      name: 'Super Admin Growvia',
      email,
      passwordHash
    }
  })

  console.log(`✅ Default admin seeded successfully:`)
  console.log(`   - ID: ${admin.id}`)
  console.log(`   - Name: ${admin.name}`)
  console.log(`   - Email: ${admin.email}`)
  console.log(`   - Password: ${rawPassword}`)
}

main()
  .catch(e => {
    console.error('❌ Failed to seed admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
