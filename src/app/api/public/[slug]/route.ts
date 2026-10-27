import { prisma } from '@/libs/prisma'
import { apiError, apiSuccess } from '@/server/utils/response'
import type {
  PublicPortfolioData,
  PortfolioSkillItem,
  PortfolioExperienceItem
} from '@/types/portfolio'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const cleanSlug = slug?.trim().toLowerCase()

    if (!cleanSlug) {
      return apiError('Slug portofolio tidak valid', 400)
    }

    // 1. Cari profil berdasarkan slug
    const profile = await prisma.profile.findFirst({
      where: {
        portfolioSlug: cleanSlug
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!profile) {
      return apiError('Portofolio dengan alamat ini tidak ditemukan', 404, {
        code: 'NOT_FOUND'
      })
    }

    if (!profile.portfolioPublished) {
      return apiError(
        'Portofolio ini sedang dalam status privat atau belum dipublikasikan oleh pemiliknya.',
        403,
        {
          code: 'PRIVATE_PORTFOLIO',
          userName: profile.user.name
        }
      )
    }

    const userId = profile.userId

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

    // 3. Ambil data Keahlian terverifikasi dengan bukti riil
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

    // 4. Ambil target peran aktif
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
        id: profile.user.id,
        name: profile.user.name,
        avatarUrl: profile.user.avatarUrl
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

    return apiSuccess(payload, 'Portofolio publik berhasil dimuat')
  } catch (error: any) {
    console.error('Error fetching public portfolio:', error)
    
return apiError('Gagal memuat data portofolio publik', 500, error)
  }
}
