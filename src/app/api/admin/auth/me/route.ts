import prisma from '@/libs/prisma'
import { getAdminServerSession } from '@/server/utils/adminAuth'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET() {
  try {
    const session = await getAdminServerSession()

    if (!session?.adminId) {
      return apiError('Sesi admin tidak valid atau telah berakhir', 401)
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
        createdAt: true
      }
    })

    if (!admin) {
      return apiError('Akun admin tidak ditemukan', 404)
    }

    return apiSuccess(admin, 'Sesi admin aktif')
  } catch (error) {
    console.error('Admin Auth Me Error:', error)
    
return apiError('Terjadi kesalahan saat memeriksa sesi admin', 500)
  }
}
