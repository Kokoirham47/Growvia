import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { onboardingProfileSchema } from '@/server/validations/onboarding'

/**
 * Helper to slugify user name for initial portfolioSlug
 */
function createSlug(name: string, fallbackId: string) {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${clean || 'user'}-${randomSuffix}`
}

/**
 * POST /api/onboarding/profile
 * Menyimpan profil akademik dasar mahasiswa (Step 1 Onboarding F02.1)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const validated = onboardingProfileSchema.parse(body)

    // Periksa keberadaan user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    // Update nama jika diubah di form onboarding
    if (validated.name && validated.name !== user.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: validated.name }
      })
    }

    // Default portfolio slug jika belum ada
    const portfolioSlug = user.profile?.portfolioSlug || createSlug(validated.name || user.name, user.id)

    // Upsert profil pengguna
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        institution: validated.institution,
        major: validated.major,
        graduationYear: validated.graduationYear,
        bio: validated.bio || user.profile?.bio,
        headline: validated.headline || `${validated.major} at ${validated.institution}`,
        portfolioSlug: user.profile?.portfolioSlug || portfolioSlug
      },
      create: {
        userId,
        institution: validated.institution,
        major: validated.major,
        graduationYear: validated.graduationYear,
        bio: validated.bio,
        headline: validated.headline || `${validated.major} at ${validated.institution}`,
        portfolioSlug
      }
    })

    return apiSuccess(
      {
        profile,
        user: {
          id: user.id,
          name: validated.name || user.name,
          email: user.email
        }
      },
      'Profil dasar berhasil disimpan'
    )
  } catch (error) {
    console.error('Error saving onboarding profile:', error)
    return apiError('Gagal menyimpan data profil dasar', 400, error)
  }
}
