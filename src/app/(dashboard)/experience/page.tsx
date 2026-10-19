import type { Metadata } from 'next'
import ExperienceView from '@/views/experience/ExperienceView'

export const metadata: Metadata = {
  title: 'Manajemen Pengalaman — Growvia Career Compass',
  description: 'Kelola rekam jejak kepanitiaan, organisasi, proyek, dan magang untuk diekstrak menjadi skill tervalidasi oleh AI.'
}

export default function ExperiencePage() {
  return <ExperienceView />
}
