import type { NextRequest } from 'next/server'

import type { RoleSkillImportance, SkillLevel } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; skillId: string }> }
) {
  try {
    const { id, skillId } = await params
    const body = await request.json()
    const { importance, minLevel } = body

    const updated = await prisma.careerRoleSkill.update({
      where: {
        careerRoleId_skillId: {
          careerRoleId: id,
          skillId
        }
      },
      data: {
        ...(importance && { importance: importance as RoleSkillImportance }),
        ...(minLevel && { minLevel: minLevel as SkillLevel })
      },
      include: {
        skill: true
      }
    })

    return apiSuccess(updated, 'Persyaratan skill berhasil diperbarui')
  } catch (error) {
    console.error('Admin PUT Role Skill Error:', error)
    
return apiError('Gagal memperbarui persyaratan skill peran', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; skillId: string }> }
) {
  try {
    const { id, skillId } = await params

    await prisma.careerRoleSkill.delete({
      where: {
        careerRoleId_skillId: {
          careerRoleId: id,
          skillId
        }
      }
    })

    return apiSuccess(null, 'Keahlian berhasil dicabut dari peran karier')
  } catch (error) {
    console.error('Admin DELETE Role Skill Error:', error)
    
return apiError('Gagal menghapus keahlian dari peran karier', 500)
  }
}
