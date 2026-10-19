'use client'

import React, { useState, useMemo } from 'react'

import { CheckCircle2, RotateCcw, Search } from 'lucide-react'

import LearningHeader from './LearningHeader'
import FeaturedRecommendationCard from './FeaturedRecommendationCard'
import LearningFilterBar from './LearningFilterBar'
import LearningCard from './LearningCard'
import ImpactSimulationBanner from './ImpactSimulationBanner'
import CourseDetailModal from './CourseDetailModal'
import { FEATURED_LEARNING_RESOURCE, LEARNING_RESOURCES } from './learningData'
import type {
  LearningCategory,
  DifficultyLevel,
  SortOption,
  LearningCardItem
} from '@/types/learning'

export default function LearningRecommendationsView() {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory>('semua')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all')
  const [selectedSort, setSelectedSort] = useState<SortOption>('match')

  // Bookmark State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])

  // Modal State
  const [activeModalItem, setActiveModalItem] = useState<LearningCardItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle Bookmark Toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter(item => item !== id) : [...prev, id]

      showToast(
        exists
          ? 'Modul dihapus dari daftar tersimpan.'
          : 'Modul berhasil disimpan ke daftar belajar!'
      )
      
return next
    })
  }

  // Handle Open Syllabus / Course Detail
  const handleOpenSyllabus = (item: LearningCardItem) => {
    setActiveModalItem(item)
    setIsModalOpen(true)
  }

  // Handle Start Learning
  const handleStartLearning = (item: LearningCardItem) => {
    setActiveModalItem(item)
    setIsModalOpen(true)
  }

  // Handle Enroll / Launch
  const handleEnroll = (item: LearningCardItem) => {
    showToast(`Membuka ${item.title} di platform ${item.platform}...`)
  }

  // Calculate category counts
  const counts = useMemo(() => {
    return {
      semua: LEARNING_RESOURCES.length,
      course: LEARNING_RESOURCES.filter(r => r.category === 'course').length,
      artikel: LEARNING_RESOURCES.filter(r => r.category === 'artikel').length,
      video: LEARNING_RESOURCES.filter(r => r.category === 'video').length,
      bootcamp: LEARNING_RESOURCES.filter(r => r.category === 'bootcamp').length
    }
  }, [])

  // Filter & Sort Logic
  const filteredAndSortedResources = useMemo(() => {
    const result = LEARNING_RESOURCES.filter(item => {
      // Category Filter
      const matchCat = selectedCategory === 'semua' || item.category === selectedCategory

      // Difficulty Filter
      const matchDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty

      return matchCat && matchDiff
    })

    // Sort Logic
    result.sort((a, b) => {
      if (selectedSort === 'match') {
        return b.matchPercent - a.matchPercent
      }

      if (selectedSort === 'rating') {
        return b.rating - a.rating
      }

      if (selectedSort === 'duration') {
        // extract hours/minutes number roughly
        const numA = parseFloat(a.duration) || 99
        const numB = parseFloat(b.duration) || 99

        return numA - numB
      }

      return 0
    })

    return result
  }, [selectedCategory, selectedDifficulty, selectedSort])

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-16 font-["Poppins",sans-serif]'
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300'>
          <div className='flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs sm:text-sm font-medium'>
            <div className='w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0'>
              <CheckCircle2 className='w-3.5 h-3.5 stroke-[2.8]' />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <LearningHeader
        careerTarget='AI Engineer'
        selectedModulesCount={4}
        priorityGapsCount={3}
      />

      {/* 2. PINNED TOP SECTION: AI Recommendation Highlight Card */}
      <FeaturedRecommendationCard
        item={FEATURED_LEARNING_RESOURCE}
        isBookmarked={bookmarkedIds.includes(FEATURED_LEARNING_RESOURCE.id)}
        onToggleBookmark={handleToggleBookmark}
        onOpenSyllabus={handleOpenSyllabus}
        onStartLearning={handleStartLearning}
      />

      {/* 3. FILTER BAR */}
      <LearningFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        counts={counts}
      />

      {/* 4. RESOURCE LIST (2 COLUMNS ON DESKTOP) */}
      {filteredAndSortedResources.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6'>
          {filteredAndSortedResources.map(resource => (
            <LearningCard
              key={resource.id}
              item={resource}
              isBookmarked={bookmarkedIds.includes(resource.id)}
              onToggleBookmark={handleToggleBookmark}
              onStartLearning={handleStartLearning}
            />
          ))}
        </div>
      ) : (

        /* Empty State */
        <div className='flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center gap-3'>
          <div className='w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400'>
            <Search className='w-6 h-6' />
          </div>
          <h4 className='text-base font-bold text-slate-900 dark:text-white'>
            Tidak ada materi yang sesuai
          </h4>
          <p className='text-xs text-slate-500 dark:text-slate-400 max-w-sm'>
            Coba ubah kata kunci pencarian atau sesuaikan pilihan filter kategori dan tingkat kesulitan.
          </p>
          <button
            type='button'
            onClick={() => {
              setSelectedCategory('semua')
              setSelectedDifficulty('all')
            }}
            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 transition-colors cursor-pointer mt-1'
          >
            <RotateCcw className='w-3.5 h-3.5' />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* 5. BOTTOM SECTION: SIMULASI DAMPAK BELAJAR & SYNC NOTICE */}
      <ImpactSimulationBanner
        currentScore={68}
        potentialScore={89}
        improvement={21}
        targetScore={80}
      />

      {/* Course Detail / Syllabus Modal */}
      <CourseDetailModal
        item={activeModalItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEnroll={handleEnroll}
      />
    </div>
  )
}
