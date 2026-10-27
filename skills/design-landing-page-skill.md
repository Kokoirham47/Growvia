---
name: design-landing-page
description: Panduan mendesain ulang landing page Growvia (AI skill ecosystem untuk mahasiswa & fresh graduate) menjadi simple, modern, ringan, interaktif, dengan animasi halus, font Poppins, dan dark/light mode. Gunakan setiap kali membuat, merevisi, atau mereview landing page, section, copy, atau komponen marketing Growvia. Konten wajib mengikuti PRD Growvia v1.1.
---

# Growvia Landing Page — Design Skill

Skill ini mengatur **bagaimana landing page Growvia dibangun**: tujuan, token desain, tipografi, layout, konten (dari PRD v1.1), interaksi, animasi, dark mode, performa, dan checklist QA.

Stack acuan: **Next.js (App Router) + Tailwind CSS + next-themes + lucide-react**. Prinsipnya tetap berlaku di stack lain.

---

## 0. Cara memakai skill ini

1. Baca bagian 1–3 dulu (tujuan, anti-pattern, token).
2. Bangun page sesuai urutan section di bagian 6. Jangan menambah section di luar daftar kecuali diminta.
3. Semua teks mengambil dari bagian 7 (copy). Kalau butuh teks baru, tulis dengan aturan bagian 7.1.
4. Sebelum selesai, jalankan checklist bagian 13.

Jika ada konflik antara skill ini dan PRD, **PRD menang** untuk isi/klaim produk, **skill ini menang** untuk visual.

---

## 1. Tujuan & arah desain

**Produk:** Growvia membantu mahasiswa dan fresh graduate mengubah pengalaman (organisasi, kepanitiaan, magang, proyek) menjadi skill terstruktur, lalu menghubungkannya ke target karier, rekomendasi belajar, peluang, dan portofolio. Alurnya: **pengalaman → skill → karier**.

**Tugas utama landing page:** pengunjung paham dalam ±5 detik apa yang Growvia lakukan, mencoba sendiri hasilnya tanpa daftar, lalu klik **Daftar gratis**.

**Kata kunci visual:** tenang, bersih, ringan, terpercaya. Seperti alat bantu belajar yang rapi, bukan iklan teknologi.

**Satu momen yang diingat:** demo interaktif di hero (tulis pengalaman, skill muncul sebagai chip, Readiness Score bergerak saat chip diterima). Semua elemen lain dibuat tenang agar demo ini menonjol.

---

## 2. Anti-pattern: yang harus dihapus dari landing page lama

Landing page saat ini terasa "AI slop" karena hal-hal berikut. **Jangan dibawa ke versi baru.**

| Ada di versi lama | Masalah | Gantinya |
|---|---|---|
| Gradient ungu-ke-biru, teks gradient ("Into Opportunity") | Template AI paling umum, aksen satu kata | Biru navy/royal solid dari palet. Headline satu warna |
| Glow blob, dot grid, sparkle ✦ dekoratif, bayangan ungu | Dekorasi tanpa fungsi, berat di GPU | Background polos `--bg`. Tanpa glow |
| Heading berat (weight 800–900) | Terlalu agresif, Poppins jadi sesak | Poppins 600 untuk heading |
| Badge kecil di atas heading ("AI-Powered Career Intelligence", "Keunggulan Fitur", "Langkah Mudah", "Ulasan Pengguna") | Eyebrow generik di tiap section | Hapus. Heading cukup berdiri sendiri |
| "Sudah dipercaya 1,200+ mahasiswa" + avatar | Angka karangan. PRD: target 5.000 user dalam 6 bulan, belum ada user | Hapus. Lihat aturan 7.2 |
| Logo "TechNusantara, EduFutura Lab, …" | Mitra fiktif. PRD tidak punya mitra | Hapus strip logo |
| 3 testimoni bintang 5 dengan nama dan jabatan | Fiktif, menyesatkan | Hapus. Ganti section "Kamu yang memegang kendali" |
| "Jadwalkan Demo Tim" | PRD: tidak ada employer-side/tim | Hapus |
| "Career Match: A", "Confidence: 92%", "Match Score: 94%" statis | Tidak ada di PRD (PRD memakai Readiness Score 0–100% + label) | Pakai istilah PRD, dan angkanya hidup (dihitung dari demo) |
| "AI Engine: Gemini & Groq" | Open question #5 PRD belum diputuskan, dan user tidak butuh tahu | Hapus |
| "100% didukung AI", "terdepan di Indonesia", "recruiter kelas dunia", "skor di atas 90% otomatis" | Klaim berlebihan. PRD: AI hanya ranking/ekstraksi, user pegang kendali | Copy jujur bagian 7 |
| "Unggah Portofolio" di langkah 1 | Tidak sesuai alur PRD (input pengalaman) | "Tulis pengalamanmu" |
| Footer: "Karier di Growvia", "Panduan Komunitas", "Integrasi Portofolio" | Halaman/fitur tidak ada di PRD | Footer minimal bagian 7.9 |
| Nav: About / Review / Showcase | Section-nya tidak ada | Fitur / Cara kerja / FAQ |
| 3 kartu identik + hover glow | Kit SaaS generik | Bento dengan ukuran berbeda (bagian 6.4) |

