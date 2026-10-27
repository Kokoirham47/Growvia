import type { NextRequest } from 'next/server'

import type { OpportunityType } from '@prisma/client'

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
      company,
      location,
      sourceUrl,
      type,
      description,
      deadline,
      isActive,
      skillIds
    } = body

    if (!title?.trim() || !company?.trim()) {
      return apiError('Posisi/Judul dan Nama Perusahaan wajib diisi', 400)
    }

    const updated = await prisma.$transaction(async tx => {
      const opp = await tx.careerOpportunity.update({
        where: { id },
        data: {
          title: String(title).trim(),
          company: String(company).trim(),
          location: location !== undefined ? location?.trim() || null : undefined,
          sourceUrl: sourceUrl !== undefined ? sourceUrl?.trim() || null : undefined,
          ...(type && { type: type as OpportunityType }),
          description: description !== undefined ? description?.trim() || null : undefined,
          deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : undefined,
          ...(typeof isActive === 'boolean' && { isActive })
        }
      })

      // Re-sync skill tags if provided
      if (Array.isArray(skillIds)) {
        await tx.opportunitySkillTag.deleteMany({ where: { careerOpportunityId: id } })

        if (skillIds.length > 0) {
          await tx.opportunitySkillTag.createMany({
            data: skillIds.map((sId: string) => ({
              careerOpportunityId: id,
              skillId: sId
            }))
          })
        }
      }

      return opp
    })

    return apiSuccess(updated, 'Lowongan karier berhasil diperbarui')
  } catch (error) {
    console.error('Admin PUT Opportunity Error:', error)
    
return apiError('Gagal memperbarui lowongan karier', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const opp = await prisma.careerOpportunity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            savedByUsers: true
          }
        }
      }
    })

    if (!opp) {
      return apiError('Lowongan karier tidak ditemukan', 404)
    }

    // Soft-delete if has bookmarks from users
    if (opp._count.savedByUsers > 0) {
      await prisma.careerOpportunity.update({
        where: { id },
        data: { isActive: false }
      })
      
return apiSuccess(
        null,
        `Lowongan "${opp.title}" telah dinonaktifkan (soft-delete) karena disimpan oleh ${opp._count.savedByUsers} pengguna.`
      )
    }

    await prisma.$transaction([
      prisma.opportunitySkillTag.deleteMany({ where: { careerOpportunityId: id } }),
      prisma.careerOpportunity.delete({ where: { id } })
    ])

    return apiSuccess(null, `Lowongan "${opp.title}" berhasil dihapus permanen`)
  } catch (error) {
    console.error('Admin DELETE Opportunity Error:', error)
    
return apiError('Gagal menghapus lowongan karier', 500)
  }
}
