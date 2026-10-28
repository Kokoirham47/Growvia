import { prisma } from '@/libs/prisma'

function formatIndonesianDate(date: Date): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const dayName = days[date.getDay()]
  const dayNum = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${dayName}, ${dayNum} ${monthName} ${year}`
}

function formatExperienceDuration(startDate: Date, endDate?: Date | null, type?: string): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const startStr = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`
  const endStr = endDate ? `${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}` : 'Sekarang'

  const typeLabel =
    type === 'internship'
      ? 'Magang Industri'
      : type === 'organisation'
      ? 'Organisasi Kampus'
      : type === 'committee'
      ? 'Kepanitiaan'
      : type === 'freelance'
      ? 'Pekerjaan Lepas'
      : type === 'project'
      ? 'Proyek Independen'
      : type === 'competition'
      ? 'Kompetisi'
      : 'Aktivitas Ekstra'

  return `${startStr} – ${endStr} • ${typeLabel}`
}

export async function getDashboardSummaryData(userId: string) {
  // Execute all independent database queries in parallel for maximum speed
  const [
    user,
    target,
    userSkills,
    experiences,
    dbOpportunitiesCount,
    dbUserRecommendations,
    dbOpportunities,
    latestAiJob,
    fallbackResources
  ] = await Promise.all([
    // 1. User & profile
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    }),

    // 2. Active career target with role & gaps
    prisma.userCareerTarget.findFirst({
      where: { userId, isActive: true },
      include: {
        careerRole: true,
        skillGapResults: {
          include: { skill: true }
        }
      }
    }),

    // 3. User validated skills
    prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { createdAt: 'desc' }
    }),

    // 4. User experiences with skill evidences
    prisma.experience.findMany({
      where: { userId },
      include: {
        skillEvidences: {
          include: {
            userSkill: {
              include: { skill: true }
            }
          }
        }
      },
      orderBy: [{ endDate: 'desc' }, { startDate: 'desc' }]
    }),

    // 5. Active opportunities count
    prisma.careerOpportunity.count({
      where: { isActive: true }
    }),

    // 6. User learning recommendations
    prisma.learningRecommendation.findMany({
      where: { userId },
      include: {
        resource: {
          include: {
            skillTags: {
              include: { skill: true }
            }
          }
        },
        skillGapResult: {
          include: { skill: true }
        }
      },
      take: 3,
      orderBy: { relevanceScore: 'desc' }
    }),

    // 7. Active opportunities for matching
    prisma.careerOpportunity.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        skillTags: {
          include: { skill: true }
        }
      }
    }),

    // 8. Pending AI analysis suggestions
    prisma.aiAnalysisJob.findFirst({
      where: {
        userId,
        status: 'completed',
        suggestions: {
          some: { reviewStatus: 'pending' }
        }
      },
      include: {
        experience: {
          select: { title: true, institutionName: true, role: true }
        },
        suggestions: {
          where: { reviewStatus: 'pending' },
          take: 3
        }
      },
      orderBy: { completedAt: 'desc' }
    }),

    // 9. Fallback learning resources (prefetched in parallel)
    prisma.learningResource.findMany({
      where: { isActive: true },
      include: {
        skillTags: {
          include: { skill: true }
        }
      },
      take: 3,
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }]
    })
  ])

  if (!user) {
    return null
  }

  const readinessScore = target?.readinessScore ?? 0
  const targetRoleName = target?.careerRole?.name || target?.customCareerName || null
  const targetIndustry = target?.careerRole?.industry || 'Belum Ditentukan'
  const subTargetName = target?.customCareerName || target?.careerRole?.name || null

  const totalSkillsCount = userSkills.length

  const hardSkillsCount = userSkills.filter(
    us => us.skill.category === 'hard_skill' || us.skill.category === 'technical'
  ).length

  const softSkillsCount = userSkills.filter(
    us => us.skill.category === 'soft_skill' || us.skill.category === 'leadership'
  ).length

  const totalExperiencesCount = experiences.length

  const mappedExperiences = experiences.slice(0, 3).map(exp => {
    const skillsFromEvidence = exp.skillEvidences.map(se => se.userSkill.skill.name)

    return {
      id: exp.id,
      role: exp.role || exp.title,
      company: exp.institutionName,
      title: `${exp.title} • ${exp.institutionName}`,
      dateFormatted: formatExperienceDuration(
        new Date(exp.startDate),
        exp.endDate ? new Date(exp.endDate) : null,
        exp.type
      ),
      validatedSkillsCount: skillsFromEvidence.length,
      skills: skillsFromEvidence,
      type: exp.type
    }
  })

  const allGaps =
    target?.skillGapResults?.map(sg => ({
      name: sg.skill.name,
      status: sg.gapCategory === 'missing' ? 'missing' : 'develop'
    })) || []

  // Profile Completeness formula
  let completeness = 0

  if (user.name) completeness += 15
  if (user.profile?.headline) completeness += 15
  if (user.profile?.institution && user.profile?.major) completeness += 15
  else if (user.profile?.institution || user.profile?.major) completeness += 8
  if (user.profile?.bio) completeness += 15
  if (totalExperiencesCount > 0) completeness += 20
  if (totalSkillsCount > 0) completeness += 15
  if (user.profile?.portfolioPublished) completeness += 5

  // Map Learning Recommendations
  let rapidModules: Array<{
    id: string
    type: string
    duration: string
    title: string
    description: string
    gapTag: string
    ctaText: string
    url: string
  }> = []

  if (dbUserRecommendations.length > 0) {
    rapidModules = dbUserRecommendations.map(rec => {
      const res = rec.resource
      const skillName = rec.skillGapResult?.skill?.name || res.skillTags[0]?.skill?.name || 'Keahlian'

      return {
        id: res.id,
        type:
          res.type === 'course'
            ? 'Kursus'
            : res.type === 'article'
            ? 'Artikel'
            : res.type === 'video'
            ? 'Video'
            : res.type === 'bootcamp'
            ? 'Bootcamp'
            : 'Panduan',
        duration: res.durationMinutes ? `${res.durationMinutes} menit` : 'Fleksibel',
        title: res.title,
        description: res.description || 'Materi pembelajaran untuk menutup skill gap kariermu.',
        gapTag: skillName,
        ctaText: 'Pelajari Sekarang',
        url: res.url
      }
    })
  } else {
    rapidModules = fallbackResources.map(res => ({
      id: res.id,
      type:
        res.type === 'course'
          ? 'Kursus'
          : res.type === 'article'
          ? 'Artikel'
          : res.type === 'video'
          ? 'Video'
          : res.type === 'bootcamp'
          ? 'Bootcamp'
          : 'Panduan',
      duration: res.durationMinutes ? `${res.durationMinutes} menit` : 'Fleksibel',
      title: res.title,
      description: res.description || 'Materi pembelajaran untuk menutup skill gap kariermu.',
      gapTag: res.skillTags[0]?.skill?.name || 'Kompetensi Karier',
      ctaText: 'Pelajari Sekarang',
      url: res.url
    }))
  }

  // Opportunities match scores
  const userSkillIds = new Set(userSkills.map(us => us.skillId))

  const recentOpportunities = dbOpportunities.map(opp => {
    const requiredTags = opp.skillTags.filter(st => st.importance === 'required')
    const tagsToCheck = requiredTags.length > 0 ? requiredTags : opp.skillTags

    let matchScore = 0

    if (tagsToCheck.length > 0 && userSkillIds.size > 0) {
      const metCount = tagsToCheck.filter(st => userSkillIds.has(st.skillId)).length

      matchScore = Math.round((metCount / tagsToCheck.length) * 100)
    } else if (target && readinessScore > 0) {
      matchScore = Math.max(50, Math.min(95, readinessScore))
    }

    return {
      id: opp.id,
      title: opp.title,
      company: opp.company,
      location: opp.location || 'Indonesia (Hybrid)',
      matchScore,
      type:
        opp.type === 'internship'
          ? 'Magang'
          : opp.type === 'full_time'
          ? 'Penuh Waktu'
          : opp.type === 'freelance'
          ? 'Pekerjaan Lepas'
          : opp.type === 'part_time'
          ? 'Paruh Waktu'
          : 'Kompetisi',
      url: opp.sourceUrl || '/career'
    }
  })

  // Real AI Insight
  let aiInsight = null

  if (latestAiJob && latestAiJob.suggestions.length > 0) {
    const rawOutput = latestAiJob.rawOutput as any
    const rawSkills = Array.isArray(rawOutput?.skills) ? rawOutput.skills : []
    const primarySkill = rawSkills[0]

    aiInsight = {
      jobId: latestAiJob.id,
      experienceId: latestAiJob.experienceId,
      projectName: latestAiJob.experience?.title
        ? `${latestAiJob.experience.title}${
            latestAiJob.experience.institutionName ? ` • ${latestAiJob.experience.institutionName}` : ''
          }`
        : 'Pengalaman Terbaru',
      skills: latestAiJob.suggestions.map(s => s.suggestedName),
      suggestions: latestAiJob.suggestions.map(s => ({
        id: s.id,
        name: s.suggestedName,
        category: s.suggestedCategory,
        confidenceScore: Math.round(s.confidenceScore || 85)
      })),
      level: primarySkill?.level
        ? primarySkill.level.charAt(0).toUpperCase() + primarySkill.level.slice(1)
        : 'Menengah',
      reasoning: primarySkill?.reasoning || null
    }
  }

  // Category Distribution
  const hardSkillItems = userSkills.filter(us => us.skill.category === 'hard_skill').length
  const techSkillItems = userSkills.filter(us => us.skill.category === 'technical').length
  const softSkillItems = userSkills.filter(us => us.skill.category === 'soft_skill').length
  const leadershipItems = userSkills.filter(us => us.skill.category === 'leadership').length
  const totalCategorized = hardSkillItems + techSkillItems + softSkillItems + leadershipItems

  const skillDistribution =
    totalCategorized > 0
      ? [
          {
            name: 'Hard Skill',
            count: hardSkillItems,
            percentage: Math.round((hardSkillItems / totalCategorized) * 100),
            color: '#2563EB'
          },
          {
            name: 'Teknis & Tools',
            count: techSkillItems,
            percentage: Math.round((techSkillItems / totalCategorized) * 100),
            color: '#F59E0B'
          },
          {
            name: 'Soft Skill',
            count: softSkillItems,
            percentage: Math.round((softSkillItems / totalCategorized) * 100),
            color: '#10B981'
          },
          {
            name: 'Kepemimpinan & Tim',
            count: leadershipItems,
            percentage: Math.max(
              0,
              100 -
                (Math.round((hardSkillItems / totalCategorized) * 100) +
                  Math.round((techSkillItems / totalCategorized) * 100) +
                  Math.round((softSkillItems / totalCategorized) * 100))
            ),
            color: '#8B5CF6'
          }
        ]
      : []

  // Mini Skill Pattern Map
  let targetSkillsPattern: Array<{
    name: string
    shortName: string
    score: number
    status: string
    level: string
    isGap: boolean
  }> = []

  if (target && target.skillGapResults && target.skillGapResults.length > 0) {
    targetSkillsPattern = target.skillGapResults.slice(0, 7).map(sg => {
      const isGap = sg.gapCategory !== 'strong'
      const score = sg.userScore

      return {
        name: sg.skill.name,
        shortName: sg.skill.name.length > 14 ? `${sg.skill.name.slice(0, 12)}...` : sg.skill.name,
        score: Math.min(100, Math.max(0, score)),
        status:
          sg.gapCategory === 'strong'
            ? 'Tervalidasi'
            : sg.gapCategory === 'develop'
            ? 'Perlu Ditingkatkan'
            : 'Belum Dikuasai',
        level:
          sg.gapCategory === 'strong'
            ? 'Mahir'
            : sg.gapCategory === 'develop'
            ? 'Menengah'
            : 'Belum Memenuhi',
        isGap
      }
    })
  } else if (userSkills.length > 0) {
    targetSkillsPattern = userSkills.slice(0, 7).map(us => ({
      name: us.skill.name,
      shortName: us.skill.name.length > 14 ? `${us.skill.name.slice(0, 12)}...` : us.skill.name,
      score:
        us.score > 0
          ? us.score
          : us.level === 'expert'
          ? 95
          : us.level === 'advanced'
          ? 80
          : us.level === 'intermediate'
          ? 65
          : 40,
      status: 'Tervalidasi',
      level:
        us.level === 'expert'
          ? 'Ahli'
          : us.level === 'advanced'
          ? 'Mahir'
          : us.level === 'intermediate'
          ? 'Menengah'
          : 'Pemula',
      isGap: false
    }))
  }

  // Competency Levels
  const beginnerCount = userSkills.filter(s => s.level === 'beginner').length
  const intermediateCount = userSkills.filter(s => s.level === 'intermediate').length
  const advancedCount = userSkills.filter(s => s.level === 'advanced').length
  const expertCount = userSkills.filter(s => s.level === 'expert').length
  const totalLevels = userSkills.length || 1

  const competencyLevels = [
    {
      label: 'Pemula',
      shortName: 'Beginner',
      count: beginnerCount,
      score: userSkills.length > 0 ? Math.round((beginnerCount / totalLevels) * 100) : 0,
      note: `${beginnerCount} skill pemula`
    },
    {
      label: 'Menengah',
      shortName: 'Intermed',
      count: intermediateCount,
      score: userSkills.length > 0 ? Math.round((intermediateCount / totalLevels) * 100) : 0,
      note: `${intermediateCount} skill operasional`
    },
    {
      label: 'Mahir',
      shortName: 'Advanced',
      count: advancedCount,
      score: userSkills.length > 0 ? Math.round((advancedCount / totalLevels) * 100) : 0,
      note: `${advancedCount} skill portofolio`
    },
    {
      label: 'Ahli',
      shortName: 'Expert',
      count: expertCount,
      score: userSkills.length > 0 ? Math.round((expertCount / totalLevels) * 100) : 0,
      note: `${expertCount} skill spesialisasi`
    }
  ]

  const skillPatternMap = {
    targetRole: targetRoleName || 'Target Karier Belum Dipilih',
    targetSkills: targetSkillsPattern,
    competencyLevels
  }

  const now = new Date()

  return {
    user: {
      name: user.name || 'Pengguna Growvia',
      headline:
        user.profile?.headline ||
        (user.profile?.major ? `Mahasiswa ${user.profile.major}` : 'Pengguna Growvia'),
      avatarUrl: user.avatarUrl,
      dateFormatted: formatIndonesianDate(now),
      semesterTag: user.profile?.graduationYear
        ? `${user.profile.institution ? `${user.profile.institution} • ` : ''}Target Lulus ${user.profile.graduationYear}`
        : 'Profil Karier Terhubung'
    },
    statCards: {
      careerReadiness: {
        percentage: readinessScore,
        trend: target?.lastAnalyzedAt ? 'Evaluasi Aktif' : 'Belum Dianalisis',
        targetRole: subTargetName || 'Belum Ditentukan',
        note: subTargetName ? `Sasaran: ${subTargetName}` : 'Pilih sasaran karier'
      },
      totalSkills: {
        count: totalSkillsCount,
        hardSkillsCount,
        softSkillsCount
      },
      skillGaps: {
        count: target?.skillGapResults?.length || 0,
        label: target?.skillGapResults?.length ? 'Skill Perlu Dikejar' : 'Tidak Ada Gap Aktif',
        targetRole: targetRoleName || 'Belum Ada Target'
      },
      publicPortfolio: {
        completeness,
        status: user.profile?.portfolioPublished ? 'Aktif & Siap Dibagikan' : 'Draft Portofolio',
        previewUrl: user.profile?.portfolioSlug ? `/u/${user.profile.portfolioSlug}` : '/portfolio'
      }
    },
    metodologi: {
      experiencesCount: totalExperiencesCount,
      skillsCount: totalSkillsCount,
      gapCount: target?.skillGapResults?.length || 0,
      opportunitiesCount: dbOpportunitiesCount
    },
    charts: {
      skillPatternMap,
      skillDistribution
    },
    aiInsight,
    recentExperiences: mappedExperiences,
    recentOpportunities,
    targetCareer: {
      roleName: targetRoleName || 'Belum Memilih Target Karier',
      industry: targetIndustry,
      matchPercent: readinessScore,
      threshold: 85,
      missingSkillsCount: allGaps.length,
      gaps: allGaps
    },
    rapidModules
  }
}
