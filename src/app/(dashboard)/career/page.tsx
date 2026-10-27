import type { Metadata } from 'next'
import CareerGapView from '@/views/career/CareerGapView'

export const metadata: Metadata = {
  title: 'Karier & Analisis Skill Gap — Growvia Career Compass',
  description: 'Bandingkan skill yang kamu miliki dengan standar industri untuk posisi impianmu.'
}

export default function CareerGapPage() {
  return <CareerGapView />
}
