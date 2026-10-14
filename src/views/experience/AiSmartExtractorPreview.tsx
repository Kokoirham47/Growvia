'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  FileText,
  Sliders,
  Check,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react'

interface ExtractedSkill {
  id: string
  name: string
  metricBadge: string
  metricColor: 'green' | 'indigo' | 'blue' | 'purple'
  level: string
  confidence: number
}

interface ExampleCase {
  text: string
  metricLabel: string
  accuracy: string
  skills: ExtractedSkill[]
}

const EXAMPLES: ExampleCase[] = [
  {
    text: 'Memimpin tim 5 orang merancang ulang alur registrasi aplikasi mobile e-commerce hingga meningkatkan checkout rate 18% dalam 3 bulan.',
    metricLabel: 'Konteks Metrik Terdeteksi',
    accuracy: '98.4%',
    skills: [
      {
        id: '1',
        name: 'User Research & Usability',
        metricBadge: 'Bukti Metrik 18%',
        metricColor: 'green',
        level: 'Intermediate',
        confidence: 82
      },
      {
        id: '2',
        name: 'Cross-Functional Leadership',
        metricBadge: 'Tim 5 Orang',
        metricColor: 'indigo',
        level: 'Advanced',
        confidence: 88
      },
      {
        id: '3',
        name: 'Data-Driven UX Design',
        metricBadge: 'Analisis Konversi',
        metricColor: 'blue',
        level: 'Intermediate',
        confidence: 79
      }
    ]
  },
  {
    text: 'Mengembangkan arsitektur backend mikroservis Node.js dan PostgreSQL yang mampu menangani throughput 1.200 req/detik dengan test coverage 92%.',
    metricLabel: 'Konteks Teknis & Skala Terdeteksi',
    accuracy: '99.1%',
    skills: [
      {
        id: '4',
        name: 'Backend API Architecture',
        metricBadge: '1.200 req/detik',
        metricColor: 'green',
        level: 'Advanced',
        confidence: 91
      },
      {
        id: '5',
        name: 'Database Query Optimization',
        metricBadge: 'PostgreSQL Relational',
        metricColor: 'blue',
        level: 'Intermediate',
        confidence: 85
      },
      {
        id: '6',
        name: 'Test-Driven Development (TDD)',
        metricBadge: 'Coverage 92%',
        metricColor: 'indigo',
        level: 'Intermediate',
        confidence: 87
      }
    ]
  },
  {
    text: 'Mengkoordinasikan kepanitiaan nasional beranggotakan 40 staf dan mengelola anggaran sponsor senilai Rp75 juta untuk konferensi 1.500 mahasiswa.',
    metricLabel: 'Konteks Skala & Finansial Terdeteksi',
    accuracy: '97.8%',
    skills: [
      {
        id: '7',
        name: 'Project Budgeting & Finance',
        metricBadge: 'Rp75 Juta Sponsor',
        metricColor: 'green',
        level: 'Advanced',
        confidence: 90
      },
      {
        id: '8',
        name: 'Large Team Coordination',
        metricBadge: '40 Staf Internal',
        metricColor: 'indigo',
        level: 'Advanced',
        confidence: 89
      },
      {
        id: '9',
        name: 'Stakeholder & Event Scale',
        metricBadge: '1.500 Peserta',
        metricColor: 'purple',
        level: 'Intermediate',
        confidence: 84
      }
    ]
  }
]

interface AiSmartExtractorPreviewProps {
  onConfirmSkills?: (count: number) => void
}

