'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import {
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Target,
  Layers,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Cpu,
  ChevronRight,
  Lightbulb,
  Globe
} from 'lucide-react'

type TabType = 'overview' | 'guide' | 'features' | 'methodology'

export default function AboutView() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  return (
    <div className='flex flex-col gap-8 max-w-5xl mx-auto pb-16 w-full font-["Poppins",sans-serif] animate-in fade-in duration-200'>
      {/* Page Header */}
      <div className='flex flex-col gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-6'>
        <div className='flex flex-wrap items-center gap-2.5'>
          <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs'>
            <Compass className='w-5 h-5' />
          </div>
          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60'>
            Growvia Platform Guide · v1.0
          </span>
          <span className='px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'>
            UINIC 8.0 Web Dev
          </span>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1'>
          <div className='space-y-1.5'>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
              Tentang Aplikasi & Panduan Growvia
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed'>
              Pelajari visi, filosofi verifikasi berbasis bukti, arsitektur kecerdasan buatan, dan panduan lengkap pemanfaatan fitur Growvia untuk akselerasi karier teknologi Anda.
            </p>
          </div>

          <Link
            href='/profile'
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs self-start sm:self-auto shrink-0'
          >
            <span>Mulai Atur Profil</span>
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className='flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-850/80 border border-slate-200/70 dark:border-slate-800 overflow-x-auto'>
        <button
          type='button'
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className='w-4 h-4' />
          <span>Tentang Growvia</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className='w-4 h-4' />
          <span>Panduan Penggunaan</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'features'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className='w-4 h-4' />
          <span>Fitur Utama</span>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('methodology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'methodology'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Workflow className='w-4 h-4' />
          <span>Metodologi & Glosarium</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: OVERVIEW & TENTANG GROWVIA */}
      {activeTab === 'overview' && (
        <div className='flex flex-col gap-8'>
          {/* Hero Callout */}
          <div className='p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-100 dark:border-slate-800 shadow-2xs space-y-4'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-2xs'>
              <Sparkles className='w-3.5 h-3.5' />
              <span>Visi Platform</span>
            </div>
            <h2 className='text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight'>
              Menjembatani Kesenjangan Antara Kampus dan Kebutuhan Industri Teknologi
            </h2>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl'>
              Growvia adalah ekosistem navigasi karier cerdas berbasis kecerdasan buatan (AI) yang dirancang khusus untuk mahasiswa, fresh graduate, dan talenta teknologi. Growvia mengubah paradigma resume tradisional dari sekadar daftar klaim keahlian sepihak menjadi portofolio berbasis bukti autentik yang terukur terhadap standar kompetensi industri.
            </p>
          </div>

          {/* Perbandingan: Masalah Riil vs Solusi Growvia */}
          <div className='space-y-4'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
                Paradigma Baru Penilaian Kualifikasi
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Bagaimana Growvia mengatasi kerapuhan metode penilaian resume konvensional.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Kolom 1: Cara Konvensional */}
              <div className='p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3'>
                <div className='flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider'>
                  <span className='w-2 h-2 rounded-full bg-rose-500' />
                  <span>Kelemahan Cara Konvensional</span>
                </div>

                <ul className='space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong>Klaim sepihak tanpa bukti:</strong> Pelamar menulis daftar puluhan skill teknis di CV tanpa verifikasi artefak kode atau riwayat proyek riil.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong>Buta kesenjangan (Skill Gap):</strong> Talenta tidak mengetahui secara terukur berapa persen keahlian yang kurang untuk memenuhi kualifikasi peran yang dituju.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong>Belajar tanpa panduan target:</strong> Mahasiswa mengambil kursus secara acak tanpa sinkronisasi dengan kekurangan prioritas mereka.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Kolom 2: Pendekatan Growvia */}
              <div className='p-5 sm:p-6 rounded-3xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 space-y-3'>
                <div className='flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider'>
                  <span className='w-2 h-2 rounded-full bg-blue-500' />
                  <span>Pendekatan Cerdas Growvia</span>
                </div>

                <ul className='space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed'>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong>Evidence-Based Credibility:</strong> Setiap keahlian wajib terhubung dengan artefak autentik (tautan repository, live URL, sertifikat).
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong>Algoritma Gap Presisi (Threshold 80%+):</strong> Kesiapan dihitung secara matematis. Rekruter dan talenta dapat melihat status gap secara transparan.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong>Ekosistem Tertutup (Closed-Loop Learning):</strong> Setiap kekurangan skill langsung diarahkan ke modul belajar pilihan dan lowongan yang cocok.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Pilar Inti Platform */}
          <div className='space-y-4'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
                Empat Pilar Arsitektur Growvia
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Landasan teknologi dan metodologi di balik sistem evaluasi Growvia.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40'>
                  <ShieldCheck className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  1. Evidence-Based Credibility
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Kredibilitas kompetensi tidak dinilai dari klaim subjektif. Growvia mewajibkan pengikatan artefak bukti konkret seperti repositori GitHub, dokumen sertifikasi, atau produk digital yang berjalan.
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40'>
                  <Cpu className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  2. AI Semantic Skill Extraction
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Model kecerdasan buatan membaca narasi rekam jejak pengalaman Anda, mengekstraksi keahlian teknis (hard skills) dan interpersonal (soft skills), serta mengukur tingkat keyakinan (confidence score).
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40'>
                  <Target className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  3. Algorithmic Gap Analysis (80%+ Benchmark)
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Membandingkan akumulasi keahlian Anda terhadap kurikulum peran industri target. Skor 80%+ ditetapkan sebagai ambang batas kesiapan kerja nyata (industry-ready benchmark).
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40'>
                  <Globe className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  4. Instant Public Portfolio Engine
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Menghasilkan situs web portofolio profesional siap saji pada tautan <code>growvia.app/u/[slug]</code> dengan tema visual dinamis, bebas repot koding terpisah.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN PENGGUNAAN LENGKAP (8 LANGKAH) */}
      {activeTab === 'guide' && (
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
              Alur Penggunaan Lengkap: Dari Mahasiswa ke Siap Kerja
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Ikuti 8 langkah terstruktur ini untuk memaksimalkan potensi profil dan kesiapan karier Anda.
            </p>
          </div>

          <div className='space-y-4'>
            {/* Langkah 1 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    1
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Tentukan Target Peran Karier Anda
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Langkah Awal · Estimasi: 2 menit
                    </span>
                  </div>
                </div>

                <Link
                  href='/profile'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Atur di Profil</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Tentukan peran target yang ingin Anda tuju (misalnya <em>Frontend Web Engineer</em>, <em>AI & Machine Learning Engineer</em>, atau <em>Backend Engineer</em>). Target ini menjadi tolok ukur utama bagi seluruh perhitungan matriks kesenjangan (skill gap) dan rekomendasi belajar Anda.
              </p>

              <div className='p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400'>
                <Lightbulb className='w-4 h-4 text-amber-500 shrink-0 mt-0.5' />
                <span>
                  <strong>Tips:</strong> Anda dapat mengubah peran target kapan saja di menu Profil apabila fokus studi atau minat Anda bergeser di kemudian hari.
                </span>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    2
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Catat Rekam Jejak Pengalaman & Manfaatkan Ekstraksi AI
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Pengalaman · Estimasi: 5-10 menit
                    </span>
                  </div>
                </div>

                <Link
                  href='/experience'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Buka Pengalaman</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Tambahkan pengalaman Anda, baik magang, proyek mata kuliah, organisasi, kompetisi (hackathon), atau freelance. Gunakan tombol <strong>AI Ekstraksi Keahlian</strong> saat mengisi form untuk membedah narasi proyek Anda menjadi entitas keahlian yang terstruktur.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800'>
                  <span className='font-bold text-slate-800 dark:text-slate-200 block mb-1'>Tulis Deskripsi Berorientasi Aksi</span>
                  <p className='text-slate-500 dark:text-slate-400'>
                    Sertakan teknologi yang dipakai (React, Next.js, PostgreSQL) dan pencapaian konkrit agar AI mengenali keahlian dengan tepat.
                  </p>
                </div>
                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800'>
                  <span className='font-bold text-slate-800 dark:text-slate-200 block mb-1'>Lampirkan Bukti Autentik</span>
                  <p className='text-slate-500 dark:text-slate-400'>
                    Masukkan URL repositori GitHub, URL demo live aplikasi, atau file sertifikat pada formulir pengalaman.
                  </p>
                </div>
              </div>
            </div>

            {/* Langkah 3 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    3
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Eksplorasi Peta Keahlian & Graf Interaktif (Skill Matrix)
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Skill Matrix · Eksplorasi Visual
                    </span>
                  </div>
                </div>

                <Link
                  href='/skills'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Buka Skill Matrix</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Buka menu <strong>Skill Matrix</strong> untuk melihat sebaran keahlian Anda dalam graf visual interaktif (Skill Map Graph). Graf ini memetakan relasi antara hard skills teknis, soft skills kepemimpinan/kolaborasi, dan bukti yang memperkuat masing-masing keahlian.
              </p>
            </div>

            {/* Langkah 4 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    4
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Analisis Skor Kesiapan Karier & Matriks Kesenjangan (Gap)
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Karier & Gap · Tolok Ukur Kesiapan Kerja
                    </span>
                  </div>
                </div>

                <Link
                  href='/career'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Analisis Gap Karier</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Periksa persentase <em>Career Readiness Score</em> Anda. Pelajari tabel rincian kompetensi: mana keahlian yang telah memenuhi standar industri (skor ≥80%) dan mana keahlian prioritas tinggi yang masih mengalami kesenjangan (gap) untuk segera Anda tingkatkan.
              </p>
            </div>

            {/* Langkah 5 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    5
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Tingkatkan Kompetensi Lewat Rekomendasi Belajar
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Rekomendasi Belajar · Kurasi Eksternal Terpercaya
                    </span>
                  </div>
                </div>

                <Link
                  href='/learning'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Akses Modul Belajar</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Growvia secara otomatis merekomendasikan modul pembelajaran yang relevan untuk menutup kesenjangan keahlian spesifik Anda. Simpan modul yang ingin Anda pelajari ke daftar tersimpan, buka tautan materi eksternal resmi, dan pelajari secara mandiri.
              </p>
            </div>

            {/* Langkah 6 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    6
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Jelajahi Lowongan Karier Sesuai Arah Peran
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Peluang Karier · Magang & Pekerjaan Terkurasi
                    </span>
                  </div>
                </div>

                <Link
                  href='/opportunities'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Lihat Lowongan</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Buka menu <strong>Peluang Karier</strong> untuk melihat lowongan kerja dan magang dari industri. Gunakan opsi filter <em>Sesuai Arah Karier</em> untuk menyaring lowongan yang paling relevan dengan role target Anda, simpan lowongan favorit, dan lamar langsung.
              </p>
            </div>

            {/* Langkah 7 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    7
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Personalisasi & Terbitkan Portofolio Digital AI Anda
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Portofolio AI · Publikasi URL Resmi
                    </span>
                  </div>
                </div>

                <Link
                  href='/portfolio'
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors shrink-0'
                >
                  <span>Buka Portofolio AI</span>
                  <ChevronRight className='w-3.5 h-3.5' />
                </Link>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Buka menu <strong>Portofolio AI</strong> untuk memilih tema visual (misalnya <em>Royal Blue</em>, <em>Sleek Slate</em>, atau <em>Modern Emerald</em>), atur seksi yang ingin Anda tampilkan, lalu aktifkan status publik untuk mendapatkan tautan resmi <code>growvia.app/u/[slug]</code> yang siap dibagikan kepada rekruter.
              </p>
            </div>

            {/* Langkah 8 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                    8
                  </div>
                  <div>
                    <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                      Lakukan Pembaruan Berkala Sesuai Perkembangan
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Siklus Berkelanjutan · Evaluasi Rutin
                    </span>
                  </div>
                </div>

                <span className='px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0'>
                  Continuous Growth
                </span>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Setiap kali Anda menyelesaikan modul belajar, menyelesaikan proyek baru, atau memperoleh sertifikasi, segera tambahkan ke menu Pengalaman. Skor kesiapan Anda akan langsung meningkat secara otomatis dan portofolio publik Anda selalu diperbarui.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FITUR UTAMA PLATFORM */}
      {activeTab === 'features' && (
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
              Katalog Fitur & Spesifikasi Teknis Growvia
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Penjelasan rinci mengenai kemampuan sistem yang bekerja di balik layar.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Feature 1 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40'>
                <Sparkles className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                AI Smart Skill Extractor
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Menggunakan teknik pemrosesan bahasa alami (NLP) untuk menganalisis deskripsi pengalaman secara mendalam. Sistem mengenali terminologi teknologi, framework, arsitektur, dan soft skill, lalu memetakannya ke standar taksonomi keahlian industri global.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40'>
                <Layers className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Skill Map Graph Interaktif
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Graf visualisasi relasi jaringan berbasis node yang memperlihatkan bagaimana keahlian teknis Anda saling berhubungan dengan pengalaman proyek dan soft skills, memungkinkan peninjauan holistik yang tidak dapat disajikan oleh CV datar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40'>
                <Target className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Dynamic Career Gap Matrix
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Mesin kalkulasi gap yang mengukur jarak antara akumulasi kompetensi nyata talenta dengan persyaratan standar peran industri. Memilah keahlian menjadi kategori siap kerja (≥80%) dan prioritas gap yang harus segera dikejar.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40'>
                <Briefcase className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Career Opportunities Hub
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Pusat kurasi lowongan kerja dan program magang yang dilengkapi filter kecocokan arah peran karier (Career Direction Matching), fasilitas penyimpanan lowongan, dan integrasi pelamaran langsung.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40'>
                <BookOpen className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Targeted Learning Recommendations
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Koleksi materi dan kursus terpercaya dari platform eksternal resmi yang dipetakan secara spesifik untuk menutup kelemahan keahlian tanpa membuang waktu mempelajari hal-hal yang sudah dikuasai.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40'>
                <Globe className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Verified Public Portfolio Engine
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Mesin pembuat portofolio web publik dengan pilihan palet tema visual modern, pengaturan seksi fleksibel, tautan ramah SEO (`/u/[slug]`), dan verifikasi bukti artefak yang siap diinspeksi oleh rekruter profesional.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: METODOLOGI & GLOSARIUM */}
      {activeTab === 'methodology' && (
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
              Metodologi Penilaian & Glosarium Istilah
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Transparansi rumus, konsep pembobotan, dan arti istilah teknis di dalam Growvia.
            </p>
          </div>

          <div className='space-y-4'>
            {/* Konsep 1: Ambang Batas 80% */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'>
                  Standar Industri
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Mengapa Ambang Batas Kesiapan Ditetapkan pada 80%?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Dalam standar perekrutan teknologi modern, rekruter tidak mencari kandidat yang menguasai 100% dari seluruh pustaka teknis (yang seringkali tidak realistis). Kandidat yang telah memenuhi minimal <strong>80%</strong> dari matriks keahlian utama dianggap telah memiliki fondasi solid untuk belajar mandiri dan berproduksi secara efektif di lingkungan kerja riil.
              </p>
            </div>

            {/* Konsep 2: Confidence Score */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'>
                  AI Metric
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Apa itu Confidence Score pada Ekstraksi Keahlian?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                <em>Confidence Score</em> adalah nilai keyakinan (0% hingga 100%) yang dihasilkan model AI saat mendeteksi keahlian dari narasi teks Anda. Semakin eksplisit Anda menceritakan penggunaan suatu alat (misalnya: <em>&ldquo;Membangun REST API menggunakan Express.js dan PostgreSQL serta mengimplementasikan JWT authentication&rdquo;</em>), semakin tinggi tingkat keyakinan AI bahwa keahlian tersebut benar-benar diaplikasikan secara mendalam.
              </p>
            </div>

            {/* Konsep 3: Evidence-to-Skill Mapping */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'>
                  Validasi Data
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Konsep Relasi Bukti Terhadap Keahlian (Evidence-to-Skill Mapping)
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Satu artefak proyek riil (misalnya Proyek E-Commerce) dapat memvalidasi beberapa keahlian sekaligus (misal: React, TypeScript, Tailwind, Git). Relasi banyak-ke-banyak (many-to-many) ini memperkuat jaringan bukti Anda di dalam Skill Map Graph dan meningkatkan kredibilitas portofolio publik di mata rekruter.
              </p>
            </div>

            {/* Konsep 4: Keamanan & Privasi */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'>
                  Privasi & Keamanan
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Keamanan Data & Kendali Penuh Pengguna
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Growvia menghormati privasi data Anda. Informasi kontak dan portofolio Anda hanya dapat diakses secara publik melalui tautan `/u/[slug]` apabila Anda telah mengaktifkan tombol status publikasi di menu Portofolio AI. Anda dapat mencabut atau memperbarui izin publikasi kapan saja sesuai kebutuhan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigasi Cepat */}
      <div className='p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
            <Compass className='w-4 h-4' />
          </div>
          <div>
            <h4 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
              Siap Mengembangkan Karier Anda?
            </h4>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Lengkapi profil dan mulai rekam pengalaman pertama Anda di Growvia.
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2.5 w-full sm:w-auto'>
          <Link
            href='/profile'
            className='flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-2xs'
          >
            Edit Profil
          </Link>
          <Link
            href='/career'
            className='flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs'
          >
            Lihat Gap Karier
          </Link>
        </div>
      </div>
    </div>
  )
}
