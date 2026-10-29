import type { NextRequest } from 'next/server'

import { getAuthUserId } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { getDashboardSummaryData } from '@/server/services/dashboardService'

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
    return apiError('Gagal memuat ringkasan dashboard.', 500)
  }
}
