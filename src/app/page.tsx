// Next Imports
import type { Metadata } from 'next'

// Component Imports
import LandingPage from '@views/LandingPage'
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode, getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Growvia — Turn Experience Into Opportunity',
  description:
    'Growvia adalah ekosistem karier berbasis AI yang membantu mahasiswa dan fresh graduate mengubah pengalaman nyata menjadi skill terstruktur, memetakan kesiapan karier, dan menemukan peluang impian.'
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
