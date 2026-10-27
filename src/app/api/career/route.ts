import type { NextRequest } from 'next/server'

import { GapCategory } from '@prisma/client'

import { prisma } from '@/libs/prisma'
import { getGeminiModel } from '@/libs/ai/gemini'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import type { CareerTargetProfile, LearningResourceItem, SkillChipItem, SoftSkillCardItem, SkillGapStatus } from '@/types/career'

/**
 * Format relative date time in Indonesian
 */
function formatLastUpdated(date?: Date | null): string {
  if (!date) return 'Baru saja dianalisis'
  const diffMinutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000)

  if (diffMinutes < 5) return 'Baru saja dianalisis'
  if (diffMinutes < 60) return `Update ${diffMinutes} menit lalu`
  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) return `Update ${diffHours} jam lalu`
  const diffDays = Math.floor(diffHours / 24)

  
return `Update ${diffDays} hari lalu`
}

interface GenerateAiCareerParams {
  userName: string
  roleName: string
  industry: string
  readinessScore: number
  strongSkills: string[]
  developSkills: string[]
  missingSkills: string[]
  latestExpTitle?: string
  latestExpInstitution?: string
}

/**
 * Generate real AI career insight and dynamic 30-day roadmap tailored to user profile
 */
async function generateAiCareerInsightAndRoadmap(params: GenerateAiCareerParams): Promise<{
  aiInsight: string
  highlightedKeywords: string[]
  growthRoadmap: CareerTargetProfile['growthRoadmap']
}> {
  const {
    userName,
    roleName,
    industry,
    readinessScore,
    strongSkills,
    developSkills,
    missingSkills,
    latestExpTitle,
    latestExpInstitution
  } = params

  const topStrong = strongSkills[0] || 'Kompetensi Fondasi'
  const topGap = missingSkills[0] || developSkills[0] || 'Skill Spesialisasi'
  const secondaryGap = missingSkills[1] || developSkills[1] || 'Studi Kasus Portofolio'

  const totalGap = Math.max(10, 100 - readinessScore)
  const step1GainNum = Math.max(6, Math.min(22, Math.round(totalGap * 0.45)))
  const step2GainNum = Math.max(5, Math.min(18, Math.round(totalGap * 0.35)))

  // Heuristic dynamic formula
  const defaultInsight = `${userName}, kamu memiliki fondasi yang baik pada '${topStrong}'${
    latestExpInstitution ? ` dari pengalaman di ${latestExpInstitution}` : ''
  }. Untuk bersaing kuat di role ${roleName}, prioritaskan penguasaan '${topGap}' dan '${secondaryGap}'.`

  const defaultRoadmap: CareerTargetProfile['growthRoadmap'] = [
    {
      step: 1,
      title: `Kuasai Fondasi & Praktik '${topGap}'`,
      estDays: 'Est. 3-5 Hari',
      description: `Pelajari modul terstruktur dan lab praktis ${topGap} untuk menutup gap kompetensi paling kritis pada posisi ${roleName}.`,
      footerLabel: 'Buka Modul Belajar',
      gainLabel: `+${step1GainNum}% Kesiapan`,
      type: 'course',
      actionType: 'learning_modal',
      targetSkill: topGap
    },
    {
      step: 2,
      title: `Update Studi Kasus Portofolio ${roleName}`,
      estDays: 'Est. 5-7 Hari',
      description: `Unggah bukti artefak proyek terapan yang mengintegrasikan ${secondaryGap} ke portofolio Anda dengan metrik hasil bisnis yang terukur.`,
      footerLabel: 'Buka Portofolio AI',
      gainLabel: `+${step2GainNum}% Kesiapan`,
      type: 'portfolio',
      actionType: 'portfolio',
      actionUrl: '/dashboard/portfolio'
    },
    {
      step: 3,
      title: `Kirim Lamaran ke Mitra Lowongan ${roleName}`,
      estDays: 'Target Akhir (Hari 15-30)',
      description: `Gunakan fitur Fast-Track Apply Growvia untuk lowongan ${roleName} terverifikasi dengan rekomendasi kecocokan kualifikasi 85%+.`,
      footerLabel: 'Jelajahi Lowongan',
      gainLabel: 'Siap Kerja 95%+',
      type: 'application',
      actionType: 'opportunities',
      actionUrl: '/dashboard/opportunities'
    }
  ]

  const isMock = process.env.AI_MOCK_MODE === 'true'
  const groqKey = process.env.GROQ_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  if (isMock || (!groqKey && !geminiKey)) {
    return {
      aiInsight: defaultInsight,
      highlightedKeywords: [topGap, secondaryGap],
      growthRoadmap: defaultRoadmap
    }
  }

  const prompt = `Anda adalah asisten AI Career Advisor profesional dari Growvia.
Data Profil Pengguna:
- Nama: "${userName}"
- Target Posisi: "${roleName}" (Industri: ${industry})
- Skor Kesiapan: ${readinessScore}%
- Skill Unggulan: ${strongSkills.slice(0, 3).join(', ') || 'Belum ada'}
- Pengalaman Terakhir: ${latestExpTitle ? `${latestExpTitle} di ${latestExpInstitution}` : 'Portofolio Mandiri'}
- Gap Kritis (Missing): ${missingSkills.slice(0, 3).join(', ') || '-'}
- Perlu Ditingkatkan (Develop): ${developSkills.slice(0, 3).join(', ') || '-'}

Buatkan respon JSON murni dengan schema persis berikut:
{
  "aiInsight": "1 sampai 2 kalimat personal tajam menyapa '${userName}'. Puji fondasinya pada '${topStrong}', lalu sebutkan fokus utama pada '${topGap}' dan '${secondaryGap}' untuk role ${roleName}. Tuliskan nama skill di dalam tanda petik tunggal 'Nama Skill'. Jangan gunakan nama selain ${userName}.",
  "keywords": ["${topGap}", "${secondaryGap}"],
  "steps": [
    {
      "step": 1,
      "title": "Kuasai Fondasi & Praktik '${topGap}'",
      "estDays": "Est. 3-5 Hari",
      "description": "Deskripsi aksi konkret belajar ${topGap} untuk menutup gap utama.",
      "footerLabel": "Buka Modul Belajar",
      "gainLabel": "+${step1GainNum}% Kesiapan",
      "type": "course",
      "actionType": "learning_modal",
      "targetSkill": "${topGap}"
    },
    {
      "step": 2,
      "title": "Update Studi Kasus Portofolio ${roleName}",
      "estDays": "Est. 5-7 Hari",
      "description": "Deskripsi membuat artefak proyek dengan metrik hasil nyata terkait ${secondaryGap}.",
      "footerLabel": "Buka Portofolio AI",
      "gainLabel": "+${step2GainNum}% Kesiapan",
      "type": "portfolio",
      "actionType": "portfolio",
      "actionUrl": "/dashboard/portfolio"
    },
    {
      "step": 3,
      "title": "Kirim Lamaran ke Mitra Lowongan ${roleName}",
      "estDays": "Target Akhir (Hari 15-30)",
      "description": "Deskripsi melamar lowongan ${roleName} terverifikasi via Growvia.",
      "footerLabel": "Jelajahi Lowongan",
      "gainLabel": "Siap Kerja 95%+",
      "type": "application",
      "actionType": "opportunities",
      "actionUrl": "/dashboard/opportunities"
    }
  ]
}
Keluarkan HANYA JSON tanpa teks pengantar atau markdown (\`\`\`json).`

  try {
    if (groqKey) {
      const sanitizedKey = groqKey.startsWith('gskgsk_') ? groqKey.replace('gskgsk_', 'gsk_') : groqKey

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sanitizedKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [
            { role: 'system', content: 'Anda asisten AI yang hanya mengeluarkan JSON murni tanpa markdown.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2
        }),
        signal: AbortSignal.timeout(4500)
      })

      if (response.ok) {
        const json = await response.json()
        const raw = json.choices?.[0]?.message?.content?.trim() || ''
        const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
        const parsed = JSON.parse(clean)

        if (parsed?.aiInsight && Array.isArray(parsed?.steps)) {
          return {
            aiInsight: parsed.aiInsight,
            highlightedKeywords: parsed.keywords || [topGap, secondaryGap],
            growthRoadmap: parsed.steps
          }
        }
      }
    }

    if (geminiKey) {
      const model = getGeminiModel('gemini-1.5-flash')
      const result = await model.generateContent(prompt)
      const raw = result.response.text().trim()
      const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
      const parsed = JSON.parse(clean)

      if (parsed?.aiInsight && Array.isArray(parsed?.steps)) {
        return {
          aiInsight: parsed.aiInsight,
          highlightedKeywords: parsed.keywords || [topGap, secondaryGap],
          growthRoadmap: parsed.steps
        }
      }
    }
  } catch (err) {
    console.warn('AI career generator fallback to heuristic formula:', err)
  }

  return {
    aiInsight: defaultInsight,
    highlightedKeywords: [topGap, secondaryGap],
    growthRoadmap: defaultRoadmap
  }
}

