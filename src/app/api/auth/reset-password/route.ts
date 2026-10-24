import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { resetPasswordSchema } from '@/server/validations/auth'
import { hashPassword, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

interface ResetTokenPayload {
  userId: string
  email: string
  type: string
  sig: string
  [key: string]: unknown
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Format data reset password tidak valid', 400, parsed.error)
    }

    const { token, newPassword } = parsed.data

    // Verifikasi validitas JWT token
    const decoded = await verifyJwtToken<ResetTokenPayload>(token)

    if (!decoded || decoded.type !== 'password_reset' || !decoded.userId) {
      return apiError('Tautan reset password tidak valid atau sudah kedaluwarsa. Silakan ajukan permintaan baru.', 400)
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404)
    }

    // Validasi single-use: periksa signature hash lama
    if (decoded.sig !== user.passwordHash.slice(-10)) {
      return apiError('Tautan reset password ini sudah pernah digunakan atau sudah usang. Silakan minta tautan baru.', 400)
    }

    // Hash password baru
    const newHash = await hashPassword(newPassword)

    // Update password user dan hapus semua sesi aktif untuk keamanan
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash
        }
      }),
      prisma.session.deleteMany({
        where: { userId: user.id }
      })
    ])

    return apiSuccess(
      { email: user.email },
      'Password Anda berhasil diperbarui. Silakan login kembali dengan password baru Anda.'
    )
  } catch (error) {
    console.error('Error on reset-password API:', error)
    return apiError('Terjadi kesalahan saat mereset password', 500, error)
  }
}
