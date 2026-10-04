# 🌱 Growvia — Pembagian Tugas Tim

> Proyek: Growvia Web App
> Total Beban: 100% | Pembagian: **40% / 40% / 20%**
> Setiap anggota mengerjakan fullstack (frontend + backend) per fitur masing-masing agar tidak ada konflik antar branch dan modul.

---

## 🧭 Prinsip Pembagian

| Prinsip | Keterangan |
|---------|-----------|
| **Satu fitur, satu orang** | Tidak ada fitur yang dikerjakan dua orang bersamaan |
| **Satu fitur, satu branch** | Setiap fitur punya branch sendiri, merge ke `develop` satu per satu |
| **Dependency jelas** | Fitur yang menjadi dependency dikerjakan lebih dulu dan di-merge sebelum fitur lain mulai |
| **Shared code = main/develop only** | Schema DB, env config, shared utils, middleware auth hanya di `main`/`develop` — tidak duplikasi di branch fitur |

---

## 📋 Ringkasan Pembagian

| # | Anggota | Fitur | Beban |
|---|---------|-------|-------|
| 1 | **Anggota A** | F01 Auth + F02 Onboarding + F03 Experience + F04 AI Skill Extraction + F10 Dashboard | **40%** |
| 2 | **Anggota B** | F05 Skill Profile + F06 Career Target & Skill Gap + F07 Learning Recommendation + F13 Admin Dashboard | **40%** |
| 3 | **Anggota C** | F08 Career Opportunities + F09 Portfolio Builder + F12 Profile & Settings | **20%** |

---

---

# 👤 ANGGOTA A — 40%

**PIC:** *(isi nama)*
**Tanggung Jawab:** Foundation & Core AI Loop

> Mengerjakan tulang punggung sistem: auth, onboarding, input pengalaman, AI ekstraksi skill, dan dashboard. Semua fitur lain bergantung pada output F01 dan F03 — prioritas merge paling awal.

---

### F01 — Authentication

**Branch:** `feature/f01-authentication`

| Sub-Fitur | Detail |
|-----------|--------|
| F01.1 Register | Form validasi real-time + kirim email verifikasi |
| F01.2 Email Verification | Token 24 jam, resend cooldown 60 detik |
| F01.3 Login | JWT session, redirect logic (onboarding vs dashboard) |
| F01.4 Forgot Password | Reset via email |

**Backend scope:**
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- Tabel: `USER`, `EMAIL_VERIFICATION`, `SESSION`
- Middleware `authMiddleware` → dipakai semua orang, merge ke `develop` dulu sebelum branch lain start

**Frontend scope:**
- Page: `/register`, `/login`, `/verify-email`, `/forgot-password`
- Auth context / store (global)

---

### F02 — Onboarding

**Branch:** `feature/f02-onboarding`
**Dependency:** F01 harus sudah di-merge ke `develop`

| Sub-Fitur | Detail |
|-----------|--------|
| F02.1 Basic Profile | Step 1: Nama, Institusi, Jurusan, Tahun Lulus |
| F02.2 Career Interest | Step 2: Multi-select bidang karier (1–3) |
| F02.3 First Experience Prompt | Step 3: Prompt opsional tambah experience |

**Backend scope:**
- `POST /api/onboarding/profile`
- `POST /api/onboarding/interests`
- `GET /api/career-fields` (seed data, read-only)
- Tabel: `PROFILE`, `CAREER_INTEREST`, `CAREER_FIELD`

**Frontend scope:**
- Page: `/onboarding` (stepper 3 langkah)
- Progress indicator component

---

### F03 — Experience Management

**Branch:** `feature/f03-experience`
**Dependency:** F01 selesai

| Sub-Fitur | Detail |
|-----------|--------|
| F03.1 Add / Edit Experience | Form lengkap (tipe, peran, periode, deskripsi, bukti) |
| F03.2 Experience List | Card list, search, filter by tipe |
| F03.3 Delete Experience | Konfirmasi + warning jika ada skill evidence |

**Backend scope:**
- `GET /api/experiences`
- `POST /api/experiences`
- `PUT /api/experiences/:id`
- `DELETE /api/experiences/:id`
- Tabel: `EXPERIENCE`

**Frontend scope:**
- Page: `/experience`
- Component: ExperienceCard, ExperienceForm, DeleteConfirmModal

---

### F04 — AI Skill Extraction

**Branch:** `feature/f04-ai-skill-extraction`
**Dependency:** F03 harus sudah di-merge

