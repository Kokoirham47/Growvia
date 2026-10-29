// Next Imports
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Masuk ke Akun | Growvia',
  description: 'Masuk ke akun Growvia Anda dan lanjutkan eksplorasi karier berbasis kecerdasan buatan.'
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const LoginPage = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const code = searchParams?.code

  // Jika Supabase melempar auth code ke /login
  if (typeof code === 'string' && code) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(code)}`)
  }

  // Vars
  const mode = await getServerMode()
  const reason = typeof searchParams?.reason === 'string' ? searchParams.reason : undefined
  const message = typeof searchParams?.message === 'string' ? searchParams.message : undefined

  return <Login mode={mode} initialReason={reason} initialMessage={message} />
}

export default LoginPage
