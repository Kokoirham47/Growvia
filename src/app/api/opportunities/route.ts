import { NextResponse, type NextRequest } from 'next/server'

import { OpportunityType } from '@prisma/client'

import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import type { OpportunityItem, OpportunitySkillItem } from '@/types/opportunities'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
      })

      if (firstUser) {
        userId = firstUser.id
      }
    }

    // 1. Dapatkan daftar ID skill yang dimiliki user
    const userSkills = userId
      ? await prisma.userSkill.findMany({
          where: { userId },
          include: { skill: true }
        })
      : []

    const userSkillMap = new Map(userSkills.map(us => [us.skillId, us]))

    // 2. Dapatkan target peran karier user untuk konteks header & relevansi arah karier
    const userTarget = userId
      ? await prisma.userCareerTarget.findFirst({
          where: { userId, isActive: true },
          include: {
            careerRole: {
              include: {
                roleSkills: true
              }
            }
          }
        })
      : null

    const userTargetRole =
      userTarget?.careerRole?.name || userTarget?.customCareerName || null

    const targetRoleSkillIds = new Set(
      userTarget?.careerRole?.roleSkills?.map(rs => rs.skillId) || []
    )

    const roleKeywords = userTargetRole
      ? userTargetRole
          .toLowerCase()
          .split(/[\s,/-]+/)
          .filter(w => w.length >= 3 && !['and', 'the', 'for'].includes(w))
      : []

    // 3. Dapatkan daftar lowongan yang telah di-bookmark user
    const savedOpportunities = userId
      ? await prisma.userSavedOpportunity.findMany({
          where: { userId }
        })
      : []

    const savedOppIds = new Set(savedOpportunities.map(so => so.careerOpportunityId))

    // 4. Parse query parameters
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search')?.trim().toLowerCase() || ''
    const typeParam = searchParams.get('type') as OpportunityType | 'all' | null
    const locationParam = searchParams.get('location')?.trim().toLowerCase() || ''
    const minMatchParam = searchParams.get('minMatch')
    const minMatch = minMatchParam ? parseInt(minMatchParam, 10) : 0
    const savedOnly = searchParams.get('savedOnly') === 'true'
    const careerTargetOnly = searchParams.get('careerTargetOnly') === 'true'
    const sortParam = searchParams.get('sort') || 'match_desc'

    // 5. Query active opportunities from DB
    const dbOpportunities = await prisma.careerOpportunity.findMany({
      where: {
        isActive: true,
        ...(typeParam && typeParam !== 'all' && Object.values(OpportunityType).includes(typeParam)
          ? { type: typeParam }
          : {})
      },
      include: {
        skillTags: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // 6. Hitung Skill Match Score secara realistis & cek keselarasan arah karier
    const mappedOpportunities: OpportunityItem[] = dbOpportunities.map(opp => {
      let totalWeight = 0
      let matchedWeight = 0

      const matchedSkills: OpportunitySkillItem[] = []
      const missingSkills: OpportunitySkillItem[] = []
      const allSkills: OpportunitySkillItem[] = []

      for (const tag of opp.skillTags) {
        const weight = tag.importance === 'required' ? 2.0 : 1.0

        totalWeight += weight

        const userSkill = userSkillMap.get(tag.skillId)
        const hasSkill = Boolean(userSkill)

        const skillItem: OpportunitySkillItem = {
          id: tag.skill.id,
          name: tag.skill.name,
          category: tag.skill.category,
          importance: tag.importance
        }

        allSkills.push(skillItem)

        if (hasSkill && userSkill) {
          // Perhitungkan tingkat penguasaan skill (score 0-100)
          const mastery = Math.max(0.45, Math.min(1.0, (userSkill.score || 50) / 100))

          matchedWeight += weight * mastery
          matchedSkills.push(skillItem)
        } else {
          missingSkills.push(skillItem)
        }
      }

      // Hitung skor dasar kecocokan
      let rawScore =
        totalWeight === 0
          ? 50
          : Math.round((matchedWeight / totalWeight) * 100)

      // Kalibrasi realistis: portofolio skill yang baru sedikit tidak langsung mendapat 100%
      if (userSkills.length <= 2) {
        rawScore = Math.min(rawScore, 68)
      } else if (userSkills.length <= 4) {
        rawScore = Math.min(rawScore, 82)
      } else if (missingSkills.length > 0) {
        rawScore = Math.min(rawScore, 88)
      } else {
        rawScore = Math.min(rawScore, 96)
      }

      const matchScore = Math.max(15, rawScore)
      const isSaved = savedOppIds.has(opp.id)

      // Cek keselarasan dengan target peran karier
      const titleLower = opp.title.toLowerCase()
      const descLower = (opp.description || '').toLowerCase()

      const hasKeywordMatch =
        roleKeywords.length > 0 &&
        roleKeywords.some(kw => titleLower.includes(kw) || descLower.includes(kw))

      const matchingTargetSkillsCount = opp.skillTags.filter(t =>
        targetRoleSkillIds.has(t.skillId)
      ).length

      const hasRoleSkillMatch =
        targetRoleSkillIds.size > 0 &&
        matchingTargetSkillsCount >= Math.min(2, Math.max(1, opp.skillTags.length))

      const isCareerTargetMatch = hasKeywordMatch || hasRoleSkillMatch

      return {
        id: opp.id,
        title: opp.title,
        company: opp.company,
        location: opp.location,
        type: opp.type,
        sourceUrl: opp.sourceUrl,
        description: opp.description,
        deadline: opp.deadline ? opp.deadline.toISOString() : null,
        postedAt: opp.postedAt ? opp.postedAt.toISOString() : opp.createdAt.toISOString(),
        isActive: opp.isActive,
        matchScore,
        isSaved,
        isCareerTargetMatch,
        matchedSkills,
        missingSkills,
        allSkills
      }
    })

    // 7. Filter berdasarkan search, lokasi, minMatch, savedOnly, dan careerTargetOnly
    let filtered = mappedOpportunities.filter(item => {
      // Saved filter
      if (savedOnly && !item.isSaved) {
        return false
      }

      // Career target filter
      if (careerTargetOnly && !item.isCareerTargetMatch) {
        return false
      }

      // Min match score filter
      if (minMatch > 0 && item.matchScore < minMatch) {
        return false
      }

      // Location filter
      if (locationParam && item.location) {
        if (!item.location.toLowerCase().includes(locationParam)) {
          return false
        }
      }

      // Search keyword filter
      if (search) {
        const matchesTitle = item.title.toLowerCase().includes(search)
        const matchesCompany = item.company.toLowerCase().includes(search)
        const matchesLocation = item.location?.toLowerCase().includes(search) ?? false
        const matchesSkill = item.allSkills.some(s => s.name.toLowerCase().includes(search))

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkill) {
          return false
        }
      }

      return true
    })

    // 8. Sorting
    filtered = filtered.sort((a, b) => {
      if (sortParam === 'match_desc') {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore
        }

        
return new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
      }

      if (sortParam === 'deadline_asc') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        
return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }

      if (sortParam === 'newest') {
        return new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
      }

      return 0
    })

    // 9. Meta statistics
    const totalMatchSum = filtered.reduce((acc, curr) => acc + curr.matchScore, 0)
    const averageMatchScore = filtered.length > 0 ? Math.round(totalMatchSum / filtered.length) : 0

    return NextResponse.json({
      success: true,
      message: 'Peluang karier berhasil dimuat',
      data: filtered,
      meta: {
        total: filtered.length,
        userSkillsCount: userSkills.length,
        averageMatchScore,
        userTargetRole
      }
    })
  } catch (error) {
    console.error('Opportunities GET Error:', error)
    
return apiError('Gagal memuat peluang karier', 500, error)
  }
}

