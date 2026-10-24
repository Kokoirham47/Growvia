'use client'

import React from 'react'

import Image from 'next/image'

import {
  Compass,
  CheckCircle2,
  Clock,
  BarChart2,
  Star,
  Lightbulb,
  Play,
  Briefcase,
  ArrowRight,
  Bookmark
} from 'lucide-react'

import type { LearningCardItem } from '@/types/learning'

interface FeaturedRecommendationCardProps {
  item: LearningCardItem
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
  onOpenSyllabus: (item: LearningCardItem) => void
  onStartLearning: (item: LearningCardItem) => void
}

export default function FeaturedRecommendationCard({
  item,
  isBookmarked,
  onToggleBookmark,
  onOpenSyllabus,
  onStartLearning
}: FeaturedRecommendationCardProps) {
  return (
    <div className='relative w-full rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/40 border border-indigo-100/90 dark:border-indigo-900/60 p-5 sm:p-7 shadow-xs overflow-hidden'>
      {/* Top Banner Row */}
      <div className='flex items-center justify-between pb-4 sm:pb-5 border-b border-indigo-100/80 dark:border-indigo-900/40'>
        {/* Left: "Paling Direkomendasikan untuk Kamu" */}
        <div className='inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm'>
          <Compass className='w-4 h-4 text-indigo-600 dark:text-indigo-400' />
          <span>Paling Direkomendasikan untuk Kamu</span>
        </div>

        {/* Right: "Missing Skill Gap Priority" badge */}
        <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/50'>
          <span className='w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
          <span>Missing Skill Gap Priority</span>
        </div>
      </div>

      {/* Main Content: 2 Columns on Desktop */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5'>
        {/* Left Section: Tags, Title, Meta, Reason */}
        <div className='lg:col-span-7 flex flex-col gap-3.5'>
          {/* Tags */}
          <div className='flex flex-wrap items-center gap-2'>
            {/* Skill Tag */}
            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300'>
              {item.skillTag}
            </span>

            {/* Platform Tag */}
            <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'>
              <CheckCircle2 className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
              <span>{item.platform}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className='text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight'>
            {item.title}
          </h2>

          {/* Metadata Row */}
          <div className='flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300'>
            <div className='inline-flex items-center gap-1.5'>
              <Clock className='w-4 h-4 text-slate-400' />
              <span>{item.duration}</span>
            </div>

            <div className='inline-flex items-center gap-1.5'>
              <BarChart2 className='w-4 h-4 text-slate-400' />
              <span>{item.difficulty}</span>
            </div>

            <div className='inline-flex items-center gap-1.5'>
              <Star className='w-4 h-4 text-amber-500 fill-amber-500' />
              <span className='font-bold text-slate-900 dark:text-white'>{item.rating}</span>
              {item.reviewsCount && (
                <span className='text-slate-500 dark:text-slate-400 text-xs'>({item.reviewsCount})</span>
              )}
            </div>
          </div>

          {/* Reason Box (Alasan AI) */}
          <div className='mt-1 flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs'>
            <div className='w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5'>
              <Lightbulb className='w-4 h-4' />
            </div>
            <p className='text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed'>
              <strong className='font-semibold text-slate-900 dark:text-white'>Alasan AI: </strong>
              Sangat relevan untuk menutup gap keahlian{' '}
              <strong className='font-semibold text-indigo-700 dark:text-indigo-400'>
                Machine Learning Fundamentals
              </strong>{' '}
              yang saat ini diwajibkan oleh <strong className='font-semibold text-slate-900 dark:text-white'>92% lowongan AI Engineer entry-level</strong>.
            </p>
          </div>
        </div>

        {/* Right Section: Media Preview Card + Action Buttons */}
        <div className='lg:col-span-5 flex flex-col gap-3'>
          {/* Thumbnail Box */}
          <div className='relative w-full h-44 sm:h-48 rounded-xl overflow-hidden shadow-md group border border-slate-200/50 dark:border-slate-700'>
            <Image
              src='/images/learning/ml_course_preview.jpg'
              alt={item.title}
              fill
              className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
              sizes='(max-width: 768px) 100vw, 400px'
              priority
            />
            {/* Dark gradient overlay for contrast */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent' />

            {/* Overlay Badges */}
            <div className='absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10'>
              {/* Pratinjau Silabus & Lab */}
              <button
                type='button'
                onClick={() => onOpenSyllabus(item)}
                className='inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-medium backdrop-blur-xs transition-colors cursor-pointer border border-white/10'
              >
                <Play className='w-3 h-3 fill-current text-blue-400' />
                <span>Pratinjau Silabus & Lab</span>
              </button>

              {/* 3 Proyek Portfolio */}
              <div className='inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/85 text-white text-[11px] font-medium backdrop-blur-xs border border-white/10'>
                <Briefcase className='w-3 h-3 text-amber-400' />
                <span>{item.portfolioProjectsCount || 3} Proyek Portfolio</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Mulai Belajar Sekarang (Blue) + Simpan */}
          <div className='flex items-center gap-2.5'>
            <button
              type='button'
              onClick={() => onStartLearning(item)}
              className='flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/35 cursor-pointer'
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className='w-4 h-4' />
            </button>

            <button
              type='button'
              onClick={() => onToggleBookmark(item.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors border cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`}
              />
              <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
