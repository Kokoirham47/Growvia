import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { onboardingInterestsSchema } from '@/server/validations/onboarding'

/**
 * POST /api/onboarding/interests
 * Menyimpan preferensi bidang minat karier mahasiswa (Step 2 Onboarding F02.2)
 * Batasan: Minimal 1, Maksimal 3 bidang karier
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const validated = onboardingInterestsSchema.parse(body)

    // Cari atau buat profile jika belum ada
    let profile = await prisma.profile.findUnique({
      where: { userId }
    })

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId,
          portfolioSlug: `user-${userId.substring(0, 8)}`
        }
      })
    }

    // Verifikasi bahwa semua careerFieldIds yang dikirimkan valid di database
    const validFields = await prisma.careerField.findMany({
      where: {
        id: { in: validated.careerFieldIds }
      }
    })

    if (validFields.length !== validated.careerFieldIds.length) {
      return apiError('Satu atau lebih bidang karier yang dipilih tidak valid', 400)
    }

    // Gunakan transaction untuk menyinkronkan career interests
    await prisma.$transaction(async tx => {
      // Hapus pilihan lama untuk profil ini
      await tx.careerInterest.deleteMany({
        where: { profileId: profile.id }
      })

      // Simpan pilihan baru
      if (validated.careerFieldIds.length > 0) {
        await tx.careerInterest.createMany({
          data: validated.careerFieldIds.map(cfId => ({
            profileId: profile.id,
            careerFieldId: cfId
          }))
        })
      }
    })

    // Ambil data terbaru dengan relasi
    const updatedInterests = await prisma.careerInterest.findMany({
      where: { profileId: profile.id },
      include: {
        careerField: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        }
      }
    })

    return apiSuccess(
      {
        profileId: profile.id,
        interests: updatedInterests.map(i => i.careerField)
      },
      'Preferensi bidang karier berhasil disimpan'
    )
  } catch (error) {
    console.error('Error saving career interests:', error)
    return apiError('Gagal menyimpan preferensi bidang karier', 400, error)
  }
}
