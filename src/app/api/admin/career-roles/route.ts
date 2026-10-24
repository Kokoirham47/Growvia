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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') || ''

    const whereClause: Record<string, unknown> = {}

    if (search.trim()) {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { industry: { contains: search.trim(), mode: 'insensitive' } },
        { slug: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    const roles = await prisma.careerRole.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            roleSkills: true,
            userTargets: true
          }
        }
      }
    })

    return apiSuccess({
      data: roles,
      total: roles.length
    })
  } catch (error) {
    console.error('Admin GET Career Roles Error:', error)
    
return apiError('Gagal memuat daftar peran karier', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, industry, description } = body

    if (!name?.trim()) {
      return apiError('Nama peran karier wajib diisi', 400)
    }

    const cleanName = String(name).trim()
    const cleanSlug = slug?.trim() ? String(slug).toLowerCase().trim() : generateSlug(cleanName)

    // Check duplicate slug
    const existing = await prisma.careerRole.findUnique({
      where: { slug: cleanSlug }
    })

    if (existing) {
      return apiError(`Peran karier dengan slug "${cleanSlug}" sudah terdaftar`, 409)
    }

    const newRole = await prisma.careerRole.create({
      data: {
        name: cleanName,
        slug: cleanSlug,
        industry: industry?.trim() || null,
        description: description?.trim() || null
      }
    })

    return apiSuccess(newRole, 'Peran karier baru berhasil ditambahkan', 201)
  } catch (error) {
    console.error('Admin POST Career Role Error:', error)
    
return apiError('Gagal menambahkan peran karier', 500)
  }
}
