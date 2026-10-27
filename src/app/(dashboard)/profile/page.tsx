import type { Metadata } from 'next'

import ProfileView from '@/views/profile/ProfileView'

export const metadata: Metadata = {
  title: 'Profil & Identitas Diri — Growvia',
  description: 'Kelola informasi biodata, foto avatar, institusi pendidikan, dan biografi profesional akun Anda di Growvia.'
}

export default function ProfilePage() {
  return <ProfileView />
}
