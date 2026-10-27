'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Target,
  Layers,
  Briefcase,
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
        <div className='flex items-center gap-2.5'>
          <Image
            src='/images/growvia-logo.png'
            alt='Growvia Logo'
            width={32}
            height={32}
            className='w-8 h-8 rounded-lg object-contain'
          />
          <span className='font-bold text-lg text-slate-900 dark:text-white tracking-tight'>
            Growvia
          </span>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1'>
          <div className='space-y-1.5'>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
              Tentang Aplikasi & Panduan Growvia
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed'>
              Kenali Growvia lebih dekat: cara kerja, keunggulan dibanding CV biasa, dan panduan praktis dari awal sampai siap melamar kerja impianmu.
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className='flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 overflow-x-auto'>
        <button
          type='button'
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
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
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
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
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
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
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <Workflow className='w-4 h-4' />
          <span>Tanya Jawab & Penjelasan</span>
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
              <span>Tujuan Kami</span>
            </div>
            <h2 className='text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight'>
              Membantu Mahasiswa & Lulusan Baru Lebih Siap Masuk Dunia Kerja
            </h2>
            <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl'>
              Growvia adalah sahabat navigasi kariermu. Kami membantu kamu mencatat pengalaman nyata dari kuliah, proyek, magang, atau organisasi, lalu mencari tahu apa saja keahlian yang masih kurang untuk posisi impianmu, dan membuat portofolio online yang meyakinkan bagi rekruter.
            </p>
          </div>

          {/* Perbandingan: Masalah Riil vs Solusi Growvia */}
          <div className='space-y-4'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
                Kenapa Harus Pakai Growvia?
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Perbedaan mendasar antara CV biasa dengan portofolio berbasis bukti di Growvia.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Kolom 1: Cara Konvensional */}
              <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs'>
                <div className='text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider'>
                  Kelemahan CV Konvensional
                </div>

                <ul className='space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed'>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong className='text-slate-800 dark:text-slate-200'>Cuma klaim tanpa bukti:</strong> Di CV pelamar sering menulis panjang daftar skill, tapi rekruter sulit membuktikan apakah skill tersebut benar-benar dikuasai.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong className='text-slate-800 dark:text-slate-200'>Bingung apa yang kurang:</strong> Sering ditolak lamaran kerja tanpa pernah tahu keahlian apa yang sebenarnya belum memenuhi syarat.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='w-5 h-5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5'>
                      ✕
                    </span>
                    <span>
                      <strong className='text-slate-800 dark:text-slate-200'>Belajar tanpa arah:</strong> Banyak menghabiskan waktu ikut kursus acak yang ternyata tidak sesuai dengan kebutuhan lowongan kerja saat ini.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Kolom 2: Pendekatan Growvia */}
              <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs'>
                <div className='text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider'>
                  Kelebihan Menggunakan Growvia
                </div>

                <ul className='space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed'>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong className='text-slate-900 dark:text-white'>Dibuktikan dengan karya nyata:</strong> Setiap keahlian langsung ditautkan dengan link proyek, GitHub, website aktif, atau sertifikat asli.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong className='text-slate-900 dark:text-white'>Tahu jelas kekuranganmu:</strong> Sistem otomatis menghitung kesiapanmu dan memberitahu skill apa saja yang perlu kamu pelajari lagi.
                    </span>
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
                    <span>
                      <strong className='text-slate-900 dark:text-white'>Rekomendasi belajar tepat:</strong> Begitu tahu skill yang kurang, kamu langsung diarahkan ke modul belajar pilihan dan lowongan yang cocok.
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
                4 Manfaat Utama Growvia untuk Kariermu
              </h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Fitur-fitur andalan yang mempermudah langkahmu meraih karier impian.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40'>
                  <ShieldCheck className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  1. Portofolio Berbasis Bukti
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Bukan sekadar menuliskan nama keahlian di kertas, tapi menghubungkannya langsung ke hasil karya nyata, link repositori, dan sertifikat yang bisa diinspeksi rekruter.
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40'>
                  <Cpu className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  2. Bantuan AI Ekstraksi Keahlian
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Cukup ceritakan pengalaman proyek atau magang dengan bahasamu sendiri. AI kami akan otomatis menemukan keahlian teknis maupun kerja sama tim yang kamu gunakan.
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40'>
                  <Target className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  3. Pengukur Kesiapan Kerja
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Growvia menghitung seberapa cocok keahlianmu dengan standar lowongan kerja saat ini. Nilai di atas 80% menunjukkan kamu sudah siap melamar dengan percaya diri.
                </p>
              </div>

              <div className='p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs'>
                <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40'>
                  <Globe className='w-5 h-5' />
                </div>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  4. Website Portofolio Siap Pakai
                </h4>
                <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                  Tidak perlu repot koding website sendiri. Growvia membuatkan halaman portofolio keren beralamat <code>growvia.app/u/namamu</code> yang siap kamu cantumkan di surat lamaran.
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
              Panduan 8 Langkah Praktis Menggunakan Growvia
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Ikuti langkah sederhana ini untuk membangun profil yang kuat dan siap dilirik rekruter.
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
                      Tentukan Karier Impianmu
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
                Pilih peran yang ingin kamu tuju (contohnya <em>Frontend Web Engineer</em>, <em>Data Analyst</em>, atau <em>AI Engineer</em>). Pilihan peran ini menjadi patokan bagi Growvia untuk menghitung keahlian apa saja yang kamu butuhkan.
              </p>

              <div className='p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400'>
                <Lightbulb className='w-4 h-4 text-amber-500 shrink-0 mt-0.5' />
                <span>
                  <strong>Tips:</strong> Kamu bisa mengganti peran target kapan saja di menu Profil jika minat kariermu berubah.
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
                      Catat Pengalaman & Gunakan Ekstraksi AI
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
                Tambahkan pengalaman yang pernah kamu miliki: magang, proyek tugas kuliah, kepanitiaan, atau lomba. Manfaatkan tombol <strong>Ekstraksi AI</strong> saat mengisi formulir agar AI otomatis merangkum keahlian dari ceritamu.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60'>
                  <span className='font-bold text-slate-800 dark:text-slate-200 block mb-1'>Tulis Alat yang Kamu Pakai</span>
                  <p className='text-slate-500 dark:text-slate-400'>
                    Sebutkan teknologi yang digunakan (misal: React, Python, PostgreSQL) agar AI bisa mendeteksinya dengan akurat.
                  </p>
                </div>
                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60'>
                  <span className='font-bold text-slate-800 dark:text-slate-200 block mb-1'>Lampirkan Bukti Asli</span>
                  <p className='text-slate-500 dark:text-slate-400'>
                    Masukkan link GitHub, alamat demo aplikasi yang sudah online, atau sertifikat pada formulir pengalaman.
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
                      Lihat Peta Keahlianmu (Skill Matrix)
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Skill Matrix · Tampilan Visual Interaktif
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
                Masuk ke menu <strong>Skill Matrix</strong> untuk melihat peta keahlianmu. Kamu bisa melihat graf interaktif yang memperlihatkan bagaimana keahlian teknis terhubung dengan proyek nyata dan soft skill yang kamu miliki.
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
                      Cek Skor Kesiapan & Apa yang Masih Kurang
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
                Periksa persentase kesiapan kariermu. Kamu bisa melihat dengan jelas: keahlian apa yang sudah kamu kuasai dengan baik dan keahlian prioritas mana yang masih kurang agar kamu bisa segera menutup kekurangannya.
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
                      Belajar dari Rekomendasi Materi Terpilih
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Rekomendasi Belajar · Langsung ke Sasaran
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
                Growvia otomatis mencarikan modul belajar terpercaya yang sesuai dengan kelemahan keahlianmu. Kamu bisa bookmark modul yang ingin kamu pelajari dan langsung membuka link materi resminya.
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
                      Jelajahi Lowongan Magang & Pekerjaan
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Peluang Karier · Peluang Kerja Terkurasi
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
                Buka menu <strong>Peluang Karier</strong> untuk melihat lowongan magang dan kerja. Gunakan filter <em>Sesuai Arah Karier</em> agar lowongan yang muncul benar-benar relevan dengan posisi yang kamu tuju.
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
                      Buat & Bagikan Portofolio Onlinemu
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Menu Portofolio AI · Link Publik Siap Dibagikan
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
                Pilih tema warna favoritmu (misal: <em>Royal Blue</em>, <em>Sleek Slate</em>, atau <em>Modern Emerald</em>), pilih bagian mana yang ingin ditampilkan, lalu nyalakan tombol publik agar portofoliomu bisa diakses lewat link <code>growvia.app/u/namamu</code>.
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
                      Perbarui Secara Berkala
                    </h4>
                    <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                      Siklus Berkelanjutan · Profil Selalu Update
                    </span>
                  </div>
                </div>

                <span className='px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 shrink-0'>
                  Selalu Bertumbuh
                </span>
              </div>

              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Setiap kali kamu menyelesaikan proyek baru, lulus pelatihan, atau mendapat sertifikat baru, langsung tambahkan ke Growvia. Skor kesiapan kerjamu akan otomatis naik dan portofolio publikmu selalu terlihat aktif.
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
              Fitur Lengkap Growvia
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Berbagai kemudahan yang kami siapkan untuk membantu persiapan kariermu.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Feature 1 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40'>
                <Sparkles className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Ekstraksi Keahlian Otomatis oleh AI
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Kamu tidak perlu bingung memilih skill apa saja yang kamu kuasai. Cukup ketik cerita pengalaman kerjamu, dan AI akan otomatis menemukan keahlian teknis maupun kemampuan kerja sama timmu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40'>
                <Layers className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Peta Visual Keahlian (Skill Map Graph)
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Tampilan grafik interaktif yang menyenangkan untuk melihat bagaimana skill teknis, soft skill, dan proyek-proyekmu saling terhubung satu sama lain.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40'>
                <Target className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Pengukur Gap & Kesiapan Karier
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Sistem yang secara adil mengukur jarak antara skill yang kamu miliki sekarang dengan syarat lowongan kerja sesungguhnya, lengkap dengan saran apa yang perlu dipelajari.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40'>
                <Briefcase className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Peluang Magang & Kerja Terkurasi
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Temukan lowongan dari perusahaan yang memang cocok dengan bidang yang kamu minati, simpan lowongan favorit, dan lamar tanpa proses yang rumit.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40'>
                <BookOpen className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Rekomendasi Modul Belajar Pilihan
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Kumpulan materi dan kursus online terpercaya yang langsung diarahkan untuk menutup kekurangan keahlianmu, sehingga belajarmu jadi efisien dan tidak buang waktu.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40'>
                <Globe className='w-5 h-5' />
              </div>
              <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                Website Portofolio Online Otomatis
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed'>
                Halaman portofolio cantik dengan link khusus yang siap kamu pamerkan ke rekruter atau dipasang di LinkedIn, lengkap dengan bukti proyek dan sertifikatmu.
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
              Tanya Jawab & Penjelasan Istilah
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Pertanyaan umum seputar cara penilaian dan keamanan data di Growvia.
            </p>
          </div>

          <div className='space-y-4'>
            {/* Konsep 1: Ambang Batas 80% */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50'>
                  Standar Kesiapan
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Kenapa Target Kesiapan Ditetapkan 80%, Bukan 100%?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Di dunia kerja sesungguhnya, perusahaan tidak mengharuskan kamu menguasai 100% semua alat atau teknologi. Memiliki setidaknya <strong>80%</strong> dari keahlian utama sudah sangat cukup membuktikan bahwa kamu punya dasar yang kuat dan siap belajar hal baru dengan cepat di tempat kerja.
              </p>
            </div>

            {/* Konsep 2: Confidence Score */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/50'>
                  Tingkat Keyakinan AI
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Apa itu Confidence Score pada Ekstraksi Keahlian?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Ini adalah angka persentase seberapa yakin AI bahwa kamu benar-benar menguasai keahlian tersebut. Semakin jelas dan rinci kamu menceritakan tugas serta alat yang kamu pakai dalam proyek, semakin tinggi nilai keyakinan yang didapatkan.
              </p>
            </div>

            {/* Konsep 3: Evidence-to-Skill Mapping */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/50'>
                  Bukti Nyata
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Bagaimana 1 Proyek Bisa Membuktikan Banyak Keahlian Sekaligus?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Satu hasil karya (contohnya: Aplikasi Web Toko Online) bisa langsung memvalidasi kemampuan React, desain tampilan, pengaturan database, hingga kerja sama tim. Dengan begitu, kamu tidak perlu membuat proyek terpisah untuk tiap keahlian.
              </p>
            </div>

            {/* Konsep 4: Keamanan & Privasi */}
            <div className='p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs'>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'>
                  Privasi & Keamanan
                </span>
                <h4 className='text-sm sm:text-base font-bold text-slate-900 dark:text-white'>
                  Apakah Data Portofolio Saya Aman?
                </h4>
              </div>
              <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
                Sangat aman. Portofoliomu hanya bisa dibuka oleh orang lain lewat internet jika kamu sendiri yang mengaktifkan tombol publikasi di menu Portofolio AI. Kamu juga bebas mematikan atau mengubahnya kapan saja.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigasi Cepat */}
      <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-2xs'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
            <Compass className='w-4 h-4' />
          </div>
          <div>
            <h4 className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white'>
              Siap Mengembangkan Kariermu?
            </h4>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Lengkapi profil dan mulai rekam pengalaman pertamamu di Growvia.
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
