import type { NextRequest } from 'next/server'

import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
      })

      if (firstUser) userId = firstUser.id
    }

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    const { id: opportunityId } = await context.params

    const opportunity = await prisma.careerOpportunity.findUnique({
      where: { id: opportunityId }
    })

    if (!opportunity) {
      return apiError('Peluang karier tidak ditemukan.', 404)
    }

    const body = await request.json().catch(() => ({}))
    const matchScore = typeof body?.matchScore === 'number' ? body.matchScore : null

    const existing = await prisma.userSavedOpportunity.findUnique({
      where: {
        userId_careerOpportunityId: {
          userId,
          careerOpportunityId: opportunityId
        }
      }
    })

    let isSaved = false

    if (existing) {
      await prisma.userSavedOpportunity.delete({
        where: { id: existing.id }
      })
      isSaved = false
    } else {
      await prisma.userSavedOpportunity.create({
        data: {
          userId,
          careerOpportunityId: opportunityId,
          skillMatchScore: matchScore
        }
      })
      isSaved = true
    }

    const allSaved = await prisma.userSavedOpportunity.findMany({
      where: { userId },
      select: { careerOpportunityId: true }
    })

    return apiSuccess(
      {
        isSaved,
        savedIds: allSaved.map(s => s.careerOpportunityId)
      },
      isSaved ? 'Peluang berhasil disimpan' : 'Peluang dihapus dari simpanan'
    )
  } catch (error) {
    console.error('Error in /api/opportunities/[id]/save POST:', error)
    
return apiError('Gagal memproses simpan peluang', 500, error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession()
    let userId = session?.userId

    if (!userId) {
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
      })

      if (firstUser) userId = firstUser.id
    }

    if (!userId) {
      return apiError('Pengguna tidak terautentikasi.', 401)
    }

    const { id: opportunityId } = await context.params

    await prisma.userSavedOpportunity.deleteMany({
      where: {
        userId,
        careerOpportunityId: opportunityId
      }
    })

    const allSaved = await prisma.userSavedOpportunity.findMany({
      where: { userId },
      select: { careerOpportunityId: true }
    })

    return apiSuccess(
      {
        isSaved: false,
        savedIds: allSaved.map(s => s.careerOpportunityId)
      },
      'Peluang berhasil dihapus dari daftar tersimpan'
    )
  } catch (error) {
    console.error('Error in /api/opportunities/[id]/save DELETE:', error)
    
return apiError('Gagal menghapus simpanan peluang', 500, error)
  }
}
