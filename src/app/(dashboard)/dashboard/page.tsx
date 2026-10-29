import type { Metadata } from 'next'

import DashboardView from '@/views/dashboard/DashboardView'

export const metadata: Metadata = {
  title: 'Dashboard — Growvia Career Compass',
  description: 'AI-Powered Career & Skill Ecosystem Dashboard untuk Mahasiswa dan Fresh Graduate.'
}

export default function DashboardPage() {
  return <DashboardView />
}
