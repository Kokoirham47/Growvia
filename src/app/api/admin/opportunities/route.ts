import type { NextRequest } from 'next/server'

import { OpportunityType } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') as OpportunityType | null

    const whereClause: Record<string, unknown> = {}

    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { company: { contains: search.trim(), mode: 'insensitive' } },
        { location: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    if (type && Object.values(OpportunityType).includes(type)) {
      whereClause.type = type
    }

    const opportunities = await prisma.careerOpportunity.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        skillTags: {
          include: {
            skill: {
              select: { id: true, name: true, category: true }
            }
          }
        },
        _count: {
          select: {
            savedByUsers: true
          }
        }
      }
    })

    return apiSuccess({
      data: opportunities,
      total: opportunities.length
    })
  } catch (error) {
    console.error('Admin GET Opportunities Error:', error)
    
return apiError('Gagal memuat daftar lowongan karier', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-admin-id') || null
    const body = await request.json()

    const {
      title,
      company,
      location,
      sourceUrl,
      type = 'internship',
      description,
      deadline,
      skillIds = []
    } = body

    if (!title?.trim() || !company?.trim()) {
      return apiError('Posisi/Judul dan Nama Perusahaan wajib diisi', 400)
    }

    const newOpportunity = await prisma.$transaction(async tx => {
      const opp = await tx.careerOpportunity.create({
        data: {
          title: String(title).trim(),
          company: String(company).trim(),
          location: location?.trim() || null,
          sourceUrl: sourceUrl?.trim() || null,
          type: type as OpportunityType,
          description: description?.trim() || null,
          deadline: deadline ? new Date(deadline) : null,
          createdBy: adminId,
          postedAt: new Date()
        }
      })

      // Link skill tags
      if (Array.isArray(skillIds) && skillIds.length > 0) {
        await tx.opportunitySkillTag.createMany({
          data: skillIds.map((sId: string) => ({
            careerOpportunityId: opp.id,
            skillId: sId
          }))
        })
      }

      return opp
    })

    return apiSuccess(newOpportunity, 'Lowongan karier baru berhasil ditambahkan', 201)
  } catch (error) {
    console.error('Admin POST Opportunity Error:', error)
    
return apiError('Gagal menambahkan lowongan karier', 500)
  }
}
