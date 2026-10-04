# GROWVIA — PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Version 1.1 · Status: Draft**

---

## 01. Overview

### Product Summary

Growvia adalah AI-powered skill ecosystem berbasis web yang dirancang untuk mahasiswa dan fresh graduate. Platform ini membantu pengguna mengubah pengalaman organisasi, kepanitiaan, magang, dan proyek menjadi skill yang terstruktur — kemudian menghubungkan skill tersebut dengan peluang karier, rekomendasi pembelajaran, dan portfolio profesional.

### Problem Statement

Mahasiswa dan fresh graduate sering memiliki banyak pengalaman berharga, namun kesulitan untuk:
1. Mengidentifikasi skill apa yang mereka miliki dari pengalaman tersebut
2. Memahami gap antara skill mereka dan kebutuhan karier yang dituju
3. Menemukan cara belajar yang relevan untuk mengisi gap tersebut
4. Mempresentasikan skill mereka secara profesional kepada recruiter

### Vision

Menjadi platform karier terlengkap bagi generasi muda Indonesia yang menghubungkan pengalaman → skill → karier dalam satu ekosistem berbasis AI.

### Target User

| Segment | Deskripsi |
|---------|-----------|
| Primary | Mahasiswa aktif semester 4–8, aktif di organisasi/kepanitiaan |
| Secondary | Fresh graduate 0–2 tahun pengalaman kerja |
| Tertiary | Career switcher yang ingin memetakan ulang skill mereka |

---

## 02. Goals & Success Metrics

### Product Goals

1. Pengguna dapat mengekstrak dan memvalidasi skill dari pengalaman mereka dalam < 5 menit
2. Pengguna memahami career readiness score mereka dan apa yang perlu ditingkatkan
3. Pengguna dapat membangun portfolio yang siap dibagikan ke recruiter

### Key Metrics

| Metric | Target (6 Bulan) |
|--------|-----------------|
| Registered Users | 5.000 |
| Skill Profiles Completed | 60% dari registered users |
| Career Target Set | 70% dari completed profiles |
| Portfolio Published | 40% dari users dengan career target |
| Monthly Active Users | 35% dari registered users |
| Avg. Session Duration | ≥ 8 menit |

---

## 03. User Flow Summary

Berdasarkan flowchart yang telah didefinisikan, terdapat 9 alur utama:

1. **Authentication** — Register → Verify Email → Login
2. **Onboarding** — Basic Profile → Career Interest → First Experience (optional)
3. **Experience Management** — CRUD experience + AI Skill Extraction
4. **Skill Profile** — View, manage, dan link skill ke evidence
5. **Career Target** — Set career goal → view required skills
6. **Skill Gap Analysis** — Compare user skills vs career requirements → Readiness Score
7. **Learning** — AI-personalized resource recommendation berdasarkan gap
8. **Career Opportunities** — Browse, filter, dan simpan peluang kerja/magang
9. **Portfolio Builder** — Compile semua data → preview → publish → share

---

## 04. Features & Requirements

---

### F01 — Authentication

**Priority:** P0 (Must Have)

#### F01.1 Register
- Form: Nama lengkap, Email, Password (min. 8 karakter, 1 huruf besar, 1 angka)
- Validasi real-time pada setiap field
- Setelah submit: kirim email verifikasi
- State: loading saat submit, error jika data invalid

#### F01.2 Email Verification
- Token verifikasi valid selama 24 jam
- Opsi resend email (cooldown 60 detik)
- Redirect ke login setelah berhasil verify

#### F01.3 Login
- Form: Email + Password
- Opsi "Lupa Password" → reset via email
- Error state: "Email atau password salah" (jangan sebutkan mana yang salah)
- Redirect ke Onboarding jika profil belum lengkap, ke Dashboard jika sudah

**Acceptance Criteria:**
- [ ] User tidak bisa login tanpa verifikasi email
- [ ] Form menampilkan pesan error yang jelas dan actionable
- [ ] Session tersimpan (stay logged in) selama 30 hari

---

### F02 — Onboarding

**Priority:** P0 (Must Have)

Onboarding adalah first impression. Harus terasa ringan dan cepat (< 3 menit).

#### F02.1 Basic Profile
- Fields: Nama, Institusi pendidikan, Jurusan, Tahun kelulusan
- Progress indicator (step 1 dari 3)