---

## 3. Design tokens

### 3.1 Warna

Palet inti dari brief (**jangan diubah**), dipakai sebagai light mode. Dark mode adalah turunan yang dibuat di skill ini dan ditandai *(turunan)*.

| Token | Light | Dark *(turunan)* | Peran |
|---|---|---|---|
| `--primary` | `#1E3A8A` | `#93B4F5` | Judul penting, logo, teks tautan utama |
| `--accent` | `#2563EB` | `#3B82F6` | Tombol utama, fokus, aksi |
| `--ai` | `#6366F1` | `#818CF8` | Penanda AI (badge, chip hasil AI) |
| `--ai-bg` | `#EEF2FF` | `rgba(99,102,241,.16)` | Latar badge/chip AI |
| `--bg` | `#F5F6F8` | `#0F172A` | Latar halaman |
| `--surface` | `#FFFFFF` | `#1E293B` | Kartu, demo, navbar |
| `--surface-2` | `#F1F5F9` | `#273449` | Latar bertingkat (input, hover) |
| `--border` | `#E2E8F0` | `#334155` | Garis kartu, pemisah |
| `--text` | `#1E293B` | `#F1F5F9` | Teks utama |
| `--text-sec` | `#64748B` | `#94A3B8` | Teks sekunder |
| `--text-muted` | `#94A3B8` | `#64748B` | Placeholder, disabled, dekoratif saja |
| `--success` | `#16A34A` | `#4ADE80` | Ikon/latar status "Strong" |
| `--warning` | `#F59E0B` | `#FBBF24` | Ikon/latar status "Perlu dikembangkan" |
| `--error` | `#DC2626` | `#F87171` | Error, status "Missing" |

**Token tambahan agar teks lolos kontras WCAG AA** *(turunan)*:

| Token | Light | Dark | Dipakai untuk |
|---|---|---|---|
| `--ai-text` | `#4F46E5` | `#A5B4FC` | Teks kecil berwarna AI |
| `--success-text` | `#15803D` | `#4ADE80` | Teks status sukses |
| `--warning-text` | `#B45309` | `#FBBF24` | Teks status peringatan |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | Teks di atas tombol `--accent` |

**Aturan kontras (penting):**
- `#94A3B8` di atas putih ≈ 2.6:1, **gagal** untuk teks. Pakai `--text-muted` hanya untuk placeholder, ikon dekoratif, dan teks disabled.
- `#64748B` di atas `--bg` `#F5F6F8` kira-kira 4.4:1 (mepet). Untuk paragraf panjang di atas `--bg`, pakai `--text`. `--text-sec` aman di atas `--surface` putih.
- `#6366F1` untuk teks kecil sedikit di bawah 4.5:1, gunakan `--ai-text`. `--ai` murni untuk ikon, border, dan blok warna.
- `#16A34A` dan `#F59E0B` bukan warna teks yang aman di putih. Pakai `--success-text` / `--warning-text` untuk teks, atau pasang di latar tint dengan teks `--text`.
- Cek ulang pasangan warna dengan alat kontras sebelum rilis, terutama versi dark.

**Aturan pemakaian warna:**
- `--accent` = semua aksi (tombol utama, link aktif, focus ring). Satu tombol utama per layar.
- `--ai` dan `--ai-bg` = **hanya** untuk hal yang dihasilkan AI (chip skill AI, badge "AI", alasan rekomendasi). Warna ini punya arti, jangan dipakai sebagai hiasan.
- `--primary` = judul besar di light mode dan logo.
- Tanpa gradient. Satu-satunya pengecualian: tidak ada.

### 3.2 CSS variables (salin ke `globals.css`)

```css
:root {
  --primary: #1E3A8A;
  --accent: #2563EB;
  --ai: #6366F1;
  --ai-bg: #EEF2FF;
  --bg: #F5F6F8;
  --surface: #FFFFFF;
  --surface-2: #F1F5F9;
  --border: #E2E8F0;
  --text: #1E293B;
  --text-sec: #64748B;
  --text-muted: #94A3B8;
  --success: #16A34A;
  --warning: #F59E0B;
  --error: #DC2626;
  --ai-text: #4F46E5;
  --success-text: #15803D;
  --warning-text: #B45309;
  --on-accent: #FFFFFF;
  --shadow-float: 0 8px 24px rgba(30, 41, 59, 0.08);
  color-scheme: light;
}

.dark {
  --primary: #93B4F5;
  --accent: #3B82F6;
  --ai: #818CF8;
  --ai-bg: rgba(99, 102, 241, 0.16);
  --bg: #0F172A;
  --surface: #1E293B;
  --surface-2: #273449;
  --border: #334155;
  --text: #F1F5F9;
  --text-sec: #94A3B8;
  --text-muted: #64748B;
  --success: #4ADE80;
  --warning: #FBBF24;
  --error: #F87171;
  --ai-text: #A5B4FC;
  --success-text: #4ADE80;
  --warning-text: #FBBF24;
  --shadow-float: 0 8px 24px rgba(0, 0, 0, 0.35);
  color-scheme: dark;
}

html { background: var(--bg); color: var(--text); }
body { font-family: var(--font-poppins), system-ui, sans-serif; }
```

