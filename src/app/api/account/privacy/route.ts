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

export async function PUT(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const body = await req.json()
    const { portfolioPublished } = body

    if (portfolioPublished === undefined || typeof portfolioPublished !== 'boolean') {
      return apiError('Nilai visibilitas portofolio harus boolean', 400)
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        portfolioPublished
      },
      update: {
        portfolioPublished
      }
    })

    return apiSuccess(
      { portfolioPublished: profile.portfolioPublished },
      portfolioPublished
        ? 'Portofolio Anda kini dapat diakses secara publik'
        : 'Portofolio Anda kini bersifat privat'
    )
  } catch (error) {
    console.error('Error on PUT /api/account/privacy:', error)
    
return apiError('Gagal mengubah pengaturan privasi', 500, error)
  }
}