#### F02.2 Career Interest
- Multiple select dari daftar bidang karier (contoh: Product, Engineering, Marketing, Design, Finance, dll.)
- Minimum 1, maksimum 3 pilihan
- User bisa skip → pilih nanti dari Career menu

#### F02.3 First Experience (Optional)
- Prompt: "Punya pengalaman yang ingin kamu tambahkan sekarang?"
- Jika Yes → buka Experience Form
- Jika No → masuk ke Dashboard dengan empty state yang friendly

**Acceptance Criteria:**
- [ ] Onboarding dapat diselesaikan dalam 3 langkah
- [ ] Setiap langkah bisa dilewati kecuali Basic Profile
- [ ] User langsung masuk Dashboard setelah onboarding selesai

---

### F03 — Experience Management

**Priority:** P0 (Must Have)

Experience adalah sumber utama data di Growvia. Kualitas experience input menentukan kualitas AI output.

#### F03.1 Experience Form
Fields yang wajib diisi:
- Judul pengalaman (contoh: "Ketua Divisi Acara Bincang Karir 2026")
- Tipe: Organisasi / Kepanitiaan / Magang / Freelance / Proyek / Kompetisi / Lainnya
- Peran / Posisi
- Tanggal mulai – selesai (atau centang "Sedang berlangsung")
- Deskripsi (min. 50 karakter, maks. 1000 karakter)

Fields opsional:
- Nama institusi / organisasi
- Link bukti (sertifikat, foto, GitHub, dll.)
- Tags manual

#### F03.2 Experience List (Inbox)
- Tampil sebagai card list, sorted by date (terbaru dulu)
- Quick actions: Edit, Delete, View Detail
- Search dan filter by tipe

#### F03.3 Delete Experience
- Konfirmasi dialog sebelum delete
- Jika experience terhubung ke skill → tampilkan warning bahwa skill evidence akan terpengaruh

**Acceptance Criteria:**
- [ ] User bisa menambah, melihat, mengedit, dan menghapus experience
- [ ] Form memvalidasi input sebelum submit
- [ ] Setelah save, AI Skill Analysis otomatis berjalan

---

### F04 — AI Skill Extraction

**Priority:** P0 (Must Have)

Ini adalah fitur inti Growvia. AI menganalisis deskripsi experience dan mengekstrak skill yang relevan.

#### F04.1 Proses Ekstraksi
Pipeline:
1. **Extract** — Identifikasi skill dari teks deskripsi
2. **Normalize** — Standardisasi nama skill (contoh: "public speaking" → "Public Speaking")
3. **Classify** — Kategorikan skill (Hard Skill / Soft Skill / Leadership / Technical)
4. **Score** — Estimasi relevansi skill berdasarkan konteks

#### F04.2 Review Interface
- Tampilkan hasil AI sebagai suggestion chips
- User bisa: Accept semua · Edit nama · Reject chip individual
- AI Badge ditampilkan pada setiap skill yang dihasilkan AI
- Setelah review → skill disimpan dan di-link ke experience sebagai evidence

#### F04.3 AI Confidence
- Skill dengan relevansi tinggi (>75%) → auto-suggest accept
- Skill dengan relevansi rendah (<40%) → ditampilkan terpisah dengan label "Perlu konfirmasi"

**Acceptance Criteria:**
- [ ] AI menghasilkan minimal 3 skill suggestion per experience (jika deskripsi ≥ 50 karakter)
- [ ] User dapat menolak atau mengubah semua saran AI
- [ ] Skill yang diterima otomatis ter-link ke experience sebagai evidence
- [ ] Proses analisis selesai dalam < 10 detik

---

### F05 — Skill Profile

**Priority:** P0 (Must Have)

#### F05.1 Skill Overview
- Total skill count
- Distribusi per kategori (Hard Skill, Soft Skill, Technical, Leadership)
- Top 5 skill berdasarkan evidence count

#### F05.2 Skill Pattern Map
- Visualisasi berbasis node/graph
- Node = skill, edge = koneksi antar skill (skill yang sering muncul bersama)
- Color-coded berdasarkan kategori

#### F05.3 Skill Detail
- Nama skill, level, score
- List experience sebagai evidence
- Edit level secara manual
- Remove skill (dengan konfirmasi)