Tailwind: petakan token ke utility (`bg-bg`, `bg-surface`, `text-text`, `text-sec`, `border-border`, `bg-accent`, `text-ai-text`, dst.) lewat `theme.extend.colors` memakai `var(--token)`, jadi komponen tidak pernah menulis hex.

Di light mode, **tanpa `box-shadow` pada kartu biasa**. Pakai border 1px `--border`. `--shadow-float` hanya untuk kartu demo hero dan dropdown.

### 3.3 Tipografi: Poppins

Satu keluarga saja: **Poppins**. Muat lewat `next/font` agar self-hosted dan tanpa layout shift.

```tsx
// app/layout.tsx
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],   // cukup 3 bobot, lebih ringan
  display: "swap",
  variable: "--font-poppins",
});

<html lang="id" suppressHydrationWarning className={poppins.variable}>
```

Poppins berukuran lebar dan geometris. Karena itu: heading tidak lebih dari weight 600, tracking heading sedikit dirapatkan, dan baris dibatasi agar tidak melebar.

| Peran | Ukuran (desktop / mobile) | Weight | Line-height | Tracking |
|---|---|---|---|---|
| H1 hero | `clamp(2rem, 4.5vw, 3.25rem)` | 600 | 1.15 | -0.02em |
| H2 section | `clamp(1.5rem, 3vw, 2.25rem)` | 600 | 1.2 | -0.015em |
| H3 kartu | 1.125rem | 600 | 1.3 | -0.01em |
| Body besar (sub hero) | 1.125rem | 400 | 1.65 | 0 |
| Body | 1rem | 400 | 1.65 | 0 |
| Teks kecil / chip | 0.875rem | 500 | 1.5 | 0 |

- Panjang baris maksimal **±65 karakter** (`max-w-[60ch]` untuk paragraf, `max-w-[18ch]`–`22ch` untuk H1 agar pecah baris rapi).
- **Sentence case** di mana-mana. Tanpa ALL CAPS untuk label.
- Tanpa menebalkan atau mewarnai satu kata di dalam heading.
- Angka di demo memakai `font-variant-numeric: tabular-nums` agar tidak bergoyang saat dianimasikan.

### 3.4 Spasi, radius, layout

- Grid: container `max-w-[1120px]`, padding samping 20px (mobile) / 32px (desktop). Skala spasi kelipatan 4.
- Jarak antar section: `96px` desktop, `64px` mobile. Jarak dalam section konsisten, jangan variasi tiap section.
- Radius **bertingkat sesuai hierarki**, bukan satu nilai untuk semua:
  - 8px: input, chip kecil teks
  - 12px: tombol
  - 16px: kartu fitur
  - 24px: kartu demo hero (satu-satunya yang paling besar)
  - full: pill badge AI, chip skill
- Alignment: **rata kiri** untuk hero dan semua section (lebih mudah dibaca, tidak terasa template). CTA akhir boleh rata tengah.

### 3.5 Ikon & aset

- Ikon: `lucide-react`, stroke 1.75, ukuran 18–20px. Satu set saja.
- Logo: SVG sederhana + wordmark "Growvia" (Poppins 600). Tanpa orb bercahaya.
- Tanpa gambar stok, tanpa ilustrasi 3D, tanpa mockup palsu. Visual utama = komponen demo yang hidup (HTML/CSS asli).

---

## 4. Dark mode & light mode

- Pakai `next-themes` dengan `attribute="class"`, `defaultTheme="system"`, `enableSystem`. Preferensi tersimpan otomatis dan tidak ada flash saat load.
- Toggle di navbar: tombol ikon tunggal (sun/moon) 40×40, `aria-label="Ganti tema"`, `aria-pressed` sesuai state. Tanpa pill dua-ikon ala lama.
- Transisi tema: `transition: background-color .2s, color .2s, border-color .2s` hanya pada `body`, kartu, dan navbar. Jangan `* { transition: all }`.
- Dark mode bukan sekadar membalik warna: permukaan naik lewat **`--bg` → `--surface` → `--surface-2`**, border tetap terlihat, tanpa bayangan hitam pekat, tanpa glow ungu.
- Chip AI di dark memakai `--ai-bg` transparan + border `--ai` 40% agar tidak "menyala" berlebihan.
- Semua komponen harus dicek di dua mode sebelum dianggap selesai.

```tsx
// components/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemes } from "next-themes";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
```

---

## 5. Prinsip interaksi & animasi

Tujuan: **terasa hidup, tetap ringan**. Animasi menjawab aksi pengguna atau menarik perhatian ke satu hal. Bukan hiasan.