export default function AiSmartExtractorPreview({
  onConfirmSkills
}: AiSmartExtractorPreviewProps) {
  const [exampleIndex, setExampleIndex] = useState(0)
  const currentExample = EXAMPLES[exampleIndex]

  const [inputText, setInputText] = useState(currentExample.text)
  const [skills, setSkills] = useState<ExtractedSkill[]>(currentExample.skills)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)

  // Cycle example
  const handleNextExample = () => {
    const nextIdx = (exampleIndex + 1) % EXAMPLES.length
    setExampleIndex(nextIdx)
    setInputText(EXAMPLES[nextIdx].text)
    setSkills(EXAMPLES[nextIdx].skills)
    setConfirmed(false)
  }

  // Simulate AI Re-analysis
  const handleReanalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setSkills(currentExample.skills)
      setConfirmed(false)
    }, 600)
  }

  // Remove skill item
  const handleRemoveSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  // Confirm skills
  const handleConfirm = () => {
    setConfirmed(true)
    if (onConfirmSkills) {
      onConfirmSkills(skills.length)
    }
  }

  return (
    <div className='relative rounded-3xl bg-gradient-to-br from-[#F0F5FF] via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0F172A] dark:via-[#131E36] dark:to-[#0F172A] border border-blue-200/70 dark:border-blue-900/50 p-5 sm:p-7 shadow-xs overflow-hidden transition-all'>
      {/* Decorative Glow */}
      <div className='absolute -right-16 -top-16 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none' />

      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-blue-100 dark:border-slate-800/80'>
        <div className='flex items-start gap-3.5'>
          <div className='w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs border border-blue-100 dark:border-slate-700 mt-0.5'>
            <Sparkles className='w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse' />
          </div>
          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <h2 className='text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                Growvia AI Smart Extractor
              </h2>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs'>
                Live Preview
              </span>
            </div>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed'>
              Tempel deskripsi tugas, sertifikat, atau ringkasan proyekmu. AI akan memecahnya secara otomatis menjadi skill terukur berbasis bukti empiris.
            </p>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className='flex items-center gap-2 shrink-0 self-start sm:self-center'>
          <button
            type='button'
            onClick={handleNextExample}
            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer'
          >
            <RotateCcw className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' />
            <span>Ganti Contoh Teks</span>
          </button>

          <button
            type='button'
            onClick={() => setShowDocModal(!showDocModal)}
            className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-2xs transition-all cursor-pointer'
          >
            <HelpCircle className='w-3.5 h-3.5 text-slate-400' />
            <span>Dokumentasi AI</span>
          </button>
        </div>
      </div>

      {/* Info Pipeline Modal/Drawer if opened */}
      {showDocModal && (
        <div className='mt-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-2 animate-in fade-in duration-200 shadow-xs'>
          <div className='flex items-center justify-between'>
            <span className='font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5'>
              <Cpu className='w-4 h-4' />
              <span>Arsitektur Ekstraksi AI 3-Tahap (PRD F04)</span>
            </span>
            <button
              type='button'
              onClick={() => setShowDocModal(false)}
              className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] leading-relaxed'>
            <div className='p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'>
              <strong className='text-slate-900 dark:text-white block'>1. Extract</strong>
              Mengidentifikasi skill, metrik angka, dan peran tanggung jawab dari kalimat input.
            </div>
            <div className='p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'>
              <strong className='text-slate-900 dark:text-white block'>2. Normalize</strong>
              Menstandarkan taksonomi (misal: &quot;usability test&quot; → &quot;Usability Testing&quot;).
            </div>
            <div className='p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'>
              <strong className='text-slate-900 dark:text-white block'>3. Classify & Score</strong>
              Mengelompokkan Hard/Soft/Leadership serta menghitung confidence score.
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid (Left: Narasi, Right: Hasil Ekstraksi) */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6'>
        {/* LEFT COLUMN: Input Narasi Aktivitas */}
        <div className='lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 p-5 shadow-xs'>
          <div>
            <div className='flex items-center justify-between pb-3'>
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider'>
                <FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                <span>Input Narasi Aktivitas</span>
              </span>
              <span className='text-xs font-semibold text-slate-400 dark:text-slate-500'>
                {inputText.trim().length} Karakter
              </span>
            </div>

            {/* Editable narrative text */}
            <div className='mt-1 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'>
              <textarea
                rows={5}
                value={inputText}
                onChange={e => {
                  setInputText(e.target.value)
                  setConfirmed(false)
                }}
                className='w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 leading-relaxed outline-none resize-none placeholder:text-slate-400 custom-scrollbar font-medium'
                placeholder='Tulis atau tempel deskripsi pengalaman...'
              />
            </div>
          </div>

          {/* Left Footer: Metric detected status & Re-analyze button */}
          <div className='flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4'>
            <div className='inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='w-4 h-4 text-emerald-500 shrink-0' />
              <span className='truncate'>{currentExample.metricLabel}</span>
            </div>

            <button
              type='button'
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer shrink-0'
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Mengekstrak...' : 'Analisis Ulang'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Hasil Ekstraksi Bukti Kompetensi */}
        <div className='lg:col-span-7 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 p-5 shadow-xs'>
          <div>
            <div className='flex items-center justify-between pb-3'>
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider'>
                <Sparkles className='w-4 h-4 text-purple-500' />
                <span>Hasil Ekstraksi Bukti Kompetensi ({skills.length} Ditemukan)</span>
              </span>
              <span className='text-xs font-semibold text-slate-400 dark:text-slate-500'>
                Akurasi Model {currentExample.accuracy}
              </span>
            </div>

            {/* Skills List */}
            {isAnalyzing ? (
              <div className='space-y-3 py-6'>
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className='p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse space-y-2'
                  >
                    <div className='w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded' />
                    <div className='w-1/2 h-3 bg-slate-100 dark:bg-slate-850 rounded' />
                  </div>
                ))}
              </div>
            ) : skills.length === 0 ? (
              <div className='p-6 text-center text-xs text-slate-400 dark:text-slate-500 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 mt-2'>
                Tidak ada skill yang terdeteksi atau semua rekomendasi dihapus. Klik &quot;Analisis Ulang&quot; untuk memuat kembali.
              </div>
            ) : (
              <div className='space-y-2.5 mt-1'>
                {skills.map(skill => {
                  const isGreen = skill.metricColor === 'green'
                  const isIndigo = skill.metricColor === 'indigo'

                  const badgeClass = isGreen
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60'
                    : isIndigo
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/60'
                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'

                  const barColor = isGreen
                    ? 'bg-emerald-500'
                    : 'bg-blue-600'

                  return (
                    <div
                      key={skill.id}
                      className='p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3'
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <h4 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate'>
                            {skill.name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}
                          >
                            • {skill.metricBadge}
                          </span>
                        </div>

                        <p className='text-[11px] text-slate-500 dark:text-slate-400 mt-0.5'>
                          Tingkat: <span className='font-semibold text-slate-700 dark:text-slate-300'>{skill.level}</span> · Skor Kepercayaan: <span className='font-semibold text-slate-700 dark:text-slate-300'>{skill.confidence}%</span>
                        </p>
                      </div>

                      {/* Right: Confidence Bar & Dismiss Button */}
                      <div className='flex items-center gap-3 shrink-0'>
                        <div className='w-16 sm:w-20 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden'>
                          <div
                            className={`${barColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${skill.confidence}%` }}
                          />
                        </div>

                        <button
                          type='button'
                          onClick={() => handleRemoveSkill(skill.id)}
                          title='Hapus rekomendasi skill ini'
                          className='p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Footer: Controls & Confirm CTA */}
          <div className='pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 space-y-3'>
            <div className='flex items-center justify-between text-xs'>
              <button
                type='button'
                onClick={() => alert('Level skill dapat dikustomisasi setelah dimasukkan ke Skill Matrix (F04).')}
                className='font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
              >
                Sesuaikan Level
              </button>
              <button
                type='button'
                onClick={() => setSkills([])}
                className='font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer'
              >
                Hapus Rekomendasi
              </button>
            </div>

            <button
              type='button'
              onClick={handleConfirm}
              disabled={skills.length === 0}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmed
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-blue-900/20'
              }`}
            >
              {confirmed ? (
                <>
                  <Check className='w-4 h-4' />
                  <span>{skills.length} Skill Berhasil Dimasukkan ke Matrix!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-4 h-4' />
                  <span>Konfirmasi & Masukkan ke Skill Matrix</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