#### F05.4 Manual Add Skill
- Form: nama skill, kategori, level, evidence (opsional)
- Skill yang ditambah manual tidak memiliki AI badge

**Acceptance Criteria:**
- [ ] Skill Profile menampilkan semua skill user dengan evidence
- [ ] User bisa manage (add, edit, remove) skill secara manual
- [ ] Skill linked ke experience bisa diklik untuk melihat detail experience

---

### F06 — Career Target & Skill Gap Analysis

**Priority:** P1 (Should Have)

#### F06.1 Career Target Selection
- Browse dari library karier (contoh: Product Manager, Data Analyst, UI/UX Designer, Software Engineer, dll.)
- Search by nama karier
- Custom input jika karier tidak ditemukan di library

#### F06.2 Required Skills per Career
- Setiap karier memiliki daftar required skills dengan weight (penting/sangat penting/wajib)
- Data ini dapat dikurasi secara manual dan diperkaya AI

#### F06.3 Skill Gap Analysis
- Bandingkan user skill vs career requirements
- Output 3 kategori:
  - **Strong Skills:** User sudah punya, level cukup
  - **Skills to Develop:** User punya tapi level perlu ditingkatkan
  - **Missing Skills:** User belum punya sama sekali

#### F06.4 Career Readiness Score
- Formula: (matched skills × weight) / total required skills weight × 100
- Ditampilkan sebagai persentase + progress bar
- Label: Starter (0–39%) · Developing (40–69%) · Ready (70–89%) · Top Candidate (90–100%)

**Acceptance Criteria:**
- [ ] User bisa set, ganti, atau hapus career target
- [ ] Skill gap ditampilkan dengan kategori Strong / Develop / Missing
- [ ] Career Readiness Score diperbarui otomatis saat skill berubah

---

### F07 — Learning Recommendation

**Priority:** P1 (Should Have)

> **Data source:** Learning Resources berasal dari Admin (input manual via Admin Dashboard) atau integrasi API eksternal di masa depan. AI tidak membuat resource baru — AI hanya melakukan ranking dan personalisasi dari candidate resources yang sudah ada di database.

#### F07.1 Hybrid Recommendation Pipeline
Proses rekomendasi menggunakan pendekatan hybrid:
1. **Candidate Retrieval (Backend)** — Backend mengambil candidate resources dari `LEARNING_RESOURCE` berdasarkan skill tag yang cocok dengan skill gap user (Missing + Develop)
2. **AI Ranking (LLM)** — AI (Gemini/Groq) menerima daftar candidate resources beserta konteks user (skill gap, career target, level) dan memberikan ranking + reasoning singkat
3. **Output** — Rekomendasi ditampilkan ke user dengan urutan hasil AI ranking; reasoning AI ditampilkan sebagai sub-teks ("Direkomendasikan karena…")

AI hanya memberikan ranking dan reasoning — bukan sumber data resource.

#### F07.2 Resource Card
- Judul, platform, tipe (course/artikel/video), durasi, level kesulitan
- Skill yang ditarget
- AI reasoning snippet: "Direkomendasikan karena cocok untuk mengisi gap Machine Learning kamu"
- Tombol "Mulai Belajar" → buka link eksternal

#### F07.3 Save & Track
- User bisa save resource ke daftar pribadi
- Mark as completed → update skill progress

**Acceptance Criteria:**
- [ ] Minimum 3 rekomendasi per missing/develop skill (jika resource tersedia di database)
- [ ] Resource dapat disimpan dan diakses kembali
- [ ] Menyelesaikan resource mengupdate skill progress di Skill Profile
- [ ] AI reasoning ditampilkan per resource card
- [ ] Jika candidate resources < 3, sistem menampilkan semua yang tersedia tanpa error

---

### F08 — Career Opportunities

**Priority:** P1 (Should Have)

> **Data source:** Career Opportunities berasal dari Admin (input manual via Admin Dashboard) atau integrasi API eksternal di masa depan. Skill match dihitung oleh backend — bukan AI.

#### F08.1 Opportunity List
- Source: data yang diinput Admin atau integrasi API eksternal (Internship, Part-time, Full-time, Freelance, Kompetisi)
- Filter: tipe, lokasi, skill requirement, company size

