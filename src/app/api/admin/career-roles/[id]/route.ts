import type { NextRequest } from 'next/server'

import prisma from '@/libs/prisma'
import { apiSuccess, apiError } from '@/server/utils/response'

function generateSlug(name: string): string {
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
    const { name, slug, industry, description } = body

    if (!name?.trim()) {
      return apiError('Nama peran karier wajib diisi', 400)
    }

    const cleanName = String(name).trim()
    const cleanSlug = slug?.trim() ? String(slug).toLowerCase().trim() : generateSlug(cleanName)

    // Check duplicate slug with another role
    const duplicate = await prisma.careerRole.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id }
      }
    })

    if (duplicate) {
      return apiError(`Slug "${cleanSlug}" sudah digunakan oleh peran karier lain`, 409)
    }

    const updatedRole = await prisma.careerRole.update({
      where: { id },
      data: {
        name: cleanName,
        slug: cleanSlug,
        industry: industry?.trim() || null,
        description: description?.trim() || null
      }
    })

    return apiSuccess(updatedRole, 'Peran karier berhasil diperbarui')
  } catch (error) {
    console.error('Admin PUT Career Role Error:', error)
    
return apiError('Gagal memperbarui peran karier', 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const role = await prisma.careerRole.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            userTargets: true,
            roleSkills: true
          }
        }
      }
    })

    if (!role) {
      return apiError('Peran karier tidak ditemukan', 404)
    }

    // If users currently have this as target, prevent hard delete (PRD F13.4)
    if (role._count.userTargets > 0) {
      return apiError(
        `Peran "${role.name}" tidak dapat dihapus karena telah dipilih sebagai target aktif oleh ${role._count.userTargets} pengguna.`,
        400,
        {
          isBlocked: true,
          userTargetsCount: role._count.userTargets
        }
      )
    }

    // Cascade delete role skills mapping and delete role
    await prisma.$transaction([
      prisma.careerRoleSkill.deleteMany({ where: { careerRoleId: id } }),
      prisma.careerRole.delete({ where: { id } })
    ])

    return apiSuccess(null, `Peran karier "${role.name}" berhasil dihapus`)
  } catch (error) {
    console.error('Admin DELETE Career Role Error:', error)
    
return apiError('Gagal menghapus peran karier', 500)
  }
}
