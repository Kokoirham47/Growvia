import type { NextRequest } from 'next/server'

import { LearningResourceType, Difficulty } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') as LearningResourceType | null
    const difficulty = searchParams.get('difficulty') as Difficulty | null

    const whereClause: Record<string, unknown> = {}

    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { platform: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    if (type && Object.values(LearningResourceType).includes(type)) {
      whereClause.type = type
    }

    if (difficulty && Object.values(Difficulty).includes(difficulty)) {
      whereClause.difficulty = difficulty
    }

    const resources = await prisma.learningResource.findMany({
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
            recommendations: true,
            savedByUsers: true
          }
        }
      }
    })

    return apiSuccess({
      data: resources,
      total: resources.length
    })
  } catch (error) {
    console.error('Admin GET Learning Resources Error:', error)
    
return apiError('Gagal memuat katalog materi belajar', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = request.headers.get('x-admin-id') || null
    const body = await request.json()

    const {
      title,
      platform,
      url,
      type = 'course',
      difficulty = 'beginner',
      durationMinutes,
      rating,
      description,
      skillIds = []
    } = body

    if (!title?.trim() || !platform?.trim() || !url?.trim()) {
      return apiError('Judul, platform, dan URL materi belajar wajib diisi', 400)
    }

    // PRD F13.6 rule: minimal 1 skill tag
    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return apiError('Setiap materi belajar wajib memiliki minimal 1 tag skill', 400)
    }

    const newResource = await prisma.$transaction(async tx => {
      const resource = await tx.learningResource.create({
        data: {
          title: String(title).trim(),
          platform: String(platform).trim(),
          url: String(url).trim(),
          type: type as LearningResourceType,
          difficulty: difficulty as Difficulty,
          durationMinutes: durationMinutes ? parseInt(String(durationMinutes), 10) : null,
          rating: rating ? parseFloat(String(rating)) : null,
          description: description?.trim() || null,
          createdBy: adminId
        }
      })

      // Link skill tags
      await tx.resourceSkillTag.createMany({
        data: skillIds.map((sId: string) => ({
          learningResourceId: resource.id,
          skillId: sId
        }))
      })

      return resource
    })

    return apiSuccess(newResource, 'Materi belajar berhasil ditambahkan', 201)
  } catch (error) {
    console.error('Admin POST Learning Resource Error:', error)
    
return apiError('Gagal menambahkan materi belajar', 500)
  }
}
