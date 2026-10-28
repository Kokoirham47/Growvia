# Rencana Implementasi Fitur F09: Portfolio Builder & Public View (/u/[slug])

## Ringkasan Eksekusi
Rencana ini menguraikan tahapan implementasi fitur **F09 (Portfolio Builder)** sesuai spesifikasi di [`docs/superpowers/specs/2026-10-26-f09-portfolio-builder-design.md`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/docs/superpowers/specs/2026-10-26-f09-portfolio-builder-design.md). Implementasi mencakup API backend, antarmuka split-view editor dashboard, halaman publik recruiter `/u/[slug]`, sistem tema, evidence modal, serta modal berbagi dan cetak PDF.

---

## Tahap 1: Kontrak Tipe Data (`src/types/portfolio.ts`)
- **Tujuan**: Mendefinisikan tipe TypeScript yang kokoh untuk data portofolio, pengaturan builder, dan respons API.
- **Tipe yang Dibuat**:
  - `PortfolioTheme`: `'royal-blue' | 'sleek-slate' | 'emerald-modern'`
  - `PortfolioSectionVisibility`: Konfigurasi visibilitas seksi (`work`, `projects`, `organisations`, `competitions`, `skills`, `education`)
  - `PublicPortfolioData`: Struktur data lengkap portofolio publik (user, profil, pengalaman, skill terverifikasi beserta bukti riil)
  - `PortfolioSettingsPayload`: Payload update pengaturan (`portfolioPublished`, `portfolioSlug`, `headline`, `bio`, `theme`, `sections`)
  - `PortfolioPreviewResponse`: Format kembalian API preview

---

## Tahap 2: Layanan Backend API
1. **`GET /api/portfolio/preview`** (`src/app/api/portfolio/preview/route.ts`):
   - Ambil data user yang sedang login via session.
   - Sertakan `profile`, `experiences` (diurutkan tanggal mulai terbaru), `userSkills` (dengan `skill` dan `skillEvidences`), serta target karier.
   - Kembalikan data lengkap untuk editor builder.

2. **`PUT /api/portfolio/settings`** (`src/app/api/portfolio/settings/route.ts`):
   - Validasi data masukan: format slug regex `^[a-z0-9-]+$`, reserved slugs, dan keunikan slug di tabel `Profile`.
   - Update `Profile.portfolioPublished`, `Profile.portfolioSlug`, `Profile.headline`, `Profile.bio`.
   - Kembalikan status sukses dan URL publik baru.

3. **`GET /api/public/[slug]`** (`src/app/api/public/[slug]/route.ts`):
   - Endpoint publik tanpa middleware auth (sudah diizinkan di `src/middleware.ts`).
   - Query profil berdasarkan `portfolioSlug` dan `portfolioPublished: true`.
   - Jika tidak ada atau privat, kembalikan HTTP 404 yang terstruktur.
   - Sanitasi data agar bebas dari data rahasia (*passwordHash*, dsb).

---

## Tahap 3: Halaman Publik Portofolio (`/u/[slug]`)
1. **`src/views/portfolio/public/PublicPortfolioHeader.tsx`**:
   - Header minimalis elegan tanpa sidebar, menampilkan brand Growvia, tombol Cetak/Ekspor PDF, dan tombol Bagikan.
2. **`src/views/portfolio/public/PublicPortfolioHero.tsx`**:
   - Avatar profil, badge *"Verified by Growvia AI"*, headline profesional, bio, universitas, jurusan, dan tautan sosial.
3. **`src/views/portfolio/public/PublicPortfolioSkills.tsx`**:
   - Grid keahlian terverifikasi dengan indikator level, skor, dan jumlah bukti nyata.
   - Modal/Popover interaktif ketika kartu skill diklik untuk melihat bukti pengalaman riil.
4. **`src/views/portfolio/public/PublicPortfolioExperiences.tsx`**:
   - Timeline interaktif dengan filter tab jenis pengalaman (*Semua, Magang, Proyek, Organisasi, Kompetisi*), tanggal, deskripsi pencapaian, dan link portofolio eksternal.
5. **`src/views/portfolio/public/PublicPortfolioFloatingDock.tsx`**:
   - Tombol melayang untuk Cetak PDF (`window.print()`) dan Berbagi Tautan.
6. **`src/views/portfolio/public/PublicPortfolioNotFound.tsx`**:
   - Tampilan ramah ketika portofolio tidak ditemukan atau sedang di-set privat oleh pemiliknya.
7. **`src/views/portfolio/public/PublicPortfolioView.tsx`**:
   - Container utama pembungkus halaman publik.
8. **`src/app/u/[slug]/page.tsx`**:
   - Route publik Next.js App Router dengan `generateMetadata` dinamis untuk Open Graph thumbnail dan SEO.

---

## Tahap 4: Antarmuka Split-View Portfolio Builder (`/portfolio`)
1. **`src/views/portfolio/PortfolioEditorPanel.tsx`**:
   - Kontrol status publikasi (Saklar Aktif / Draf).
   - Input slug kustom dengan validator live URL (`growvia.app/u/[slug]`).
   - Editor headline & ringkasan diri (bio).
   - Pemilih tema visual (3 tema: Royal Blue, Sleek Slate, Emerald Modern).
   - Saklar visibilitas seksi portofolio.
   - Tombol simpan pengaturan & feedback toast.
2. **`src/views/portfolio/PortfolioLivePreviewFrame.tsx`**:
   - Penampil pratinjau real-time dalam bingkai perangkat interaktif.
   - Toggle tampilan: 🖥️ Desktop vs 📱 Mobile.
3. **`src/views/portfolio/SharePortfolioModal.tsx`**:
   - Dialog berbagi dengan tombol Salin Tautan, tautan instan ke WhatsApp, LinkedIn, dan tampilan QR code.
4. **`src/views/portfolio/PortfolioBuilderView.tsx`**:
   - Split-screen container yang menyatukan panel editor (kiri) dan live preview (kanan).
5. **`src/app/(dashboard)/portfolio/page.tsx`**:
   - Route dashboard portofolio terproteksi auth.

---

## Tahap 5: Verifikasi & Pengujian
- **Verifikasi Tipe & Linting**:
  - `npx tsc --noEmit` -> pastikan 0 error.
  - `npx eslint` -> pastikan 0 error.
- **Pengujian End-to-End**:
  - Uji builder menggunakan akun demo `demo@growvia.id`.
  - Uji perubahan slug dan visibilitas seksi secara live.
  - Buka `/u/budi-pratama-demo` di jendela incognito (tanpa login) untuk memastikan halaman publik dapat diakses recruiter.
  - Uji fitur ekspor/cetak PDF dan modal share link.
