# Spesifikasi Desain Fitur F09: Portfolio Builder & Public View (/u/[slug])

## 1. Ringkasan Eksekutif & Tujuan Bisnis
Fitur **Portfolio Builder** (F09) adalah generator portofolio digital berbasis web otomatis (*Auto-populated Portfolio*) bagi mahasiswa dan pencari kerja di ekosistem Growvia. Portofolio mengompilasi data yang sudah ada di sistem—profil, riwayat pengalaman (*magang, proyek, organisasi, kompetisi*), dan keahlian berbasis bukti nyata (*evidence-backed skills*)—menjadi halaman web elegan siap sebar (`/u/[slug]`) tanpa perlu input berulang.

Fitur ini menjawab pain point utama recruiter: resume sering kali memuat klaim sepihak tanpa bukti. Di Growvia, setiap skill terhubung langsung dengan proyek atau pengalaman riil yang memvalidasinya.

---

## 2. Arsitektur & Alur Navigasi

```
                                 [ Pengguna Login ]
                                         │
                                         ▼
                    Dashboard: /portfolio (Portfolio Builder)
                    ┌───────────────────────────────────────┐
                    │  Panel Kiri: Editor Kontrol           │
                    │  - Status Publikasi (Publish Switch)  │
                    │  - Kustomisasi Slug URL (/u/:slug)    │
                    │  - Headline & Bio                     │
                    │  - Pilihan Tema (3 Opsi)              │
                    │  - Toggle Visibilitas Seksi           │
                    ├───────────────────────────────────────┤
                    │  Panel Kanan: Live Preview Real-time  │
                    │  - Frame Responsif (Desktop / Mobile) │
                    │  - Simulasi Langsung Tanpa Reload     │
                    └───────────────────────────────────────┘
                                         │
                                         ▼
                               [ Toggle Publish: ON ]
                                         │
                                         ▼
             URL Publik Terbuka Untuk Recruiter: /u/[slug]
                    ┌───────────────────────────────────────┐
                    │  Tampilan Web Publik Mandiri          │
                    │  - Tanpa Sidebar Dashboard            │
                    │  - Akses Publik Tanpa Login           │
                    │  - Header & Profil Mahasiswa          │
                    │  - Lencana "Verified by Growvia AI"   │
                    │  - Evidence-backed Skill Cards        │
                    │  - Timeline Pengalaman & Tautan Bukti │
                    │  - Floating Bar: Print PDF & Share    │
                    └───────────────────────────────────────┘
```

---

## 3. Spesifikasi Rute & Layanan Backend API

### 3.1 `GET /api/portfolio/preview` (Autentikasi Diperlukan)
- **Tujuan**: Mengambil seluruh data user untuk keperluan editor builder:
  - Profil (`headline`, `bio`, `institution`, `major`, `graduationYear`, `portfolioSlug`, `portfolioPublished`).
  - Pengalaman aktif (`experiences` diurutkan dari terbaru).
  - Keahlian user (`userSkills` lengkap dengan `skill` dan `skillEvidences` yang terhubung ke `experience`).
  - Target karier (`careerTarget` aktif).
- **Format Respons**:
```json
{
  "success": true,
  "data": {
    "user": { "name": "Budi Pratama", "email": "demo@growvia.id", "avatarUrl": "..." },
    "profile": {
      "headline": "Frontend Web Engineer & AI Enthusiast",
      "bio": "...",
      "institution": "Universitas Indonesia",
      "major": "Ilmu Komputer",
      "graduationYear": 2026,
      "portfolioSlug": "budi-pratama-demo",
      "portfolioPublished": true
    },
    "experiences": [...],
    "skills": [...],
    "careerTarget": { "roleName": "Frontend Web Engineer", "readinessScore": 84 }
  }
}
```

### 3.2 `PUT /api/portfolio/settings` (Autentikasi Diperlukan)
- **Tujuan**: Memperbarui status publikasi, headline, bio, dan slug kustom.
- **Validasi Slug**:
  - Format: huruf kecil, angka, dan tanda hubung (`^[a-z0-9-]+$`, panjang 3-40 karakter).
  - Reserved keywords yang dilarang: `admin`, `api`, `login`, `register`, `home`, `dashboard`, `portfolio`, `settings`, `u`, `auth`.
  - Pengecekan keunikan: memastikan slug belum dipakai pengguna lain di tabel `Profile`.
- **Payload**:
```json
{
  "portfolioPublished": true,
  "portfolioSlug": "budi-pratama",
  "headline": "Frontend Web Engineer | React & Next.js",
  "bio": "Mahasiswa tingkat akhir..."
}
```

### 3.3 `GET /api/public/[slug]` (Publik / Tanpa Login)
- **Tujuan**: Mengambil data portofolio publik berdasarkan slug.
- **Kondisi**:
  - Harus cocok dengan `Profile.portfolioSlug`.
  - `Profile.portfolioPublished` harus bernilai `true`.
  - Jika tidak ditemukan atau belum dipublikasikan, kirimkan HTTP 404 (`PORTOFOLIO_NOT_FOUND` / `PORTOFOLIO_PRIVATE`).
