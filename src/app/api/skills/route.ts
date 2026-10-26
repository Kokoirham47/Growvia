import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { SkillCategory, SkillLevel, SkillSource } from '@prisma/client'

/**
 * GET /api/skills
 * Mengambil daftar skill dan bukti kompetensi pengguna dari Supabase database
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    // Ambil data user skills dari Supabase database
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
        skillEvidences: {
          include: {
            experience: true
          }
        }
      },
      orderBy: { score: 'desc' }
    })

    const formatted = userSkills.map((us: any) => ({
      id: us.id,
      name: us.skill.name,
      category: us.skill.category,
      subCategory: us.skill.normalizedName || undefined,
      level: us.level,
      score: us.score,
      evidenceCount: us.skillEvidences?.length || 0,
      evidenceTags: us.skillEvidences?.map((e: any) => e.experience?.title).filter(Boolean) || [],
      source: us.source,
      aiConfidence: us.aiConfidence || undefined,
      isAiVerified: us.source === 'ai_extracted',
      createdAt: us.createdAt ? us.createdAt.toISOString() : undefined
    }))

    // Ekstrak detail bukti (evidences) untuk tab Bukti Pengalaman
    const evidences = userSkills.flatMap((us: any) =>
      (us.skillEvidences || []).map((se: any) => ({
        id: se.id,
        skillId: us.id,
        skillName: us.skill.name,
        experienceTitle: se.experience?.title || 'Pengalaman',
        experienceRole: se.experience?.role || '',
        institutionName: se.experience?.institutionName || '',
        period: se.experience
          ? `${new Date(se.experience.startDate).getFullYear()} - ${se.experience.isOngoing ? 'Sekarang' : se.experience.endDate ? new Date(se.experience.endDate).getFullYear() : ''}`
          : '',
        type: se.experience?.type || 'Pengalaman',
        impactNote: se.note || se.experience?.description || '',
        proofUrl: se.experience?.proofUrl || undefined,
        aiExtracted: us.source === 'ai_extracted'
      }))
    )

    return apiSuccess({
      skills: formatted,
      evidences,
      total: formatted.length
    })
  } catch (error: any) {
    console.error('Error fetching skills from Supabase:', error)
    return apiError(error.message || 'Gagal mengambil data skills dari database', 500)
  }
}

/**
 * POST /api/skills
 * Menambahkan skill baru ke profil user di Supabase
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const { name, category, level, score, subCategory, source } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return apiError('Nama skill wajib diisi', 400)
    }

    const skillName = name.trim()
    const validCategory = (category as SkillCategory) || SkillCategory.hard_skill
    const validLevel = (level as SkillLevel) || SkillLevel.intermediate
    const validScore = typeof score === 'number' ? Math.min(100, Math.max(0, score)) : 75
    const validSource = source === 'ai_extracted' ? SkillSource.ai_extracted : SkillSource.manual

    // 1. Cari atau buat master skill di tabel skills
    const skill = await prisma.skill.upsert({
      where: { name: skillName },
      update: {
        category: validCategory,
        normalizedName: subCategory?.trim() || skillName.toLowerCase()
      },
      create: {
        name: skillName,
        category: validCategory,
        normalizedName: subCategory?.trim() || skillName.toLowerCase()
      }
    })

    // 2. Buat atau update userSkill untuk user di Supabase
    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id
        }
      },
      update: {
        level: validLevel,
        score: validScore,
        source: validSource
      },
      create: {
        userId,
        skillId: skill.id,
        level: validLevel,
        score: validScore,
        source: validSource
      },
      include: {
        skill: true,
        skillEvidences: {
          include: {
            experience: true
          }
        }
      }
    })

    const formatted = {
      id: userSkill.id,
      name: userSkill.skill.name,
      category: userSkill.skill.category,
      subCategory: userSkill.skill.normalizedName || undefined,
      level: userSkill.level,
      score: userSkill.score,
      evidenceCount: userSkill.skillEvidences?.length || 0,
      evidenceTags: userSkill.skillEvidences?.map((e: any) => e.experience?.title).filter(Boolean) || [],
      source: userSkill.source,
      aiConfidence: userSkill.aiConfidence || undefined,
      isAiVerified: userSkill.source === 'ai_extracted',
      createdAt: userSkill.createdAt.toISOString()
    }

    return apiSuccess(formatted, 'Skill berhasil ditambahkan ke profil Supabase')
  } catch (error: any) {
    console.error('Error creating skill in Supabase:', error)
    return apiError(error.message || 'Gagal menambahkan skill', 500)
  }
}

/**
 * PUT /api/skills
 * Memperbarui skill profil user di Supabase
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json()
    const { id, level, score, subCategory } = body

    if (!id) {
      return apiError('ID skill wajib disertakan', 400)
    }

    // Pastikan userSkill milik user yang sedang aktif
    const existing = await prisma.userSkill.findFirst({
      where: { id, userId },
      include: { skill: true }
    })

    if (!existing) {
      return apiError('Skill tidak ditemukan atau bukan milik Anda', 404)
    }

    const validLevel = (level as SkillLevel) || existing.level
    const validScore = typeof score === 'number' ? Math.min(100, Math.max(0, score)) : existing.score

    // Update master skill normalizedName jika subCategory diubah
    if (subCategory && subCategory !== existing.skill.normalizedName) {
      await prisma.skill.update({
        where: { id: existing.skillId },
        data: { normalizedName: subCategory.trim() }
      })
    }

    const updated = await prisma.userSkill.update({
      where: { id },
      data: {
        level: validLevel,
        score: validScore
      },
      include: {
        skill: true,
        skillEvidences: {
          include: {
            experience: true
          }
        }
      }
    })

    const formatted = {
      id: updated.id,
      name: updated.skill.name,
      category: updated.skill.category,
      subCategory: updated.skill.normalizedName || undefined,
      level: updated.level,
      score: updated.score,
      evidenceCount: updated.skillEvidences?.length || 0,
      evidenceTags: updated.skillEvidences?.map((e: any) => e.experience?.title).filter(Boolean) || [],
      source: updated.source,
      aiConfidence: updated.aiConfidence || undefined,
      isAiVerified: updated.source === 'ai_extracted',
      createdAt: updated.createdAt.toISOString()
    }

    return apiSuccess(formatted, 'Skill berhasil diperbarui di Supabase')
  } catch (error: any) {
    console.error('Error updating skill in Supabase:', error)
    return apiError(error.message || 'Gagal memperbarui skill', 500)
  }
}

/**
 * DELETE /api/skills?id=xxx
 * Menghapus skill dari profil user di Supabase
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return apiError('ID skill wajib disertakan', 400)
    }

    const existing = await prisma.userSkill.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      return apiError('Skill tidak ditemukan atau bukan milik Anda', 404)
    }

    await prisma.userSkill.delete({
      where: { id }
    })

    return apiSuccess({ id }, 'Skill berhasil dihapus dari profil Supabase')
  } catch (error: any) {
    console.error('Error deleting skill from Supabase:', error)
    return apiError(error.message || 'Gagal menghapus skill', 500)
  }
}