| Sub-Fitur | Detail |
|-----------|--------|
| F04.1 AI Analysis Job | Trigger otomatis saat experience disimpan |
| F04.2 Review Interface | Suggestion chips: accept / edit / reject per skill |
| F04.3 AI Confidence | Auto-suggest jika confidence >75%, flag jika <40% |

**Backend scope:**
- `POST /api/ai/analyze-experience` (trigger job)
- `GET /api/ai/suggestions/:job_id`
- `POST /api/ai/suggestions/:job_id/review` (bulk accept/reject)
- Integrasi LLM (Gemini/Groq) untuk ekstraksi
- Tabel: `AI_ANALYSIS_JOB`, `AI_SKILL_SUGGESTION`, `SKILL`, `USER_SKILL`, `SKILL_EVIDENCE`

**Frontend scope:**
- Component: AISkillReviewModal, SkillChip (accept/edit/reject state)
- Loading skeleton saat AI memproses

---

### F10 — Dashboard

**Branch:** `feature/f10-dashboard`
**Dependency:** F01, F03, F04 harus sudah di-merge (data minimal ada)

| Sub-Fitur | Detail |
|-----------|--------|
| Widget: Career Readiness | Score % + nama career target |
| Widget: Skill Summary | Mini graph skill count per kategori |
| Widget: Learning Rec | Top 3 rekomendasi (data dari F07, bisa placeholder dulu) |
| Widget: Opportunities | Recent match (data dari F08, bisa placeholder dulu) |
| Widget: Growth Progress | Skill ditambah bulan ini |
| Empty State | Panduan untuk user baru |

**Backend scope:**
- `GET /api/dashboard/summary` (aggregasi dari berbagai tabel)

**Frontend scope:**
- Page: `/dashboard`
- Semua widget component (standalone, bisa dikembangkan independent)
- Sidebar / navigation layout (shared layout — koordinasi dengan anggota lain sebelum bikin)

> ⚠️ **Koordinasi:** Layout/sidebar adalah shared component. Buat dulu di branch F10, lalu anggota B dan C pull dari `develop` setelah F10 merge.

---

---

# 👤 ANGGOTA B — 40%

**PIC:** *(isi nama)*
**Tanggung Jawab:** Intelligence & Career Engine

> Mengerjakan inti "kecerdasan" Growvia: profil skill, analisis gap, rekomendasi belajar berbasis AI hybrid, dan Admin Dashboard untuk pengelolaan master data.

---

### F05 — Skill Profile

**Branch:** `feature/f05-skill-profile`
**Dependency:** F04 harus sudah di-merge (USER_SKILL dan SKILL sudah ada)

| Sub-Fitur | Detail |
|-----------|--------|
| F05.1 Skill Overview | Count total, distribusi per kategori, top 5 |
| F05.2 Skill Pattern Map | Node-graph visualisasi skill (bisa pakai D3.js / vis.js) |
| F05.3 Skill Detail | Nama, level, score, list evidence yang bisa diklik |
| F05.4 Manual Add Skill | Form tambah skill manual (tanpa AI badge) |

**Backend scope:**
- `GET /api/skills/profile` (semua user skill + evidence)
- `GET /api/skills/:id`
- `POST /api/skills` (manual add)
- `PUT /api/skills/:id` (edit level)
- `DELETE /api/skills/:id`
- `GET /api/skills/graph` (data untuk visualisasi node-graph)
- Tabel: `USER_SKILL`, `SKILL`, `SKILL_EVIDENCE`

**Frontend scope:**
- Page: `/skills`
- Component: SkillCard, SkillDetailPanel, SkillGraph, AddSkillForm

---

### F06 — Career Target & Skill Gap Analysis

**Branch:** `feature/f06-career-gap`
**Dependency:** F05 harus sudah di-merge

| Sub-Fitur | Detail |
|-----------|--------|
| F06.1 Career Target Selection | Browse/search career library + custom input |
| F06.2 Required Skills View | Tampil skill yang dibutuhkan per career |
| F06.3 Skill Gap Analysis | Kategori: Strong / Develop / Missing |
| F06.4 Career Readiness Score | Formula weight-based, label tier |

**Backend scope:**
- `GET /api/career-roles` (list career dari master data)
- `GET /api/career-roles/:id/skills` (required skills)
- `POST /api/career-targets` (set target)
- `GET /api/career-targets/active`
- `POST /api/career-targets/:id/analyze` (trigger gap analysis)
- `GET /api/skill-gap/:target_id`
- Tabel: `CAREER_ROLE`, `CAREER_ROLE_SKILL`, `USER_CAREER_TARGET`, `SKILL_GAP_RESULT`

