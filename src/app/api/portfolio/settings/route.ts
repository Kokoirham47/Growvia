import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiError, apiSuccess } from '@/server/utils/response'
import type { PortfolioSettingsPayload } from '@/types/portfolio'

const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'login',
  'register',
  'home',
  'dashboard',
  'portfolio',
  'settings',
  'u',
  'auth',
  'null',
  'undefined',
  'experience',
  'skills',
  'career',
  'learning',
  'opportunities'
])

export async function PUT(req: Request) {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi', 401)
    }

    const body: PortfolioSettingsPayload = await req.json()
    const { portfolioPublished, portfolioSlug, headline, bio, theme, sections } = body

    // 1. Validasi format slug
    const cleanSlug = portfolioSlug
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (!cleanSlug || cleanSlug.length < 3) {
      return apiError('Slug URL minimal 3 karakter huruf kecil atau angka.', 400)
    }

    if (cleanSlug.length > 40) {
      return apiError('Slug URL maksimal 40 karakter.', 400)
    }

    if (RESERVED_SLUGS.has(cleanSlug)) {
      return apiError(`Slug "${cleanSlug}" adalah kata kunci sistem yang tidak dapat digunakan.`, 400)
    }

    // 2. Cek keunikan slug di pengguna lain
    const existingSlug = await prisma.profile.findFirst({
      where: {
        portfolioSlug: cleanSlug,
        NOT: { userId }
      }
    })

    if (existingSlug) {
      return apiError(
        `Alamat tautan "/u/${cleanSlug}" sudah dipakai oleh pengguna lain. Silakan pilih kombinasi nama lain.`,
        400
      )
    }

    // 3. Upsert / Update Profil Pengguna
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        portfolioSlug: cleanSlug,
        portfolioPublished: Boolean(portfolioPublished),
        ...(headline !== undefined ? { headline } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(theme !== undefined ? { portfolioTheme: theme } : {}),
        ...(sections !== undefined ? { portfolioSections: sections as any } : {})
      },
      create: {
        userId,
        portfolioSlug: cleanSlug,
        portfolioPublished: Boolean(portfolioPublished),
        headline: headline || 'Aspiring Professional',
        bio: bio || '',
        portfolioTheme: theme || 'royal-blue',
        portfolioSections: sections ? (sections as any) : undefined
      }
    })

    return apiSuccess(
      {
        portfolioSlug: updatedProfile.portfolioSlug,
        portfolioPublished: updatedProfile.portfolioPublished,
        theme: updatedProfile.portfolioTheme,
        sections: updatedProfile.portfolioSections,
        publicUrl: `/u/${updatedProfile.portfolioSlug}`
      },
      updatedProfile.portfolioPublished
        ? 'Portofolio berhasil dipublikasikan secara publik!'
        : 'Pengaturan portofolio disimpan dalam status draf privat.'
    )
  } catch (error: any) {
    console.error('Error updating portfolio settings:', error)
    
return apiError('Gagal memperbarui pengaturan portofolio', 500, error)
  }
}
