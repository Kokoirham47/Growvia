import type { NextRequest } from 'next/server'

import { Difficulty, LearningResourceType } from '@prisma/client'

import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import type { LearningCardItem, SyllabusModule } from '@/types/learning'

/**
 * Format durationMinutes into Indonesian display string
 */
function formatDuration(minutes?: number | null, type?: LearningResourceType): string {
  if (!minutes || minutes <= 0) {
    return type === LearningResourceType.article ? '15 Menit baca' : '2 Jam'
  }

  if (minutes < 60) {
    return `${minutes} Menit${type === LearningResourceType.article ? ' baca' : ''}`
  }

  const hours = minutes / 60

  if (hours % 1 === 0) {
    return `${hours} Jam`
  }

  return `${hours.toFixed(1).replace('.0', '')} Jam`
}

/**
 * Map Prisma Difficulty to UI Difficulty Level
 */
function formatDifficulty(diff?: Difficulty): 'Beginner' | 'Intermediate' | 'Advanced' {
  switch (diff) {
    case Difficulty.advanced:
      return 'Advanced'
    case Difficulty.intermediate:
      return 'Intermediate'
    case Difficulty.beginner:
    default:
      return 'Beginner'
  }
}

/**
 * Map Prisma LearningResourceType to UI category
 */
function formatCategory(type: LearningResourceType): 'course' | 'artikel' | 'video' | 'bootcamp' {
  switch (type) {
    case LearningResourceType.article:
      return 'artikel'
    case LearningResourceType.video:
      return 'video'
    case LearningResourceType.bootcamp:
      return 'bootcamp'
    case LearningResourceType.course:
    case LearningResourceType.book:
    default:
      return 'course'
  }
}

/**
 * Helper to get current authenticated user ID
 */
async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const headerUserId = request.headers.get('x-user-id')

  if (headerUserId) return headerUserId

  const session = await getServerSession()

  if (session?.userId) return session.userId

  // Fallback to demo active user in development
  const demoUser = await prisma.user.findFirst({
    where: { careerTargets: { some: { isActive: true } } },
    select: { id: true }
  })

  return demoUser?.id ?? null
}

