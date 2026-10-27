import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

async function getAuthenticatedUserId(req: Request): Promise<string | null> {
  const cookieStore = await cookies()
  let token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    const authHeader = req.headers.get('authorization')

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  if (!token) return null

  const decoded = await verifyJwtToken(token)

  
return decoded?.userId || null
}

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: user.status,
        createdAt: user.createdAt
      },
      profile: user.profile
    })
  } catch (error) {
    console.error('Error on GET /api/profile:', error)
    
return apiError('Gagal memuat profil pengguna', 500, error)
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const body = await req.json()
    const { name, avatarUrl, headline, bio, institution, major, graduationYear } = body

    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return apiError('Nama lengkap tidak boleh kosong', 400)
    }

    // 1. Update user record (name and avatarUrl)
    const userUpdateData: { name?: string; avatarUrl?: string | null } = {}

    if (name !== undefined) userUpdateData.name = name.trim()
    if (avatarUrl !== undefined) userUpdateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData
    })

    // 2. Upsert profile record
    const profileData = {
      headline: headline !== undefined ? (headline ? String(headline).trim() : null) : undefined,
      bio: bio !== undefined ? (bio ? String(bio).trim() : null) : undefined,
      institution: institution !== undefined ? (institution ? String(institution).trim() : null) : undefined,
      major: major !== undefined ? (major ? String(major).trim() : null) : undefined,
      graduationYear: graduationYear !== undefined ? (graduationYear ? Number(graduationYear) : null) : undefined
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...profileData
      },
      update: profileData
    })

    return apiSuccess({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        status: updatedUser.status
      },
      profile: updatedProfile
    }, 'Profil berhasil diperbarui')
  } catch (error) {
    console.error('Error on PUT /api/profile:', error)
    
return apiError('Gagal memperbarui profil pengguna', 500, error)
  }
}
