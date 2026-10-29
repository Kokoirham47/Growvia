import type { Metadata } from 'next'

import DashboardView from '@/views/dashboard/DashboardView'
import { getAuthUserId } from '@/server/utils/auth'
import { getDashboardSummaryData } from '@/server/services/dashboardService'

export const metadata: Metadata = {
  title: 'Dashboard — Growvia Career Compass',
  description: 'AI-Powered Career & Skill Ecosystem Dashboard untuk Mahasiswa dan Fresh Graduate.'
}

export default async function Page() {
  let initialData = null

  try {
    const userId = await getAuthUserId()

    if (userId) {
      initialData = await getDashboardSummaryData(userId)
    }
  } catch (error) {
    console.error('Error prefetching dashboard data on server:', error)
  }

  return <DashboardView initialData={initialData} />
}

