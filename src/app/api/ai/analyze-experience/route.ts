import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { extractSkillsFromExperience } from '@/libs/ai/skillExtractor'

/**
 * POST /api/ai/analyze-experience
 * Memicu proses ekstraksi AI untuk pengalaman tertentu (atau teks kustom).
 * Menyimpan hasil ekstraksi ke AiAnalysisJob dan AiSkillSuggestion.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const body = await req.json().catch(() => ({}))
    const { experienceId, customText } = body

    if (!experienceId && !customText) {
      return apiError('experienceId atau customText wajib disertakan', 400)
    }

    let experience: any = null
    let textToAnalyze = ''
    let title = ''
    let role = ''
    let institutionName = ''

    if (experienceId) {
      experience = await prisma.experience.findUnique({
        where: { id: experienceId }
      })

      if (!experience) {
        return apiError('Pengalaman tidak ditemukan', 404)
      }

      if (experience.userId !== userId) {
        return apiError('Anda tidak memiliki akses ke pengalaman ini', 403)
      }

      textToAnalyze = customText || experience.description || ''
      title = experience.title
      role = experience.role
      institutionName = experience.institutionName
    } else {
      textToAnalyze = customText || ''
    }

    if (!textToAnalyze.trim()) {
      return apiError('Deskripsi pengalaman kosong atau terlalu pendek untuk dianalisis oleh AI', 400)
    }

    // 1. Buat atau perbarui AiAnalysisJob
    let job = experienceId
      ? await prisma.aiAnalysisJob.findFirst({
          where: { experienceId, userId },
          orderBy: { createdAt: 'desc' }
        })
      : null

    if (!job || job.status === 'completed' || job.status === 'failed') {
      // Jika belum ada atau job lama sudah selesai, buat job baru
      if (experienceId) {
        job = await prisma.aiAnalysisJob.create({
          data: {
            userId,
            experienceId,
            status: 'processing',
            rawInput: textToAnalyze,
            startedAt: new Date()
          }
        })
      } else {
        // Analisis teks bebas (Live Playground / Daily Activity Logger)
        // Cari container experience atau buat otomatis jika belum ada
        let targetExp = await prisma.experience.findFirst({
          where: {
            userId,
            title: 'Aktivitas Harian & Projek Mandiri'
          }
        })

        if (!targetExp) {
          targetExp = await prisma.experience.findFirst({
            where: { userId }
          })
        }

        if (!targetExp) {
          targetExp = await prisma.experience.create({
            data: {
              userId,
              title: 'Aktivitas Harian & Projek Mandiri',
              type: 'project',
              role: 'Praktisi & Pembelajar Mandiri',
              institutionName: 'Aktivitas Mandiri (Daily Log)',
              startDate: new Date(),
              isOngoing: true,
              description: 'Kumpulan log aktivitas harian, pembelajaran praktis, dan proyek mandiri untuk pengembangan kompetensi.'
            }
          })
        }

        job = await prisma.aiAnalysisJob.create({
          data: {
            userId,
            experienceId: targetExp.id,
            status: 'processing',
            rawInput: textToAnalyze,
            startedAt: new Date()
          }
        })
      }
    } else {
      // Update job yang sedang queued menjadi processing
      job = await prisma.aiAnalysisJob.update({
        where: { id: job.id },
        data: {
          status: 'processing',
          startedAt: new Date(),
          rawInput: textToAnalyze
        }
      })
    }

    // 2. Jalankan pipeline AI ekstraksi
    const startTime = Date.now()
    const { skills, source } = await extractSkillsFromExperience({
      title,
      role,
      institutionName,
      description: textToAnalyze
    })
    const executionDuration = Date.now() - startTime

    // 3. Simpan saran ke tabel AiSkillSuggestion dalam transaksi
    const suggestions = await prisma.$transaction(async tx => {
      // Bersihkan saran pending lama jika job ini dianalisis ulang
      await tx.aiSkillSuggestion.deleteMany({
        where: {
          aiAnalysisJobId: job.id,
          reviewStatus: 'pending'
        }
      })

      // Simpan saran baru
      const createdSuggestions = []
      for (const item of skills) {
        const suggestion = await tx.aiSkillSuggestion.create({
          data: {
            aiAnalysisJobId: job.id,
            suggestedName: item.name,
            suggestedCategory: item.category,
            confidenceScore: item.confidence,
            reviewStatus: 'pending',
            finalName: item.name
          }
        })
        createdSuggestions.push({
          ...suggestion,
          level: item.level,
          reasoning: item.reasoning,
          metricTag: item.metricTag
        })
      }

      // Tandai job selesai
      await tx.aiAnalysisJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          rawOutput: {
            source,
            executionDurationMs: executionDuration,
            extractedCount: skills.length,
            skills
          } as any
        }
      })

      return createdSuggestions
    })

    return apiSuccess({
      jobId: job.id,
      job: { id: job.id, status: job.status },
      source,
      executionDurationMs: executionDuration,
      suggestionsCount: suggestions.length,
      suggestions
    }, 'Ekstraksi keahlian AI berhasil diselesaikan', 200)

  } catch (error: any) {
    console.error('Error analyzing experience with AI:', error)
    return apiError(error?.message || 'Terjadi kesalahan saat memproses analisis AI', 500, error)
  }
}
