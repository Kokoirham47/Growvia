import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { INITIAL_SKILLS } from '@/views/skills/skillsData'

/**
 * GET /api/skills
 * Ambil daftar skill profil pengguna atau seed data
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      // Return default skills when not authenticated
      return apiSuccess({
        skills: INITIAL_SKILLS,
        total: INITIAL_SKILLS.length
      })
    }

    // Ambil data user skills dari database jika terhubung
    try {
      const userSkills = await prisma.userSkill.findMany({
        where: { userId },
        include: {
          skill: true,
          skillEvidences: {
            include: {
              experience: true
            }
          }
        },
        orderBy: { score: 'desc' }
      })

      if (userSkills.length > 0) {
        const formatted = userSkills.map((us: any) => ({
          id: us.id,
          name: us.skill.name,
          category: us.skill.category,
          subCategory: us.skill.normalizedName || undefined,
          level: us.level,
          score: us.score,
          evidenceCount: us.skillEvidences?.length || 0,
          evidenceTags: us.skillEvidences?.map((e: any) => e.experience?.title).filter(Boolean) || [],
          source: us.source,
          aiConfidence: us.aiConfidence || undefined,
          isAiVerified: us.source === 'ai_extracted'
        }))

        return apiSuccess({
          skills: formatted,
          total: formatted.length
        })
      }
    } catch {
      // Fallback silently to initial skills
    }

    return apiSuccess({
      skills: INITIAL_SKILLS,
      total: INITIAL_SKILLS.length
    })
  } catch (error: any) {
    return apiError(error.message || 'Gagal mengambil data skills', 500)
  }
}