- **Keamanan**:
  - Hapus data sensitif (seperti password hash, email verification token, refresh token).
  - Hanya sertakan data yang relevan untuk recruiter.

---

## 4. Spesifikasi Desain Antarmuka Frontend

### 4.1 Portfolio Builder Dashboard (`/portfolio`)
- **Header Builder**:
  - Judul: "AI Portfolio Builder".
  - Subtitle: "Bangun portofolio digital berbasis bukti nyata secara instan untuk recruiter industri tech."
  - Badges: Status Portofolio (`Aktif Dipublikasikan` / `Draf Privat`), Tombol Salin Tautan Cepat.
- **Split-View Editor Layout**:
  - **Panel Kiri (Lebar: ~45% Desktop, Sticky Scroll)**:
    - Card 1: **Status & Alamat Tautan Publik** (Toggle Switch Publish, Input Slug dengan live feedback URL `growvia.app/u/:slug`).
    - Card 2: **Headline & Ringkasan Diri** (Input headline profesional, textarea bio).
    - Card 3: **Tema Visual Portofolio** (3 Pilihan: `Royal Blue`, `Sleek Slate`, `Emerald Modern`).
    - Card 4: **Visibilitas Seksi** (Toggle switch untuk: Magang & Kerja, Proyek Mandiri, Organisasi, Prestasi & Kompetisi, Bukti Keahlian).
    - Card 5: **Aksi Utama** (Tombol "Simpan Perubahan", "Buka Halaman Publik", "Bagikan Portofolio").
  - **Panel Kanan (Lebar: ~55% Desktop, Interactive Device Frame)**:
    - Bar Navigasi Frame: Toggle Mode Pratinjau (🖥️ Desktop vs 📱 Mobile Device Frame).
    - Refresh/Sync Indicator real-time.
    - Kontainer scrollable dengan border frame gawai yang menampilkan rendered preview secara langsung.

### 4.2 Halaman Publik (`/u/[slug]`)
- **Tata Letak**:
  - Standalone, mandiri, tanpa navbar/sidebar dashboard.
  - Navbar publik minimalis dengan logo Growvia, tombol "Cetak / Simpan PDF", dan tombol "Bagikan".
- **Hero Section**:
  - Foto avatar lingkaran dengan ring gradien tema.
  - Nama lengkap, headline profesional, badge universitas & jurusan.
  - Badge verifikasi resmi: *"Verified Talent by Growvia AI"*.
  - Link profil sosial (GitHub, LinkedIn, Website jika tersedia).
- **Evidence-Backed Skills Section**:
  - Pengelompokan kategori: Technical, Hard Skills, Soft Skills, Leadership.
  - Setiap kartu keahlian menampilkan tingkat kemahiran (*Level* & *Score*), serta badge *"Berdasarkan X Bukti Nyata"*.
  - Interaksi klik kartu skill menampilkan popover/modal bukti pengalaman yang relevan.
- **Interactive Experience Timeline**:
  - Tab kategori (*Semua*, *Magang*, *Proyek*, *Organisasi*, *Kompetisi*).
  - Kartu pengalaman dengan format tanggal, institusi, role, deskripsi pencapaian, dan tombol bukti tautan eksternal (*proofUrl*).
- **Floating Action Dock**:
  - Tombol melayang di pojok kanan bawah:
    - 🖨️ Cetak / Ekspor PDF.
    - 🔗 Bagikan Tautan (Salin, WhatsApp, LinkedIn).
- **Footer Publik**:
  - Banner ajakan: *"Ingin membuat portofolio terverifikasi berbasis bukti seperti ini? Buat di Growvia"*.

---

## 5. Tema Visual yang Didukung
1. **Royal Blue (Default)**:
   - Primary: `#2563EB`, Akses: Indigo/Cyan, Latar: Pure White / Dark Slate 950.
   - Karakter: Modern Tech, Korporat & Startup Terpercaya.
2. **Sleek Slate (Minimalist)**:
   - Primary: `#0F172A`, Akses: Zinc/Silver, Latar: Clean Neutral.
   - Karakter: Editorial, Elegan, Monokromatik Premium.
3. **Emerald Modern**:
   - Primary: `#059669`, Akses: Teal/Mint, Latar: Soft Emerald Hue.
   - Karakter: Segar, Dinamis, Inovatif.

---

## 6. Standar Kualitas & Rencana Verifikasi
- **TypeScript**: `npx tsc --noEmit` wajib bebas dari error tipe.
- **ESLint**: `npx eslint` wajib bersih dari pelanggaran kode.
- **Responsivitas**: Teruji pada layar desktop (>= 1280px) dan mobile (< 640px).
- **SEO & Social Share**: Meta tags Open Graph (`og:title`, `og:description`, `og:image`) terkonfigurasi untuk preview tautan di WhatsApp dan LinkedIn.
