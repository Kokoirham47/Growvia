import type { NextRequest } from 'next/server'

import type { RoleSkillImportance, SkillLevel } from '@prisma/client'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const role = await prisma.careerRole.findUnique({
      where: { id },
      include: {
        roleSkills: {
          include: {
            skill: true
          },
          orderBy: [
            { importance: 'asc' },
            { skill: { name: 'asc' } }
          ]
        }
      }
    })

    if (!role) {
      return apiError('Peran karier tidak ditemukan', 404)
    }

    return apiSuccess({
      role: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        industry: role.industry,
        description: role.description
      },
      skills: role.roleSkills
    })
  } catch (error) {
    console.error('Admin GET Role Skills Error:', error)
    
return apiError('Gagal memuat daftar keahlian yang dipersyaratkan', 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { skillId, importance = 'required', minLevel = 'intermediate' } = body

    if (!skillId) {
      return apiError('ID skill wajib dipilih', 400)
    }

    // Verify role exists
    const role = await prisma.careerRole.findUnique({ where: { id } })

    if (!role) {
      return apiError('Peran karier tidak ditemukan', 404)
    }

    // Verify skill exists
    const skill = await prisma.skill.findUnique({ where: { id: skillId } })

    if (!skill) {
      return apiError('Skill tidak ditemukan dalam master data', 404)
    }

    // Upsert role skill mapping
    const roleSkill = await prisma.careerRoleSkill.upsert({
      where: {
        careerRoleId_skillId: {
          careerRoleId: id,
          skillId
        }
      },
      update: {
        importance: importance as RoleSkillImportance,
        minLevel: minLevel as SkillLevel
      },
      create: {
        careerRoleId: id,
        skillId,
        importance: importance as RoleSkillImportance,
        minLevel: minLevel as SkillLevel
      },
      include: {
        skill: true
      }
    })

    return apiSuccess(roleSkill, 'Keahlian berhasil dipetakan ke peran karier', 201)
  } catch (error) {
    console.error('Admin POST Role Skill Error:', error)
    
return apiError('Gagal memetakan skill ke peran karier', 500)
  }
}
