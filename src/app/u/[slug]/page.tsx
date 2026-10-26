import type { Metadata } from 'next'

import { prisma } from '@/libs/prisma'
import PublicPortfolioView from '@/views/portfolio/public/PublicPortfolioView'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cleanSlug = slug?.toLowerCase()

  const profile = await prisma.profile.findFirst({
    where: {
      portfolioSlug: cleanSlug,
      portfolioPublished: true
    },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
        }
      }
    }
  })

  if (!profile) {
    return {
      title: 'Portofolio Tidak Ditemukan — Growvia',
      description: 'Halaman portofolio digital berbasis bukti keahlian nyata.'
    }
  }

  const title = `${profile.user.name} — Portofolio Terverifikasi Growvia`

  const description =
    profile.headline ||
    profile.bio?.slice(0, 160) ||
    `Lihat rekam jejak pengalaman dan keahlian berbasis bukti nyata milik ${profile.user.name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile.user.avatarUrl ? [{ url: profile.user.avatarUrl }] : undefined
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params

  
return <PublicPortfolioView slug={slug} />
}
