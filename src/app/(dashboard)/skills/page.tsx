import type { Metadata } from 'next'
import SkillProfileView from '@/views/skills/SkillProfileView'

export const metadata: Metadata = {
  title: 'Skill Profile — Growvia Career Compass',
  description: '12 skill terverifikasi dari 5 pengalaman organisasi & magang dengan analisis distribusi kompetensi AI.'
}

export default function SkillsPage() {
  return <SkillProfileView />
}
