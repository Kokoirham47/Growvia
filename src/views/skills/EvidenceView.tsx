'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  Filter,
  FileText
} from 'lucide-react'
import { EvidenceDetail } from '@/types/skills'

interface EvidenceViewProps {
  evidences: EvidenceDetail[]
  onOpenAddSkill: () => void
}

export default function EvidenceView({ evidences, onOpenAddSkill }: EvidenceViewProps) {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const filtered = evidences.filter(ev => {
    const matchesSearch =
      ev.skillName.toLowerCase().includes(search.toLowerCase()) ||
      ev.experienceTitle.toLowerCase().includes(search.toLowerCase()) ||
      ev.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      ev.impactNote.toLowerCase().includes(search.toLowerCase())

    const matchesType = selectedType === 'all' || ev.type.toLowerCase() === selectedType.toLowerCase()

    return matchesSearch && matchesType
  })

  return (
    <div className='flex flex-col gap-5 w-full'>
      {/* Top Filter and Info Bar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs'>
        <div className='flex items-center gap-2.5 flex-1 max-w-md'>
          <div className='relative w-full'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Cari bukti berdasarkan skill, institusi, atau peran...'
              className='w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className='flex items-center gap-1.5 overflow-x-auto text-xs'>
          {['all', 'Organisasi', 'Magang', 'Kepanitiaan', 'Proyek', 'Freelance'].map(type => (
            <button
              key={type}
              type='button'
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'Semua Tipe' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {filtered.map(item => (
          <div
            key={item.id}
            className='p-5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/60 transition-all flex flex-col justify-between gap-4'
          >
            <div>
              {/* Header: Skill Tag & Type Pill */}
              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#1E3A8A] dark:text-blue-300 font-bold text-xs border border-blue-200/80 dark:border-blue-900/60'>
                    {item.skillName}
                  </span>
                  <span className='px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'>
                    {item.type}
                  </span>
                </div>

                {item.aiExtracted && (
                  <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FF] text-[#6366F1] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF] dark:border-indigo-900/60 shrink-0'>
                    <span>Tervalidasi AI</span>
                    <Sparkles className='w-2.5 h-2.5' />
                  </span>
                )}
              </div>

              {/* Experience Details */}
              <h4 className='text-sm font-bold text-slate-900 dark:text-white mt-3'>
                {item.experienceTitle}
              </h4>
              <p className='text-xs font-semibold text-[#2563EB] dark:text-blue-400 mt-0.5'>
                {item.experienceRole}
              </p>

              <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5'>
                <span className='flex items-center gap-1'>
                  <Building2 className='w-3.5 h-3.5 text-slate-400' />
                  <span>{item.institutionName}</span>
                </span>
                <span>•</span>
                <span className='flex items-center gap-1'>
                  <Calendar className='w-3.5 h-3.5 text-slate-400' />
                  <span>{item.period}</span>
                </span>
              </div>

              {/* Impact Note / Description */}
              <div className='mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal'>
                <p>"{item.impactNote}"</p>
              </div>
            </div>

            {/* Bottom Proof Link */}
            <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs'>
              <div className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium'>
                <CheckCircle2 className='w-3.5 h-3.5' />
                <span>Bukti Terverifikasi</span>
              </div>

              {item.proofUrl && (
                <a
                  href={item.proofUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 text-[#2563EB] hover:underline font-semibold'
                >
                  <span>Lihat Dokumen</span>
                  <ExternalLink className='w-3 h-3' />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
