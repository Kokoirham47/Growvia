// Next Imports
import type { Metadata } from 'next'

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

const RootPage = async () => {
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
