'use client'

// React Imports
import { useState } from 'react'
import {
  Settings,
  Plus,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  Share2,
  ArrowUpRight,
  RefreshCw,
  Briefcase,
  Brain,
  Flame,
  Compass,
  Sparkles,
  Check,
  Sliders,
  ChevronRight,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Users,
  Flag,
  XCircle,
  GraduationCap,
  Zap,
  Clock,
  Download
} from 'lucide-react'

const DashboardView = () => {
  // State for interactive elements (dismissing AI insight, tab switching, etc.)
  const [insightDismissed, setInsightDismissed] = useState(false)
  const [insightAccepted, setInsightAccepted] = useState(false)

  return (
    <div className='flex flex-col gap-6 w-full max-w-[1440px] mx-auto pb-8'>
      {/* 1. HERO SECTION (Header) */}
      <section className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1'>
        {/* Left: Status tag, Welcome greeting & summary */}
        <div className='flex flex-col gap-1.5'>
          <div className='inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-medium'>
            <Settings className='w-3.5 h-3.5 animate-spin-slow' />
            <span>Semester 7 Ready • Target Q3 2025</span>
          </div>

          <h1 className='text-3xl lg:text-[34px] font-bold text-[#1E293B] tracking-tight mt-1 flex items-center gap-2'>
            <span>Halo, Nabila!</span>
            <span className='inline-block animate-wave origin-[70%_70%]'>👋</span>
          </h1>

          <p className='text-sm text-[#64748B] max-w-2xl leading-relaxed'>
            Kamu sudah mendokumentasikan <strong className='font-semibold text-slate-800'>6 pengalaman</strong>. Growvia AI menemukan{' '}
            <strong className='font-semibold text-[#2563EB]'>14 skill terverifikasi</strong> dan 2 potensi jalur karier impianmu.
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className='flex items-center gap-3 shrink-0'>
          <button
            type='button'
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.98]'
          >
            <Plus className='w-4 h-4' />
            <span>Tambah Pengalaman Baru</span>
          </button>

          <button
            type='button'
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#1E293B] text-sm font-semibold transition-all shadow-xs hover:border-slate-300 active:scale-[0.98]'
          >
            <Rocket className='w-4 h-4 text-[#2563EB]' />
            <span>Eksplor Skill Gap</span>
          </button>
        </div>
      </section>

      {/* 2. STAT CARDS ROW (4 Cards) */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Card 1: Skor Kesiapan Karier */}
        <div className='bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Skor Kesiapan Karier
              </span>
              <div className='w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center'>
                <ShieldCheck className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-2.5 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] tracking-tight'>78%</span>
              <span className='inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700'>
                <TrendingUp className='w-3 h-3' />
                <span>+12% bulan ini</span>
              </span>
            </div>

            <div className='w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden'>
              <div className='bg-emerald-500 h-full rounded-full' style={{ width: '78%' }} />
            </div>
          </div>

          <p className='text-xs text-slate-500 mt-3 font-normal'>
            Siap melamar Junior Product Designer
          </p>
        </div>

        {/* Card 2: Skill Tervalidasi */}
        <div className='bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Skill Tervalidasi
              </span>
              <div className='w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
                <Award className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] tracking-tight'>14</span>
              <span className='text-sm font-normal text-slate-500 ml-1'>Skill</span>
            </div>

            <div className='flex items-center gap-2 mt-3.5'>
              <span className='text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#3730A3]'>
                8 Hard Skill
              </span>
              <span className='text-slate-300 text-xs'>•</span>
              <span className='text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                6 Soft Skill
              </span>
            </div>
          </div>

          <div className='h-4' />
        </div>

        {/* Card 3: Skill Gap Terdeteksi */}
        <div className='bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Skill Gap Terdeteksi
              </span>
              <div className='w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center'>
                <AlertTriangle className='w-4 h-4' />
              </div>
            </div>

            <div className='flex items-baseline gap-1.5 mt-3'>
              <span className='text-3xl font-extrabold text-[#D97706] tracking-tight'>3</span>
              <span className='text-sm font-semibold text-[#1E293B]'>Skill Perlu Dikejar</span>
            </div>
          </div>

          <p className='text-xs text-slate-500 mt-4 font-normal'>
            Dibutuhkan untuk Target: Associate PM
          </p>
        </div>

        {/* Card 4: Portofolio Publik */}
        <div className='bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all'>
          <div>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Portofolio Publik
              </span>
              <button
                type='button'
                className='text-slate-400 hover:text-slate-600 transition-colors'
                title='Bagikan Portofolio'
              >
                <Share2 className='w-4 h-4' />
              </button>
            </div>

            <div className='flex items-baseline gap-1 mt-3'>
              <span className='text-3xl font-extrabold text-[#1E293B] tracking-tight'>92%</span>
              <span className='text-sm font-normal text-slate-500 ml-1'>Kelengkapan</span>
            </div>
          </div>

          <div className='flex items-center justify-between mt-3 pt-1'>
            <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
              <span>Aktif & Siap Dibagikan</span>
            </span>

            <a
              href='#'
              className='inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors'
            >
              <span>Preview</span>
              <ArrowUpRight className='w-3 h-3' />
            </a>
          </div>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT GRID (Left: ~67%, Right: ~33%) */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* LEFT COLUMN (8 Cols) */}
        <div className='lg:col-span-8 flex flex-col gap-6'>
          {/* A. METODOLOGI GROWVIA: ALUR EKOSISTEM KARIER */}
          <div className='bg-white rounded-2xl border border-slate-100 p-6 shadow-xs'>
            <div className='flex items-center justify-between pb-4'>
              <div>
                <span className='text-xs font-bold text-slate-400 uppercase tracking-wider block'>
                  METODOLOGI GROWVIA
                </span>
                <h2 className='text-xl font-bold text-[#1E293B] tracking-tight mt-0.5'>
                  Alur Ekosistem Karier Kamu
                </h2>
              </div>

              <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100'>
                <RefreshCw className='w-3 h-3' />
                <span>Siklus Berkelanjutan</span>
              </span>
            </div>

            {/* 4 Steps Flow */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 pt-2'>
              {/* Step 1: Pengalaman */}
              <div className='rounded-xl bg-[#F0F5FF] p-4 flex flex-col justify-between border border-blue-50/50 hover:shadow-xs transition-all'>
                <div>
                  <div className='flex items-center justify-between text-[#6366F1]'>
                    <div className='w-7 h-7 rounded-lg bg-indigo-100/70 text-[#6366F1] flex items-center justify-center'>
                      <Briefcase className='w-4 h-4' />
                    </div>
                    <span className='text-xs font-bold text-slate-400'>1</span>
                  </div>
                  <div className='text-xs font-semibold text-slate-600 mt-3'>Pengalaman</div>
                  <div className='text-2xl font-bold text-[#1E293B] mt-0.5'>6</div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Tercatat rapi</div>
                </div>
                <div className='w-full bg-blue-100 h-1 rounded-full mt-3 overflow-hidden'>
                  <div className='bg-blue-600 h-full rounded-full' style={{ width: '100%' }} />
                </div>
              </div>

              {/* Step 2: Ekstraksi AI */}
              <div className='rounded-xl bg-[#F8FAFC] p-4 flex flex-col justify-between border border-slate-100 hover:shadow-xs transition-all'>
                <div>
                  <div className='flex items-center justify-between text-blue-600'>
                    <div className='w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
                      <Brain className='w-4 h-4' />
                    </div>
                    <span className='text-xs font-bold text-slate-400'>2</span>
                  </div>
                  <div className='text-xs font-semibold text-slate-600 mt-3'>Ekstraksi AI</div>
                  <div className='text-2xl font-bold text-[#1E293B] mt-0.5'>14</div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Skill aktif terpetakan</div>
                </div>
                <div className='w-full bg-slate-200 h-1 rounded-full mt-3 overflow-hidden'>
                  <div className='bg-blue-600 h-full rounded-full' style={{ width: '85%' }} />
                </div>
              </div>

              {/* Step 3: Analisis Gap */}
              <div className='rounded-xl bg-[#FFFBEB] p-4 flex flex-col justify-between border border-amber-50 hover:shadow-xs transition-all'>
                <div>
                  <div className='flex items-center justify-between text-amber-600'>
                    <div className='w-7 h-7 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center'>
                      <Flame className='w-4 h-4' />
                    </div>
                    <span className='text-xs font-bold text-slate-400'>3</span>
                  </div>
                  <div className='text-xs font-semibold text-slate-600 mt-3'>Analisis Gap</div>
                  <div className='text-2xl font-bold text-[#D97706] mt-0.5'>3</div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Target belajar aktif</div>
                </div>
                <div className='w-full bg-amber-100 h-1 rounded-full mt-3 overflow-hidden'>
                  <div className='bg-amber-500 h-full rounded-full' style={{ width: '60%' }} />
                </div>
              </div>

              {/* Step 4: Peluang Karier */}
              <div className='rounded-xl bg-[#F0FDF4] p-4 flex flex-col justify-between border border-emerald-50 hover:shadow-xs transition-all'>
                <div>
                  <div className='flex items-center justify-between text-emerald-600'>
                    <div className='w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center'>
                      <Compass className='w-4 h-4' />
                    </div>
                    <span className='text-xs font-bold text-slate-400'>4</span>
                  </div>
                  <div className='text-xs font-semibold text-slate-600 mt-3'>Peluang Karier</div>
                  <div className='text-2xl font-bold text-emerald-700 mt-0.5'>12</div>
                  <div className='text-[11px] text-slate-500 mt-0.5'>Lowongan cocok match &gt;80%</div>
                </div>
                <div className='w-full bg-emerald-100 h-1 rounded-full mt-3 overflow-hidden'>
                  <div className='bg-emerald-600 h-full rounded-full' style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* B. INSIGHT AI GROWVIA: PENEMUAN SKILL BARU OTOMATIS */}
          {!insightDismissed && (
            <div className='bg-[#EEF2FF] rounded-2xl border border-[#E0E7FF] p-6 shadow-xs relative overflow-hidden transition-all'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-indigo-600/10 text-[#6366F1] flex items-center justify-center shrink-0'>
                    <Sparkles className='w-5 h-5' />
                  </div>
                  <div>
                    <span className='text-xs font-bold text-[#6366F1] uppercase tracking-wider block'>
                      INSIGHT AI GROWVIA
                    </span>
                    <h3 className='text-lg font-bold text-[#1E293B] tracking-tight mt-0.5'>
                      Penemuan Skill Baru Otomatis
                    </h3>
                  </div>
                </div>

                <span className='inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 shrink-0'>
                  Baru Teranalisis
                </span>
              </div>

              <p className='text-sm text-slate-700 leading-relaxed mt-4 font-normal'>
                Berdasarkan proyek <strong className='font-semibold text-slate-900'>Capstone Bangkit Academy</strong> kamu,
                kami mendeteksi bukti konkret penerapan skill{' '}
                <span className='inline-block px-2 py-0.5 rounded bg-white text-blue-700 font-semibold text-xs border border-blue-100 shadow-2xs'>
                  Product Discovery
                </span>{' '}
                dan{' '}
                <span className='inline-block px-2 py-0.5 rounded bg-white text-blue-700 font-semibold text-xs border border-blue-100 shadow-2xs'>
                  User Interview
                </span>{' '}
                pada level <em className='not-italic font-medium text-slate-800'>Intermediate</em>. Tambahkan ke matriks portofoliomu?
              </p>

              {/* Action Buttons */}
              <div className='flex items-center gap-3 mt-5 pt-1'>
                <button
                  type='button'
                  onClick={() => setInsightAccepted(true)}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]'
                >
                  <Check className='w-4 h-4' />
                  <span>{insightAccepted ? 'Tersimpan ke Portfolio!' : 'Terima & Simpan'}</span>
                </button>

                <button
                  type='button'
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold transition-all active:scale-[0.98]'
                >
                  <Sliders className='w-4 h-4' />
                  <span>Edit Skill</span>
                </button>

                <button
                  type='button'
                  onClick={() => setInsightDismissed(true)}
                  className='px-3 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors'
                >
                  Abaikan
                </button>
              </div>
            </div>
          )}

          {/* C. REKAM JEJAK: PENGALAMAN TERAKHIR */}
          <div className='bg-white rounded-2xl border border-slate-100 p-6 shadow-xs'>
            <div className='flex items-center justify-between pb-5'>
              <div>
                <span className='text-xs font-bold text-slate-400 uppercase tracking-wider block'>
                  REKAM JEJAK
                </span>
                <h3 className='text-xl font-bold text-[#1E293B] tracking-tight mt-0.5'>
                  Pengalaman Terakhir
                </h3>
              </div>

              <a
                href='#'
                className='inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors'
              >
                <span>Lihat Semua (6)</span>
                <ChevronRight className='w-4 h-4' />
              </a>
            </div>

            {/* List of Experiences */}
            <div className='flex flex-col divide-y divide-slate-100'>
              {/* Item 1: UI/UX Design Intern */}
              <div className='py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-start gap-3.5'>
                  <div className='w-11 h-11 rounded-xl bg-[#F0F5FF] text-blue-600 flex items-center justify-center shrink-0 mt-0.5'>
                    <Laptop className='w-5 h-5' />
                  </div>
                  <div>
                    <h4 className='text-base font-semibold text-[#1E293B] flex items-center gap-2'>
                      <span>UI/UX Design Intern</span>
                      <span className='text-slate-300 text-xs font-normal'>•</span>
                      <span className='text-slate-600 font-medium text-sm'>Telkom Digital Solution</span>
                    </h4>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      Agu 2024 - Des 2024 • Magang Industri (5 bln)
                    </p>
                    <div className='flex flex-wrap items-center gap-1.5 mt-2.5'>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Wireframing
                      </span>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Figma Systems
                      </span>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Usability Testing
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pl-14 sm:pl-0'>
                  <span className='inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700'>
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    <span>3 Skill Tervalidasi</span>
                  </span>
                  <a
                    href='#'
                    className='inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors'
                  >
                    <span>Detail Log</span>
                    <ArrowRight className='w-3 h-3' />
                  </a>
                </div>
              </div>

              {/* Item 2: Ketua Divisi Media & Kreatif */}
              <div className='py-4 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-start gap-3.5'>
                  <div className='w-11 h-11 rounded-xl bg-[#F0F5FF] text-blue-600 flex items-center justify-center shrink-0 mt-0.5'>
                    <Users className='w-5 h-5' />
                  </div>
                  <div>
                    <h4 className='text-base font-semibold text-[#1E293B] flex items-center gap-2'>
                      <span>Ketua Divisi Media & Kreatif</span>
                      <span className='text-slate-300 text-xs font-normal'>•</span>
                      <span className='text-slate-600 font-medium text-sm'>BEM Universitas Indonesia</span>
                    </h4>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      Jan 2024 - Des 2024 • Organisasi Kampus (1 thn)
                    </p>
                    <div className='flex flex-wrap items-center gap-1.5 mt-2.5'>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Team Leadership
                      </span>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Stakeholder Management
                      </span>
                      <span className='text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600'>
                        Content Strategy
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pl-14 sm:pl-0'>
                  <span className='inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700'>
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    <span>4 Skill Tervalidasi</span>
                  </span>
                  <a
                    href='#'
                    className='inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors'
                  >
                    <span>Detail Log</span>
                    <ArrowRight className='w-3 h-3' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols) */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          {/* A. PRIORITAS UTAMA */}
          <div className='bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between'>
            <div>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-bold text-amber-500 uppercase tracking-wider'>
                  PRIORITAS UTAMA
                </span>
                <Flag className='w-4 h-4 text-slate-400' />
              </div>

              <div className='mt-2'>
                <span className='text-xs text-slate-500 block font-normal'>Peran Sasaran</span>
                <h3 className='text-xl font-bold text-[#1E293B] tracking-tight mt-0.5'>
                  Associate Product Designer
                </h3>
                <span className='text-xs text-slate-500 block mt-0.5'>
                  Industri: FinTech & SaaS EdTech
                </span>
              </div>

              {/* Match Score Box */}
              <div className='bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 mt-4'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-slate-700'>Kecocokan Profil</span>
                  <span className='font-bold text-blue-600'>78% Match</span>
                </div>
                <div className='w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden'>
                  <div className='bg-blue-600 h-full rounded-full' style={{ width: '78%' }} />
                </div>
                <p className='text-[11px] text-slate-500 mt-2 leading-relaxed font-normal'>
                  Tinggal 2 skill kunci untuk mencapai ambang 90% siap rekrut.
                </p>
              </div>

              {/* Gap Skills List */}
              <div className='mt-4 pt-1'>
                <span className='text-xs font-bold text-slate-700 block mb-2.5'>
                  Gap Skill Harus Dikejar:
                </span>

                <div className='flex flex-col gap-2'>
                  {/* Item 1 */}
                  <div className='flex items-center justify-between py-1'>
                    <div className='flex items-center gap-2'>
                      <XCircle className='w-4 h-4 text-red-500' />
                      <span className='text-sm font-semibold text-slate-800'>
                        Design System Tokens
                      </span>
                    </div>
                    <span className='text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-600'>
                      Missing
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className='flex items-center justify-between py-1'>
                    <div className='flex items-center gap-2'>
                      <RefreshCw className='w-4 h-4 text-amber-500' />
                      <span className='text-sm font-semibold text-slate-800'>
                        Quantitative Analytics
                      </span>
                    </div>
                    <span className='text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700'>
                      Develop
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type='button'
              className='w-full mt-5 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]'
            >
              <GraduationCap className='w-4 h-4' />
              <span>Lihat Rekomendasi Belajar</span>
            </button>
          </div>

          {/* B. MODUL KILAT AI */}
          <div className='bg-white rounded-2xl border border-slate-100 p-6 shadow-xs'>
            <div>
              <div className='flex items-center gap-2'>
                <Zap className='w-4 h-4 text-blue-600' />
                <h3 className='text-base font-bold text-[#1E293B] tracking-tight'>
                  Modul Kilat AI
                </h3>
              </div>
              <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
                Dipilih secara presisi untuk menutup gap dalam waktu kurang dari 1 minggu.
              </p>
            </div>

            <div className='flex flex-col gap-3 mt-4'>
              {/* Module 1 */}
              <div className='p-3.5 rounded-xl border border-slate-100 bg-[#F8FAFC] flex flex-col gap-2 hover:border-slate-200 transition-all'>
                <div className='flex items-center gap-2 text-xs'>
                  <span className='font-semibold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5]'>
                    Mini Course
                  </span>
                  <span className='text-slate-400 flex items-center gap-1'>
                    <Clock className='w-3 h-3' />
                    <span>45 menit</span>
                  </span>
                </div>

                <div>
                  <h4 className='text-sm font-bold text-slate-900 leading-snug'>
                    Metrics for UX: Heart Framework & Product KPI
                  </h4>
                  <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
                    Materi ringkas menghubungkan data kuantitatif ke desain wireframe.
                  </p>
                </div>

                <div className='flex items-center justify-between pt-1 border-t border-slate-100 mt-1'>
                  <span className='text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700'>
                    Tutup Gap: Quantitative
                  </span>
                  <a
                    href='#'
                    className='inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700'
                  >
                    <span>Mulai</span>
                    <ArrowRight className='w-3 h-3' />
                  </a>
                </div>
              </div>

              {/* Module 2 */}
              <div className='p-3.5 rounded-xl border border-slate-100 bg-[#F8FAFC] flex flex-col gap-2 hover:border-slate-200 transition-all'>
                <div className='flex items-center gap-2 text-xs'>
                  <span className='font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700'>
                    Resource Kit
                  </span>
                  <span className='text-slate-400 flex items-center gap-1'>
                    <Download className='w-3 h-3' />
                    <span>Unduhan Gratis</span>
                  </span>
                </div>

                <div>
                  <h4 className='text-sm font-bold text-slate-900 leading-snug'>
                    Template: Design Token Architecture in Figma
                  </h4>
                  <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
                    Standar dokumentasi variabel & token untuk diserahkan ke tim engineer.
                  </p>
                </div>

                <div className='flex items-center justify-between pt-1 border-t border-slate-100 mt-1'>
                  <span className='text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700'>
                    Tutup Gap: Design System
                  </span>
                  <a
                    href='#'
                    className='inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700'
                  >
                    <span>Unduh Kit</span>
                    <Download className='w-3 h-3' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardView
