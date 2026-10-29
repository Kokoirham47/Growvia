import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { experienceSchema, experienceTypes } from '@/server/validations/experience'
import { ExperienceType } from '@prisma/client'

/**
 * GET /api/experiences
 * Mengambil daftar pengalaman pengguna dengan pencarian, filter tipe, dan statistik
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search')?.trim() || ''
    const typeFilter = searchParams.get('type')?.trim() || 'all'

    // Build filter condition
    const whereCondition: any = {
      userId
    }

    if (typeFilter && typeFilter !== 'all' && (experienceTypes as readonly string[]).includes(typeFilter)) {
      whereCondition.type = typeFilter as ExperienceType
    }

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { institutionName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Ambil daftar pengalaman dengan relasi skill evidence dan aiAnalysisJobs
    const [experiences, allUserExperiences] = await Promise.all([
      prisma.experience.findMany({
        where: whereCondition,
        include: {
          skillEvidences: {
            include: {
              userSkill: {
                include: {
                  skill: true
                }
              }
            }
          },
          aiAnalysisJobs: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: [
          { startDate: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      // Query ringkas untuk statistik keseluruhan
      prisma.experience.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          isOngoing: true,
          skillEvidences: {
            select: {
              userSkillId: true
            }
          }
        }
      })
    ])

    // Hitung statistik
    const totalCount = allUserExperiences.length
    const ongoingCount = allUserExperiences.filter(e => e.isOngoing).length
    
    // Hitung unique skill yang tervalidasi dari seluruh pengalaman
    const uniqueSkillIds = new Set<string>()
    allUserExperiences.forEach(exp => {
      exp.skillEvidences.forEach(ev => uniqueSkillIds.add(ev.userSkillId))
    })

    const typeBreakdown: Record<string, number> = {
      all: totalCount,
      organisation: 0,
      committee: 0,
      internship: 0,
      freelance: 0,
      project: 0,
      competition: 0,
      other: 0
    }

    allUserExperiences.forEach(exp => {
      if (typeBreakdown[exp.type] !== undefined) {
        typeBreakdown[exp.type]++
      }
    })

    return apiSuccess({
      experiences,
      stats: {
        total: totalCount,
        ongoing: ongoingCount,
        skillsExtracted: uniqueSkillIds.size,
        typeBreakdown
      }
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return apiError('Gagal mengambil daftar pengalaman', 500, error)
  }
}

/**
 * POST /api/experiences
 * Menambahkan pengalaman baru (F03.1) dan otomatis memicu AI Skill Extraction Job (F03.1/F04)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const validated = experienceSchema.parse(body)

    // Parsing tanggal mulai
    const startDate = new Date(validated.startDate)
    if (isNaN(startDate.getTime())) {
      return apiError('Format tanggal mulai tidak valid', 400)
    }

    // Parsing tanggal selesai jika ada dan tidak sedang berlangsung
    let endDate: Date | null = null
    if (!validated.isOngoing && validated.endDate) {
      endDate = new Date(validated.endDate)
      if (isNaN(endDate.getTime())) {
        return apiError('Format tanggal selesai tidak valid', 400)
      }
    }

    // Default nama institusi jika kosong
    const institutionName = validated.institutionName?.trim() || '-'

    // Simpan entitas pengalaman ke database
    const experience = await prisma.experience.create({
      data: {
        userId,
        title: validated.title,
        type: validated.type,
        role: validated.role,
        institutionName,
        startDate,
        endDate,
        isOngoing: validated.isOngoing,
        description: validated.description,
        proofUrl: validated.proofUrl || null
      }
    })

    // Otomatis antrekan AI Skill Analysis Job (non-blocking fallback)
    try {
      await prisma.aiAnalysisJob.create({
        data: {
          userId,
          experienceId: experience.id,
          status: 'queued',
          rawInput: validated.description
        }
      })
    } catch (aiErr) {
      console.warn('AiAnalysisJob awal dilewati, akan dibuat saat modal review dibuka:', aiErr)
    }

    return apiSuccess(
      experience,
      'Pengalaman berhasil ditambahkan dan siap dianalisis oleh AI',
      201
    )
  } catch (error) {
    console.error('Error creating experience:', error)
    return apiError('Gagal menambahkan pengalaman', 400, error)
  }
}
