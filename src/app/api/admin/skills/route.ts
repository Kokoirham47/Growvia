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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') as SkillCategory | null
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50', 10)))
    const skip = (page - 1) * limit

    const whereClause: Record<string, unknown> = {}

    if (search.trim()) {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { normalizedName: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    if (category && Object.values(SkillCategory).includes(category)) {
      whereClause.category = category
    }

    const [total, skills] = await Promise.all([
      prisma.skill.count({ where: whereClause }),
      prisma.skill.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
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
    ])

    return apiSuccess({
      data: skills,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin GET Skills Error:', error)
    
return apiError('Gagal memuat master data skill', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check duplicate name
    const existing = await prisma.skill.findUnique({
      where: { name: cleanName }
    })

    if (existing) {
      return apiError(`Skill dengan nama "${cleanName}" sudah terdaftar`, 409)
    }

    const newSkill = await prisma.skill.create({
      data: {
        name: cleanName,
        category,
        normalizedName: cleanNormalized
      }
    })

    return apiSuccess(newSkill, 'Master skill berhasil ditambahkan', 201)
  } catch (error) {
    console.error('Admin POST Skill Error:', error)
    
return apiError('Gagal menambahkan master skill', 500)
  }
}
