import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { prisma } from '@/libs/prisma'
import { registerSchema } from '@/server/validations/auth'
import { hashPassword } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Data registrasi tidak valid', 400, parsed.error)
    }

    const { name, email, password } = parsed.data

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return apiError('Alamat email sudah terdaftar. Silakan gunakan email lain atau masuk.', 400)
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password)

    // 3. Simpan user dengan status unverified
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        status: 'unverified'
      }
    })

    // 4. Buat token verifikasi email (berlaku 24 jam sesuai PRD F01.2)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.emailVerification.create({
      data: {
        userId: newUser.id,
        token: verificationToken,
        expiresAt
      }
    })

    // 5. Kembalikan response sukses
    // Dalam mode development, token dikembalikan agar pengembang/penguji bisa langsung memverifikasi
    return apiSuccess(
      {
        userId: newUser.id,
        email: newUser.email,
        verificationToken,
        verificationUrl: `/verify-email?token=${verificationToken}`
      },
      'Registrasi berhasil. Silakan periksa email Anda untuk melakukan verifikasi akun.',
      201
    )
  } catch (error) {
    console.error('Error on register API:', error)
    return apiError('Terjadi kesalahan pada server saat registrasi', 500, error)
  }
}