#### F08.2 Skill Match
- Setiap opportunity menampilkan % match dengan skill user
- Highlight skill yang sudah dimiliki vs yang belum

#### F08.3 Apply & Save
- Apply → redirect ke platform eksternal
- Save → masuk ke Saved Opportunities
- Tidak ada fitur apply langsung di Growvia v1

**Acceptance Criteria:**
- [ ] Opportunity list dapat difilter
- [ ] Skill match % akurat berdasarkan skill profile user
- [ ] User bisa save dan unsave opportunity

---

### F09 — Portfolio Builder

**Priority:** P1 (Should Have)

#### F09.1 Auto-populated Portfolio
Growvia mengumpulkan data dari:
- Profile & bio
- Skills (dengan evidence)
- Experiences
- Education

#### F09.2 Portfolio Preview
- Preview tampilan public portfolio sebelum publish
- User bisa edit section secara langsung dari preview

#### F09.3 Publish & Share
- Setelah publish → generate public URL (`growvia.app/u/username`)
- Share sebagai link
- Export sebagai PDF (v1.1)

**Acceptance Criteria:**
- [ ] Portfolio auto-populated dari data yang sudah diisi
- [ ] Public URL dapat diakses tanpa login
- [ ] User bisa unpublish portfolio kapan saja

---

### F10 — Dashboard

**Priority:** P0 (Must Have)

Dashboard adalah homebase pengguna. Harus communicative dalam < 5 detik.

**Widgets (prioritas tampilan):**
1. Career Readiness Score (dengan nama career target)
2. Skill Pattern Map (mini)
3. Top 3 Learning Recommendations
4. Recent Career Opportunities (berdasarkan skill match)
5. Growth Progress (skill added this month)
6. Shortcuts ke fitur utama

**Acceptance Criteria:**
- [ ] Dashboard menampilkan ringkasan status karier user
- [ ] Setiap widget bisa diklik untuk masuk ke halaman terkait
- [ ] Empty state yang jelas untuk pengguna baru

---

### F11 — Notifications

**Priority:** P2 (Nice to Have)**

| Tipe | Trigger | Channel |
|------|---------|---------|
| Skill Update | AI selesai menganalisis experience | In-app |
| Learning Reminder | 3 hari tidak buka learning | In-app + Email |
| New Opportunity | Peluang baru match >70% | In-app |
| Portfolio View | Ada yang melihat portfolio | In-app |

---

### F12 — Profile & Settings

**Priority:** P0 (Must Have)

- Edit basic profile
- View public profile (preview sebagai recruiter)
- Account settings: email, password
- Privacy settings: siapa yang bisa lihat portfolio
- Notification preferences
- Delete account (soft delete, data retained 30 hari)

---

### F13 — Admin Dashboard

**Priority:** P1 (Should Have)

Admin Dashboard adalah interface internal untuk mengelola master data yang digunakan oleh sistem rekomendasi Growvia. Admin Dashboard bukan fitur user-facing — aksesnya terpisah dari aplikasi utama dan hanya diperuntukkan bagi tim pengelola Growvia.

> **Scope Admin MVP:** Admin hanya mengelola master data. Tidak ada analytics kompleks, role management multi-level, CMS, audit system kompleks, atau permission system berlapis.

#### Arsitektur Data & Tanggung Jawab

| Layer | Tanggung Jawab |
|-------|---------------|
| **Admin** | Mengelola master data: Skills, Career Paths, Required Skills, Learning Resources, Career Opportunities |
| **Backend** | Filtering kandidat resource berdasarkan skill gap, kalkulasi skill match score, business logic |
| **AI (LLM)** | Ranking dan personalisasi dari kandidat resource yang sudah ada; memberikan reasoning — bukan membuat data baru |
| **User** | Menerima rekomendasi, tetap memiliki kontrol penuh (accept/edit/reject) terhadap semua output AI |

#### F13.1 Admin Login
- Form: Email + Password (terpisah dari auth user biasa)
- Tidak ada register publik — akun admin dibuat secara internal
- Session admin independent dari session user

**Acceptance Criteria:**
- [ ] Admin dapat login dengan kredensial yang valid
- [ ] Halaman admin tidak dapat diakses tanpa autentikasi admin
- [ ] Session admin expire setelah 8 jam inaktif