**Frontend scope:**
- Page: `/career`
- Component: CareerTargetCard, SkillGapBoard (3 kolom), ReadinessScoreGauge

---

### F07 — Learning Recommendation

**Branch:** `feature/f07-learning`
**Dependency:** F06 harus sudah di-merge (SKILL_GAP_RESULT dibutuhkan)

| Sub-Fitur | Detail |
|-----------|--------|
| F07.1 Hybrid Pipeline | Backend filter candidates → AI ranking via LLM |
| F07.2 Resource Card | Judul, platform, tipe, durasi, AI reasoning snippet |
| F07.3 Save & Track | Save resource, mark completed → update skill progress |

**Backend scope:**
- `GET /api/learning/recommendations` (hybrid: DB filter + AI ranking)
- `POST /api/learning/recommendations/generate` (trigger AI ranking)
- `POST /api/learning/saved` (save resource)
- `GET /api/learning/saved`
- `PUT /api/learning/saved/:id/complete`
- Integrasi LLM untuk ranking (panggil `LEARNING_RESOURCE` candidates → kirim ke AI → simpan ranking + reasoning)
- Tabel: `LEARNING_RESOURCE`, `RESOURCE_SKILL_TAG`, `LEARNING_RECOMMENDATION`, `USER_SAVED_RESOURCE`

**Frontend scope:**
- Page: `/learning`
- Component: ResourceCard (dengan AI reasoning), SavedResourceList, FilterChips

---

### F13 — Admin Dashboard

**Branch:** `feature/f13-admin`
**Dependency:** F01, F05, F06 harus sudah di-merge (tabel SKILL, CAREER_ROLE, LEARNING_RESOURCE, CAREER_OPPORTUNITY sudah ada)

| Sub-Fitur | Detail |
|-----------|--------|
| F13.1 Admin Login | Auth terpisah, session 8 jam |
| F13.2 Overview | Count stat: Skills, Career Paths, Resources, Opportunities |
| F13.3 Manage Skills | CRUD skill taxonomy + safe delete |
| F13.4 Manage Career Paths | CRUD career role + soft delete |
| F13.5 Manage Required Skills | CRUD mapping career ↔ skill |
| F13.6 Manage Learning Resources | CRUD resource + skill tags |
| F13.7 Manage Career Opportunities | CRUD opportunity + skill tags |

**Backend scope:**
- `POST /api/admin/auth/login`
- `GET /api/admin/overview`
- `GET|POST|PUT|DELETE /api/admin/skills`
- `GET|POST|PUT|DELETE /api/admin/career-roles`
- `GET|POST|PUT|DELETE /api/admin/career-roles/:id/skills`
- `GET|POST|PUT|DELETE /api/admin/learning-resources`
- `GET|POST|PUT|DELETE /api/admin/opportunities`
- Middleware `adminAuthMiddleware` (terpisah dari `authMiddleware` user)
- Tabel: `ADMIN`

**Frontend scope:**
- Route terpisah: `/admin/*`
- Layout admin (sidebar berbeda dari user app)
- Component: DataTable (reusable untuk semua manage page), CRUDModal

---

---

# 👤 ANGGOTA C — 20%

**PIC:** *(isi nama)*
**Tanggung Jawab:** Discovery & Identity

> Mengerjakan fitur yang paling self-contained dan tidak menjadi dependency orang lain. Semua fitur bisa dimulai setelah foundation (F01) merge.

---

### F08 — Career Opportunities

**Branch:** `feature/f08-opportunities`
**Dependency:** F01 selesai, F05/F06 bisa paralel (skill match dibaca dari USER_SKILL yang sudah ada)

| Sub-Fitur | Detail |
|-----------|--------|
| F08.1 Opportunity List | List + filter (tipe, lokasi, skill requirement) |
| F08.2 Skill Match | % match dihitung backend, highlight skill match |
| F08.3 Apply & Save | Redirect ke URL eksternal, save/unsave |

**Backend scope:**
- `GET /api/opportunities` (dengan query filter)
- `GET /api/opportunities/:id` (detail + skill match untuk user ini)
- `POST /api/opportunities/saved`
- `DELETE /api/opportunities/saved/:id`
- Tabel: `CAREER_OPPORTUNITY`, `OPPORTUNITY_SKILL_TAG`, `USER_SAVED_OPPORTUNITY`

**Frontend scope:**
- Page: `/opportunities`
- Component: OpportunityCard (dengan skill match badge), FilterSidebar, SaveButton

---

### F09 — Portfolio Builder