**Aturan:**
1. Hanya animasikan `transform` dan `opacity` (plus lebar progress bar via `transform: scaleX`). Tanpa animasi `blur`, `box-shadow`, `filter`, atau layout.
2. Durasi 150–350ms. Easing: `cubic-bezier(0.22, 1, 0.36, 1)` untuk masuk, `ease-out` untuk hover.
3. **Satu rangkaian utama**: saat tombol "Ekstrak skill" ditekan di hero, chip muncul berurutan (stagger 60ms), lalu angka Readiness Score naik dan bar terisi. Ini momen utama.
4. **Respon aksi**, selalu ada: tombol (naik 1px saat hover, turun saat ditekan), chip (toggle terima/tolak dengan perubahan warna + ikon centang), accordion FAQ (tinggi + rotasi chevron), toggle tema.
5. **Scroll reveal dibatasi**: hanya pada blok demo skor, bento fitur, dan section kendali. Fade 8px sekali jalan (`IntersectionObserver`, `once: true`). Section lain muncul biasa. Jangan fade-slide pada setiap section.
6. Tanpa parallax, tanpa cursor effect, tanpa partikel, tanpa animasi looping latar.
7. Skeleton shimmer **hanya** saat simulasi ekstraksi (±1,2 detik), bukan di tempat lain.
8. Hormati `prefers-reduced-motion`: semua animasi diganti perubahan instan (tanpa stagger, tanpa count-up).

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

```css
/* chip masuk, dipakai dengan style="--i: index" */
@keyframes chip-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to   { opacity: 1; transform: none; }
}
.chip-in { animation: chip-in .3s cubic-bezier(0.22,1,0.36,1) both; animation-delay: calc(var(--i) * 60ms); }

.bar-fill { transform-origin: left; transition: transform .5s cubic-bezier(0.22,1,0.36,1); }
```

Library: utamakan **CSS murni + satu hook kecil** untuk count-up dan IntersectionObserver. Hindari memasukkan Framer Motion hanya untuk ini. Jika tetap dipakai, gunakan `LazyMotion` + `domAnimation` agar bundle kecil.

---

## 6. Struktur halaman (urut dari atas)

Navbar → Hero + Demo → Cara kerja → Fitur → Kendali → Untuk siapa → FAQ → CTA akhir → Footer.

### 6.1 Navbar
- Sticky, tinggi 64px, latar `--surface` 85% opasitas + `backdrop-filter: blur(8px)` hanya jika perangkat mendukung (fallback solid), border bawah 1px `--border` muncul setelah scroll.
- Kiri: logo. Tengah: **Fitur · Cara kerja · FAQ** (smooth scroll ke anchor). Kanan: toggle tema, **Masuk** (teks), **Daftar gratis** (tombol `--accent`).
- Mobile: tombol menu → panel penuh sederhana (fade 150ms), link besar, tombol Daftar di bawah.
- Link aktif ditandai garis bawah 2px `--accent` (scroll-spy ringan).

### 6.2 Hero + Demo interaktif
Layout desktop 2 kolom (kiri teks 5/12, kanan demo 7/12). Mobile: teks dulu, demo di bawah.

