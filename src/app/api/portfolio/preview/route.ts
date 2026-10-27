import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiError, apiSuccess } from '@/server/utils/response'
import type {
  PublicPortfolioData,
  PortfolioSkillItem,
  PortfolioExperienceItem
} from '@/types/portfolio'

export async function GET() {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { email: 'demo@growvia.id' }
      })

      const firstUser = demoUser || (await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } }))

      userId = firstUser?.id
    }

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi', 401)
    }

    // 1. Ambil data User & Profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      return apiError('Data pengguna tidak ditemukan', 404)
    }

    // Buat slug default jika belum ada
    let profile = user.profile

    if (!profile) {
      const defaultSlug =
        user.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'portfolio'

      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          portfolioSlug: defaultSlug,
          portfolioPublished: false,
          headline: 'Aspiring Professional',
          bio: 'Mahasiswa / Talenta teknologi aktif'
        }
      })
    } else if (!profile.portfolioSlug) {
      const defaultSlug =
        user.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'portfolio'

      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { portfolioSlug: defaultSlug }
      })
    }

    // 2. Ambil data Pengalaman
    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    })

    const mappedExperiences: PortfolioExperienceItem[] = experiences.map(exp => ({
      id: exp.id,
      title: exp.title,
      role: exp.role,
      institutionName: exp.institutionName,
      type: exp.type as any,
      startDate: exp.startDate.toISOString().split('T')[0],
      endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
      isOngoing: exp.isOngoing,
      description: exp.description,
      proofUrl: exp.proofUrl
    }))

    // 3. Ambil data Skill & Evidences
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

    const mappedSkills: PortfolioSkillItem[] = userSkills.map(us => ({
      id: us.skillId,
      name: us.skill.name,
      category: us.skill.category as any,
      level: us.level as any,
      score: us.score,
      source: us.source as any,
      aiConfidence: us.aiConfidence,
      evidences: us.skillEvidences.map(ev => ({
        id: ev.id,
        experienceId: ev.experienceId,
        experienceTitle: ev.experience.title,
        institutionName: ev.experience.institutionName,
        note: ev.note
      }))
    }))

    // 4. Ambil Target Karier Aktif
    const target = await prisma.userCareerTarget.findFirst({
      where: { userId, isActive: true },
      include: { careerRole: true }
    })

    const careerTarget = target
      ? {
          roleName: target.careerRole?.name || target.customCareerName || 'Software Engineer',
          readinessScore: target.readinessScore
        }
      : null

    const payload: PublicPortfolioData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      profile: {
        institution: profile.institution,
        major: profile.major,
        graduationYear: profile.graduationYear,
        bio: profile.bio,
        headline: profile.headline,
        portfolioSlug: profile.portfolioSlug,
        portfolioPublished: profile.portfolioPublished
      },
      careerTarget,
      skills: mappedSkills,
      experiences: mappedExperiences,
      theme: (profile.portfolioTheme as any) || 'royal-blue',
      sections: (profile.portfolioSections as any) || undefined
    }

    return apiSuccess(payload, 'Data preview portofolio berhasil dimuat')
  } catch (error: any) {
    console.error('Error fetching portfolio preview:', error)
    
return apiError('Gagal memuat data preview portofolio', 500, error)
  }
}
