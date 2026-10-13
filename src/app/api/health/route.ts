import { prisma } from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1;`

    const skillCount = await prisma.skill.count()
    const fieldCount = await prisma.careerField.count()

    return apiSuccess({
      status: 'healthy',
      database: 'connected',
      seeded: {
        skills: skillCount,
        careerFields: fieldCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return apiError('Health check failed: Unable to connect to database', 500, error)
  }
}
