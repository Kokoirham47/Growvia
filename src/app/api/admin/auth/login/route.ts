import type { NextRequest } from 'next/server'

import prisma from '@/libs/prisma'
import { compareAdminPassword, createAdminToken, ADMIN_COOKIE_NAME } from '@/server/utils/adminAuth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('Email dan password wajib diisi', 400)
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail }
    })

    if (!admin) {
      return apiError('Kredensial admin tidak valid', 401)
    }

    const isValidPassword = await compareAdminPassword(password, admin.passwordHash)

    if (!isValidPassword) {
      return apiError('Kredensial admin tidak valid', 401)
    }

    // Update last login timestamp
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    })

    // Sign 8-hour admin JWT token
    const token = await createAdminToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name
    })

    const response = apiSuccess(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email
      },
      'Login admin berhasil'
    )

    // Set 8-hour HTTP-only secure cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 // 8 hours in seconds
    })

    return response
  } catch (error) {
    console.error('Admin Login Error:', error)
    
return apiError('Terjadi kesalahan pada server saat login admin', 500)
  }
}