```
┌──────────────────────────────────────────────────────┐
│ Ubah pengalamanmu        ┌──────────────────────────┐ │
│ jadi skill yang          │ Coba sekarang, tanpa     │ │
│ bisa dibuktikan.         │ daftar                   │ │
│                          │ [ textarea pengalaman ]  │ │
│ sub copy                 │ [Ekstrak skill]          │ │
│ [Daftar gratis] [Coba]   │ (chip AI) (chip) (chip)  │ │
│ Gratis untuk mahasiswa…  │ Readiness 64% ▓▓▓▓░░     │ │
│                          └──────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

Detail demo ada di **bagian 8**.

### 6.3 Cara kerja
Ini **urutan nyata**, jadi penomoran 1–2–3 dibenarkan. Layout horizontal 3 kolom (desktop), vertikal (mobile), dihubungkan garis tipis 1px `--border`. Tiap langkah: angka dalam lingkaran 32px, judul, satu kalimat. Tanpa kartu berbayang.

### 6.4 Fitur (bento, ukuran berbeda)
Grid 6 kolom, **bukan 3 kartu identik**:

```
┌───────────────────────┬───────────┐
│ Ekstraksi skill (4col)│ Skill     │
│ + mini chip statis    │ Profile   │
│                       │ (2col)    │
├───────────┬───────────┴───────────┤
│ Readiness │ Rekomendasi belajar   │
│ Score(2)  │ (4col) + 1 resource   │
├───────────┴─────┬─────────────────┤
│ Peluang karier  │ Portofolio      │
│ (3col)          │ (3col)          │
└─────────────────┴─────────────────┘
```

- Setiap kartu: ikon 20px, judul H3, 1–2 kalimat, dan **satu fragmen UI nyata** (chip, bar, cuplikan resource card) sebagai ilustrasi. Bukan ikon besar ber-glow.
- Hover: border berubah ke `--accent` 40% dan naik 2px. Tanpa glow.
- Tiap fitur punya **status rilis** (lihat 9).

### 6.5 Kendali (kepercayaan AI)
Bagian ini menggantikan testimoni. Dua kolom: kiri heading + paragraf, kanan daftar 4 poin dengan ikon centang (copy di 7.6). Latar `--surface`, border, radius 16.

### 6.6 Untuk siapa
Tiga baris sederhana (bukan kartu): judul segmen + satu kalimat. Dibatasi garis tipis. Tanpa foto.

### 6.7 FAQ
Accordion dengan elemen `<details>`/`<summary>` atau komponen ARIA. Satu terbuka sekali waktu (opsional). Animasi tinggi 200ms.

### 6.8 CTA akhir
Blok `--surface` dengan border (bukan panel gradient ungu). Heading, satu kalimat, satu tombol utama + satu tautan sekunder.

### 6.9 Footer
Minimal, lihat 7.9.

---

## 7. Copy (konten dari PRD v1.1)

Bahasa: **Bahasa Indonesia saja** (PRD: multi-language di luar scope v1). Nada: santai tapi jelas, pakai "kamu". Tanpa tanda seru berlebihan.

### 7.1 Aturan menulis
- Sentence case. Kata kerja aktif. Tombol menyebut hasil aksi: "Daftar gratis", "Ekstrak skill", bukan "Submit" atau "Mulai Sekarang".
- Satu nama untuk satu hal: selalu **"skill"**, **"pengalaman"**, **"Career Readiness Score"**, **"skill gap"**, **"portofolio"**. Jangan berganti istilah antar section.
- Jelaskan manfaat nyata, bukan klaim besar. Hindari: "terdepan", "revolusioner", "game changer", "kelas dunia", "100%", "otomatis sempurna".
- Setiap angka harus berasal dari PRD (lihat 7.2).

### 7.2 Angka & klaim yang boleh dipakai
Hanya yang ada di PRD sebagai kemampuan produk:
- "Kurang dari 5 menit" (Goal 1: ekstrak dan validasi skill)
- "Kurang dari 10 detik" (analisis AI, NFR)
- Label skor: Starter (0–39%), Developing (40–69%), Ready (70–89%), Top Candidate (90–100%)
- 4 kategori skill: Hard Skill, Soft Skill, Technical, Leadership
- Gratis di v1 (Assumption 6)

**Dilarang:** jumlah pengguna, nama mitra/perusahaan, testimoni, rating, "dipercaya oleh…", persentase keberhasilan, jumlah lowongan. Jika nanti ada data nyata, tambahkan lewat komponen terpisah yang diisi dari sumber terverifikasi.

### 7.3 Hero
- **H1:** Ubah pengalamanmu jadi skill yang bisa dibuktikan.
- **Sub:** Tulis pengalaman organisasi, kepanitiaan, magang, atau proyekmu. Growvia mengusulkan skill-nya, menunjukkan gap ke karier yang kamu tuju, lalu merangkum semuanya jadi portofolio.
- **CTA utama:** Daftar gratis → `/register`
- **CTA sekunder:** Coba ekstraksi skill → `#demo`
- **Microcopy:** Gratis untuk mahasiswa dan fresh graduate.

### 7.4 Cara kerja
H2: **Dari pengalaman ke karier dalam tiga langkah**
1. **Tulis pengalamanmu.** Ceritakan peran dan apa yang kamu kerjakan, misalnya ketua divisi acara atau proyek kuliah. Minimal 50 karakter.
2. **Tinjau skill yang diusulkan AI.** Terima, ubah namanya, atau tolak. Skill yang kamu terima tersimpan lengkap dengan pengalaman sebagai buktinya.
3. **Pilih target karier dan lihat gap-nya.** Growvia menghitung Career Readiness Score, merekomendasikan materi belajar, dan menyiapkan portofolio yang siap dibagikan.

### 7.5 Fitur
H2: **Semua yang kamu perlukan, dalam satu alur**

| Fitur (PRD) | Judul | Teks |
|---|---|---|
| F03 + F04 | Ekstraksi skill dari pengalaman | Tulis pengalamanmu, AI mengidentifikasi, menormalkan, dan mengelompokkan skill-nya. Kamu yang memutuskan mana yang disimpan. |
| F05 | Skill Profile | Lihat semua skill beserta bukti pengalamannya. Peta skill menunjukkan skill yang sering muncul bersama. |
| F06 | Career Readiness Score | Pilih target karier, lalu lihat skill mana yang sudah kuat, perlu dikembangkan, dan belum kamu punya. |
| F07 | Rekomendasi belajar | Course, artikel, dan video yang dipilih dari skill gap-mu, lengkap dengan alasan kenapa cocok. |
| F08 | Peluang karier | Magang, kerja, freelance, dan kompetisi dengan persentase kecocokan skill. Kamu melamar di platform asalnya. |
| F09 | Portofolio | Terisi otomatis dari profil, skill, dan pengalamanmu. Publikasikan ke `growvia.app/u/namamu` dan batalkan kapan saja. |

