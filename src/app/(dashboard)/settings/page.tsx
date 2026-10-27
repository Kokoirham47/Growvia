import type { Metadata } from 'next'

import SettingsView from '@/views/settings/SettingsView'

export const metadata: Metadata = {
  title: 'Pengaturan Akun & Keamanan — Growvia',
  description: 'Kelola keamanan kata sandi akun, privasi portofolio publik, dan pengaturan akun Anda di Growvia.'
}

export default function SettingsPage() {
  return <SettingsView />
}
