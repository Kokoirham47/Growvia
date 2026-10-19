import { NextRequest } from 'next/server'
import { prisma } from '@/libs/prisma'
import { getServerSession } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { experienceSchema } from '@/server/validations/experience'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/experiences/[id]
 * Mengambil detail satu pengalaman berdasarkan ID beserta bukti skill yang terhubung
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { id } = await params

    const experience = await prisma.experience.findFirst({
      where: {
        id,
        userId
      },
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
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!experience) {
      return apiError('Pengalaman tidak ditemukan', 404)
    }

    return apiSuccess(experience)
  } catch (error) {
    console.error('Error fetching experience detail:', error)
    return apiError('Gagal mengambil data pengalaman', 500, error)
  }
}

/**
 * PUT /api/experiences/[id]
 * Memperbarui pengalaman (F03.1) dan memperbarui antrean analisis AI jika deskripsi berubah
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { id } = await params

    // Cek apakah pengalaman ada dan milik user yang sedang aktif
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existingExperience) {
      return apiError('Pengalaman tidak ditemukan atau Anda tidak memiliki akses', 404)
    }

    const body = await req.json()
    const validated = experienceSchema.parse(body)

    const startDate = new Date(validated.startDate)
    if (isNaN(startDate.getTime())) {
      return apiError('Format tanggal mulai tidak valid', 400)
    }

    let endDate: Date | null = null
    if (!validated.isOngoing && validated.endDate) {
      endDate = new Date(validated.endDate)
      if (isNaN(endDate.getTime())) {
        return apiError('Format tanggal selesai tidak valid', 400)
      }
    }

    const institutionName = validated.institutionName?.trim() || '-'
    const isDescriptionChanged = existingExperience.description !== validated.description

    const updated = await prisma.$transaction(async tx => {
      const exp = await tx.experience.update({
        where: { id },
        data: {
          title: validated.title,
          type: validated.type,
          role: validated.role,
          institutionName,
          startDate,
          endDate,
          isOngoing: validated.isOngoing,
          description: validated.description,
          proofUrl: validated.proofUrl || null
        },
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
        }
      })

      // Jika deskripsi berubah, buat job analisis AI baru
      if (isDescriptionChanged) {
        await tx.aiAnalysisJob.create({
          data: {
            userId,
            experienceId: id,
            status: 'queued',
            rawInput: validated.description
          }
        })
      }

      return exp
    })

    return apiSuccess(
      updated,
      'Pengalaman berhasil diperbarui' + (isDescriptionChanged ? ' dan diantrekan ulang untuk analisis AI' : '')
    )
  } catch (error) {
    console.error('Error updating experience:', error)
    return apiError('Gagal memperbarui pengalaman', 400, error)
  }
}

/**
 * DELETE /api/experiences/[id]
 * Menghapus pengalaman (F03.3) beserta pembersihan relasi bukti skill terkait
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    const userId = req.headers.get('x-user-id') || session?.userId

    if (!userId) {
      return apiError('Tidak terautentikasi. Silakan login terlebih dahulu.', 401)
    }

    const { id } = await params

    const experience = await prisma.experience.findFirst({
      where: {
        id,
        userId
      },
      include: {
        skillEvidences: {
          select: {
            id: true,
            userSkill: {
              select: {
                skill: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!experience) {
      return apiError('Pengalaman tidak ditemukan atau sudah dihapus', 404)
    }

    const affectedSkillsCount = experience.skillEvidences.length
    const affectedSkillNames = experience.skillEvidences.map(se => se.userSkill.skill.name)

    // Hapus pengalaman (Prisma cascade akan menghapus skillEvidences dan aiAnalysisJobs)
    await prisma.experience.delete({
      where: { id }
    })

    return apiSuccess({
      deletedId: id,
      affectedSkillsCount,
      affectedSkillNames
    }, 'Pengalaman berhasil dihapus')
  } catch (error) {
    console.error('Error deleting experience:', error)
    return apiError('Gagal menghapus pengalaman', 500, error)
  }
}