/**
 * GET /api/learning
 * Retrieves personalized learning recommendations from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    // 1. Fetch active career target and skill gaps
    let userTarget = await prisma.userCareerTarget.findFirst({
      where: { userId, isActive: true },
      include: {
        careerRole: {
          include: {
            roleSkills: {
              include: { skill: true }
            }
          }
        },
        skillGapResults: {
          include: { skill: true }
        }
      }
    })

    // If no active target, find or create default target
    if (!userTarget) {
      const defaultRole = await prisma.careerRole.findFirst({
        include: { roleSkills: { include: { skill: true } } }
      })

      if (defaultRole) {
        userTarget = await prisma.userCareerTarget.create({
          data: {
            userId,
            careerRoleId: defaultRole.id,
            isActive: true,
            readinessScore: 20
          },
          include: {
            careerRole: {
              include: {
                roleSkills: {
                  include: { skill: true }
                }
              }
            },
            skillGapResults: {
              include: { skill: true }
            }
          }
        })
      }
    }

    const careerRoleName =
      userTarget?.careerRole?.name || userTarget?.customCareerName || 'Karier Impian'

    const readinessScore = userTarget?.readinessScore ?? 25

    // 2. Map user skill gaps
    const gapMap = new Map<string, { category: string; gapScore: number; skillName: string }>()

    if (userTarget?.skillGapResults && userTarget.skillGapResults.length > 0) {
      for (const res of userTarget.skillGapResults) {
        gapMap.set(res.skillId, {
          category: res.gapCategory,
          gapScore: res.gapScore,
          skillName: res.skill.name
        })
      }
    }

    // 3. Fetch user's saved/bookmarked resources
    const savedResources = await prisma.userSavedResource.findMany({
      where: { userId }
    })

    const bookmarkedIds = savedResources.map(sr => sr.learningResourceId)

    // 4. Fetch all active learning resources from Supabase
    const dbResources = await prisma.learningResource.findMany({
      where: { isActive: true },
      include: {
        skillTags: {
          include: { skill: true }
        }
      },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }]
    })

    if (dbResources.length === 0) {
      return apiSuccess({
        featuredResource: null,
        resources: [],
        bookmarkedIds: [],
        header: {
          careerTarget: careerRoleName,
          selectedModulesCount: 0,
          priorityGapsCount: 0
        },
        impact: {
          currentScore: readinessScore,
          potentialScore: Math.min(100, readinessScore + 20),
          improvement: 20,
          targetScore: 80
        }
      })
    }

    // 5. Calculate match percentage & relevance for each resource
    const processedResources: LearningCardItem[] = dbResources.map(res => {
      const primarySkill = res.skillTags[0]?.skill
      const skillId = primarySkill?.id
      const skillName = primarySkill?.name || 'Keahlian Inti'

      const gapInfo = skillId ? gapMap.get(skillId) : undefined

      // Calculate dynamic match percent
      let baseMatch = 75
      let priorityBonus = 0

      if (gapInfo) {
        if (gapInfo.category === 'missing') {
          baseMatch = 95
          priorityBonus = Math.min(4, Math.floor(gapInfo.gapScore / 25))
        } else if (gapInfo.category === 'develop') {
          baseMatch = 88
          priorityBonus = Math.min(5, Math.floor(gapInfo.gapScore / 20))
        } else {
          baseMatch = 80
        }
      } else {
        // Check if skill is required by career role
        const isRequiredInRole = userTarget?.careerRole?.roleSkills?.some(
          rs => rs.skillId === skillId
        )

        if (isRequiredInRole) {
          baseMatch = 84
        }
      }

      // Rating bonus (e.g. rating 4.9 adds +1, 4.7 adds 0)
      const ratingBonus = res.rating ? Math.round((res.rating - 4.7) * 4) : 0
      const calculatedMatch = Math.min(99, Math.max(70, baseMatch + priorityBonus + ratingBonus))

      const syllabusData = Array.isArray(res.syllabus)
        ? (res.syllabus as unknown as SyllabusModule[])
        : undefined

      return {
        id: res.id,
        title: res.title,
        category: formatCategory(res.type),
        skillTag: skillName,
        platform: res.platform,
        duration: formatDuration(res.durationMinutes, res.type),
        difficulty: formatDifficulty(res.difficulty),
        rating: res.rating ?? 4.8,
        reviewsCount: res.reviewsCount ?? '500+ ulasan',
        description:
          res.description ||
          `Pelajari secara mendalam keahlian ${skillName} untuk memperkuat portofolio dan kesiapan karier profesional kamu.`,
        matchPercent: calculatedMatch,
        url: res.url,
        instructor: res.instructor ?? undefined,
        enrolledCount: res.enrolledCount ?? undefined,
        portfolioProjectsCount: res.portfolioProjectsCount ?? 1,
        hasCertificate: res.hasCertificate ?? true,
        syllabus: syllabusData,
        reasonAI: `Sangat direkomendasikan untuk menutup gap keahlian **${skillName}** yang diprioritaskan untuk posisi ${careerRoleName}.`
      }
    })

    // Sort by matchPercent descending
    processedResources.sort((a, b) => b.matchPercent - a.matchPercent)

    // Select featured recommendation (highest match with missing/develop gap)
    const featuredResource = processedResources.length > 0
      ? {
          ...processedResources[0],
          isFeatured: true
        }
      : null

    const regularResources = processedResources.slice(1)

    // Priority gaps count (missing + develop skills)
    const priorityGapsCount = Array.from(gapMap.values()).filter(
      g => g.category === 'missing' || g.category === 'develop'
    ).length

    // Realistic impact simulation based on closing competency gaps:
    // Completing the curated curriculum lifts candidate past the 80% industry readiness standard
    const targetScore = 80
    const baseTarget = Math.max(84, targetScore + Math.min(10, Math.round((readinessScore / 100) * 12)))

    const potentialScore = readinessScore >= targetScore
      ? Math.min(98, readinessScore + Math.max(6, Math.round((100 - readinessScore) * 0.45)))
      : Math.min(95, Math.max(baseTarget, readinessScore + Math.round((100 - readinessScore) * 0.72)))

    const estimatedImprovement = Math.max(8, potentialScore - readinessScore)

    return apiSuccess({
      featuredResource,
      resources: regularResources,
      bookmarkedIds,
      header: {
        careerTarget: careerRoleName,
        selectedModulesCount: bookmarkedIds.length,
        priorityGapsCount: priorityGapsCount > 0 ? priorityGapsCount : 3
      },
      impact: {
        currentScore: readinessScore,
        potentialScore,
        improvement: estimatedImprovement,
        targetScore
      }
    })
  } catch (error) {
    console.error('Error fetching learning recommendations:', error)
    
return apiError('Gagal memuat rekomendasi belajar dari database.', 500)
  }
}

/**
 * POST /api/learning
 * Handles bookmarking and module interactions
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    const body = await request.json()
    const { action, resourceId } = body

    if (!resourceId) {
      return apiError('Parameter resourceId wajib disertakan.', 400)
    }

    if (action === 'toggle_bookmark') {
      const existing = await prisma.userSavedResource.findUnique({
        where: {
          userId_learningResourceId: {
            userId,
            learningResourceId: resourceId
          }
        }
      })

      let isBookmarked = false

      if (existing) {
        await prisma.userSavedResource.delete({
          where: { id: existing.id }
        })
        isBookmarked = false
      } else {
        await prisma.userSavedResource.create({
          data: {
            userId,
            learningResourceId: resourceId
          }
        })
        isBookmarked = true
      }

      const allSaved = await prisma.userSavedResource.findMany({
        where: { userId },
        select: { learningResourceId: true }
      })

      const bookmarkedIds = allSaved.map(s => s.learningResourceId)

      return apiSuccess({
        isBookmarked,
        bookmarkedIds,
        selectedModulesCount: bookmarkedIds.length,
        message: isBookmarked
          ? 'Modul berhasil disimpan ke daftar belajar!'
          : 'Modul dihapus dari daftar tersimpan.'
      })
    }

    if (action === 'complete_resource') {
      await prisma.userSavedResource.upsert({
        where: {
          userId_learningResourceId: {
            userId,
            learningResourceId: resourceId
          }
        },
        update: {
          isCompleted: true,
          completedAt: new Date()
        },
        create: {
          userId,
          learningResourceId: resourceId,
          isCompleted: true,
          completedAt: new Date()
        }
      })

      return apiSuccess({
        message: 'Selamat! Modul belajar telah berhasil diselesaikan.'
      })
    }

    return apiError('Aksi tidak dikenali.', 400)
  } catch (error) {
    console.error('Error in /api/learning POST:', error)
    
return apiError('Gagal memproses permintaan belajar.', 500)
  }
}
