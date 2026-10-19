'use client'

import React from 'react'
import { X, ShieldCheck, AlertCircle, Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react'
import { SkillChipItem } from '@/types/career'

interface SkillDetailModalProps {
  skill: SkillChipItem | null
  onClose: () => void
  onOpenLearningForSkill: (skillName: string) => void
}

export default function SkillDetailModal({
  skill,
  onClose,
  onOpenLearningForSkill
}: SkillDetailModalProps) {
  if (!skill) return null

  const getStatusBadge = () => {
    switch (skill.status) {
      case 'strong':
        return (
          <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#16A34A]' />
            Skill Kuat
          </span>
        )
      case 'develop':
        return (
          <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#F59E0B]' />
            Perlu Ditingkatkan
          </span>
        )
      case 'missing':
        return (
          <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 inline-flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#DC2626]' />
            Belum Dimiliki (Gap)
          </span>
        )
    }
  }

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
              <Layers className='w-5 h-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                  {skill.name}
                </h3>
                {getStatusBadge()}
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Kategori: {skill.category || 'Hard Skill'}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body */}
        <div className='p-6 flex flex-col gap-4'>
          {/* Match Score bar */}
          <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-2'>
            <div className='flex items-center justify-between text-xs font-semibold'>
              <span className='text-slate-700 dark:text-slate-300'>Kesiapan Kompetensi</span>
              <span className='text-blue-600 dark:text-blue-400'>{skill.score}% Standar Industri</span>
            </div>
            <div className='w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden'>
              <div
                className={`h-full rounded-full ${
                  skill.score >= 80 ? 'bg-[#16A34A]' : skill.score >= 40 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
                }`}
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1'>
              Deskripsi & Ekspektasi Industri
            </h4>
            <p className='text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
              {skill.description || 'Keahlian teknis penting yang dievaluasi dalam rekrutmen AI Engineer.'}
            </p>
          </div>

          {/* Evidence verification */}
          <div>
            <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1'>
              Status Verifikasi Portofolio
            </h4>
            <div className='flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300'>
              <ShieldCheck className='w-4 h-4 text-blue-600' />
              <span>{skill.evidenceSource || 'Belum ada bukti yang terhubung'}</span>
            </div>
          </div>

          {/* ATS Keywords */}
          {skill.atsKeywords && skill.atsKeywords.length > 0 && (
            <div>
              <h4 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5'>
                Kata Kunci Penting ATS Scanner
              </h4>
              <div className='flex flex-wrap gap-1.5'>
                {skill.atsKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className='px-2.5 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono'
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
          >
            Tutup
          </button>
          <button
            type='button'
            onClick={() => {
              onClose()
              onOpenLearningForSkill(skill.name)
            }}
            className='inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all shadow-md shadow-indigo-600/25 cursor-pointer'
          >
            <BookOpen className='w-4 h-4' />
            <span>Lihat Modul Belajar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
