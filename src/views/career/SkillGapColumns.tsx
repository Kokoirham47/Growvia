'use client'

import React from 'react'
import { Check, ArrowUp, Plus, ShieldCheck, AlertCircle, Sparkles, ChevronRight } from 'lucide-react'
import { CareerTargetProfile, SkillChipItem } from '@/types/career'

interface SkillGapColumnsProps {
  career: CareerTargetProfile
  onSelectSkill: (skill: SkillChipItem) => void
}

export default function SkillGapColumns({ career, onSelectSkill }: SkillGapColumnsProps) {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>

        {/* 1. Strong Skills Card */}
        <div
          style={{ borderTop: '4px solid #16A34A' }}
          className='bg-white dark:bg-slate-900 rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md flex flex-col justify-between'
        >
          <div>
            {/* Header: ✓ "Skill Kuat" (green) */}
            <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-green-50 dark:bg-green-950/60 flex items-center justify-center text-[#16A34A]'>
                  <Check className='w-3.5 h-3.5 stroke-[2.8]' />
                </div>
                <h3 className='text-base font-bold text-[#16A34A] tracking-tight'>
                  Skill Kuat
                </h3>
              </div>
              <span className='px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 dark:bg-green-950/50 text-[#16A34A] border border-green-200/60 dark:border-green-900/40'>
                {career.strongSkills.length} Skill
              </span>
            </div>

            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2.5 mb-4 leading-relaxed'>
              Kompetensi yang sudah terverifikasi memenuhi atau melebihi ekspektasi standar industri tech.
            </p>

            {/* Chips: Python · Problem Solving · Communication · Git */}
            <div className='flex flex-wrap gap-2'>
              {career.strongSkills.map(skill => (
                <button
                  key={skill.id}
                  type='button'
                  onClick={() => onSelectSkill(skill)}
                  className='group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-300 transition-all cursor-pointer'
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-[#16A34A]' />
                  <span>{skill.name}</span>
                  <span className='text-[10px] text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity font-semibold'>
                    {skill.score}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500'>
            <span className='flex items-center gap-1'>
              <ShieldCheck className='w-3.5 h-3.5 text-emerald-600' />
              Terverifikasi Portofolio
            </span>
            <span className='text-emerald-600 dark:text-emerald-400 font-medium'>
              Siap Wawancara
            </span>
          </div>
        </div>

        {/* 2. Skills to Develop Card */}
        <div
          style={{ borderTop: '4px solid #F59E0B' }}
          className='bg-white dark:bg-slate-900 rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md flex flex-col justify-between'
        >
          <div>
            {/* Header: ↑ "Perlu Ditingkatkan" (amber) */}
            <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-[#F59E0B]'>
                  <ArrowUp className='w-3.5 h-3.5 stroke-[2.8]' />
                </div>
                <h3 className='text-base font-bold text-[#F59E0B] tracking-tight'>
                  Perlu Ditingkatkan
                </h3>
              </div>
              <span className='px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-[#F59E0B] border border-amber-200/60 dark:border-amber-900/40'>
                {career.developSkills.length} Skill
              </span>
            </div>

            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2.5 mb-4 leading-relaxed'>
              Sudah memiliki dasar teori/praktik, namun membutuhkan bukti proyek konkret atau latihan terapan.
            </p>

            {/* Chips: Machine Learning · Data Processing · SQL */}
            <div className='flex flex-wrap gap-2'>
              {career.developSkills.map(skill => (
                <button
                  key={skill.id}
                  type='button'
                  onClick={() => onSelectSkill(skill)}
                  className='group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-300 transition-all cursor-pointer'
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-[#F59E0B]' />
                  <span>{skill.name}</span>
                  <span className='text-[10px] text-amber-600 dark:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity font-semibold'>
                    {skill.score}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500'>
            <span className='flex items-center gap-1'>
              <Sparkles className='w-3.5 h-3.5 text-amber-600' />
              Asah 1–2 Proyek Terapan
            </span>
            <span className='text-amber-600 dark:text-amber-400 font-medium'>
              Progres Cepat
            </span>
          </div>
        </div>

        {/* 3. Missing Skills Card */}
        <div
          style={{ borderTop: '4px solid #DC2626' }}
          className='bg-white dark:bg-slate-900 rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md flex flex-col justify-between'
        >
          <div>
            {/* Header: + "Belum Dimiliki" (red) */}
            <div className='flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-[#DC2626]'>
                  <Plus className='w-3.5 h-3.5 stroke-[2.8]' />
                </div>
                <h3 className='text-base font-bold text-[#DC2626] tracking-tight'>
                  Belum Dimiliki
                </h3>
              </div>
              <span className='px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-[#DC2626] border border-rose-200/60 dark:border-rose-900/40'>
                {career.missingSkills.length} Skill
              </span>
            </div>

            <p className='text-xs text-slate-500 dark:text-slate-400 mt-2.5 mb-4 leading-relaxed'>
              Belum terdeteksi di CV atau portofolio. Sangat krusial dipelajari agar lolos seleksi ATS.
            </p>

            {/* Chips: Model Deployment · Cloud Computing · MLOps */}
            <div className='flex flex-wrap gap-2'>
              {career.missingSkills.map(skill => (
                <button
                  key={skill.id}
                  type='button'
                  onClick={() => onSelectSkill(skill)}
                  className='group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-300 transition-all cursor-pointer'
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-[#DC2626]' />
                  <span>{skill.name}</span>
                  <span className='text-[10px] text-rose-600 dark:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity font-semibold'>
                    Gap
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500'>
            <span className='flex items-center gap-1'>
              <AlertCircle className='w-3.5 h-3.5 text-rose-600' />
              Kriteria Wajib ATS
            </span>
            <span className='text-rose-600 dark:text-rose-400 font-medium'>
              Prioritas Tinggi
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
