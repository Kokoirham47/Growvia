import type { Metadata } from 'next'

import PortfolioBuilderView from '@/views/portfolio/PortfolioBuilderView'

export const metadata: Metadata = {
  title: 'Portofolio AI & Bukti Nyata — Growvia',
  description:
    'Buat dan bagikan portofolio digital berbasis bukti keahlian nyata secara otomatis kepada recruiter.'
}

export default function PortfolioBuilderPage() {
  return <PortfolioBuilderView />
}