### 7.6 Kendali (kepercayaan AI)
- **H2:** AI mengusulkan, kamu yang memutuskan
- **Paragraf:** Growvia memakai AI untuk menghemat waktumu, bukan untuk menggantikan penilaianmu.
- **Poin:**
  - Semua saran AI bisa kamu terima, ubah, atau tolak.
  - Skill hasil AI diberi badge AI, skill yang kamu tambah sendiri tidak.
  - Rekomendasi belajar diurutkan AI dari katalog yang dikurasi tim Growvia. AI tidak mengarang materi.
  - Persentase kecocokan peluang dihitung dari profil skill-mu oleh sistem, bukan ditebak AI.

### 7.7 Untuk siapa
H2: **Dibuat untuk yang sedang menyiapkan langkah pertama**
- **Mahasiswa aktif (semester 4–8).** Kamu aktif di organisasi atau kepanitiaan, tapi bingung menuliskannya di CV.
- **Fresh graduate.** Pengalamanmu masih 0–2 tahun dan kamu ingin tahu skill apa yang perlu ditambah.
- **Career switcher.** Kamu ingin memetakan ulang skill yang sudah ada untuk bidang baru.

### 7.8 FAQ
H2: **Pertanyaan yang sering muncul**
1. **Growvia gratis?** Ya, gratis di versi awal ini.
2. **Apa yang perlu saya tulis?** Judul, tipe (organisasi, kepanitiaan, magang, freelance, proyek, kompetisi), peran, tanggal, dan deskripsi 50–1000 karakter. Semakin spesifik, semakin tepat skill yang diusulkan.
3. **Apakah AI yang menentukan skill saya?** Tidak. AI hanya mengusulkan. Kamu bisa menerima, mengubah, atau menolak setiap saran.
4. **Bisa melamar kerja langsung lewat Growvia?** Belum. Tombol Apply mengarahkan ke platform asal lowongan, dan kamu bisa menyimpan peluang untuk nanti.
5. **Siapa yang bisa melihat portofolio saya?** Hanya yang kamu izinkan. Kamu mengatur privasinya dan bisa menarik portofolio kapan saja.
6. **Bagaimana keamanan data saya?** Koneksi memakai HTTPS dan password disimpan dalam bentuk hash. Jika kamu menghapus akun, data disimpan 30 hari sebelum dihapus.

### 7.9 CTA akhir & footer
- **CTA H2:** Mulai dari satu pengalaman.
- **Teks:** Kamu bisa melihat skill pertamamu dalam waktu kurang dari 5 menit.
- **Tombol:** Daftar gratis. **Tautan:** Sudah punya akun? Masuk
- **Footer:** logo + "Dari pengalaman ke skill ke karier." · Tautan: Fitur, Cara kerja, FAQ, Kebijakan privasi, Syarat dan ketentuan, Kontak · © {tahun} Growvia.
  Tautan privasi/syarat/kontak harus mengarah ke halaman yang benar-benar ada. Jika belum ada, sembunyikan.

### 7.10 Meta
- `<title>`: Growvia, ubah pengalamanmu jadi skill dan karier
- `description`: Tulis pengalaman organisasi, magang, atau proyekmu. Growvia mengusulkan skill, menghitung Career Readiness Score, dan menyiapkan portofolio. Gratis.
- `lang="id"`, OG image sederhana (logo + H1, latar `--bg`).

---

## 8. Demo interaktif (komponen utama)

Id section: `#demo` (bagian dari hero). Komponen client-side, **tanpa memanggil API AI** (simulasi lokal agar cepat, murah, dan tidak menghabiskan kuota).

**Label jujur di UI:** teks kecil di bawah demo, `--text-sec`: *"Ini simulasi dengan contoh data. Di Growvia, kamu memasukkan pengalamanmu sendiri."*

### 8.1 Alur
1. Kartu demo (radius 24, border, `--shadow-float`). Judul: **Coba sekarang, tanpa daftar**.
2. Textarea terisi contoh pengalaman (boleh diedit, simpan state). Isi awal:
   > Ketua Divisi Acara Bincang Karir 2026. Mengoordinasi 12 panitia, menyusun rundown dan anggaran Rp15 juta, menghubungi 5 pembicara dan sponsor, serta memimpin evaluasi setelah acara.
3. Tombol **Ekstrak skill**. Saat ditekan: tombol berubah "Menganalisis…", 3 skeleton chip shimmer selama ±1,2 detik.
4. Hasil: chip skill muncul stagger. Tiap chip: nama skill, kategori (ikon kecil), persentase relevansi, dan badge **AI**.
   - Relevansi **> 75%**: tampil terpilih (diterima) secara default.
   - **40–75%**: tampil, belum terpilih.
   - **< 40%**: dipisah di bawah dengan label **Perlu konfirmasi**.
