import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { prisma } from '@/libs/prisma'
import { loginSchema } from '@/server/validations/auth'
import { comparePassword, createJwtToken, AUTH_COOKIE_NAME } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Format data login tidak valid', 400, parsed.error)
    }

    const { email, password, rememberMe } = parsed.data

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true
      }
    })

    // Sesuai PRD F01.3: Jangan beri tahu apakah email atau password yang salah
    if (!user) {
      return apiError('Email atau password salah', 400)
    }

    // 2. Cocokkan hash password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return apiError('Email atau password salah', 400)
    }

    // 3. Sesuai Acceptance Criteria: User tidak bisa login jika status unverified
    if (user.status === 'unverified') {
      return apiError(
        'Akun Anda belum diverifikasi. Silakan periksa inbox email Anda untuk melakukan verifikasi akun.',
        403,
        { isUnverified: true, email: user.email }
      )
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      return apiError('Akun Anda sedang dinonaktifkan atau ditangguhkan. Silakan hubungi admin.', 403)
    }

    // 4. Durasi session: 30 hari jika rememberMe (PRD Acceptance Criteria), default 7 hari
    const sessionDurationDays = rememberMe ? 30 : 7
    const expiresInStr = `${sessionDurationDays}d`
    const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)

    // Buat JWT Token
    const jwtToken = await createJwtToken(
      {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      expiresInStr
    )

    // 5. Catat session ke database (tabel SESSION)
    const refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers.get('user-agent') || 'Unknown Device'

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        deviceInfo: userAgent.slice(0, 255),
        expiresAt
      }
    })

    // 6. Redirect logic: ke /onboarding jika profil belum lengkap, ke /home jika sudah
    const isProfileComplete = Boolean(user.profile?.institution && user.profile?.major)
    const redirectTo = isProfileComplete ? '/home' : '/onboarding'

    // 7. Siapkan response dan set HTTP-Only Cookie
    const response = apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          status: user.status
        },
        token: jwtToken,
        redirectTo,
        isProfileComplete
      },
      'Berhasil masuk ke akun Growvia.'
    )

    // Set cookie di response
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt
    })

    return response
  } catch (error) {
    console.error('Error on login API:', error)
    return apiError('Terjadi kesalahan pada server saat proses masuk', 500, error)
  }
}
