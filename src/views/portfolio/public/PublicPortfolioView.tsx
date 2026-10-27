'use client'

import React, { useState, useEffect, useCallback } from 'react'

import type { PublicPortfolioData } from '@/types/portfolio'
import PublicPortfolioHeader from './PublicPortfolioHeader'
import PublicPortfolioContent from './PublicPortfolioContent'
import PublicPortfolioFloatingDock from './PublicPortfolioFloatingDock'
import PublicPortfolioNotFound from './PublicPortfolioNotFound'
import SharePortfolioModal from '../SharePortfolioModal'

interface PublicPortfolioViewProps {
  slug: string
  initialData?: PublicPortfolioData | null
}

export default function PublicPortfolioView({
  slug,
  initialData
}: PublicPortfolioViewProps) {
  const [data, setData] = useState<PublicPortfolioData | null>(initialData || null)
  const [isLoading, setIsLoading] = useState<boolean>(!initialData)

  const [errorStatus, setErrorStatus] = useState<{
    notFound: boolean
    isPrivate: boolean
    userName?: string
  }>({
    notFound: false,
    isPrivate: false
  })

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)

  // Fetch portfolio data
  const fetchPublicPortfolio = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/public/${slug}`)
      const json = await res.json()

      if (res.status === 404) {
        setErrorStatus({ notFound: true, isPrivate: false })
        
return
      }

      if (res.status === 403 || json.errors?.code === 'PRIVATE_PORTFOLIO') {
        setErrorStatus({
          notFound: false,
          isPrivate: true,
          userName: json.errors?.userName
        })
        
return
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal memuat portofolio publik')
      }

      setData(json.data)
    } catch (err) {
      console.error('Error fetching public portfolio:', err)
      setErrorStatus({ notFound: true, isPrivate: false })
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (!initialData) {
      fetchPublicPortfolio()
    }
  }, [fetchPublicPortfolio, initialData])

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  // Not found / Private state
  if (errorStatus.notFound || errorStatus.isPrivate) {
    return (
      <PublicPortfolioNotFound
        isPrivate={errorStatus.isPrivate}
        userName={errorStatus.userName}
        slug={slug}
      />
    )
  }

  // Loading Skeleton
  if (isLoading || !data) {
    return (
      <div className='min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col'>
        <div className='h-16 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse' />
        <div className='max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8 animate-pulse'>
          <div className='flex items-center gap-6'>
            <div className='w-24 h-24 rounded-3xl bg-slate-200 dark:bg-slate-800' />
            <div className='space-y-3 flex-1'>
              <div className='h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3' />
              <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2' />
              <div className='h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3' />
            </div>
          </div>
          <div className='h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800' />
          <div className='h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800' />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 font-["Poppins",sans-serif]'>
      {/* 1. Header Navigation */}
      <PublicPortfolioHeader
        theme={data.theme}
        onShare={handleShare}
      />

      {/* 2. Core Portfolio Content */}
      <PublicPortfolioContent
        data={data}
        theme={data.theme}
        sections={data.sections}
      />

      {/* 3. Floating Action Dock */}
      <PublicPortfolioFloatingDock
        onShare={handleShare}
        theme={data.theme}
      />

      {/* 4. Share Modal */}
      <SharePortfolioModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slug={slug}
        userName={data.user.name}
      />
    </div>
  )
}
