import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { onboardingExperienceSchema } from '@/server/validations/onboarding'

/**
 * POST /api/onboarding/experience
 * Menyimpan pengalaman pertama pengguna jika memilih opsi tambah pengalaman di Step 3 (F02.3)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const validated = onboardingExperienceSchema.parse(body)

    // Parsing tanggal mulai
    const startDate = new Date(validated.startDate)
    if (isNaN(startDate.getTime())) {
      return apiError('Format tanggal mulai tidak valid', 400)
    }

    // Parsing tanggal selesai jika ada
    let endDate: Date | null = null
    if (!validated.isOngoing && validated.endDate) {
      endDate = new Date(validated.endDate)
      if (isNaN(endDate.getTime())) {
        return apiError('Format tanggal selesai tidak valid', 400)
      }
    }

    // Buat entitas pengalaman baru
    const experience = await prisma.experience.create({
      data: {
        userId,
        title: validated.title,
        type: validated.type,
        role: validated.role,
        institutionName: validated.institutionName,
        startDate,
        endDate,
        isOngoing: validated.isOngoing,
        description: validated.description || null,
        proofUrl: validated.proofUrl || null
      }
    })

    return apiSuccess(experience, 'Pengalaman pertama berhasil ditambahkan', 201)
  } catch (error) {
    console.error('Error saving onboarding first experience:', error)
    return apiError('Gagal menyimpan pengalaman pertama', 400, error)
  }
}
