import path from 'path'
import fs from 'fs/promises'

import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'
import { createAdminClient } from '@/libs/supabase/admin'

async function getAuthenticatedUserId(req: Request): Promise<string | null> {
  const cookieStore = await cookies()
  let token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    const authHeader = req.headers.get('authorization')

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  if (!token) return null

  const decoded = await verifyJwtToken(token)

  
return decoded?.userId || null
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return apiError('File foto profil tidak ditemukan', 400)
    }

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']

    if (!validMimes.includes(file.type)) {
      return apiError('Format file tidak didukung. Harap gunakan format JPEG, PNG, atau WebP.', 400)
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024

    if (file.size > MAX_SIZE) {
      return apiError('Ukuran file terlalu besar. Maksimal 5MB.', 400)
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`

    let publicAvatarUrl = ''

    // 1. Try Supabase Storage first if configured
    try {
      const supabase = createAdminClient()

      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(b => b.name === 'avatars')

      if (!bucketExists) {
        await supabase.storage.createBucket('avatars', { public: true })
      }

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`users/${fileName}`, buffer, {
          contentType: file.type,
          upsert: true
        })

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`users/${fileName}`)

        publicAvatarUrl = publicUrlData.publicUrl
      }
    } catch {
      // Supabase storage not configured or bucket doesn't exist, proceed to local fallback
    }

    // 2. Fallback to local public/uploads/avatars directory
    if (!publicAvatarUrl) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')

      await fs.mkdir(uploadsDir, { recursive: true })

      const filePath = path.join(uploadsDir, fileName)

      await fs.writeFile(filePath, buffer)

      publicAvatarUrl = `/uploads/avatars/${fileName}`
    }

    // 3. Save URL to Prisma User
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: publicAvatarUrl }
    })

    return apiSuccess(
      { avatarUrl: publicAvatarUrl },
      'Foto profil berhasil diunggah'
    )
  } catch (error) {
    console.error('Error uploading avatar:', error)
    
return apiError('Gagal mengunggah foto profil', 500, error)
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUserId(req)

    if (!userId) {
      return apiError('Tidak terautentikasi', 401)
    }

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null }
    })

    return apiSuccess({ avatarUrl: null }, 'Foto profil berhasil dihapus')
  } catch (error) {
    console.error('Error removing avatar:', error)
    
return apiError('Gagal menghapus foto profil', 500, error)
  }
}
