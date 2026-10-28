import { Poppins } from 'next/font/google'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: 'Growvia - AI Career Portfolio & Development',
  description:
    'Growvia - Platform Pengembangan Karier, Portofolio AI, dan Analisis Skill Gap untuk Mahasiswa & Profesional Muda.',
  icons: {
    icon: [
      { url: '/images/growvia-logo.png' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/images/growvia-logo.png',
    apple: '/images/growvia-logo.png'
  }
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Type guard to ensure lang is a valid Locale

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning className={poppins.variable}>
      <body className={`flex is-full min-bs-full flex-auto flex-col ${poppins.className}`}>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