/**
 * Helper to compute CareerTargetProfile from Supabase records
 */
async function computeCareerProfile(userId: string, careerRoleId?: string): Promise<{ profile: CareerTargetProfile; targetId: string }> {
  // 1. Dapatkan peran karier dari Supabase
  let role = careerRoleId
    ? await prisma.careerRole.findUnique({
        where: { id: careerRoleId },
        include: { roleSkills: { include: { skill: true } } }
      })
    : null

  if (!role) {
    // Ambil default peran pertama
    role = await prisma.careerRole.findFirst({
      include: { roleSkills: { include: { skill: true } } }
    })
  }

  if (!role) {
    throw new Error('Tidak ada data peran karier di database Supabase')
  }

  // 2. Dapatkan atau buat UserCareerTarget aktif di Supabase
  let target = await prisma.userCareerTarget.findFirst({
    where: { userId, isActive: true },
    include: { careerRole: { include: { roleSkills: { include: { skill: true } } } } }
  })

  if (!target || (careerRoleId && target.careerRoleId !== careerRoleId)) {
    if (target) {
      await prisma.userCareerTarget.update({
        where: { id: target.id },
        data: { isActive: false }
      })
    }

    target = await prisma.userCareerTarget.create({
      data: {
        userId,
        careerRoleId: role.id,
        isActive: true,
        lastAnalyzedAt: new Date()
      },
      include: { careerRole: { include: { roleSkills: { include: { skill: true } } } } }
    })
  }

  // 3. Ambil skill user dari Supabase
  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    include: {
      skill: true,
      skillEvidences: {
        include: { experience: true }
      }
    }
  })

  // Buat lookup map dari skill user (berdasarkan normalizedName dan lowercase name)
  const userSkillMap = new Map<string, typeof userSkills[0]>()

  for (const us of userSkills) {
    userSkillMap.set(us.skillId, us)
    userSkillMap.set(us.skill.name.toLowerCase().trim(), us)

    if (us.skill.normalizedName) {
      userSkillMap.set(us.skill.normalizedName.toLowerCase().trim(), us)
    }
  }

  // 4. Analisis komparasi live skill gap
  const strongSkills: SkillChipItem[] = []
  const developSkills: SkillChipItem[] = []
  const missingSkills: SkillChipItem[] = []

  let totalScoreSum = 0
  let evaluatedSkillsCount = 0

  for (const rs of role.roleSkills) {
    const s = rs.skill

    evaluatedSkillsCount++

    // Cari kecocokan di skill user
    const matched =
      userSkillMap.get(s.id) ||
      userSkillMap.get(s.name.toLowerCase().trim()) ||
      (s.normalizedName ? userSkillMap.get(s.normalizedName.toLowerCase().trim()) : null)

    const userScore = matched ? matched.score : 0

    totalScoreSum += userScore

    const status: SkillGapStatus = userScore >= 80 ? 'strong' : userScore >= 40 ? 'develop' : 'missing'
    const gapCategoryPrisma = userScore >= 80 ? GapCategory.strong : userScore >= 40 ? GapCategory.develop : GapCategory.missing

    const item: SkillChipItem = {
      id: s.id,
      name: s.name,
      status,
      score: userScore,
      evidenceCount: matched?.skillEvidences?.length || 0,
      evidenceSource: matched?.skillEvidences?.[0]?.experience?.institutionName
        ? `Terverifikasi ${matched.skillEvidences[0].experience.institutionName}`
        : userScore > 0
          ? 'Portofolio Terverifikasi'
          : 'Belum ada bukti portofolio',
      category: s.category === 'soft_skill' ? 'Soft Skill' : s.category === 'technical' ? 'Tools & Cloud' : 'Hard Skill',
      description: matched?.skillEvidences?.[0]?.note || `Kompetensi ${s.name} untuk peran ${role.name}.`,
      priority: status === 'missing' ? 'high' : 'medium'
    }

    if (status === 'strong') strongSkills.push(item)
    else if (status === 'develop') developSkills.push(item)
    else missingSkills.push(item)

    // Simpan ke database Supabase skill_gap_results
    await prisma.skillGapResult.upsert({
      where: {
        id: (await prisma.skillGapResult.findFirst({
          where: { userCareerTargetId: target.id, skillId: s.id },
          select: { id: true }
        }))?.id || '00000000-0000-0000-0000-000000000000'
      },
      update: {
        gapCategory: gapCategoryPrisma,
        userScore,
        requiredScore: rs.importance === 'required' ? 85 : 70,
        gapScore: Math.max(0, (rs.importance === 'required' ? 85 : 70) - userScore),
        analyzedAt: new Date()
      },
      create: {
        userCareerTargetId: target.id,
        skillId: s.id,
        gapCategory: gapCategoryPrisma,
        userScore,
        requiredScore: rs.importance === 'required' ? 85 : 70,
        gapScore: Math.max(0, (rs.importance === 'required' ? 85 : 70) - userScore),
        analyzedAt: new Date()
      }
    })
  }

  // Hitung Skor Kesiapan (Readiness Score)
  const calculatedReadiness = evaluatedSkillsCount > 0
    ? Math.min(100, Math.max(15, Math.round(totalScoreSum / evaluatedSkillsCount)))
    : 70

  // Update target di Supabase
  await prisma.userCareerTarget.update({
    where: { id: target.id },
    data: {
      readinessScore: calculatedReadiness,
      lastAnalyzedAt: new Date()
    }
  })

  // Format status kesiapan
  let readinessStatus: 'Ready' | 'Developing' | 'Foundational' = 'Developing'
  let readinessBadgeColor = '#F59E0B'

  if (calculatedReadiness >= 80) {
    readinessStatus = 'Ready'
    readinessBadgeColor = '#16A34A'
  } else if (calculatedReadiness < 50) {
    readinessStatus = 'Foundational'
    readinessBadgeColor = '#2563EB'
  }

  // Siapkan Soft Skills dari data userSkills
  const softSkillsList: SoftSkillCardItem[] = userSkills
    .filter(us => us.skill.category === 'soft_skill' || us.skill.category === 'leadership')
    .slice(0, 4)
    .map(us => ({
      id: us.id,
      name: us.skill.name,
      badge: us.score >= 80 ? 'Strong' : 'Intermediate',
      badgeType: us.score >= 80 ? 'strong' : 'intermediate',
      description: us.skillEvidences?.[0]?.note || `Penguasaan ${us.skill.name} tervalidasi dari aktivitas organisasi & kepanitiaan.`,
      score: us.score
    }))

  // 5. Query user profile untuk personalisasi AI nyata
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      experiences: {
        orderBy: { startDate: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          institutionName: true,
          type: true
        }
      }
    }
  })

  const userName = user?.name ? user.name.split(' ')[0] : 'Sobat Growvia'
  const latestExp = user?.experiences?.[0]

  // Generate Growth Roadmap & Insight langsung dari AI
  const {
    aiInsight,
    highlightedKeywords,
    growthRoadmap
  } = await generateAiCareerInsightAndRoadmap({
    userName,
    roleName: role.name,
    industry: role.industry || 'Tech & Digital Industry',
    readinessScore: calculatedReadiness,
    strongSkills: strongSkills.map(s => s.name),
    developSkills: developSkills.map(s => s.name),
    missingSkills: missingSkills.map(s => s.name),
    latestExpTitle: latestExp?.title,
    latestExpInstitution: latestExp?.institutionName
  })

  // Dynamic Detailed Matrix
  const detailedMatrix = [
    {
      category: 'Kompetensi Inti Posisi',
      description: `Skill utama yang dinilai oleh recruiter untuk posisi ${role.name}`,
      skillsCountLabel: `${role.roleSkills.length} Skill Dievaluasi`,
      skills: role.roleSkills.map(rs => {
        const matched =
          userSkillMap.get(rs.skill.id) ||
          userSkillMap.get(rs.skill.name.toLowerCase().trim()) ||
          (rs.skill.normalizedName ? userSkillMap.get(rs.skill.normalizedName.toLowerCase().trim()) : null)

        const score = matched ? matched.score : 0
        const status: SkillGapStatus = score >= 80 ? 'strong' : score >= 40 ? 'develop' : 'missing'

        const actionType: 'qualified' | 'recommend' | 'intro_module' =
          status === 'strong' ? 'qualified' : status === 'develop' ? 'recommend' : 'intro_module'

        return {
          id: rs.skill.id,
          name: rs.skill.name,
          status,
          score,
          evidenceNote: matched?.skillEvidences?.[0]?.experience?.institutionName
            ? `Terverifikasi di ${matched.skillEvidences[0].experience.institutionName}`
            : score > 0
              ? 'Tervalidasi di Profil'
              : 'Belum ada bukti pengalaman',
          actionType,
          actionLabel: status === 'strong' ? 'Kualifikasi Tercapai' : status === 'develop' ? 'Lihat Rekomendasi Belajar' : 'Ambil Modul Pengantar'
        }
      })
    }
  ]

  const salaryRange =
    role.slug === 'ai-engineer'
      ? 'Rp 12.000.000 – Rp 22.000.000'
      : role.slug === 'frontend-engineer'
        ? 'Rp 10.000.000 – Rp 18.000.000'
        : role.slug === 'product-manager'
          ? 'Rp 11.000.000 – Rp 19.000.000'
          : 'Rp 9.000.000 – Rp 15.000.000'

  const profile: CareerTargetProfile = {
    id: role.id,
    title: role.name,
    companyType: role.industry || 'Tech & Digital Industry',
    level: 'Junior / Entry Level',
    readinessScore: calculatedReadiness,
    readinessStatus,
    readinessBadgeColor,
    verifiedJobsCount: 140,
    lastUpdated: formatLastUpdated(target.lastAnalyzedAt),
    salaryRange,
    summary: role.description || `Target karier profesional sebagai ${role.name}.`,
    aiInsight,
    highlightedKeywords,
    competentCount: strongSkills.length,
    totalSkillsCount: role.roleSkills.length,
    developCount: developSkills.length,
    missingCount: missingSkills.length,
    strongSkills,
    developSkills,
    missingSkills,
    detailedMatrix,
    softSkills: softSkillsList,
    growthRoadmap
  }

  return { profile, targetId: target.id }
}

