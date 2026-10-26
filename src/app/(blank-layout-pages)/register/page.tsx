import type { Metadata } from 'next'
import Register from '@views/Register'

export const metadata: Metadata = {
  title: 'Buat Akun Baru | Growvia',
  description: 'Daftar akun baru di Growvia, platform karier berbasis AI untuk mahasiswa dan profesional muda.'
}

export default function RegisterPage() {
  return <Register />
}