/**
 * POST /api/opportunities
 * Handles bookmarking / saving opportunities
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
      })

      if (firstUser) userId = firstUser.id
    }

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    const body = await request.json()
    const { action, opportunityId, matchScore } = body

    if (!opportunityId) {
      return apiError('Parameter opportunityId wajib disertakan.', 400)
    }

    if (action === 'toggle_save' || action === 'toggle_bookmark') {
      const existing = await prisma.userSavedOpportunity.findUnique({
        where: {
          userId_careerOpportunityId: {
            userId,
            careerOpportunityId: opportunityId
          }
        }
      })

      let isSaved = false

      if (existing) {
        await prisma.userSavedOpportunity.delete({
          where: { id: existing.id }
        })
        isSaved = false
      } else {
        await prisma.userSavedOpportunity.create({
          data: {
            userId,
            careerOpportunityId: opportunityId,
            skillMatchScore: typeof matchScore === 'number' ? matchScore : null
          }
        })
        isSaved = true
      }

      const allSaved = await prisma.userSavedOpportunity.findMany({
        where: { userId },
        select: { careerOpportunityId: true }
      })

      const savedIds = allSaved.map(s => s.careerOpportunityId)

      return apiSuccess(
        {
          isSaved,
          savedIds,
          savedCount: savedIds.length
        },
        isSaved
          ? 'Peluang karier berhasil disimpan ke daftar tersimpan!'
          : 'Peluang karier dihapus dari daftar tersimpan.'
      )
    }

    return apiError('Aksi tidak dikenali.', 400)
  } catch (error) {
    console.error('Error in /api/opportunities POST:', error)
    
return apiError('Gagal memproses bookmark peluang karier.', 500, error)
  }
}
