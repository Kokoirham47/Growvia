import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken, comparePassword } from '@/server/utils/auth'
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

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const body = await req.json()
    const { password, confirmPhrase } = body

    if (confirmPhrase !== 'HAPUS AKUN SAYA') {
      return apiError('Kalimat konfirmasi harus persis: "HAPUS AKUN SAYA"', 400)
    }

    if (!password || typeof password !== 'string') {
      return apiError('Password wajib diisi untuk mengonfirmasi penghapusan akun', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return apiError('Password yang Anda masukkan salah', 400)
    }

    // Soft delete: status -> 'deleted', deletedAt -> now()
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'deleted',
        deletedAt: new Date()
      }
    })

    // Remove active sessions
    await prisma.session.deleteMany({
      where: { userId }
    })

    // Clear auth cookie
    const cookieStore = await cookies()

    cookieStore.delete(AUTH_COOKIE_NAME)

    return apiSuccess(null, 'Akun berhasil dinonaktifkan. Anda akan dialihkan.')
  } catch (error) {
    console.error('Error on DELETE /api/account:', error)
    
return apiError('Gagal menghapus akun', 500, error)
  }
}
