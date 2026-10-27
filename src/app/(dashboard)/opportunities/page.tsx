import type { Metadata } from 'next'

import OpportunitiesView from '@/views/opportunities/OpportunitiesView'

export const metadata: Metadata = {
  title: 'Peluang Karier & Magang — Growvia AI Career Engine',
  description:
    'Temukan lowongan kerja, magang, dan kompetisi di industri tech Indonesia yang dicocokkan langsung secara cerdas dengan profil keahlianmu.'
}

export default function OpportunitiesPage() {
  return <OpportunitiesView />
}
