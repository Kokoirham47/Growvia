# 🌱 Growvia — AI-Powered Skill Ecosystem

> **Platform karier terintegrasi bagi mahasiswa dan fresh graduate untuk mengubah pengalaman organisasi, kepanitiaan, magang, dan proyek menjadi skill terstruktur, analisis kesiapan karier, rekomendasi belajar personalisasi, dan portofolio profesional.**

Branch ini (`develop`) adalah **integration branch utama** tempat bertemunya seluruh fitur tim Growvia sebelum dirilis ke `main`.

---

## 📑 Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Tech Stack](#2-tech-stack)
3. [Pembagian Tugas Tim](#3-pembagian-tugas-tim)
4. [Strategi Branch & Alur Kerja Git](#4-strategi-branch--alur-kerja-git)
5. [Matriks Kepemilikan Database (Anti-Konflik)](#5-matriks-kepemilikan-database-anti-konflik)
6. [Roadmap Merge & Sprint](#6-roadmap-merge--sprint)
7. [Katalog Fitur & Daftar Branch](#7-katalog-fitur--daftar-branch)
8. [Panduan Menjalankan Proyek](#8-panduan-menjalankan-proyek)
9. [Dokumentasi Perencanaan (`plan-md`)](#9-dokumentasi-perencanaan-plan-md)

---

## 1. Ringkasan Proyek

- **Visi**: Menjadi ekosistem karier terlengkap bagi generasi muda Indonesia yang menghubungkan **Pengalaman → Skill → Karier** dalam satu alur berbasis kecerdasan buatan (AI).
- **Target Pengguna**:
  - *Primary*: Mahasiswa aktif semester 4–8 (aktif berorganisasi & kepanitiaan).
  - *Secondary*: Fresh graduate 0–2 tahun pengalaman kerja.
  - *Tertiary*: Career switcher yang memetakan ulang skill set mereka.
- **Problem Statement**:
  1. Sulit mengidentifikasi skill konkret dari pengalaman non-formal/organisasi.
  2. Tidak mengetahui skill gap terhadap karier impian.
  3. Bingung memilih materi belajar yang tepat untuk menutup gap.
  4. Belum memiliki portofolio profesional berbasis bukti (*evidence-based*).

---

## 2. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 16.1.1 (App Router + Turbopack) | Server & Client Components hybrid |
| **UI Library** | MUI (Material UI) v7.3.6 | `@mui/material`, `@mui/lab`, CSS Variables |
| **Styling** | Emotion + Tailwind CSS 4.1 | Utility styling & modular themes |
| **Language** | TypeScript 5.9 | Strict typing |
| **Icons** | Iconify (Tabler Icons) | `src/assets/iconify-icons` |
| **AI Intelligence** | Gemini / Groq LLM API | Ekstraksi skill & ranking rekomendasi belajar |
| **Visualization** | D3.js / Vis.js / React Flow | Skill Pattern Map graph |

---

## 3. Pembagian Tugas Tim

Total Beban: **100%** | Skema Fullstack per Fitur (Frontend + Backend per orang):

| Anggota | Peran / Fokus | Fitur yang Dikerjakan | Beban |
|---|---|---|---|
| **Anggota A** | Foundation & Core AI Loop | **F01** Auth, **F02** Onboarding, **F03** Experience, **F04** AI Skill Extraction, **F10** Dashboard | **40%** |
| **Anggota B** | Intelligence & Career Engine | **F05** Skill Profile, **F06** Career Target & Gap, **F07** Learning Recommendation, **F13** Admin Dashboard | **40%** |
| **Anggota C** | Discovery & Identity | **F08** Career Opportunities, **F09** Portfolio Builder, **F12** Profile & Settings | **20%** |

---

## 4. Strategi Branch & Alur Kerja Git

```text
main (Production / Stable Release)
 └── develop (Integration Branch)
      ├── feature/f01-authentication      (Sprint 1 - Anggota A)
      ├── feature/f02-onboarding          (Sprint 2 - Anggota A)
      ├── feature/f03-experience          (Sprint 2 - Anggota A)
      ├── feature/f04-ai-skill-extraction (Sprint 3 - Anggota A)
      ├── feature/f05-skill-profile       (Sprint 4 - Anggota B)
      ├── feature/f06-career-gap          (Sprint 5 - Anggota B)
      ├── feature/f07-learning            (Sprint 6 - Anggota B)
      ├── feature/f08-opportunities       (Sprint 3 - Anggota C)
      ├── feature/f09-portfolio           (Sprint 5 - Anggota C)
      ├── feature/f10-dashboard           (Sprint 4 - Anggota A)
      ├── feature/f12-profile-settings    (Sprint 1 - Anggota C)
      └── feature/f13-admin               (Sprint 6 - Anggota B)
```

### Aturan Branching & Pull Request:
1. **Source Branch**: Setiap feature branch **wajib dibuat dari `develop` terbaru**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/fXX-nama-fitur
   ```
2. **Merge Target**: Semua PR diarahkan ke **`develop`**, bukan ke `main`.
3. **Branch `main`**: Hanya diperbarui saat rilis milestone stabil (Alpha/Beta/v1.0).
4. **Shared Files**: File global seperti middleware auth, skema basis data inti, konfigurasi `.env`, dan layout root dikerjakan di `develop` sebelum didistribusikan ke branch fitur.

---

## 5. Matriks Kepemilikan Database (Anti-Konflik)

Untuk menghindari *merge conflict* pada database logic dan schema:

| Tabel Basis Data | PIC Pemilik (Write / Primary CRUD) | Keterangan Konsumsi |
|---|---|---|
| `USER`, `EMAIL_VERIFICATION`, `SESSION` | **Anggota A** | Digunakan middleware auth oleh semua anggota |
| `PROFILE`, `CAREER_INTEREST`, `CAREER_FIELD` | **Anggota A** | Dibaca oleh F09 (Portofolio) & F12 (Settings) |
| `EXPERIENCE` | **Anggota A** | Dibaca oleh F04 (AI), F05 (Evidence), F09 (Portofolio) |
| `AI_ANALYSIS_JOB`, `AI_SKILL_SUGGESTION` | **Anggota A** | Khusus modul AI extraction |
| `SKILL` | **Anggota A** (Inisiasi/Seed) → **Anggota B** (Admin CRUD & Read) | Master taxonomy skill sistem |
| `USER_SKILL`, `SKILL_EVIDENCE` | **Anggota A** (Write saat ekstraksi) → **Anggota B** (Read & Manage) | Relasi skill user & bukti pengalaman |
| `CAREER_ROLE`, `CAREER_ROLE_SKILL` | **Anggota B** | Master library peran karier & bobot skill |
| `USER_CAREER_TARGET`, `SKILL_GAP_RESULT` | **Anggota B** | Data analisis gap & readiness score |
| `LEARNING_RESOURCE`, `RESOURCE_SKILL_TAG` | **Anggota B** | Master data resource & tag skill |
| `LEARNING_RECOMMENDATION`, `USER_SAVED_RESOURCE` | **Anggota B** | Hasil hybrid AI ranking belajar & bookmark |
| `ADMIN` | **Anggota B** | Akun autentikasi portal admin |
| `CAREER_OPPORTUNITY`, `OPPORTUNITY_SKILL_TAG` | **Anggota C** | Data lowongan karier & tag kualifikasi |
| `USER_SAVED_OPPORTUNITY` | **Anggota C** | Bookmark lowongan pengguna |

---

## 6. Roadmap Merge & Sprint

```text
Sprint 1  →  F01 (Auth - A) [FOUNDATION] ──> F12 (Profile & Settings - C) bisa mulai
Sprint 2  →  F02 (Onboarding - A) ───────> F03 (Experience - A)
Sprint 3  →  F04 (AI Skill Extraction - A) ──> F08 (Opportunities - C) paralel
Sprint 4  →  F05 (Skill Profile - B) ────> F10 (Dashboard Shell & Widgets - A)
Sprint 5  →  F06 (Career Gap - B) ───────> F09 (Portfolio Builder - C)
Sprint 6  →  F07 (Learning Rec - B) ─────> F13 (Admin Dashboard - B)
Sprint 7  →  Integrasi menyeluruh, End-to-End Testing, & Bug fixing
```

---

## 7. Katalog Fitur & Daftar Branch

| ID | Nama Fitur | Nama Branch | PIC | Prioritas PRD |
|---|---|---|---|---|
| **F01** | Authentication & Session | `feature/f01-authentication` | Anggota A | P0 (Must Have) |
| **F02** | User Onboarding | `feature/f02-onboarding` | Anggota A | P0 (Must Have) |
| **F03** | Experience Management | `feature/f03-experience` | Anggota A | P0 (Must Have) |
| **F04** | AI Skill Extraction | `feature/f04-ai-skill-extraction` | Anggota A | P0 (Must Have) |
| **F05** | Skill Profile & Pattern Map | `feature/f05-skill-profile` | Anggota B | P0 (Must Have) |
| **F06** | Career Target & Gap Analysis | `feature/f06-career-gap` | Anggota B | P1 (Should Have) |
| **F07** | Learning Recommendation | `feature/f07-learning` | Anggota B | P1 (Should Have) |
| **F08** | Career Opportunities | `feature/f08-opportunities` | Anggota C | P1 (Should Have) |
| **F09** | Portfolio Builder & Public View | `feature/f09-portfolio` | Anggota C | P1 (Should Have) |
| **F10** | Core Dashboard | `feature/f10-dashboard` | Anggota A | P0 (Must Have) |
| **F12** | Profile & Account Settings | `feature/f12-profile-settings` | Anggota C | P0 (Must Have) |
| **F13** | Admin Dashboard & Master Data | `feature/f13-admin` | Anggota B | P1 (Should Have) |

*Catatan: Setiap branch di atas memiliki `README.md` terdedikasi yang merinci flow, endpoint, skema, dan kriteria penerimaan sesuai PRD.*

---

## 8. Panduan Menjalankan Proyek

### Prasyarat
- Node.js versi 18.x atau 20.x
- npm / pnpm

### Langkah Instalasi
```bash
# 1. Pastikan berada di branch develop atau branch fitur tujuan
git checkout develop

# 2. Install dependencies
npm install

# 3. Siapkan environment file
cp .env.example .env.local

# 4. Jalankan development server dengan Turbopack
npm run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).

### Script Berguna
- `npm run dev` : Menjalankan Next.js dev server.
- `npm run build` : Memvalidasi bundle build Next.js.
- `npm run lint` : Menjalankan audit ESLint.
- `npm run lint:fix` : Memperbaiki pelanggaran linting secara otomatis.
- `npm run build:icons` : Mengompilasi CSS ikon Iconify jika menambah ikon baru.

---

## 9. Dokumentasi Perencanaan (`plan-md`)

Detail arsitektur teknis dan panduan lengkap tersedia di folder `plan-md/`:
- [`plan-md/prd.md`](./plan-md/prd.md) : Product Requirements Document lengkap (F01–F13).
- [`plan-md/task-management.md`](./plan-md/task-management.md) : Panduan pembagian tugas, format Notion, dan aturan merge.
- [`plan-md/erd_growvia.md`](./plan-md/erd_growvia.md) : Diagram ERD Mermaid & struktur seluruh tabel.
- [`plan-md/erd_penjelasan.md`](./plan-md/erd_penjelasan.md) : Penjelasan mendalam kamus data dan relasi tabel.
- [`plan-md/design_system.md`](./plan-md/design_system.md) : Panduan Design System, tipografi, warna, dan komponen UI.