/**
 * GET /api/career
 * Mengambil analisis skill gap karier aktif pengguna dari Supabase
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    // 1. Ambil seluruh daftar role yang tersedia di Supabase
    const availableRolesRaw = await prisma.careerRole.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        description: true
      }
    })

    // 2. Ambil target aktif user (jika ada param ?roleId=xxx gunakan yang dipilih)
    const { searchParams } = new URL(req.url)
    const roleIdParam = searchParams.get('roleId') || undefined

    const { profile } = await computeCareerProfile(userId, roleIdParam)

    // 3. Ambil rekomendasi pembelajaran dari tabel learning_resources di Supabase
    const dbResources = await prisma.learningResource.findMany({
      where: { isActive: true },
      include: {
        skillTags: {
          include: { skill: true }
        }
      },
      take: 6
    })

    const learningResources: LearningResourceItem[] = dbResources.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type === 'bootcamp' ? 'Industry Workshop' : r.type === 'course' ? 'Hands-on Project' : 'Video Lab',
      provider: r.platform,
      duration: `${Math.round((r.durationMinutes || 180) / 60)} Jam`,
      targetSkill: r.skillTags[0]?.skill?.name || 'Kompetensi Terkait',
      difficulty: r.difficulty === 'advanced' ? 'Advanced' : r.difficulty === 'intermediate' ? 'Intermediate' : 'Beginner',
      rating: r.rating || 4.8,
      reviewsCount: 320,
      isFree: true,
      description: r.title,
      url: r.url
    }))

    return apiSuccess({
      career: profile,
      availableRoles: availableRolesRaw,
      learningResources
    })
  } catch (error: any) {
    console.error('Error fetching career gap analysis from Supabase:', error)
    
return apiError(error.message || 'Gagal mengambil data analisis karier', 500)
  }
}

/**
 * POST /api/career
 * Mengubah target karier atau menganalisis ulang di Supabase
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const { action, careerRoleId } = body

    if (action === 'change_target') {
      if (!careerRoleId) {
        return apiError('careerRoleId wajib disertakan untuk mengganti target', 400)
      }

      const { profile } = await computeCareerProfile(userId, careerRoleId)

      
return apiSuccess({ career: profile }, 'Target karier berhasil diperbarui di Supabase')
    }

    if (action === 'reanalyze') {
      const activeTarget = await prisma.userCareerTarget.findFirst({
        where: { userId, isActive: true }
      })

      const { profile } = await computeCareerProfile(userId, activeTarget?.careerRoleId || undefined)

      
return apiSuccess({ career: profile }, 'Analisis ulang skill gap berhasil diselesaikan')
    }

    return apiError('Aksi tidak dikenal', 400)
  } catch (error: any) {
    console.error('Error processing career action in Supabase:', error)
    
return apiError(error.message || 'Gagal memproses aksi karier', 500)
  }
}
