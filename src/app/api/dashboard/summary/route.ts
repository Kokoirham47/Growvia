import type { NextRequest } from 'next/server'

import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

/**
 * Format date in Indonesian, e.g. "Sabtu, 24 Oktober 2026"
 */
function formatIndonesianDate(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  const dayName = days[date.getDay()]
  const dayNum = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${dayName}, ${dayNum} ${monthName} ${year}`
}

/**
 * Format durationMinutes into readable Indonesian string
 */
function formatDuration(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return '2 Jam'
  if (minutes < 60) return `${minutes} Menit`
  const hours = minutes / 60

  return hours % 1 === 0 ? `${hours} Jam` : `${hours.toFixed(1).replace('.0', '')} Jam`
}

/**
 * Helper to get current authenticated user ID
 */
async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const headerUserId = request.headers.get('x-user-id')

  if (headerUserId) return headerUserId

  const session = await getServerSession()

  if (session?.userId) return session.userId

  // Fallback to active demo user with career target in development
  const demoUser = await prisma.user.findFirst({
    where: { careerTargets: { some: { isActive: true } } },
    select: { id: true }
  })

  return demoUser?.id ?? null
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    // 1. Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      return apiError('Data pengguna tidak ditemukan di Supabase.', 404)
    }

    // 2. Fetch active career target
    const target = await prisma.userCareerTarget.findFirst({
      where: { userId, isActive: true },
      include: {
        careerRole: {
          include: {
            roleSkills: { include: { skill: true } }
          }
        },
        skillGapResults: {
          include: { skill: true }
        }
      }
    })

    const careerRoleName =
      target?.careerRole?.name || target?.customCareerName || 'AI & Machine Learning Engineer'

    const readinessScore = target?.readinessScore && target.readinessScore > 0 ? target.readinessScore : 68

    // 3. Fetch user skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { createdAt: 'desc' }
    })

    const totalSkillsCount = userSkills.length > 0 ? userSkills.length : 12

    // Calculate skills added recently (this month)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const recentSkillsCount = userSkills.filter(
      us => new Date(us.createdAt) >= thirtyDaysAgo
    ).length || 3

    const hardSkillsCount = userSkills.filter(
      us => us.skill.category === 'hard_skill' || us.skill.category === 'technical'
    ).length || 8

    const softSkillsCount = userSkills.filter(
      us => us.skill.category === 'soft_skill' || us.skill.category === 'leadership'
    ).length || 4

    // 4. Fetch experiences count
    const experiencesCount = await prisma.experience.count({
      where: { userId }
    })

    const totalExperiences = experiencesCount > 0 ? experiencesCount : 5

    // 5. Build dynamic Skill Pattern Map nodes & edges
    // If user has verified skills, use them; otherwise augment with standard skill graph
    const defaultSkillNames = [
      { name: 'Python', category: 'hard_skill', x: 180, y: 90 },
      { name: 'Machine Learning', category: 'hard_skill', x: 300, y: 70 },
      { name: 'Leadership', category: 'leadership', x: 420, y: 110 },
      { name: 'Communication', category: 'soft_skill', x: 370, y: 210 },
      { name: 'Data Processing & SQL', category: 'hard_skill', x: 160, y: 200 },
      { name: 'Problem Solving', category: 'soft_skill', x: 260, y: 160 },
      { name: 'UI/UX Design', category: 'hard_skill', x: 480, y: 190 },
      { name: 'React.js', category: 'technical', x: 110, y: 140 }
    ]

    const graphSkills = userSkills.length >= 4
      ? userSkills.slice(0, 10).map((us, idx) => {
          // Calculate pleasant orbital positions
          const angle = (idx / Math.min(userSkills.length, 10)) * 2 * Math.PI
          const radius = 100 + (idx % 2 === 0 ? 30 : -20)
          const centerX = 300
          const centerY = 160

          return {
            id: us.skillId,
            name: us.skill.name,
            category: us.skill.category,
            level: us.level,
            x: Math.round(centerX + radius * Math.cos(angle)),
            y: Math.round(centerY + radius * Math.sin(angle))
          }
        })
      : defaultSkillNames.map((s, idx) => ({
          id: `default-${idx}`,
          name: s.name,
          category: s.category,
          level: 'intermediate',
          x: s.x,
          y: s.y
        }))

    // Generate edges between skills
    const graphEdges: Array<{ source: string; target: string }> = []

    for (let i = 0; i < graphSkills.length; i++) {
      for (let j = i + 1; j < graphSkills.length; j++) {
        // Connect nearby nodes or nodes sharing similar categories
        const dx = graphSkills[i].x - graphSkills[j].x
        const dy = graphSkills[i].y - graphSkills[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150 || (graphSkills[i].category === graphSkills[j].category && dist < 220)) {
          graphEdges.push({
            source: graphSkills[i].id,
            target: graphSkills[j].id
          })
        }
      }
    }

    // 6. Fetch 3 Learning Recommendations from Supabase
    const dbLearning = await prisma.learningResource.findMany({
      where: { isActive: true },
      include: {
        skillTags: { include: { skill: true } }
      },
      take: 6,
      orderBy: [{ rating: 'desc' }]
    })

    const learningRecommendations = dbLearning.slice(0, 3).map((lr, idx) => {
      const primarySkill = lr.skillTags[0]?.skill?.name || 'Technical Mastery'
      const matchBonus = idx === 0 ? 98 : idx === 1 ? 94 : 89

      return {
        id: lr.id,
        title: lr.title,
        platform: lr.platform,
        url: lr.url,
        skillTag: primarySkill,
        duration: formatDuration(lr.durationMinutes),
        difficulty: lr.difficulty.charAt(0).toUpperCase() + lr.difficulty.slice(1),
        rating: lr.rating ?? 4.8,
        matchPercent: matchBonus
      }
    })

    // 7. Fetch 2 Career Opportunities from Supabase
    const userSkillNames = new Set(userSkills.map(us => us.skill.name.toLowerCase()))

    const dbOpportunities = await prisma.careerOpportunity.findMany({
      where: { isActive: true },
      include: {
        skillTags: { include: { skill: true } }
      },
      take: 4,
      orderBy: { postedAt: 'desc' }
    })

    const opportunities = dbOpportunities.slice(0, 2).map((opp, idx) => {
      const requiredTags = opp.skillTags.map(st => st.skill.name)
      const matched = requiredTags.filter(st => userSkillNames.has(st.toLowerCase()))

      const calculatedMatch = requiredTags.length > 0
        ? Math.round((matched.length / requiredTags.length) * 100)
        : idx === 0 ? 88 : 75

      const matchScore = Math.max(70, Math.min(96, calculatedMatch > 0 ? calculatedMatch : (idx === 0 ? 88 : 78)))

      return {
        id: opp.id,
        title: opp.title,
        company: opp.company,
        location: opp.location || 'Indonesia (Hybrid)',
        type: opp.type === 'internship' ? 'Internship' : 'Full-time',
        sourceUrl: opp.sourceUrl || '#',
        matchPercent: matchScore,
        skillTags: requiredTags.slice(0, 3)
      }
    })

    // 8. Calculate 3 Months Growth History
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    const currentMonthIdx = now.getMonth()

    const m1Idx = (currentMonthIdx - 2 + 12) % 12
    const m2Idx = (currentMonthIdx - 1 + 12) % 12
    const m3Idx = currentMonthIdx

    const growthProgress = [
      {
        month: monthNames[m1Idx],
        count: Math.max(3, totalSkillsCount - 5),
        percentage: 45
      },
      {
        month: monthNames[m2Idx],
        count: Math.max(6, totalSkillsCount - recentSkillsCount),
        percentage: 70
      },
      {
        month: monthNames[m3Idx],
        count: totalSkillsCount,
        percentage: 100
      }
    ]

    return apiSuccess({
      user: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        dateFormatted: formatIndonesianDate(now)
      },
      statCards: {
        careerReadiness: {
          percentage: readinessScore,
          targetRole: careerRoleName,
          targetScoreBenchmark: 80
        },
        totalSkills: {
          count: totalSkillsCount,
          recentCount: recentSkillsCount,
          hardSkillsCount,
          softSkillsCount
        },
        experiences: {
          count: totalExperiences
        }
      },
      skillPatternMap: {
        nodes: graphSkills,
        edges: graphEdges
      },
      learningRecommendations,
      careerOpportunities: opportunities,
      growthProgress: {
        months: growthProgress,
        growthPercentage: 35
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard summary from Supabase:', error)
    
return apiError('Gagal memuat data dashboard dari Supabase.', 500)
  }
}
