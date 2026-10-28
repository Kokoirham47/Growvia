# 📊 Feature: F10 — Core Dashboard & Navigation Shell

> **Branch:** `feature/f10-dashboard`  
> **PIC / Assignee:** Anggota A (Beban: 40% — *Foundation & Core AI Loop*)  
> **Prioritas:** P0 (Must Have)  
> **Dependency:** F01 (Auth), F03 (Experience), dan F04 (AI Skill) sudah di-merge  
> **Target Merge:** `develop` (Merge ke-10 — *Pusat Kendali Pengguna*)  
> **Dokumen Terkait:** [PRD (F10)](./plan-md/prd.md#f10--dashboard) · [Task Management](./plan-md/task-management.md#f10--dashboard) · [ERD](./plan-md/erd_growvia.md)

---

## 📌 Deskripsi Fitur

Dashboard adalah **homebase utama** bagi pengguna Growvia. Halaman ini dirancang agar komunikatif dan menyajikan status ekosistem karier mahasiswa dalam waktu **< 5 detik** setelah login. Selain widget ringkasan metrik, branch ini juga memegang peranan krusial dalam membangun **Shared Navigation Layout & Sidebar** yang akan digunakan secara bersama-sama oleh seluruh halaman aplikasi (akan ditarik oleh Anggota B dan C setelah di-merge ke `develop`).

---

## 🎯 Spesifikasi Kebutuhan & Susunan Widget (PRD)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARED SIDEBAR & NAVBAR                         │
├────────────────────────────────────────────────────────────────────────┤
│ [ Header Sapaan & Status Onboarding ]                                  │
│                                                                        │
│ ┌───────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ 1. Career Readiness Score │  │ 2. Skill Summary & Mini Pattern Map │ │
│ │    (Skor % + Target Role) │  │    (Distribusi Kategori Keahlian)   │ │
│ └───────────────────────────┘  └─────────────────────────────────────┘ │
│ ┌───────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ 3. Top Learning Recs      │  │ 4. Recent Matched Opportunities     │ │
│ │    (3 Rekomendasi Belajar)│  │    (Peluang Karier % Match Tinggi)  │ │
│ └───────────────────────────┘  └─────────────────────────────────────┘ │
│ ┌───────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ 5. Growth Progress        │  │ 6. Quick Action Shortcuts           │ │
│ │    (Skill & Bukti Bulan Ini) │ (+ Pengalaman, Set Karier, Portofolio)│
│ └───────────────────────────┘  └─────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Widget Kesiapan Karier (Career Readiness Widget)
- Menampilkan persentase kesiapan karier aktif beserta lencana tingkatan (*Starter / Developing / Ready / Top Candidate*).
- Menampilkan nama peran karier yang sedang dituju (e.g., *"Target: Frontend Engineer"*).
- Tombol aksi cepat: *"Lihat Analisis Gap"* ➔ Mengarahkan ke menu Career (`/career`).

### 2. Widget Ringkasan Keahlian (Skill Summary & Mini Graph)
- Menampilkan jumlah total keahlian dan visualisasi diagram batang/lingkaran distribusi 4 kategori (`Hard`, `Soft`, `Technical`, `Leadership`).
- Mini preview node-graph grafis sederhana.

### 3. Widget Rekomendasi Belajar Teratas (Top Learning Recommendations)
- Menampilkan 3 kartu materi teratas yang paling relevan untuk menutup missing skills.
- Jika data rekomendasi belum digenerate oleh F07, tampilkan placeholder interaktif *"Temukan materi belajarmu"*.

### 4. Widget Peluang Karier Terkini (Recent Matched Opportunities)
- Menampilkan daftar lowongan magang/kerja terbaru yang memiliki persentase kecocokan skill (*Skill Match*) tertinggi.
- Lencana persentase kecocokan (e.g. *"90% Cocok"*).

### 5. Widget Progres Pertumbuhan (Growth Progress)
- Menghitung statistik aktivitas: jumlah skill baru yang ditambahkan dan pengalaman baru yang diverifikasi dalam bulan berjalan.

### 6. Empty State Ramah Pengguna Baru
- Jika akun mahasiswa baru saja mendaftar dan belum memiliki pengalaman/skill, dashboard tidak menampilkan ruang kosong, melainkan **panduan langkah awal yang interaktif**:
  - *"Langkah 1: Tambahkan pengalaman pertamamu"*
  - *"Langkah 2: Ekstraksi skill dengan AI"*
  - *"Langkah 3: Tentukan target kariermu"*

### 7. Shared Navigation & Shell Layout
- Sidebar navigasi vertikal responsif:
  - Dashboard (`/dashboard`)
  - Experiences (`/experience`)
  - Skill Profile (`/skills`)
  - Career Target (`/career`)
  - Learning (`/learning`)
  - Opportunities (`/opportunities`)
  - Portfolio (`/portfolio`)
  - Profile & Settings (`/profile`, `/settings`)
- Navbar atas: User avatar, notifikasi placeholder, dan mode changer (Light/Dark mode).

---

## 🗄️ Lingkup Backend & Skema Basis Data

### Endpoint API

| Method | Endpoint | Deskripsi | Proteksi Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Mengambil data agregasi metrik gabungan untuk seluruh widget | User Auth |

### Entitas Basis Data (Konsumsi Read-Only)
Modul dashboard mengonsolidasikan data dari tabel:
- `PROFILE` (nama, headline, avatar).
- `USER_SKILL` (count, kategori, growth bulan ini).
- `USER_CAREER_TARGET` & `SKILL_GAP_RESULT` (readiness score).
- `LEARNING_RECOMMENDATION` (top 3 ranks).
- `CAREER_OPPORTUNITY` (top matches).

---

## 💻 Lingkup Frontend

### Rute Halaman
- `src/app/(dashboard)/dashboard/page.tsx` atau `src/app/(dashboard)/home/page.tsx`

### Komponen UI
- `CareerReadinessWidget.tsx` ➔ Widget skor kesiapan.
- `SkillSummaryWidget.tsx` ➔ Widget visualisasi ringkas keahlian.
- `TopLearningWidget.tsx` ➔ Kartu materi belajar teratas.
- `RecentOpportunitiesWidget.tsx` ➔ Kartu peluang karier cocok.
- `GrowthProgressWidget.tsx` ➔ Widget pertumbuhan skill bulanan.
- `DashboardEmptyState.tsx` ➔ Panduan langkah awal pengguna baru.
- Shared Menu Configs: Penataan link di `src/components/layout/vertical/VerticalMenu.tsx`.

---

## ✅ Kriteria Penerimaan (Acceptance Criteria)

- [ ] Dashboard menampilkan ringkasan metrik status karier user dalam waktu cepat (< 5 detik).
- [ ] Setiap kartu widget interaktif dan dapat diklik menuju halaman fitur terkait.
- [ ] Tampilan Empty State yang memandu user baru muncul jika data pengalaman/skill masih kosong.
- [ ] Shared layout navbar & sidebar responsif di mobile (drawer samping) dan desktop.

---

## 🛠️ Panduan Pengembangan

```bash
# 1. Jalankan development server
# 1. Jalankan development server
npm run dev

# 2. Buka dashboard:
# http://localhost:3000/home atau http://localhost:3000/dashboard

# 3. Validasi kode
npm run lint
```
