// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Masuk ke Akun | Growvia',
  description: 'Masuk ke akun Growvia Anda dan lanjutkan eksplorasi karier berbasis kecerdasan buatan.'
}

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