**Branch:** `feature/f09-portfolio`
**Dependency:** F01, F03, F05 sudah di-merge (data source portfolio)

| Sub-Fitur | Detail |
|-----------|--------|
| F09.1 Auto-populated | Compile data dari Profile, Skills, Experience, Education |
| F09.2 Preview | Split view: editor kiri, preview kanan |
| F09.3 Publish & Share | Toggle publish, generate public URL |
| F09.4 Public Portfolio | Halaman publik `/u/:slug` tanpa perlu login |

**Backend scope:**
- `GET /api/portfolio/preview` (aggregasi semua data user untuk preview)
- `PUT /api/portfolio/publish` (toggle published)
- `GET /api/public/:slug` (public endpoint, no auth)
- Tabel: baca dari `PROFILE`, `USER_SKILL`, `EXPERIENCE` — tidak ada tabel baru

**Frontend scope:**
- Page: `/portfolio` (builder view)
- Page: `/u/:slug` (public portfolio — tidak perlu sidebar app)
- Component: PortfolioSection (per section toggle), PublicPortfolioLayout

---

### F12 — Profile & Settings

**Branch:** `feature/f12-profile-settings`
**Dependency:** F01 selesai

| Sub-Fitur | Detail |
|-----------|--------|
| F12.1 Edit Profile | Ubah nama, institusi, bio, headline, avatar |
| F12.2 Account Settings | Ganti email, ganti password |
| F12.3 Privacy Settings | Toggle portfolio visibility |
| F12.4 Delete Account | Soft delete, konfirmasi 2 langkah |

**Backend scope:**
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/account/email`
- `PUT /api/account/password`
- `PUT /api/account/privacy`
- `DELETE /api/account` (soft delete)
- Upload avatar → Cloud Storage

**Frontend scope:**
- Page: `/profile` dan `/settings`
- Component: AvatarUpload, PrivacyToggle, DangerZoneSection

---

---

## 🌿 Branch Strategy

```
main
 └── develop
      ├── feature/f01-authentication      ← merge 1st (foundation)
      ├── feature/f02-onboarding          ← merge 2nd
      ├── feature/f03-experience          ← merge 3rd
      ├── feature/f04-ai-skill-extraction ← merge 4th
      ├── feature/f05-skill-profile       ← after f04
      ├── feature/f06-career-gap          ← after f05
      ├── feature/f07-learning            ← after f06
      ├── feature/f08-opportunities       ← after f01 (independent)
      ├── feature/f09-portfolio           ← after f03, f05
      ├── feature/f10-dashboard           ← after f04
      ├── feature/f12-profile-settings    ← after f01 (independent)
      └── feature/f13-admin               ← after f05, f06
