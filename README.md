# 🌐 Feature: F09 — Portfolio Builder & Public View

> **Branch:** `feature/f09-portfolio`  
> **PIC / Assignee:** Anggota C (Beban: 20% — *Discovery & Identity*)  
> **Prioritas:** P1 (Should Have)  
> **Dependency:** F01 (Auth), F03 (Experience), dan F05 (Skill Profile) sudah di-merge  
> **Target Merge:** `develop` (Merge ke-9 — *Halaman Publik Bukti Nyata*)  
> **Dokumen Terkait:** [PRD (F09)](./plan-md/prd.md#f09--portfolio-builder) · [Task Management](./plan-md/task-management.md#f09--portfolio) · [ERD](./plan-md/erd_growvia.md)

---

## 📌 Deskripsi Fitur

Portfolio Builder adalah alat pembuatan portofolio digital otomatis (*Auto-populated Portfolio*) bagi mahasiswa dan fresh graduate. Pengguna tidak perlu mengetik ulang riwayat hidup dari awal: sistem secara cerdas mengompilasi profil dasar, keahlian terverifikasi lengkap dengan bukti pengalaman (*evidence-backed skills*), rekam jejak organisasi, dan proyek ke dalam halaman web portofolio profesional yang siap dipublikasikan dan dibagikan kepada recruiter (`/u/:slug`).

---

## 🎯 Spesifikasi Kebutuhan & Sub-Fitur (PRD)

```text
Data Terisi: Profil (F02) + Pengalaman (F03) + Keahlian & Bukti (F05)
                                 │
                                 ▼
         [ F09.1 Auto-compilation ke Portfolio Builder ]
                                 │
                                 ▼
      [ F09.2 Split View Editor (Kiri: Pengaturan | Kanan: Live Preview) ]
                                 │
                                 ▼
            [ F09.3 Toggle Publish ➔ Generate URL Unik ]
                                 │
                                 ▼
       [ F09.4 Halaman Portofolio Publik: /u/:slug (Akses Tanpa Login) ]
```

### F09.1 Kompilasi Otomatis (Auto-populated Portfolio)
- Mengumpulkan seluruh data user yang telah terinput di sistem:
  - **Identitas & Bio**: Nama lengkap, universitas, jurusan, headline profesional, dan bio singkat.
  - **Keahlian Berbasis Bukti (Skills & Evidence)**: Menampilkan badge skill beserta jumlah bukti pengalaman nyata yang mendasarinya.
  - **Daftar Pengalaman (Experiences)**: Rekam jejak organisasi, kepanitiaan, magang, dan proyek lengkap dengan tanggal, deskripsi, dan link portofolio eksternal.
  - **Pendidikan**: Data universitas dan tahun kelulusan.

### F09.2 Antarmuka Builder Split-View (Editor & Live Preview)
- **Panel Kiri (Editor Pengaturan)**:
  - Mengatur headline portofolio (contoh: *"Aspiring Product Manager & Ex-Lead GDSC"*).
  - Mengatur slug URL kustom (`/u/[slug]`).
  - Toggle visibilitas seksi: Pengguna dapat menyembunyikan/menampilkan seksi tertentu (misal: sembunyikan pengalaman freelance atau sembunyikan kategori soft skill).
- **Panel Kanan (Live Preview Responsif)**:
  - Menampilkan tampilan portofolio secara *real-time* saat pengaturan diubah.
  - Pilihan mode pratinjau: Tampilan Desktop dan Tampilan Mobile.

### F09.3 Publikasi & Berbagi (Publish & Share)
- Saklar publikasi (*Toggle Publish*): Aktifkan portofolio publik kapan saja atau ubah menjadi privat (*unpublish*).
- Menghasilkan tautan publik instan: `growvia.app/u/:slug`.
- Modal berbagi (*Share Modal*) dilengkapi tombol **"Salin Link"** dan tautan cepat ke LinkedIn atau WhatsApp.

### F09.4 Tampilan Portofolio Publik (`/u/:slug`)
- Halaman web publik yang dapat diakses oleh siapa saja (termasuk recruiter) **tanpa memerlukan login**.
- Layout bersih (*clean minimal design*), elegan, responsif, dan terbebas dari sidebar aplikasi internal dashboard Growvia.
- Dioptimalkan untuk SEO dengan Open Graph meta tags (thumbnail, judul, dan ringkasan bio).

---

## 🗄️ Lingkup Backend & Skema Basis Data

### Endpoint API

| Method | Endpoint | Deskripsi | Proteksi Auth |
|---|---|---|---|
| `GET` | `/api/portfolio/preview` | Mengompilasi seluruh data profil, skill, dan pengalaman untuk builder | User Auth |
| `PUT` | `/api/portfolio/publish` | Mengaktifkan/menonaktifkan publikasi dan menetapkan custom slug | User Auth |
| `GET` | `/api/public/:slug` | Mengambil data portofolio publik berdasarkan slug | **Publik (No Auth)** |

### Skema Basis Data (Ownership: Anggota C — Konsumsi Read Data)

Fitur ini memanfaatkan data yang ada tanpa membuat tabel baru:
- Membaca data `PROFILE` (`portfolio_slug`, `bio`, `headline`, `institution`, `major`).
- Membaca data `USER_SKILL` & `SKILL_EVIDENCE`.
- Membaca data `EXPERIENCE`.
- Membaca data `USER` (`name`, `avatar_url`).

---

## 💻 Lingkup Frontend

### Rute Halaman
- `src/app/(dashboard)/portfolio/page.tsx` ➔ Halaman Builder (Split-view editor).
- `src/app/u/[slug]/page.tsx` ➔ Halaman Portofolio Publik (Layout publik tanpa sidebar).

### Komponen UI
- `PortfolioSplitEditor.tsx` ➔ Panel kendali pengaturan seksi, headline, dan slug.
- `PortfolioPreview.tsx` ➔ Frame penampil preview responsif.
- `PublicPortfolioLayout.tsx` ➔ Template tata letak khusus halaman recruiter publik.
- `SharePortfolioModal.tsx` ➔ Dialog salin tautan dan QR/share options.

---

## ✅ Kriteria Penerimaan (Acceptance Criteria)

- [ ] Portofolio otomatis terisi dari data profil, pengalaman, dan keahlian tanpa input berulang.
- [ ] Panel preview merespons perubahan toggle seksi secara langsung (*real-time*).
- [ ] URL publik `/u/:slug` dapat diakses secara publik tanpa status autentikasi.
- [ ] Pengguna dapat menonaktifkan (*unpublish*) portofolio publik kapan pun diinginkan.
- [ ] Tampilan halaman publik responsif di perangkat mobile dan desktop.

---

## 🛠️ Panduan Pengembangan

```bash
# 1. Jalankan development server
npm run dev

# 2. Uji builder portofolio:
# http://localhost:3000/portfolio

# 3. Uji pratinjau halaman publik (misal: slug 'johndoe'):
# http://localhost:3000/u/johndoe

# 4. Lakukan validasi linting
npm run lint
```
