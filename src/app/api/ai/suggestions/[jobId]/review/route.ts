import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { SkillLevel } from '@prisma/client'

interface RouteParams {
  params: Promise<{
    jobId: string
  }>
}

interface ReviewDecision {
  suggestionId: string
  action: 'accept' | 'edit' | 'reject'
  finalName?: string
  level?: SkillLevel
}

/**
 * POST /api/ai/suggestions/[jobId]/review
 * Menyimpan keputusan review user (Accept All / Edit / Reject).
 * Memasukkan skill yang diterima ke tabel USER_SKILL dan menautkannya ke SKILL_EVIDENCE.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { jobId } = await params
    const body = await req.json().catch(() => ({}))
    const reviews: ReviewDecision[] = body.reviews || []

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return apiError('Daftar review keputusan kosong', 400)
    }

    const job = await prisma.aiAnalysisJob.findUnique({
      where: { id: jobId },
      include: {
        suggestions: true
      }
    })

    if (!job) {
      return apiError('Job analisis AI tidak ditemukan', 404)
    }

    if (job.userId !== userId) {
      return apiError('Anda tidak memiliki akses ke job ini', 403)
    }

    const suggestionMap = new Map(job.suggestions.map(s => [s.id, s]))
    let acceptedCount = 0
    let rejectedCount = 0

    // Eksekusi transaksi database untuk memastikan konsistensi data
    await prisma.$transaction(async tx => {
      for (const item of reviews) {
        const suggestion = suggestionMap.get(item.suggestionId)
        if (!suggestion) continue

        if (item.action === 'reject') {
          await tx.aiSkillSuggestion.update({
            where: { id: suggestion.id },
            data: {
              reviewStatus: 'rejected',
              reviewedAt: new Date()
            }
          })
          rejectedCount++
          continue
        }

        // Action adalah 'accept' atau 'edit'
        const rawSkillName = (item.finalName || suggestion.suggestedName).trim()
        const normalized = rawSkillName.toLowerCase()

        // 1. Cari atau buat Master Skill di tabel `skills`
        let masterSkill = await tx.skill.findFirst({
          where: {
            OR: [
              { name: { equals: rawSkillName, mode: 'insensitive' } },
              { normalizedName: normalized }
            ]
          }
        })

        if (!masterSkill) {
          masterSkill = await tx.skill.create({
            data: {
              name: rawSkillName,
              normalizedName: normalized,
              category: suggestion.suggestedCategory
            }
          })
        }

        // 2. Cari atau buat UserSkill di profil pengguna
        let userSkill = await tx.userSkill.findUnique({
          where: {
            userId_skillId: {
              userId,
              skillId: masterSkill.id
            }
          }
        })

        // Tentukan skor penguasaan & level berbasis bukti empiris akumulatif:
        // - Bukti ke-1 (Skill baru pertama kali dicatat): Skor awal 25% + (confidence / 10) => ~35% (Beginner)
        // - Bukti ke-2: +20% => ~55% (Intermediate)
        // - Bukti ke-3: +20% => ~75% (Advanced)
        // - Bukti ke-4+: Akumulasi bertahap hingga 100% (Expert)
        let newScore = 0
        let calculatedLevel: SkillLevel = 'beginner'

        if (!userSkill) {
          // Skill baru pertama kali ditambahkan
          const confidenceBonus = Math.round((suggestion.confidenceScore / 100) * 10)
          newScore = 25 + confidenceBonus // kisaran 29 - 35%
          calculatedLevel = (item.level && item.level !== 'advanced') ? item.level : 'beginner'

          userSkill = await tx.userSkill.create({
            data: {
              userId,
              skillId: masterSkill.id,
              level: calculatedLevel,
              score: newScore,
              source: 'ai_extracted',
              aiConfidence: suggestion.confidenceScore
            }
          })
        } else {
          // Skill sudah pernah ada di profil, akumulasikan bukti baru
          newScore = Math.min(100, Math.max(userSkill.score + 20, 30))

          if (newScore >= 90) {
            calculatedLevel = 'expert'
          } else if (newScore >= 75) {
            calculatedLevel = 'advanced'
          } else if (newScore >= 45) {
            calculatedLevel = 'intermediate'
          } else {
            calculatedLevel = 'beginner'
          }

          userSkill = await tx.userSkill.update({
            where: { id: userSkill.id },
            data: {
              level: calculatedLevel,
              aiConfidence: Math.max(userSkill.aiConfidence || 0, suggestion.confidenceScore),
              score: newScore
            }
          })
        }

        // 3. Buat bukti relasi di SKILL_EVIDENCE yang merujuk ke pengalaman asal
        const existingEvidence = await tx.skillEvidence.findFirst({
          where: {
            userSkillId: userSkill.id,
            experienceId: job.experienceId
          }
        })

        if (!existingEvidence) {
          await tx.skillEvidence.create({
            data: {
              userSkillId: userSkill.id,
              experienceId: job.experienceId,
              note: `Divalidasi via Growvia AI Skill Extraction (Confidence: ${Math.round(suggestion.confidenceScore)}%)`
            }
          })
        }

        // 4. Update status saran AI
        await tx.aiSkillSuggestion.update({
          where: { id: suggestion.id },
          data: {
            reviewStatus: item.action === 'edit' ? 'edited' : 'accepted',
            finalName: rawSkillName,
            mappedSkillId: masterSkill.id,
            reviewedAt: new Date()
          }
        })

        acceptedCount++
      }
    })

    return apiSuccess({
      jobId: job.id,
      acceptedCount,
      rejectedCount
    }, `${acceptedCount} keahlian berhasil dikonfirmasi dan dimasukkan ke Skill Matrix profil Anda!`)

  } catch (error) {
    console.error('Error reviewing AI suggestions:', error)
    return apiError('Gagal menyimpan hasil review keahlian AI', 500, error)
  }
}
