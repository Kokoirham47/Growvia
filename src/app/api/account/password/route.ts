import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken, comparePassword, hashPassword } from '@/server/utils/auth'
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

export async function PUT(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const body = await req.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || typeof currentPassword !== 'string') {
      return apiError('Password saat ini wajib diisi', 400)
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return apiError('Password baru wajib diisi', 400)
    }

    if (newPassword.length < 8) {
      return apiError('Password baru minimal 8 karakter', 400)
    }

    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)

    if (!hasUppercase || !hasNumber) {
      return apiError('Password baru harus mengandung minimal 1 huruf besar dan 1 angka', 400)
    }

    if (newPassword !== confirmPassword) {
      return apiError('Konfirmasi password tidak cocok dengan password baru', 400)
    }

    // Retrieve user and current password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    // Compare with current password
    const isCurrentValid = await comparePassword(currentPassword, user.passwordHash)

    if (!isCurrentValid) {
      return apiError('Password saat ini salah', 400)
    }

    // Hash new password and save
    const newHash = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    })

    return apiSuccess(null, 'Password berhasil diperbarui')
  } catch (error) {
    console.error('Error on PUT /api/account/password:', error)
    
return apiError('Gagal memperbarui password', 500, error)
  }
}
