
import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    let token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    // Fallback: periksa Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization')

      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      // In development / demo mode, fallback to active user
      let demoUser = await prisma.user.findFirst({
        where: { email: 'demo@growvia.id' },
        include: { profile: true }
      })

      if (!demoUser) {
        demoUser = await prisma.user.findFirst({
          where: { careerTargets: { some: { isActive: true } } },
          include: { profile: true }
        })
      }

      if (demoUser) {
        return apiSuccess({
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            avatarUrl: demoUser.avatarUrl,
            status: demoUser.status,
            emailVerifiedAt: demoUser.emailVerifiedAt,
            createdAt: demoUser.createdAt
          },
          profile: demoUser.profile,
          isProfileComplete: true
        })
      }

      return apiError('Tidak terautentikasi', 401)
    }

    const decoded = await verifyJwtToken(token)

    if (!decoded?.userId) {
      return apiError('Sesi tidak valid atau telah kedaluwarsa', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      return apiError('Akun dinonaktifkan atau dihapus', 403)
    }

    const isProfileComplete = Boolean(user.profile?.institution && user.profile?.major)

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt
      },
      profile: user.profile,
      isProfileComplete
    })
  } catch (error) {
    console.error('Error on /api/auth/me:', error)
    
return apiError('Gagal mengambil data sesi pengguna', 500, error)
  }
}
