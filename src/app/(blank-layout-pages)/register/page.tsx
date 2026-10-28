import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Register from '@views/Register'

export const metadata: Metadata = {
  title: 'Buat Akun Baru | Growvia',
  description: 'Daftar akun baru di Growvia, platform karier berbasis AI untuk mahasiswa dan profesional muda.'
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RegisterPage(props: PageProps) {
  const searchParams = await props.searchParams
  const code = searchParams?.code

  // Jika Supabase melempar auth code ke /register
  if (typeof code === 'string' && code) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(code)}`)
  }

  return <Register />
}

