import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (token) {
      const decoded = await verifyJwtToken(token)
      if (decoded?.userId) {
        // Hapus session user dari database jika ada
        await prisma.session.deleteMany({
          where: { userId: decoded.userId }
        }).catch(err => {
          console.warn('Gagal menghapus session di DB saat logout:', err)
        })
      }
    }

    const response = apiSuccess(null, 'Berhasil keluar dari sesi.')

    // Hapus HTTP-Only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Error on logout API:', error)
    return apiError('Terjadi kesalahan saat logout', 500, error)
  }
}