```

### Aturan Branch

| Aturan | Detail |
|--------|--------|
| Dari mana branch dibuat | Selalu dari `develop` terbaru (`git checkout -b feature/fXX-nama develop`) |
| Naming convention | `feature/f[nomor]-[nama-singkat]` — huruf kecil, pisah dengan `-` |
| Merge target | Selalu ke `develop`, bukan ke `main` |
| `main` | Hanya untuk release yang sudah stabil |
| Tidak boleh | Edit file shared (middleware, schema, env) langsung dari branch fitur — buka PR ke `develop` dahulu |
| Konflik prevention | Setiap orang handle tabel yang berbeda — tidak ada dua orang yang CRUD tabel yang sama |

### Setup awal (lakukan sebelum branch fitur dibuat)

Di branch `develop`, **Anggota A** setup dulu:
- Struktur folder project
- Database schema migration (semua tabel sekaligus)
- `.env.example`
- Shared middleware: `authMiddleware`, error handler, response wrapper
- Seed data: `CAREER_FIELD`, `SKILL` awal

Setelah itu di-push ke `develop` → semua anggota pull → baru buat branch fitur masing-masing.

---

## ⚠️ Tabel Kepemilikan (Anti-Konflik)

Tabel ini memastikan tidak ada dua orang yang menulis logic untuk tabel yang sama di waktu yang sama.

| Tabel | Owner |
|-------|-------|
| `USER`, `EMAIL_VERIFICATION`, `SESSION` | Anggota A |
| `PROFILE`, `CAREER_INTEREST`, `CAREER_FIELD` | Anggota A |
| `EXPERIENCE` | Anggota A |
| `AI_ANALYSIS_JOB`, `AI_SKILL_SUGGESTION` | Anggota A |
| `SKILL` | Anggota A (create/seed) → Anggota B (read + admin CRUD) |
| `USER_SKILL`, `SKILL_EVIDENCE` | Anggota A (write saat extraction) → Anggota B (read + manage) |
| `CAREER_ROLE`, `CAREER_ROLE_SKILL` | Anggota B |
| `USER_CAREER_TARGET`, `SKILL_GAP_RESULT` | Anggota B |
| `LEARNING_RESOURCE`, `RESOURCE_SKILL_TAG` | Anggota B |
| `LEARNING_RECOMMENDATION`, `USER_SAVED_RESOURCE` | Anggota B |
| `ADMIN` | Anggota B |
| `CAREER_OPPORTUNITY`, `OPPORTUNITY_SKILL_TAG` | Anggota C |
| `USER_SAVED_OPPORTUNITY` | Anggota C |
| `NOTIFICATION` | *(v1.1 — belum dikerjakan)* |

---

## 📅 Urutan Merge yang Disarankan

```
Sprint 1  →  F01 (A) ✓ → F12 (C) bisa mulai
Sprint 2  →  F02 (A) ✓ → F03 (A) ✓
Sprint 3  →  F04 (A) ✓ → F08 (C) bisa mulai paralel
Sprint 4  →  F05 (B) ✓ → F10 (A) ✓
Sprint 5  →  F06 (B) ✓ → F09 (C) bisa mulai
Sprint 6  →  F07 (B) ✓ → F13 (B) ✓
Sprint 7  →  Testing & bugfix semua fitur
```

---

## 📝 Cara Isi Notion

Salin tabel di bawah ini sebagai **database view** di Notion. Buat database baru dengan property berikut:

| Property | Tipe | Isi |
|----------|------|-----|
| Task Title | Title | Nama fitur, contoh: `F01 — Authentication` |
| PIC | Person | Tag anggota tim |
| Division | Multi-select | Pilih dari: `Frontend`, `Backend`, `AI`, `Documentation` |
| Status | Select | `To Do` / `In Progress` / `Done` |
| Priority | Select | `High` / `Medium` / `Low` |
| Start Date | Date | Tanggal mulai |
| Deadline | Date | Estimasi selesai |
| Progress | Number (0–100) | % progress |
| Deliverable | Text | Nama branch, contoh: `feature/f01-authentication` |
| Dependency | Text | Fitur yang harus selesai dulu, contoh: `F01` |
| Notes | Text | Catatan teknis tambahan |

### Isian Notion (Copy-paste per row)

| Task Title | PIC | Division | Status | Priority | Deliverable | Dependency | Notes |
|-----------|-----|----------|--------|----------|-------------|------------|-------|
| F01 — Authentication | Anggota A | Backend, Frontend | To Do | High | `feature/f01-authentication` | — | Setup authMiddleware dulu, merge ke develop sebelum yang lain mulai |
| F02 — Onboarding | Anggota A | Backend, Frontend | To Do | High | `feature/f02-onboarding` | F01 | |
| F03 — Experience Management | Anggota A | Backend, Frontend | To Do | High | `feature/f03-experience` | F01 | Setelah merge, trigger AI otomatis dari F04 |
| F04 — AI Skill Extraction | Anggota A | Backend, Frontend, AI | To Do | High | `feature/f04-ai-skill-extraction` | F03 | Integrasi LLM (Gemini/Groq) |
| F05 — Skill Profile | Anggota B | Backend, Frontend | To Do | High | `feature/f05-skill-profile` | F04 | Graph viz pakai D3/vis.js |
| F06 — Career Target & Skill Gap | Anggota B | Backend, Frontend | To Do | High | `feature/f06-career-gap` | F05 | Formula readiness score di backend |
| F07 — Learning Recommendation | Anggota B | Backend, Frontend, AI | To Do | High | `feature/f07-learning` | F06 | Hybrid: DB filter + AI ranking |
| F08 — Career Opportunities | Anggota C | Backend, Frontend | To Do | Medium | `feature/f08-opportunities` | F01 | Skill match % dihitung backend |
| F09 — Portfolio Builder | Anggota C | Backend, Frontend | To Do | Medium | `feature/f09-portfolio` | F03, F05 | Public route `/u/:slug` no-auth |
| F10 — Dashboard | Anggota A | Backend, Frontend | To Do | High | `feature/f10-dashboard` | F04 | Koordinasi layout/sidebar dulu |
| F12 — Profile & Settings | Anggota C | Backend, Frontend | To Do | Medium | `feature/f12-profile-settings` | F01 | Avatar upload ke cloud storage |
| F13 — Admin Dashboard | Anggota B | Backend, Frontend | To Do | Medium | `feature/f13-admin` | F05, F06 | Route `/admin/*` terpisah |
