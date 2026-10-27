import type { Metadata } from 'next'

import AboutView from '@/views/about/AboutView'

export const metadata: Metadata = {
  title: 'Tentang Aplikasi & Panduan Penggunaan — Growvia',
  description: 'Pelajari filosofi navigasi karier cerdas Growvia, arsitektur bukti autentik terverifikasi, metodologi kesenjangan kompetensi, dan panduan lengkap alur penggunaan platform.'
}

export default function AboutPage() {
  return <AboutView />
}
