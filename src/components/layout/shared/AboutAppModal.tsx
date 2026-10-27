'use client'

import React, { useState, useEffect } from 'react'

import {
  X,
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Target,
  Layers,
  Briefcase,
  FileText
} from 'lucide-react'

interface AboutAppModalProps {
  isOpen: boolean
  onClose: () => void
}

type ActiveTab = 'about' | 'guide' | 'features'

export default function AboutAppModal({ isOpen, onClose }: AboutAppModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('about')

  // Keyboard escape listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-["Poppins",sans-serif]'
    >
      <div className='bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]'>
        {/* Header Modal */}
        <div className='px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/50'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs'>
              <Compass className='w-5 h-5' />
            </div>

            <div className='flex flex-col min-w-0'>
              <div className='flex items-center gap-2'>
                <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight'>
                  Tentang & Panduan Growvia
                </h3>
                <span className='px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60'>
                  v1.0
                </span>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
                AI Career Compass & Evidence-Based Digital Portfolio Platform
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0'
            aria-label='Tutup modal'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className='px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/70 bg-white dark:bg-slate-900'>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setActiveTab('about')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileText className='w-4 h-4' />
              <span>Tentang Aplikasi</span>
            </button>

            <button
              type='button'
              onClick={() => setActiveTab('guide')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className='w-4 h-4' />
              <span>Panduan Penggunaan</span>
            </button>

            <button
              type='button'
              onClick={() => setActiveTab('features')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'features'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className='w-4 h-4' />
              <span>Fitur Utama</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className='p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300'>
          {/* TAB 1: TENTANG APLIKASI */}
          {activeTab === 'about' && (
            <div className='space-y-6'>
              {/* Seksi Ringkasan Singkat */}
              <div className='p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 space-y-2.5'>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Apa itu Growvia?
                </h4>
                <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
                  Growvia adalah platform navigasi karier cerdas berbasis kecerdasan buatan (AI) yang membantu mahasiswa dan talenta teknologi memetakan keahlian nyata, mengukur kesenjangan kompetensi terhadap standar industri, serta membangun portofolio digital terverifikasi berbasis bukti autentik.
                </p>
              </div>

              {/* Seksi Masalah & Solusi */}
              <div className='space-y-3'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                  Tantangan yang Dijawab Growvia
                </h4>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                  <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-1.5'>
                    <div className='w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs'>
                      01
                    </div>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Klaim Skill Tanpa Bukti
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Resume konvensional kerap memuat daftar keahlian tanpa konteks. Growvia mewajibkan setiap keahlian terhubung dengan bukti pengalaman riil.
                    </p>
                  </div>

                  <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-1.5'>
                    <div className='w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs'>
                      02
                    </div>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Ketidaktahuan Skill Gap
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Banyak talenta tidak mengetahui keahlian spesifik apa yang kurang untuk melamar posisi impian. Growvia menghitung kesenjangan secara terukur.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Pilar Utama Platform */}
              <div className='space-y-3'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                  Tiga Pilar Utama Platform
                </h4>

                <div className='space-y-2.5'>
                  <div className='flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800'>
                    <div className='w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40'>
                      <ShieldCheck className='w-4 h-4' />
                    </div>
                    <div className='space-y-0.5'>
                      <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                        Evidence-Based Credibility
                      </h5>
                      <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                        Kredibilitas profil bertumpu pada bukti rekam jejak terverifikasi, bukan sekadar skor deklarasi mandiri.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800'>
                    <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40'>
                      <Target className='w-4 h-4' />
                    </div>
                    <div className='space-y-0.5'>
                      <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                        Algorithmic Skill Matching (Threshold 80%+)
                      </h5>
                      <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                        Kualifikasi peran industri dianggap tercapai secara matang bila kesiapan mencapai ambang batas minimal 80%.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800'>
                    <div className='w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/40'>
                      <Layers className='w-4 h-4' />
                    </div>
                    <div className='space-y-0.5'>
                      <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                        Continuous Learning & Career Gateway
                      </h5>
                      <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                        Menghubungkan kelemahan skill langsung dengan materi belajar eksternal dan lowongan karier yang cocok dengan profil pengguna.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN PENGGUNAAN LENGKAP */}
          {activeTab === 'guide' && (
            <div className='space-y-5'>
              <div className='flex items-center justify-between'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                  Alur 7 Langkah Penggunaan Growvia
                </h4>
                <span className='text-[11px] text-slate-400'>Dari Mahasiswa ke Siap Kerja</span>
              </div>

              <div className='space-y-3.5'>
                {/* Langkah 1 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    1
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Pilih Target Peran Karier
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Tentukan peran karier target Anda saat onboarding atau di menu profil (misalnya Frontend Web Engineer, AI & Machine Learning Engineer, atau Data Analyst). Target ini menjadi kompas seluruh analisis gap Anda.
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    2
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Catat Pengalaman & Ekstraksi AI
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Buka menu <strong>Pengalaman</strong> untuk menambahkan rekam jejak magang, proyek mandiri, kepanitiaan, atau kompetisi. Gunakan fitur AI Smart Extractor untuk membedah narasi pengalaman menjadi item keahlian terverifikasi.
                    </p>
                  </div>
                </div>

                {/* Langkah 3 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    3
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Eksplorasi Peta Keahlian (Skill Matrix)
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Buka menu <strong>Skill Matrix</strong> untuk melihat graf keterhubungan keahlian (Skill Map Graph), distribusi hard skill vs soft skill, serta relasi bukti autentik yang memperkuat tiap kompetensi.
                    </p>
                  </div>
                </div>

                {/* Langkah 4 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    4
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Analisis Kesiapan Karier & Gap Matrix
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Masuk ke menu <strong>Karier & Gap</strong> untuk melihat skor kesiapan karier Anda. Pelajari matriks detail keahlian: mana yang sudah memenuhi kualifikasi (≥80%) dan mana prioritas gap yang harus segera ditingkatkan.
                    </p>
                  </div>
                </div>

                {/* Langkah 5 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    5
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Tingkatkan Kompetensi Lewat Rekomendasi Belajar
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Gunakan menu <strong>Rekomendasi Belajar</strong> untuk mengakses modul terkurasi yang langsung menutup kekurangan keahlian Anda. Simpan modul favorit melalui tombol bookmark untuk dipelajari nanti.
                    </p>
                  </div>
                </div>

                {/* Langkah 6 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    6
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Jelajahi Lowongan & Magang (Peluang Karier)
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Pada menu <strong>Peluang Karier</strong>, temukan lowongan terkurasi. Gunakan filter <em>Sesuai Arah Karier</em> untuk melihat lowongan yang sejalan dengan peran target, simpan lowongan ke koleksi pribadi, dan lamar langsung.
                    </p>
                  </div>
                </div>

                {/* Langkah 7 */}
                <div className='flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70'>
                  <div className='w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0'>
                    7
                  </div>
                  <div className='space-y-1 flex-1'>
                    <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                      Terbitkan Portofolio Digital AI
                    </h5>
                    <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                      Di menu <strong>Portofolio AI</strong>, pilih tema visual (Royal Blue, Sleek Slate, Modern Emerald), atur seksi yang ingin ditampilkan, dan aktifkan status publik untuk mendapatkan tautan resmi <code>growvia.app/u/[slug]</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FITUR UTAMA & SPESIFIKASI */}
          {activeTab === 'features' && (
            <div className='space-y-4'>
              <h4 className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                Kapabilitas & Fitur Ekosistem Growvia
              </h4>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
                <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-1.5'>
                  <div className='w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center'>
                    <Sparkles className='w-4 h-4' />
                  </div>
                  <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                    AI Smart Skill Extractor
                  </h5>
                  <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                    Menganalisis deskripsi pengalaman kerja atau proyek secara semantik untuk menghasilkan daftar keahlian dan tingkat keyakinan (confidence score).
                  </p>
                </div>

                <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-1.5'>
                  <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center'>
                    <Layers className='w-4 h-4' />
                  </div>
                  <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                    Skill Map Graph Interaktif
                  </h5>
                  <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                    Graf visual dinamis yang memetakan relasi keahlian teknis dengan soft skill, kategori peran, dan bukti autentik.
                  </p>
                </div>

                <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-1.5'>
                  <div className='w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                    <Target className='w-4 h-4' />
                  </div>
                  <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                    Dynamic Career Gap Matrix
                  </h5>
                  <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                    Evaluasi kesiapan komprehensif yang membandingkan portofolio Anda dengan standar kurikulum dan industri terkini.
                  </p>
                </div>

                <div className='p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-1.5'>
                  <div className='w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center'>
                    <Briefcase className='w-4 h-4' />
                  </div>
                  <h5 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
                    Verified Public Portfolio Engine
                  </h5>
                  <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                    Situs web portofolio siap pakai tanpa perlu koding terpisah, dilengkapi bukti keahlian yang dapat dicek keasliannya oleh rekruter.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40'>
          <div className='flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500'>
            <span>Growvia Compass Platform</span>
            <span>·</span>
            <span>UINIC 8.0</span>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs'
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