#### F13.2 Admin Dashboard Overview
Halaman utama setelah login menampilkan ringkasan jumlah master data:
- Total Skills terdaftar
- Total Career Paths (Roles) aktif
- Total Learning Resources aktif
- Total Career Opportunities aktif

**Acceptance Criteria:**
- [ ] Dashboard menampilkan count masing-masing master data secara akurat

#### F13.3 Manage Skills (Skill Taxonomy)
CRUD untuk master data skill yang menjadi referensi global seluruh sistem.

- Tampilkan daftar skill dengan kolom: Nama, Kategori, Normalized Name, Tanggal dibuat
- Filter by kategori (hard_skill / soft_skill / technical / leadership)
- Search by nama skill
- Add skill: form Nama, Kategori, Normalized Name
- Edit skill: ubah nama, kategori
- Delete skill: hanya jika skill tidak digunakan oleh user, career role, atau resource (tampilkan warning jika digunakan)

**Acceptance Criteria:**
- [ ] Admin dapat melakukan CRUD skill
- [ ] Sistem mencegah delete skill yang masih digunakan dengan pesan informatif
- [ ] Normalized name di-generate otomatis dari nama (lowercase, tanpa spasi) tapi bisa diedit manual

#### F13.4 Manage Career Paths
CRUD untuk master data career role/path yang menjadi target karier pengguna.

- Tampilkan daftar career role: Nama, Industri, Jumlah Required Skills, Status aktif
- Add / Edit career role: Nama, Slug, Industri, Deskripsi
- Soft delete (nonaktifkan) — career role yang sudah dipilih user tidak bisa dihapus permanen
- Navigasi ke halaman manage required skills untuk role tersebut

**Acceptance Criteria:**
- [ ] Admin dapat membuat, mengedit, dan menonaktifkan career role
- [ ] Career role yang dinonaktifkan tidak muncul di career library user

#### F13.5 Manage Career Required Skills
Kelola mapping antara career role dan skill yang dibutuhkan.

- Tampilkan per career role: daftar skill dengan importance dan min_level
- Add required skill: pilih skill dari dropdown (dari master SKILL), set importance dan min_level
- Edit importance / min_level
- Remove required skill dari career role

**Acceptance Criteria:**
- [ ] Admin dapat menambah, mengubah, dan menghapus required skill per career role
- [ ] Perubahan required skill otomatis mempengaruhi skill gap calculation user yang memiliki career target tersebut (re-calculate triggered on next user request)

#### F13.6 Manage Learning Resources
CRUD untuk master data learning resource yang menjadi kandidat rekomendasi.

- Tampilkan daftar resource: Judul, Platform, Tipe, Difficulty, Skill Tags, Sumber (admin / api_import), Status aktif
- Add resource: Judul, Platform, URL, Tipe, Difficulty, Durasi, Rating, Skill Tags (multi-select dari master SKILL)
- Edit resource
- Nonaktifkan resource (soft delete) — resource nonaktif tidak muncul di rekomendasi user

**Acceptance Criteria:**
- [ ] Admin dapat melakukan CRUD learning resource
- [ ] Setiap resource harus memiliki minimal 1 skill tag
- [ ] Resource nonaktif tidak masuk ke candidate pool rekomendasi

#### F13.7 Manage Career Opportunities
CRUD untuk master data career opportunity.

- Tampilkan daftar opportunity: Judul, Perusahaan, Tipe, Deadline, Sumber (admin / api_import), Status aktif
- Add opportunity: Judul, Perusahaan, Lokasi, Tipe, URL, Deskripsi, Deadline, Skill Tags
- Edit opportunity
- Nonaktifkan / tandai sebagai expired

**Acceptance Criteria:**
- [ ] Admin dapat melakukan CRUD career opportunity
- [ ] Opportunity dengan deadline yang telah lewat otomatis ter-flag (is_active = false) oleh sistem scheduler
- [ ] Opportunity nonaktif tidak muncul di daftar user

---

## 05. Non-Functional Requirements

### Performance
- First Contentful Paint (FCP): < 1.5 detik
- Time to Interactive (TTI): < 3 detik
- AI skill extraction response: < 10 detik

### Security
- HTTPS enforced
- Password di-hash dengan bcrypt
- JWT token dengan expiry 30 hari untuk user (refresh token)
- Admin session expire setelah 8 jam inaktif
- Admin endpoint diproteksi middleware role check (`role = admin`)
- Rate limiting pada semua auth endpoints

