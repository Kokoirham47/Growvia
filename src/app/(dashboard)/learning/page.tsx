import type { Metadata } from 'next'

import LearningRecommendationsView from '@/views/learning/LearningRecommendationsView'

export const metadata: Metadata = {
  title: 'Rekomendasi Belajar — Growvia AI Learning',
  description:
    'Rekomendasi materi, course, artikel, dan bootcamp yang dipersonalisasi berdasarkan kesenjangan kompetensi (skill gap) kamu.'
}

export default function LearningRecommendationsPage() {
  return <LearningRecommendationsView />
}
