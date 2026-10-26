import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

interface RouteParams {
  params: Promise<{
    jobId: string
  }>
}

/**
 * GET /api/ai/suggestions/[jobId]
 * Mengambil daftar saran skill yang dihasilkan oleh AI Analysis Job tertentu
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { jobId } = await params

    if (!jobId) {
      return apiError('Job ID tidak valid', 400)
    }

    const job = await prisma.aiAnalysisJob.findUnique({
      where: { id: jobId },
      include: {
        experience: {
          select: {
            id: true,
            title: true,
            role: true,
            institutionName: true,
            type: true,
            description: true
          }
        },
        suggestions: {
          orderBy: [
            { confidenceScore: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!job) {
      return apiError('Job analisis AI tidak ditemukan', 404)
    }

    if (job.userId !== userId) {
      return apiError('Anda tidak memiliki akses ke data analisis ini', 403)
    }

    // Ekstrak metadata reasoning dan metricTag dari rawOutput jika ada
    const rawSkills = (job.rawOutput as any)?.skills || []
    const rawSkillMap = new Map<string, any>()
    rawSkills.forEach((s: any) => {
      rawSkillMap.set(s.name?.toLowerCase().trim(), s)
    })

    const enrichedSuggestions = job.suggestions.map(s => {
      const meta = rawSkillMap.get(s.suggestedName.toLowerCase().trim())
      return {
        ...s,
        level: meta?.level || (s.confidenceScore > 85 ? 'advanced' : 'intermediate'),
        reasoning: meta?.reasoning || 'Keahlian kompetensi diidentifikasi dari narasi tanggung jawab aktivitas.',
        metricTag: meta?.metricTag || null
      }
    })

    return apiSuccess({
      job: {
        id: job.id,
        status: job.status,
        experience: job.experience,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      },
      suggestions: enrichedSuggestions
    })

  } catch (error) {
    console.error('Error fetching AI suggestions:', error)
    return apiError('Gagal memuat saran keahlian AI', 500, error)
  }
}
