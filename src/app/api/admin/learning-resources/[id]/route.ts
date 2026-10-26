import type { NextRequest } from 'next/server'

import type { LearningResourceType, Difficulty } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      title,
      platform,
      url,
      type,
      difficulty,
      durationMinutes,
      rating,
      description,
      isActive,
      skillIds
    } = body

    if (!title?.trim() || !platform?.trim() || !url?.trim()) {
      return apiError('Judul, platform, dan URL materi belajar wajib diisi', 400)
    }

    if (Array.isArray(skillIds) && skillIds.length === 0) {
      return apiError('Materi belajar wajib memiliki minimal 1 tag skill', 400)
    }

    const updated = await prisma.$transaction(async tx => {
      const resource = await tx.learningResource.update({
        where: { id },
        data: {
          title: String(title).trim(),
          platform: String(platform).trim(),
          url: String(url).trim(),
          ...(type && { type: type as LearningResourceType }),
          ...(difficulty && { difficulty: difficulty as Difficulty }),
          durationMinutes: durationMinutes !== undefined ? (durationMinutes ? parseInt(String(durationMinutes), 10) : null) : undefined,
          rating: rating !== undefined ? (rating ? parseFloat(String(rating)) : null) : undefined,
          description: description !== undefined ? description?.trim() || null : undefined,
          ...(typeof isActive === 'boolean' && { isActive })
        }
      })

      // Re-sync skill tags if provided
      if (Array.isArray(skillIds)) {
        await tx.resourceSkillTag.deleteMany({ where: { learningResourceId: id } })
        await tx.resourceSkillTag.createMany({
          data: skillIds.map((sId: string) => ({
            learningResourceId: id,
            skillId: sId
          }))
        })
      }

      return resource
    })

    return apiSuccess(updated, 'Materi belajar berhasil diperbarui')
  } catch (error) {
    console.error('Admin PUT Learning Resource Error:', error)
    
return apiError('Gagal memperbarui materi belajar', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const resource = await prisma.learningResource.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            savedByUsers: true,
            recommendations: true
          }
        }
      }
    })

    if (!resource) {
      return apiError('Materi belajar tidak ditemukan', 404)
    }

    // Soft-delete if has relations, or hard delete if fresh
    if (resource._count.savedByUsers > 0 || resource._count.recommendations > 0) {
      await prisma.learningResource.update({
        where: { id },
        data: { isActive: false }
      })
      
return apiSuccess(
        null,
        `Materi "${resource.title}" telah dinonaktifkan (soft-delete) karena tersimpan oleh ${resource._count.savedByUsers} pengguna.`
      )
    }

    await prisma.$transaction([
      prisma.resourceSkillTag.deleteMany({ where: { learningResourceId: id } }),
      prisma.learningResource.delete({ where: { id } })
    ])

    return apiSuccess(null, `Materi "${resource.title}" berhasil dihapus permanen`)
  } catch (error) {
    console.error('Admin DELETE Learning Resource Error:', error)
    
return apiError('Gagal menghapus materi belajar', 500)
  }
}
