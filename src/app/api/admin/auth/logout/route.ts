import { ADMIN_COOKIE_NAME } from '@/server/utils/adminAuth'
import { apiSuccess } from '@/server/utils/response'

export async function POST() {
  const response = apiSuccess(null, 'Logout admin berhasil')

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })

  return response
}
