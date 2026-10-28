import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET() {
  try {
    const [skillsCount, rolesCount, resourcesCount, oppsCount, recentSkills, recentRoles] =
      await Promise.all([
        prisma.skill.count(),
        prisma.careerRole.count(),
        prisma.learningResource.count(),
        prisma.careerOpportunity.count(),
        prisma.skill.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, category: true, createdAt: true }
        }),
        prisma.careerRole.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, industry: true, createdAt: true }
        })
      ])

    return apiSuccess({
      counts: {
        skills: skillsCount,
        careerRoles: rolesCount,
        learningResources: resourcesCount,
        opportunities: oppsCount
      },
      recent: {
        skills: recentSkills,
        roles: recentRoles
      }
    })
  } catch (error) {
    console.error('Admin Overview Error:', error)
    
return apiError('Gagal memuat data ringkasan admin', 500)
  }
}
