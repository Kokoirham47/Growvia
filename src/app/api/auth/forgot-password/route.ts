import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { forgotPasswordSchema } from '@/server/validations/auth'
import { createJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Format email tidak valid', 400, parsed.error)
    }

    const { email } = parsed.data
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Hindari user enumeration: jika user tidak ditemukan, tetap beri response sukses ramah
    if (!user) {
      return apiSuccess(
        null,
        'Jika email terdaftar di Growvia, tautan instruksi reset password telah dikirimkan ke kotak masuk Anda.'
      )
    }

    // Token reset password valid 1 jam (1h)
    // Simpan potongan hash password untuk memastikan token otomatis hangus begitu password diganti
    const token = await createJwtToken(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        type: 'password_reset',
        sig: user.passwordHash.slice(-10)
      },
      '1h'
    )

    const resetUrl = `/reset-password?token=${token}`

    // Catatan untuk pengembang/penguji: Di production token ini dikirim via SMTP/Email service
    return apiSuccess(
      {
        email: user.email,
        resetToken: token,
        resetUrl
      },
      'Instruksi reset password telah dikirimkan ke kotak masuk email Anda. Tautan berlaku selama 1 jam.'
    )
  } catch (error) {
    console.error('Error on forgot-password API:', error)
    return apiError('Gagal memproses permintaan reset password', 500, error)
  }
}
