import type { NextRequest } from 'next/server'

import { SkillCategory } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

function generateNormalizedName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, normalizedName } = body

    if (!name || !category) {
      return apiError('Nama skill dan kategori wajib diisi', 400)
    }

    if (!Object.values(SkillCategory).includes(category)) {
      return apiError('Kategori skill tidak valid', 400)
    }

    const cleanName = String(name).trim()

    const cleanNormalized = normalizedName?.trim()
      ? String(normalizedName).toLowerCase().trim()
      : generateNormalizedName(cleanName)

    // Check if name taken by another skill
    const duplicate = await prisma.skill.findFirst({
      where: {
        name: cleanName,
        NOT: { id }
      }
    })

    if (duplicate) {
      return apiError(`Skill dengan nama "${cleanName}" sudah digunakan`, 409)
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name: cleanName,
        category,
        normalizedName: cleanNormalized
      }
    })

    return apiSuccess(updatedSkill, 'Master skill berhasil diperbarui')
  } catch (error) {
    console.error('Admin PUT Skill Error:', error)
    
return apiError('Gagal memperbarui master skill', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            userSkills: true,
            careerRoleSkills: true,
            resourceSkillTags: true,
            opportunitySkillTags: true
          }
        }
      }
    })

    if (!skill) {
      return apiError('Skill tidak ditemukan', 404)
    }

    const { userSkills, careerRoleSkills, resourceSkillTags, opportunitySkillTags } =
      skill._count

    const totalDependencies =
      userSkills + careerRoleSkills + resourceSkillTags + opportunitySkillTags

    // Safe-delete enforcement (PRD F13.3)
    if (totalDependencies > 0) {
      const reasons: string[] = []

      if (userSkills > 0) reasons.push(`${userSkills} pengguna`)
      if (careerRoleSkills > 0) reasons.push(`${careerRoleSkills} peran karier`)
      if (resourceSkillTags > 0) reasons.push(`${resourceSkillTags} materi belajar`)
      if (opportunitySkillTags > 0) reasons.push(`${opportunitySkillTags} lowongan kerja`)

      return apiError(
        `Skill "${skill.name}" tidak dapat dihapus karena masih digunakan aktif oleh: ${reasons.join(', ')}. Hapus relasi terlebih dahulu atau nonaktifkan data terkait.`,
        400,
        {
          isBlocked: true,
          dependencies: skill._count
        }
      )
    }

    await prisma.skill.delete({
      where: { id }
    })

    return apiSuccess(null, `Skill "${skill.name}" berhasil dihapus dari sistem`)
  } catch (error) {
    console.error('Admin DELETE Skill Error:', error)
    
return apiError('Gagal menghapus master skill', 500)
  }
}
