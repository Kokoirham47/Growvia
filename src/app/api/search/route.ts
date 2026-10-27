import { cookies } from 'next/headers'

import { prisma } from '@/libs/prisma'
import { AUTH_COOKIE_NAME, verifyJwtToken } from '@/server/utils/auth'
import { apiSuccess, apiError } from '@/server/utils/response'

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

const STATIC_NAV_PAGES = [
  {
    id: 'nav-home',
    title: 'Dashboard Utama',
    subtitle: 'Ringkasan skor kesiapan karier & perkembangan skill',
    category: 'navigation',
    url: '/home',
    keywords: ['dashboard', 'beranda', 'home', 'skor', 'ringkasan']
  },
  {
    id: 'nav-skills',
    title: 'Bank Skill & Portofolio Kompetensi',
    subtitle: 'Daftar skill terverifikasi AI dari pengalaman nyata',
    category: 'navigation',
    url: '/skills',
    keywords: ['skill', 'kompetensi', 'keahlian', 'verifikasi', 'hard skill', 'soft skill']
  },
  {
    id: 'nav-experience',
    title: 'Dokumentasi Pengalaman',
    subtitle: 'Kelola pengalaman kerja, organisasi, kepanitiaan, dan proyek',
    category: 'navigation',
    url: '/experience',
    keywords: ['pengalaman', 'kerja', 'organisasi', 'magang', 'proyek', 'portofolio']
  },
  {
    id: 'nav-career',
    title: 'Analisis Kesenjangan Karier (Career Gap)',
    subtitle: 'Bandingkan kesiapan Anda dengan peran karier impian',
    category: 'navigation',
    url: '/career',
    keywords: ['karier', 'career', 'gap', 'target', 'peran', 'kesiapan']
  },
  {
    id: 'nav-opportunities',
    title: 'Eksplorasi Lowongan Karier',
    subtitle: 'Lowongan magang, kerja, dan kompetensi yang cocok dengan profil',
    category: 'navigation',
    url: '/opportunities',
    keywords: ['lowongan', 'loker', 'magang', 'internship', 'pekerjaan', 'peluang']
  },
  {
    id: 'nav-learning',
    title: 'Rekomendasi Materi Belajar',
    subtitle: 'Kursus dan modul rekomendasi AI untuk menutup gap kompetensi',
    category: 'navigation',
    url: '/learning',
    keywords: ['belajar', 'kursus', 'learning', 'materi', 'modul', 'rekomendasi']
  },
  {
    id: 'nav-portfolio',
    title: 'Portfolio Builder & Public View',
    subtitle: 'Kelola tautan dan pratinjau live portofolio digital Anda',
    category: 'navigation',
    url: '/portfolio',
    keywords: ['portofolio', 'portfolio', 'builder', 'publik', 'live preview']
  },
  {
    id: 'nav-profile',
    title: 'Edit Profil Saya',
    subtitle: 'Ubah foto profil, biodata, headline, dan perguruan tinggi',
    category: 'navigation',
    url: '/profile',
    keywords: ['profil', 'profile', 'biodata', 'foto', 'avatar', 'kampus', 'universitas']
  },
  {
    id: 'nav-settings',
    title: 'Pengaturan Akun & Keamanan',
    subtitle: 'Kelola kata sandi, privasi portofolio, dan akun',
    category: 'navigation',
    url: '/settings',
    keywords: ['pengaturan', 'settings', 'password', 'kata sandi', 'privasi', 'keamanan']
  }
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    const queryLower = q.toLowerCase()

    const userId = await getAuthenticatedUserId(req)

    // Filter static navigation pages
    const matchingPages = queryLower
      ? STATIC_NAV_PAGES.filter(
          p =>
            p.title.toLowerCase().includes(queryLower) ||
            p.subtitle.toLowerCase().includes(queryLower) ||
            p.keywords.some(k => k.includes(queryLower))
        )
      : STATIC_NAV_PAGES.slice(0, 3)

    // If query is empty, return quick navigation suggestions and popular skills
    if (!q) {
      let popularSkills: any[] = []

      try {
        popularSkills = await prisma.skill.findMany({
          take: 4,
          orderBy: { createdAt: 'asc' },
          select: { id: true, name: true, category: true }
        })
      } catch {
        // Fallback if DB query fails
      }

      return apiSuccess({
        query: '',
        results: {
          skills: popularSkills.map(s => ({
            id: s.id,
            title: s.name,
            subtitle: `Skill ${s.category.replace('_', ' ')}`,
            category: 'skill',
            url: `/skills?search=${encodeURIComponent(s.name)}`
          })),
          opportunities: [],
          experiences: [],
          careerRoles: [],
          learningResources: [],
          navigation: matchingPages
        }
      })
    }

    // 1. Search Skills
    let skills: any[] = []

    try {
      skills = await prisma.skill.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { normalizedName: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 4,
        select: { id: true, name: true, category: true }
      })
    } catch (err) {
      console.warn('Skills search error:', err)
    }

    // 2. Search Career Opportunities
    let opportunities: any[] = []

    try {
      opportunities = await prisma.careerOpportunity.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { location: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 4,
        select: { id: true, title: true, company: true, location: true, type: true }
      })
    } catch (err) {
      console.warn('Opportunities search error:', err)
    }

    // 3. Search Experiences (user-specific)
    let experiences: any[] = []

    if (userId) {
      try {
        experiences = await prisma.experience.findMany({
          where: {
            userId,
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { role: { contains: q, mode: 'insensitive' } },
              { institutionName: { contains: q, mode: 'insensitive' } }
            ]
          },
          take: 4,
          select: { id: true, title: true, role: true, institutionName: true, type: true }
        })
      } catch (err) {
        console.warn('Experiences search error:', err)
      }
    }

    // 4. Search Career Roles
    let careerRoles: any[] = []

    try {
      careerRoles = await prisma.careerRole.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' }
        },
        take: 3,
        select: { id: true, name: true }
      })
    } catch (err) {
      console.warn('Career roles search error:', err)
    }

    // 5. Search Learning Resources
    let learningResources: any[] = []

    try {
      learningResources = await prisma.learningResource.findMany({
        where: {
          isActive: true,
          title: { contains: q, mode: 'insensitive' }
        },
        take: 3,
        select: { id: true, title: true, platform: true, type: true }
      })
    } catch (err) {
      console.warn('Learning search error:', err)
    }

    return apiSuccess({
      query: q,
      results: {
        skills: skills.map(s => ({
          id: s.id,
          title: s.name,
          subtitle: `Skill ${s.category.replace('_', ' ')}`,
          category: 'skill',
          url: `/skills?search=${encodeURIComponent(s.name)}`
        })),
        opportunities: opportunities.map(o => ({
          id: o.id,
          title: o.title,
          subtitle: `${o.company}${o.location ? ` • ${o.location}` : ''} (${o.type})`,
          category: 'opportunity',
          url: `/opportunities?search=${encodeURIComponent(o.title)}`
        })),
        experiences: experiences.map(e => ({
          id: e.id,
          title: e.title,
          subtitle: `${e.role} di ${e.institutionName} • ${e.type}`,
          category: 'experience',
          url: `/experience?search=${encodeURIComponent(e.title)}`
        })),
        careerRoles: careerRoles.map(r => ({
          id: r.id,
          title: r.name,
          subtitle: 'Peran Karier Sasaran',
          category: 'career_role',
          url: `/career`
        })),
        learningResources: learningResources.map(l => ({
          id: l.id,
          title: l.title,
          subtitle: `${l.platform} • ${l.type}`,
          category: 'learning',
          url: `/learning`
        })),
        navigation: matchingPages
      }
    })
  } catch (error) {
    console.error('Error on /api/search:', error)

    return apiError('Gagal melakukan pencarian', 500, error)
  }
}
