import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

/**
 * GET /api/career-fields
 * Mengambil master data bidang karier untuk onboarding & eksplorasi
 */
export async function GET() {
  try {
    const careerFields = await prisma.careerField.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true
      }
    })

    return apiSuccess(careerFields, 'Daftar bidang karier berhasil diambil')
  } catch (error) {
    console.error('Error fetching career fields:', error)
    return apiError('Gagal mengambil daftar bidang karier', 500, error)
  }
}