### Scalability
- Arsitektur mendukung 10.000 concurrent users
- AI processing queue untuk mencegah overload

### Accessibility
- WCAG 2.1 Level AA
- Screen reader compatible untuk main flows

### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS 14+, Android 10+

---

## 06. Out of Scope (v1.0)

- Aplikasi mobile native (iOS/Android) → post v1
- PDF export portfolio → v1.1
- Direct apply ke job (hanya redirect)
- Social features (follow user, komentar)
- Employer-side dashboard
- Multi-language (English) → hanya Bahasa Indonesia untuk v1
- Offline mode
- Admin: analytics kompleks (user growth chart, funnel, heatmap)
- Admin: role management multi-level (hanya satu level admin di v1)
- Admin: CMS atau content editor artikel
- Admin: audit log sistem kompleks
- Admin: import data massal via CSV/Excel → v1.2
- Integrasi API eksternal job board / learning platform → v1.2 (v1 manual input admin)

---

## 07. Dependencies

| Dependency | Kegunaan |
|-----------|---------|
| LLM API (Gemini / Groq) | AI skill extraction dari experience; AI ranking & reasoning untuk learning recommendation |
| Email service (Resend / SendGrid) | Verifikasi email, notifikasi |
| Cloud storage (S3 / GCS) | Upload bukti experience, avatar |
| CDN | Distribusi asset statis |

> **Catatan:** Job board API / scraper dihapus dari v1. Career Opportunities di v1 diinput manual oleh Admin. Integrasi API eksternal dijadwalkan untuk v1.2.

---

## 08. Assumptions

1. Pengguna memiliki akses internet stabil
2. Pengguna berbahasa Indonesia
3. Master data (Skills, Career Paths, Required Skills, Learning Resources, Career Opportunities) dikurasi Admin sebelum platform launch — sistem rekomendasi tidak berjalan jika database master data kosong
4. Admin adalah tim internal Growvia — tidak ada pendaftaran admin dari publik
5. AI berfungsi sebagai layer intelligence (ranking/personalization), bukan sumber data utama
6. Monetisasi bukan prioritas v1 (platform gratis)

---

## 09. Open Questions

| # | Pertanyaan | Owner | Deadline |
|---|-----------|-------|---------|
| 1 | Apakah perlu social login (Google)? | Product | Sprint 1 |
| 2 | ~~Siapa yang mengkurasi career requirement library?~~ → **Resolved:** Tim Admin Growvia via Admin Dashboard | Content | — |
| 3 | Bagaimana model bisnis jangka panjang? | Business | Q3 |
| 4 | ~~Apakah Growvia menyimpan data resume eksternal?~~ → **Resolved:** Tidak di v1; hanya data yang diinput user & admin | Engineering | — |
| 5 | LLM mana yang digunakan untuk ranking rekomendasi — Gemini atau Groq? Perlu benchmark latency keduanya | Engineering | Sprint 2 |
| 6 | Apakah Admin Dashboard perlu UI terpisah (subdomain `admin.growvia.app`) atau cukup route terlindungi di app yang sama? | Engineering | Sprint 1 |

---

## 10. Release Milestones

| Milestone | Scope | Target |
|-----------|-------|--------|
| Alpha | F01 (Auth) + F02 (Onboarding) + F03 (Experience) + F04 (AI Skill) + **F13.1–F13.3** (Admin Login + Manage Skills) | Month 2 |
| Beta | + F05 (Skill Profile) + F06 (Career Gap) + F10 (Dashboard) + **F13.4–F13.5** (Admin Career Paths & Required Skills) | Month 4 |
| v1.0 | + F07 (Learning) + F08 (Opportunities) + F09 (Portfolio) + F12 (Settings) + **F13.6–F13.7** (Admin Learning Resources & Opportunities) | Month 6 |
| v1.1 | F11 (Notifications) + PDF Export + Performance optimization + External API integration untuk Learning & Opportunities | Month 8 |

> **Catatan:** Admin Dashboard (F13) paralel dengan development fitur user. Alpha sudah harus bisa input master data Skills agar AI Skill Extraction bisa berjalan dengan normalisasi yang benar.
