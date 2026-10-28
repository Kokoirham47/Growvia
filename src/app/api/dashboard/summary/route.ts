import type { NextRequest } from 'next/server'

import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { getDashboardSummaryData } from '@/server/services/dashboardService'

export async function getAuthUserId(request?: NextRequest): Promise<string | null> {
  const headerUserId = request?.headers.get('x-user-id')

  if (headerUserId) return headerUserId

  const session = await getServerSession()

  if (session?.userId) return session.userId

  // In development, fallback to demo user or first user with active career targets
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo@growvia.id' },
    select: { id: true }
  })

  if (demoUser) return demoUser.id

  const fallbackUser = await prisma.user.findFirst({
    where: { careerTargets: { some: { isActive: true } } },
    select: { id: true }
  })

  return fallbackUser?.id ?? null
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    const data = await getDashboardSummaryData(userId)

    if (!data) {
      return apiError('Data pengguna tidak ditemukan.', 404)
    }

    return apiSuccess(data)
  } catch (error: any) {
    console.error('Error in /api/dashboard/summary:', error)

    return apiError(
      error?.message ? `Gagal memuat data dashboard: ${error.message}` : 'Gagal memuat data dashboard dari database.',
      500,
      {
        name: error?.name,
        code: error?.code,
        meta: error?.meta
      }
    )
  }
}