5. Klik chip = toggle terima/tolak (ikon centang ↔ plus, warna `--ai-bg` ↔ outline). Tombol **Terima semua**.
6. Di bawahnya: **Career Readiness Score** untuk target contoh (**Product Manager**), bar horizontal + angka + label (Starter / Developing / Ready / Top Candidate). Setiap toggle chip menghitung ulang skor dengan animasi 500ms.
7. Di bawah skor: daftar ringkas tiga status: **Sudah kuat** (hijau), **Perlu dikembangkan** (kuning), **Belum ada** (merah). Setiap status memakai ikon + teks (jangan hanya warna).

Cukup dengan target satu karier. Jangan menambah dropdown karier di landing page.

### 8.2 Data & rumus (sesuai PRD F06.4)
Rumus PRD: `(matched skills × weight) / total required skills weight × 100`.

```ts
type Level = 1 | 2 | 3; // pemula, menengah, mahir

type ExtractedSkill = {
  name: string;
  category: "Hard Skill" | "Soft Skill" | "Technical" | "Leadership";
  relevance: number; // 0–100
  level: Level;
};

type Required = { name: string; weight: 1 | 2 | 3; minLevel: Level }; // 3 = wajib, 2 = sangat penting, 1 = penting

export const SAMPLE_SKILLS: ExtractedSkill[] = [
  { name: "Leadership",               category: "Leadership", relevance: 92, level: 2 },
  { name: "Event Management",         category: "Hard Skill", relevance: 88, level: 3 },
  { name: "Team Coordination",        category: "Soft Skill", relevance: 85, level: 2 },
  { name: "Budgeting",                category: "Hard Skill", relevance: 81, level: 2 },
  { name: "Negotiation",              category: "Soft Skill", relevance: 77, level: 2 },
  { name: "Stakeholder Communication",category: "Soft Skill", relevance: 71, level: 2 },
  { name: "Project Planning",         category: "Hard Skill", relevance: 64, level: 2 },
  { name: "Data Analysis",            category: "Technical",  relevance: 32, level: 1 },
];

export const PRODUCT_MANAGER: Required[] = [
  { name: "Stakeholder Communication", weight: 3, minLevel: 2 },
  { name: "Project Planning",          weight: 3, minLevel: 2 },
  { name: "Product Discovery",         weight: 3, minLevel: 2 }, // tidak dimiliki -> Missing
  { name: "Leadership",                weight: 2, minLevel: 2 },
  { name: "Data Analysis",             weight: 2, minLevel: 2 },
  { name: "Team Coordination",         weight: 1, minLevel: 1 },
];

export function readiness(accepted: ExtractedSkill[], req: Required[]) {
  const total = req.reduce((s, r) => s + r.weight, 0);
  const byName = new Map(accepted.map((s) => [s.name, s]));
  let matched = 0;
  const strong: string[] = [], develop: string[] = [], missing: string[] = [];
  for (const r of req) {
    const s = byName.get(r.name);
    if (!s) { missing.push(r.name); continue; }
    matched += r.weight;
    (s.level >= r.minLevel ? strong : develop).push(r.name);
  }
  const score = Math.round((matched / total) * 100);
  const label = score >= 90 ? "Top Candidate" : score >= 70 ? "Ready" : score >= 40 ? "Developing" : "Starter";
  return { score, label, strong, develop, missing };
}
```

Dengan data di atas: default (chip > 75% terpilih) memberi skor ±21% (**Starter**). Menerima Stakeholder Communication dan Project Planning membawanya ke ±64% (**Developing**), dan menerima Data Analysis ke ±79% (**Ready**). Ini membuat demo terasa "naik level" saat pengguna bermain. Tampilkan Product Discovery sebagai **Belum ada** supaya skor tidak pernah 100% (jujur dan realistis).

Catatan: data `Data Analysis` level 1 dengan `minLevel` 2 akan masuk **Perlu dikembangkan**, yang memperlihatkan ketiga kategori gap PRD sekaligus.

### 8.3 Aksesibilitas demo
- Textarea punya `<label>`. Tombol bisa diakses keyboard.
- Chip = `<button aria-pressed>`. Hasil diumumkan lewat `aria-live="polite"` ("5 skill diusulkan", "Skor menjadi 64%, Developing").
- Progress bar memakai `role="progressbar"` dengan `aria-valuenow`.
- Warna tidak jadi satu-satunya pembeda (ikon + teks selalu ada).

---

## 9. Status rilis fitur (agar tidak menjanjikan berlebihan)

PRD punya milestone bertahap (Alpha, Beta, v1.0, v1.1). Landing page tidak boleh menampilkan fitur seolah sudah tersedia jika belum.

Simpan di satu config:

```ts
export const FEATURES = [
  { id: "extract",   status: "available" }, // F03–F04: Alpha
  { id: "profile",   status: "available" }, // F05: Beta
  { id: "readiness", status: "available" }, // F06: Beta
  { id: "learning",  status: "soon" },      // F07: v1.0
  { id: "opps",      status: "soon" },      // F08: v1.0
  { id: "portfolio", status: "soon" },      // F09: v1.0 (PDF export v1.1)
] as const;
```

