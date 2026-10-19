'use client'

import React, { useState } from 'react'
import { X, Briefcase, Check, Building2, TrendingUp, Sparkles, ChevronRight } from 'lucide-react'
import { CAREER_TARGETS } from './careerData'
import { CareerTargetProfile } from '@/types/career'

interface ChangeTargetModalProps {
  isOpen: boolean
  currentCareerId: string
  onClose: () => void
  onSelectCareer: (career: CareerTargetProfile) => void
}

export default function ChangeTargetModal({
  isOpen,
  currentCareerId,
  onClose,
  onSelectCareer
}: ChangeTargetModalProps) {
  const [selectedId, setSelectedId] = useState(currentCareerId)

  if (!isOpen) return null

  const careersList = Object.values(CAREER_TARGETS)

  const handleApply = () => {
    const selected = CAREER_TARGETS[selectedId]
    if (selected) {
      onSelectCareer(selected)
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]'>
        {/* Modal Header */}
        <div className='p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
              <Briefcase className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                Pilih Target Karier Impian
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Sesuaikan analisis skill gap dengan posisi target yang ingin kamu tuju
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-5 overflow-y-auto flex flex-col gap-3 custom-scrollbar'>
          {careersList.map(item => {
            const isSelected = item.id === selectedId
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className='w-3 h-3 stroke-[3]' />}
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-sm text-slate-900 dark:text-white'>
                        {item.title}
                      </span>
                      <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'>
                        {item.companyType}
                      </span>
                    </div>
                    <span className='text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1'>
                      {item.summary}
                    </span>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium'>
                      {item.verifiedJobsCount}+ lowongan terverifikasi • {item.salaryRange}
                    </span>
                  </div>
                </div>

                <div className='flex flex-col items-end shrink-0'>
                  <span className='text-base font-bold text-slate-900 dark:text-white'>
                    {item.readinessScore}%
                  </span>
                  <span
                    style={{ color: item.readinessBadgeColor }}
                    className='text-[10px] font-semibold uppercase tracking-wider'
                  >
                    {item.readinessStatus}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal Footer */}
        <div className='p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            Batal
          </button>
          <button
            type='button'
            onClick={handleApply}
            className='px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm transition-all cursor-pointer'
          >
            Terapkan Target
          </button>
        </div>
      </div>
    </div>
  )
}
