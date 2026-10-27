import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

/**
 * GET /api/onboarding/status
 * Mengambil status kemajuan onboarding pengguna saat ini
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            careerInterests: {
              include: {
                careerField: true
              }
            }
          }
        },
        experiences: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    const hasBasicProfile = Boolean(user.profile?.institution && user.profile?.major)
    const hasInterests = Boolean(user.profile?.careerInterests && user.profile.careerInterests.length > 0)
    const experienceCount = user.experiences.length

    // Hitung step yang disarankan
    let currentStep = 1
    if (hasBasicProfile && !hasInterests) {
      currentStep = 2
    } else if (hasBasicProfile && hasInterests) {
      currentStep = 3
    }

    return apiSuccess({
      isCompleted: hasBasicProfile,
      currentStep,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      profile: user.profile
        ? {
            institution: user.profile.institution,
            major: user.profile.major,
            graduationYear: user.profile.graduationYear,
            bio: user.profile.bio,
            headline: user.profile.headline,
            portfolioSlug: user.profile.portfolioSlug
          }
        : null,
      interests: user.profile?.careerInterests.map(ci => ci.careerField) || [],
      experienceCount
    })
  } catch (error) {
    console.error('Error fetching onboarding status:', error)
    return apiError('Gagal memeriksa status onboarding', 500, error)
  }
}
