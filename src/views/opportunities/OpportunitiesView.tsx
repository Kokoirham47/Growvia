'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { CheckCircle2, AlertTriangle } from 'lucide-react'

import type {
  OpportunityItem,
  OpportunitiesResponse,
  OpportunitiesFilterState
} from '@/types/opportunities'

import OpportunitiesHeader from './OpportunitiesHeader'
import OpportunitiesFilterBar from './OpportunitiesFilterBar'
import OpportunityCard from './OpportunityCard'
import OpportunityDetailModal from './OpportunityDetailModal'
import OpportunitiesEmptyState from './OpportunitiesEmptyState'

export default function OpportunitiesView() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Metadata profil pengguna & matching
  const [meta, setMeta] = useState<{
    total: number
    userSkillsCount: number
    averageMatchScore: number
    userTargetRole: string | null
  }>({
    total: 0,
    userSkillsCount: 0,
    averageMatchScore: 0,
    userTargetRole: null
  })

  // Filter & Urutan
  const [filters, setFilters] = useState<OpportunitiesFilterState>({
    search: '',
    type: 'all',
    quickFilter: 'all',
    location: '',
    sort: 'match_desc'
  })

  // State modal detail
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // State loading bookmark per item
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev))
    }, 3500)
  }, [])

  // Fetch opportunities from API
  const fetchOpportunities = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()

      if (filters.type !== 'all') {
        queryParams.set('type', filters.type)
      }

      if (filters.location) {
        queryParams.set('location', filters.location)
      }

      if (filters.sort) {
        queryParams.set('sort', filters.sort)
      }

      const res = await fetch(`/api/opportunities?${queryParams.toString()}`)
      const data: OpportunitiesResponse = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memuat daftar peluang karier')
      }

      setOpportunities(data.data || [])

      if (data.meta) {
        setMeta(data.meta)
      }
    } catch (err: any) {
      console.error('Error fetching opportunities:', err)
      setError(err.message || 'Terjadi kesalahan pada sistem saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }, [filters.type, filters.location, filters.sort])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  // Filter di sisi klien untuk search & quick filters agar responsif instan
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // 1. Search text filter
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const matchTitle = opp.title.toLowerCase().includes(query)
        const matchCompany = opp.company.toLowerCase().includes(query)
        const matchLoc = opp.location?.toLowerCase().includes(query) ?? false
        const matchSkill = opp.allSkills.some(s => s.name.toLowerCase().includes(query))

        if (!matchTitle && !matchCompany && !matchLoc && !matchSkill) {
          return false
        }
      }

      // 2. Quick filters
      if (filters.quickFilter === 'high_match' && opp.matchScore < 70) {
        return false
      }

      if (filters.quickFilter === 'saved' && !opp.isSaved) {
        return false
      }

      if (
        filters.quickFilter === 'remote' &&
        !opp.location?.toLowerCase().includes('remote')
      ) {
        return false
      }

      return true
    })
  }, [opportunities, filters.search, filters.quickFilter])

  // Hitung jumlah untuk chip badge
  const counts = useMemo(() => {
    return {
      all: opportunities.length,
      internship: opportunities.filter(o => o.type === 'internship').length,
      full_time: opportunities.filter(o => o.type === 'full_time').length,
      part_time: opportunities.filter(o => o.type === 'part_time').length,
      freelance: opportunities.filter(o => o.type === 'freelance').length,
      competition: opportunities.filter(o => o.type === 'competition').length,
      highMatch: opportunities.filter(o => o.matchScore >= 70).length,
      saved: opportunities.filter(o => o.isSaved).length
    }
  }, [opportunities])

  // Handler toggle save bookmark secara optimistik
  const handleToggleSave = async (item: OpportunityItem) => {
    const oppId = item.id
    const prevSaved = item.isSaved
    const newSaved = !prevSaved

    // Optimistic UI update
    setOpportunities(prev =>
      prev.map(opp => (opp.id === oppId ? { ...opp, isSaved: newSaved } : opp))
    )

    if (selectedOpportunity && selectedOpportunity.id === oppId) {
      setSelectedOpportunity(prev => (prev ? { ...prev, isSaved: newSaved } : null))
    }

    setSavingIds(prev => new Set(prev).add(oppId))

    try {
      const res = await fetch(`/api/opportunities/${oppId}/save`, {
        method: 'POST'
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mengubah status bookmark')
      }

      showToast(
        newSaved
          ? `⭐ Disimpan! "${item.title}" ditambahkan ke daftar tersimpan.`
          : `Dihapus dari daftar lowongan tersimpan.`
      )
    } catch (err: any) {
      console.error('Bookmark error:', err)

      // Rollback jika request gagal
      setOpportunities(prev =>
        prev.map(opp => (opp.id === oppId ? { ...opp, isSaved: prevSaved } : opp))
      )

      if (selectedOpportunity && selectedOpportunity.id === oppId) {
        setSelectedOpportunity(prev => (prev ? { ...prev, isSaved: prevSaved } : null))
      }

      showToast('❌ Gagal menyimpan perubahan bookmark. Coba lagi.')
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev)

        next.delete(oppId)
        
return next
      })
    }
  }

  // Handler apply external
  const handleApply = (item: OpportunityItem) => {
    if (item.sourceUrl) {
      showToast(`Membuka situs resmi ${item.company}...`)
      window.open(item.sourceUrl, '_blank', 'noopener,noreferrer')
    } else {
      showToast(`Tautan pendaftaran belum tersedia untuk ${item.company}`)
    }
  }

  // Handler open modal detail
  const handleOpenDetail = (item: OpportunityItem) => {
    setSelectedOpportunity(item)
    setIsModalOpen(true)
  }

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      quickFilter: 'all',
      location: '',
      sort: 'match_desc'
    })
  }

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-16 font-["Poppins",sans-serif]'
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300'>
          <div className='flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs sm:text-sm font-medium'>
            <div className='w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0'>
              <CheckCircle2 className='w-3.5 h-3.5 stroke-[2.8]' />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header Section */}
      <OpportunitiesHeader
        userTargetRole={meta.userTargetRole}
        averageMatchScore={meta.averageMatchScore}
        userSkillsCount={meta.userSkillsCount}
        totalOpportunities={meta.total}
        onQuickFilterHighMatch={() =>
          setFilters(prev => ({
            ...prev,
            quickFilter: prev.quickFilter === 'high_match' ? 'all' : 'high_match'
          }))
        }
      />

      {/* 2. Filter & Controls Bar */}
      <OpportunitiesFilterBar
        filterState={filters}
        onSearchChange={val => setFilters(prev => ({ ...prev, search: val }))}
        onTypeChange={val => setFilters(prev => ({ ...prev, type: val }))}
        onQuickFilterChange={val => setFilters(prev => ({ ...prev, quickFilter: val }))}
        onLocationChange={val => setFilters(prev => ({ ...prev, location: val }))}
        onSortChange={val => setFilters(prev => ({ ...prev, sort: val }))}
        onResetFilters={handleResetFilters}
        counts={counts}
      />

      {/* 3. Error Banner if any */}
      {error && (
        <div className='p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs sm:text-sm text-rose-700 dark:text-rose-300'>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4 text-rose-600' />
            <span>{error}</span>
          </div>
          <button
            type='button'
            onClick={fetchOpportunities}
            className='underline font-semibold cursor-pointer'
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* 4. Opportunity Cards Grid or Skeleton */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className='p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse'
            >
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800' />
                <div className='space-y-1.5 flex-1'>
                  <div className='h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3' />
                  <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5' />
                </div>
              </div>
              <div className='h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full' />
              <div className='h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3' />
              <div className='h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full' />
            </div>
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <OpportunitiesEmptyState
          hasFilters={
            Boolean(filters.search) ||
            filters.type !== 'all' ||
            filters.quickFilter !== 'all' ||
            Boolean(filters.location)
          }
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              item={opp}
              onSelect={handleOpenDetail}
              onToggleSave={handleToggleSave}
              onApply={handleApply}
              isSaving={savingIds.has(opp.id)}
            />
          ))}
        </div>
      )}

      {/* 5. Detail Modal */}
      <OpportunityDetailModal
        item={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleSave={handleToggleSave}
        onApply={handleApply}
        isSaving={selectedOpportunity ? savingIds.has(selectedOpportunity.id) : false}
      />
    </div>
  )
}
