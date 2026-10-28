// Next Imports
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// Component Imports
import LandingPage from '@views/LandingPage'
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode, getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Growvia — Ubah Pengalamanmu Jadi Skill dan Karier',
  description:
    'Tulis pengalaman organisasi, magang, atau proyekmu. Growvia mengusulkan skill, menghitung Career Readiness Score, dan menyiapkan portofolio. Gratis.'
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const RootPage = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const code = searchParams?.code

  // Jika Supabase melempar auth code ke root (/)
  if (typeof code === 'string' && code) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(code)}`)
  }

  const direction = 'ltr'
  const systemMode = await getSystemMode()
  const mode = await getServerMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <LandingPage mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default RootPage