Fitur berstatus `soon` memakai pill kecil **"Segera hadir"** (`--surface-2`, teks `--text-sec`). Atur sesuai tahap rilis saat page dipublikasikan. Ekspor PDF portofolio jangan disebut sebagai fitur tersedia sebelum v1.1.

---

## 10. Responsif

- Breakpoint: 640 / 768 / 1024 / 1280.
- Mobile-first. Hero menumpuk, demo penuh lebar, bento menjadi satu kolom, cara kerja vertikal.
- Area sentuh minimal 44×44px. Teks minimal 16px untuk body (cegah zoom otomatis iOS pada input).
- Tidak ada scroll horizontal di lebar 360px.
- Dukungan browser mengikuti PRD: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+; iOS 14+, Android 10+. Beri fallback solid bila `backdrop-filter` tidak ada.

---

## 11. Performa

Target dari PRD: **FCP < 1,5 detik, TTI < 3 detik**.

- Halaman statis (SSG). Hanya demo, navbar mobile, toggle tema, dan FAQ yang `"use client"`.
- Font: `next/font` (self-host), 3 bobot, `display: swap`. Tanpa font tambahan.
- Tidak ada gambar raster di atas lipatan. Visual dibuat dengan HTML/CSS dan SVG inline.
- Tanpa library animasi berat. Tanpa video latar. Tanpa canvas.
- Tanpa blur/filter besar (hapus semua blob glow). `backdrop-filter` hanya di navbar.
- Lazy-load komponen di bawah lipatan (`next/dynamic`) bila bundle melebihi anggaran.
- Anggaran saran: JS awal ≤ 120 KB gzip, CLS < 0,05.

---

## 12. Aksesibilitas (WCAG 2.1 AA)

- Kontras teks ≥ 4.5:1 (lihat aturan di 3.1). Teks besar ≥ 3:1.
- Fokus terlihat: `outline: 2px solid var(--accent); outline-offset: 2px` pada semua elemen interaktif (di dark pakai `--accent` yang sudah diterangkan).
- Struktur heading berurutan: satu `<h1>`, lalu `<h2>` per section.
- Landmark: `<header>`, `<main>`, `<nav aria-label>`, `<footer>`.
- Link "Lewati ke konten" di awal halaman.
- Semua ikon dekoratif `aria-hidden`, ikon fungsional punya label.
- Fully operable dengan keyboard, termasuk demo, FAQ, dan menu mobile.

---

## 13. Checklist QA sebelum selesai

**Visual**
- [ ] Tidak ada gradient, glow, blob, dot grid, sparkle dekoratif, atau teks gradient.
- [ ] Hanya warna dari palet (light + turunan dark). Tidak ada hex lepas di komponen.
- [ ] Poppins di seluruh halaman, weight ≤ 600, heading sentence case.
- [ ] Tidak ada eyebrow/badge di atas heading section.
- [ ] Radius bertingkat sesuai 3.4, bayangan hanya pada kartu demo.
- [ ] Light dan dark mode sama-sama rapi, tanpa flash saat load.

**Konten**
- [ ] Semua copy sesuai bagian 7 dan PRD v1.1. Bahasa Indonesia.
- [ ] Tidak ada angka pengguna, logo mitra, testimoni, atau rating.
- [ ] Tidak ada "Demo Tim", "AI Engine: Gemini & Groq", "Career Match: A".
- [ ] Istilah konsisten: skill, pengalaman, Career Readiness Score, skill gap, portofolio.
- [ ] Fitur belum rilis diberi pill "Segera hadir".
- [ ] Footer hanya berisi tautan yang halamannya ada.

**Interaksi & animasi**
- [ ] Demo: ekstrak → chip stagger → toggle → skor menghitung ulang berjalan lancar.
- [ ] Scroll reveal hanya di 3 blok yang disebut di bagian 5.
- [ ] Hanya `transform` dan `opacity` yang dianimasikan.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] Toggle tema bekerja dan preferensi tersimpan.

**Teknis**
- [ ] FCP < 1,5 dt dan TTI < 3 dt pada Lighthouse mobile.
- [ ] Tidak ada layout shift saat font dan demo dimuat.
- [ ] Lolos cek kontras AA di kedua mode.
- [ ] Navigasi keyboard lengkap, fokus selalu terlihat.
- [ ] Tidak ada scroll horizontal di 360px.
- [ ] Meta, OG, `lang="id"` terpasang.

---

## 14. Yang sengaja tidak dilakukan

- Tidak menambah halaman/section di luar bagian 6 (misal blog, harga, tim, showcase). PRD v1 gratis dan tidak punya halaman tersebut.
- Tidak memanggil API LLM dari landing page.
- Tidak menampilkan fitur Admin Dashboard (F13). Itu internal dan tidak untuk pengunjung.
- Tidak membuat klaim kompetitif ("terbaik", "pertama", "terlengkap") meski Vision PRD menyebut "terlengkap". Itu visi internal, bukan fakta yang bisa diklaim di halaman publik.
