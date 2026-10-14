import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { prisma } from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Skenario 1: Resend verification email
    if (body.action === 'resend' || (!body.token && body.email)) {
      const email = String(body.email).toLowerCase().trim()
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return apiError('Pengguna dengan email tersebut tidak ditemukan', 404)
      }

      if (user.status === 'active') {
        return apiError('Akun ini sudah terverifikasi. Anda dapat langsung masuk.', 400)
      }

      // Cek cooldown 60 detik dari token terakhir
      const lastToken = await prisma.emailVerification.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      if (lastToken) {
        const timeDiffSeconds = Math.floor((Date.now() - new Date(lastToken.createdAt).getTime()) / 1000)
        if (timeDiffSeconds < 60) {
          const remainingSeconds = 60 - timeDiffSeconds
          return apiError(
            `Harap tunggu ${remainingSeconds} detik sebelum meminta email verifikasi baru (cooldown).`,
            429
          )
        }
      }

      // Buat token baru
      const newToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token: newToken,
          expiresAt
        }
      })

      return apiSuccess(
        {
          token: newToken,
          verificationUrl: `/verify-email?token=${newToken}`
        },
        'Email verifikasi baru berhasil dikirimkan.'
      )
    }

    // Skenario 2: Verifikasi Token
    const token = String(body.token || '').trim()

    if (!token) {
      return apiError('Token verifikasi tidak boleh kosong', 400)
    }

    const verificationRecord = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verificationRecord) {
      return apiError('Token verifikasi tidak valid atau tidak ditemukan.', 400)
    }

    if (verificationRecord.used) {
      return apiError('Token verifikasi ini sudah pernah digunakan. Silakan langsung masuk.', 400)
    }

    if (new Date() > new Date(verificationRecord.expiresAt)) {
      return apiError('Token verifikasi telah kedaluwarsa (lebih dari 24 jam). Silakan minta kirim ulang.', 400)
    }

    // Update status user menjadi active dan catat emailVerifiedAt
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationRecord.userId },
        data: {
          status: 'active',
          emailVerifiedAt: new Date()
        }
      }),
      prisma.emailVerification.update({
        where: { id: verificationRecord.id },
        data: { used: true }
      })
    ])

    return apiSuccess(
      {
        verified: true,
        email: verificationRecord.user.email
      },
      'Email berhasil diverifikasi! Akun Anda kini aktif dan siap digunakan.'
    )
  } catch (error) {
    console.error('Error on verify-email API:', error)
    return apiError('Terjadi kesalahan saat memverifikasi email', 500, error)
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return apiError('Parameter token diperlukan', 400)
    }

    const verificationRecord = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verificationRecord || verificationRecord.used || new Date() > new Date(verificationRecord.expiresAt)) {
      return apiError('Token tidak valid atau sudah kedaluwarsa', 400)
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationRecord.userId },
        data: {
          status: 'active',
          emailVerifiedAt: new Date()
        }
      }),
      prisma.emailVerification.update({
        where: { id: verificationRecord.id },
        data: { used: true }
      })
    ])

    return apiSuccess(
      { verified: true, email: verificationRecord.user.email },
      'Email berhasil diverifikasi! Silakan login.'
    )
  } catch (error) {
    return apiError('Gagal memverifikasi token', 500, error)
  }
}
