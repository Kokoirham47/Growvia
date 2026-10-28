# 📋 DOKUMEN RENCANA & TEST CASE PENGUJIAN QA
## **Growvia — AI-Powered Career & Skill Ecosystem**

> **Tujuan Dokumen:**  
> Dokumen ini dirancang sebagai panduan pengujian Quality Assurance (QA) menyeluruh (End-to-End) untuk platform web **Growvia**. Seluruh fungsionalitas, alur otentikasi, fitur kecerdasan buatan (AI), manajemen profil, dashboard pengguna, hingga panel administrasi (CRUD Admin) tercakup secara terstruktur dengan langkah-langkah uji yang jelas.

---

### 📌 Ringkasan Informasi Pengujian

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Aplikasi** | **Growvia Career Compass** |
| **Teknologi Utama** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Material UI, Prisma ORM, Supabase PostgreSQL, Google Gemini AI API |
| **Target Penguji (Tester)** | QA Engineer / Internal Tester / Peer Reviewer |
| **Lingkungan Uji (Environment)** | Lokal: `http://localhost:3000` atau Staging URL |
| **Kredensial Admin Pengujian** | Email: `admin@growvia.id` <br> Password: `AdminGrowvia2026!` |
| **Kredensial Demo User** | Email: `demo@growvia.id` <br> *(Atau buat akun baru melalui alur Registrasi)* |
| **Status Pengujian** | `[ ] PASS` = Berhasil Sesuai Ekspektasi <br> `[ ] FAIL` = Terjadi Kesalahan / Bug <br> `[ ] BLOCKED` = Terhalang Isu Lain |

---

## 📑 DAFTAR ISI MODUL PENGUJIAN

1. [Modul 1: Landing Page (`/`)](#modul-1-landing-page-)
2. [Modul 2: Autentikasi Pengguna (`/login`, `/register`, `/reset-password`)](#modul-2-autentikasi-pengguna)
3. [Modul 3: Onboarding Pengguna Baru (`/onboarding`)](#modul-3-onboarding-pengguna-baru)
4. [Modul 4: User Dashboard (`/home` & `/dashboard`)](#modul-4-user-dashboard)
5. [Modul 5: Rekam Jejak Pengalaman & AI Smart Extractor (`/experience`)](#modul-5-rekam-jejak-pengalaman--ai-smart-extractor)
6. [Modul 6: Skill Matrix & Bukti Kevalidan (`/skills`)](#modul-6-skill-matrix--bukti-kevalidan)
7. [Modul 7: Sasaran Karier & Gap Analysis AI (`/career`)](#modul-7-sasaran-karier--gap-analysis-ai)
8. [Modul 8: Rekomendasi Belajar AI (`/learning`)](#modul-8-rekomendasi-belajar-ai)
9. [Modul 9: Peluang Karier & Magang (`/opportunities`)](#modul-9-peluang-karier--magang)
10. [Modul 10: Portofolio Publik AI (`/portfolio` & `/u/[slug]`)](#modul-10-portofolio-publik-ai)
11. [Modul 11: Profil Pengguna & Edit Data Diri (`/profile`)](#modul-11-profil-pengguna--edit-data-diri)
12. [Modul 12: Pengaturan Akun & Keamanan (`/settings`)](#modul-12-pengaturan-akun--keamanan)
13. [Modul 13: Admin Portal - Login & Dashboard (`/admin/login`, `/admin/dashboard`)](#modul-13-admin-portal---login--dashboard)
14. [Modul 14: Admin Portal - CRUD Master Data](#modul-14-admin-portal---crud-master-data)
15. [Modul 15: Global UI, Tema Dark/Light & Responsivitas Mobile](#modul-15-global-ui-tema-darklight--responsivitas-mobile)

---

## Modul 1: Landing Page (`/`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-LP-001** | Akses Halaman Utama | Buka URL root `/` pada browser. | URL: `/` | Landing page terbuka sempurna, hero headline, mockup visual, badge, dan logo Growvia tampil jernih. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-002** | Navigasi Menu Navbar | Klik menu navbar (Fitur, Solusi, Cara Kerja, FAQ). | Klik tautan navbar | Halaman melakukan smooth-scroll ke seksi konten yang dituju tanpa glitch. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-003** | CTA Tombol "Mulai Sekarang" / "Daftar" | Klik tombol CTA utama "Mulai Sekarang Gratis" di hero atau navbar. | Klik tombol CTA | Pengguna diarahkan ke halaman pendaftaran `/register`. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-004** | CTA Tombol "Masuk" | Klik tombol "Masuk" pada navbar landing page. | Klik tombol Masuk | Pengguna diarahkan ke halaman login `/login`. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-005** | Toggle Dark Mode di Landing Page | Klik ikon toggle tema (Sun/Moon) di navbar. | Klik tombol tema | Seluruh latar belakang, teks, kartu, dan gradien beralih antara mode Terang (Light) dan Gelap (Dark) tanpa teks yang tidak terbaca. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-006** | Accordion FAQ | Buka seksi FAQ, klik salah satu pertanyaan. | Klik baris accordion FAQ | Jawaban terbuka dengan animasi akordeon halus, dan tertutup saat diklik kembali. | [ ] PASS<br>[ ] FAIL |
| **TC-LP-007** | Footer Links | Periksa tautan legalitas dan sosial media di footer. | Klik tautan footer | Tautan mengarah ke bagian yang relevan / target halaman eksternal terbuka di tab baru. | [ ] PASS<br>[ ] FAIL |

---

## Modul 2: Autentikasi Pengguna

### A. Registrasi Akun Baru (`/register`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-001** | Validasi Form Kosong | Buka `/register`, langsung klik tombol "Daftar Akun Baru". | Field kosong | Muncul pesan error validasi di bawah input (Nama, Email, dan Password wajib diisi). | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-002** | Validasi Format Email Salah | Masukkan email tidak valid. | Email: `bukanemail` | Muncul pesan error format email tidak valid. | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-003** | Validasi Panjang Password | Masukkan password kurang dari 6 karakter. | Password: `12345` | Muncul peringatan bahwa password minimal 6 karakter. | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-004** | Registrasi Berhasil | Isi seluruh form dengan data baru yang valid, lalu submit. | Nama: `Budi Santoso`<br>Email: `budi.tester@test.com`<br>Pass: `Password123!` | Registrasi berhasil, muncul notifikasi sukses, dan diarahkan ke alur `/onboarding` atau verifikasi. | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-005** | Registrasi Email Duplikat | Daftar kembali menggunakan email yang sudah terdaftar sebelumnya. | Email yang sudah ada | Muncul pesan error "Email sudah terdaftar. Silakan gunakan email lain atau masuk". | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-006** | Link Pindah ke Halaman Login | Klik tautan "Sudah punya akun? Masuk". | Klik tautan | Browser berpindah ke halaman `/login`. | [ ] PASS<br>[ ] FAIL |

### B. Login Email & Password (`/login`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-007** | Login dengan Password Salah | Masukkan email terdaftar dengan password keliru. | Email: `demo@growvia.id`<br>Pass: `SalahPass123` | Muncul alert merah error bahwa email atau password tidak valid. Tidak bisa masuk. | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-008** | Toggle Tampilkan / Sembunyikan Password | Ketik password, lalu klik ikon mata (Eye/EyeOff). | Klik ikon mata | Karakter password beralih antara tipe `password` (tersembunyi) dan `text` (terlihat). | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-009** | Login Berhasil (Email & Password) | Masukkan email dan password yang valid, klik "Masuk". | Email & Password valid | Tombol menampilkan status loading, muncul feedback sukses, dan otomatis redirect ke `/home` atau `/dashboard`. | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-010** | Fitur "Ingat Saya" (Remember Me) | Centang checkbox "Ingat Saya" sebelum menekan login. | Checkbox: `Checked` | Sesi login tersimpan lebih lama di browser cookies/localStorage. | [ ] PASS<br>[ ] FAIL |

### C. Login dengan Google OAuth

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-011** | Login via Tombol Akun Google | Klik tombol "Masuk dengan Google" pada form login. | Klik tombol Google | Browser mengarahkan ke halaman persetujuan Google Accounts, setelah memilih akun diarahkan kembali via callback dan masuk ke dashboard. | [ ] PASS<br>[ ] FAIL |

### D. Lupa Password & Reset Password

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-012** | Permintaan Reset Password | Klik "Lupa kata sandi?" di modal/halaman login, masukkan email terdaftar, klik kirim. | Email terdaftar | Muncul pesan konfirmasi bahwa tautan reset telah dikirim (atau URL dev reset jika lokal). | [ ] PASS<br>[ ] FAIL |
| **TC-AUTH-013** | Eksekusi Ubah Password via Link Reset | Buka link reset password, masukkan password baru dan konfirmasi, klik simpan. | Password Baru: `PasswordBaru2026!` | Password berhasil diperbarui, dan pengguna dapat login dengan password baru. | [ ] PASS<br>[ ] FAIL |

---

## Modul 3: Onboarding Pengguna Baru (`/onboarding`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-ONB-001** | Akses Proteksi Onboarding | Akses `/onboarding` setelah registrasi akun baru. | Akun belum setup profil | Halaman onboarding terbuka dengan wizard bertahap (Progress Bar Step 1 dari 3). | [ ] PASS<br>[ ] FAIL |
| **TC-ONB-002** | Step 1: Data Pendidikan / Kampus | Pilih Universitas, ketik/pilih Jurusan, dan masukkan Tahun Target Kelulusan. | Univ: `Universitas Indonesia`<br>Jurusan: `Teknik Informatika`<br>Tahun: `2026` | Input tersimpan, tombol "Lanjut" menjadi aktif. | [ ] PASS<br>[ ] FAIL |
| **TC-ONB-003** | Step 2: Pemilihan Sasaran Karier | Pilih bidang minat (misal: Software Engineering / UI/UX Design) dan role target spesifik. | Role: `Frontend Engineer` atau `Associate Product Designer` | Kartu role terpilih mendapatkan highlight aktif, tombol "Lanjut" bisa ditekan. | [ ] PASS<br>[ ] FAIL |
| **TC-ONB-004** | Step 3: Input Keahlian Awal | Pilih minimal 3 skill yang sudah dikuasai beserta level kemahirannya. | Skill: `React.js`, `Figma`, `JavaScript` | Badge skill terpilih bertambah, counter skill valid. | [ ] PASS<br>[ ] FAIL |
| **TC-ONB-005** | Penyelesaian Wizard Onboarding | Klik tombol "Selesaikan Setup & Masuk ke Dashboard". | Klik Selesai | Data tersimpan ke Supabase melalui API, profil terkonfigurasi, dan langsung dialihkan ke `/home` atau `/dashboard`. | [ ] PASS<br>[ ] FAIL |

---

## Modul 4: User Dashboard (`/home` & `/dashboard`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-DASH-001** | Server Pre-fetch LCP & Data Pengguna | Buka `/home` atau `/dashboard`. Periksa header profil pengguna. | Akses halaman | Halaman terbuka cepat tanpa skeleton berkepanjangan (SSR aktif). Nama pengguna, headline, kampus, dan tag kelulusan tampil sesuai data user. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-002** | Verifikasi 4 Stat Cards Utama | Periksa 4 kartu statistik di bagian atas dashboard. | Observasi visual | 1. **Career Readiness Score:** Tampil persentase kesiapan (0-100%).<br>2. **Total Skill:** Tampil jumlah hard skill & soft skill.<br>3. **Skill Gap:** Tampil jumlah skill yang belum terpenuhi.<br>4. **Portofolio Publik:** Tampil persentase kelengkapan & status aktif/draft. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-003** | Interaktivitas Grafik Skill Pattern Map | Klik toggle mode grafik antara **"Sasaran Karier"** dan **"Level Kompetensi"**. | Klik tab toggle | Tampilan bar chart bertransisi dengan mulus. Saat kursor diarahkan ke bar (hover), tooltip menampilkan detail skor dan status gap. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-004** | Indikator Kategori Keahlian | Periksa diagram sebaran keahlian di samping kiri. | Observasi visual | Menampilkan breakdown kategori skill (Hard Skill, Soft Skill, dsb.) dengan tinggi kartu simetris. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-005** | Fitur Insight AI Growvia (Abaikan Sementara) | Pada kartu rekomendasi AI, klik tombol **"Abaikan Sementara"**. | Klik Abaikan Sementara | Kartu insight tertutup/diabaikan, dan daftar rekam jejak pengalaman di bawahnya otomatis bergeser naik secara rapi. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-006** | Fitur Insight AI Growvia (Terima Rekomendasi) | Pada kartu rekomendasi AI, klik tombol **"Terima Rekomendasi"**. | Klik Terima | Skill yang disarankan AI otomatis tersimpan ke daftar skill profil pengguna, muncul toast sukses. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-007** | Quick Add Rekam Jejak Pengalaman | Klik tombol **"+ Tambah Pengalaman"** di kartu rekam jejak dashboard. | Klik + Tambah | Modal popup formulir kilat terbuka. Pengguna dapat mengisi judul, instansi, jenis pengalaman, dan menyimpan langsung dari dashboard. | [ ] PASS<br>[ ] FAIL |
| **TC-DASH-008** | Klik Modul Kilat & Peluang Karier | Klik salah satu item rekomendasi modul kilat atau kartu peluang kerja di dashboard. | Klik kartu | Pengguna diarahkan ke halaman detail modul pembelajaran atau peluang karier yang relevan. | [ ] PASS<br>[ ] FAIL |

---

## Modul 5: Rekam Jejak Pengalaman & AI Smart Extractor (`/experience`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-EXP-001** | Filter Kategori Pengalaman | Klik tab filter: Semua, Magang, Organisasi, Kepanitiaan, Proyek, dsb. | Klik filter tab | Daftar pengalaman terfilter sesuai tipe yang dipilih dengan instan. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-002** | Pencarian Pengalaman | Ketik kata kunci pada kotak search rekam jejak. | Search: nama instansi atau posisi | Kartu pengalaman menyaring otomatis berdasarkan kecocokan teks. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-003** | Tambah Pengalaman Baru (Manual) | Klik tombol "+ Tambah Pengalaman", lengkapi form modal, klik simpan. | Judul: `Frontend Intern`<br>Instansi: `PT Teknologi Maju`<br>Tipe: `Magang`<br>Periode valid | Pengalaman baru tersimpan ke database, muncul di urutan teratas daftar, dan stat counter bertambah. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-004** | Edit Pengalaman | Klik tombol edit (pensil) pada salah satu kartu pengalaman, ubah data, simpan. | Ubah deskripsi atau peran | Perubahan langsung tercermin pada kartu pengalaman tanpa merusak data lainnya. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-005** | Hapus Pengalaman | Klik tombol hapus (ikon sampah), konfirmasi pada modal pop-up. | Klik Konfirmasi Hapus | Pengalaman terhapus dari daftar dan database, counter berkurang, muncul toast notifikasi. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-006** | **AI Smart Extractor — Ekstraksi Otomatis** | Klik tombol **"Ekstraksi Skill dengan AI"**, tempel teks deskripsi kegiatan yang panjang, klik Analisis. | Contoh teks: *"Sebagai ketua panitia, saya mengkoordinasikan 50 orang panitia, mengelola anggaran Rp 15 juta, dan menyusun timeline kerja..."* | AI Gemini memproses teks, memunculkan modal daftar skill yang berhasil dideteksi (misal: *Team Leadership, Budgeting, Event Management*) dengan skor keyakinan AI. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-007** | **AI Smart Extractor — Konfirmasi Skill** | Centang skill yang ingin disimpan ke profil dari hasil ekstraksi AI, klik **"Simpan Skill Terpilih"**. | Pilih skill hasil AI | Skill otomatis tertaut ke pengalaman tersebut dan ditambahkan ke Skill Matrix pengguna. | [ ] PASS<br>[ ] FAIL |
| **TC-EXP-008** | Pagination Rekam Jejak | Periksa pagination di bagian bawah jika pengalaman berjumlah lebih dari 6 item (desktop) atau 4 (mobile). | Klik tombol Halaman 2 / Next | Daftar pengalaman berganti ke halaman berikutnya dengan lancar. | [ ] PASS<br>[ ] FAIL |

---

## Modul 6: Skill Matrix & Bukti Kevalidan (`/skills`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-SKL-001** | Visualisasi Sebaran Skill | Buka halaman `/skills`. | Akses halaman | Menampilkan pengelompokan skill: Hard Skills, Soft Skills, Technical Skills, dan Leadership Skills lengkap dengan badge level kemahiran. | [ ] PASS<br>[ ] FAIL |
| **TC-SKL-002** | Tambah Skill Baru Manual | Klik tombol "+ Tambah Skill", cari nama skill dari database atau ketik baru, pilih tingkat kemahiran. | Skill: `TypeScript`<br>Level: `Intermediate` | Skill baru tersimpan dan muncul di kategori yang sesuai pada matriks. | [ ] PASS<br>[ ] FAIL |
| **TC-SKL-003** | Ubah Tingkat Kemahiran (Edit Skill) | Klik salah satu skill, ubah level kemahiran dari Beginner ke Advanced. | Update level kemahiran | Level skill berhasil diperbarui dan indikator visual progress bar ikut meningkat. | [ ] PASS<br>[ ] FAIL |
| **TC-SKL-004** | Hapus Skill dari Matriks | Klik opsi hapus pada kartu skill, konfirmasi modal. | Konfirmasi hapus | Skill terhapus dari profil pengguna, total skill berkurang. | [ ] PASS<br>[ ] FAIL |
| **TC-SKL-005** | Bukti Pengalaman Tertaut (Evidence Link) | Klik pada skill yang diekstrak dari pengalaman kerja/organisasi. | Klik tautan bukti | Menampilkan popup rincian pengalaman mana yang memvalidasi kepemilikan skill tersebut. | [ ] PASS<br>[ ] FAIL |

---

## Modul 7: Sasaran Karier & Gap Analysis AI (`/career`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CAR-001** | Tampilan Skor Kesiapan Karier (Readiness) | Buka `/career`. Periksa kartu Hero Match Card. | Akses halaman | Menampilkan target peran karier yang aktif, persentase kesiapan (match %), threshold standar industri (85%), dan status gap. | [ ] PASS<br>[ ] FAIL |
| **TC-CAR-002** | Ubah Target Peran Karier | Klik tombol **"Ganti Target Karier"**, pilih role lain dari daftar atau ketik peran impian. | Role: `Data Scientist` | Target karier berganti, sistem otomatis menganalisis ulang skill gap terhadap syarat posisi baru tersebut. | [ ] PASS<br>[ ] FAIL |
| **TC-CAR-003** | Kolom Pemetaan Skill Gap | Periksa 2 kolom: **"Skill Dikuasai"** vs **"Skill Perlu Ditingkatkan / Missing"**. | Observasi visual | Setiap skill gap diberi label prioritas (Missing / Perlu Dikejar) untuk mencapai standar kelulusan. | [ ] PASS<br>[ ] FAIL |
| **TC-CAR-004** | Fitur Evaluasi Ulang AI (Re-Analyze) | Klik tombol **"Evaluasi Ulang AI"** di pojok kanan atas. | Klik Evaluasi Ulang | AI Gemini menghitung ulang seluruh matriks skill terbaru terhadap persyaratan industri, dan memperbarui skor kesiapan karier secara dinamis. | [ ] PASS<br>[ ] FAIL |
| **TC-CAR-005** | Roadmap Pertumbuhan (Growth Roadmap) | Scroll ke bagian Roadmap Pertumbuhan di bawah gap analysis. | Observasi visual | Menampilkan tahapan step-by-step rekomendasi langkah yang harus diambil user untuk menutup skill gap. | [ ] PASS<br>[ ] FAIL |

---

## Modul 8: Rekomendasi Belajar AI (`/learning`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-LRN-001** | Kurasi Materi Sesuai Skill Gap | Buka `/learning`. Periksa kartu rekomendasi unggulan. | Akses halaman | Modul yang direkomendasikan secara cerdas mencocokkan skill yang masih menjadi gap pada profil pengguna. | [ ] PASS<br>[ ] FAIL |
| **TC-LRN-002** | Filter Kategori Materi Belajar | Klik filter: Semua, Gratis, Sertifikasi, Pemula, Tingkat Lanjut. | Klik filter bar | Daftar kartu kursus terfilter dengan tepat. | [ ] PASS<br>[ ] FAIL |
| **TC-LRN-003** | Modal Detail Kursus | Klik salah satu kartu modul pembelajaran. | Klik modul | Modal detail terbuka menampilkan deskripsi lengkap, platform penyedia, estimasi jam belajar, dan skill yang akan didapatkan. | [ ] PASS<br>[ ] FAIL |
| **TC-LRN-004** | Simulasi Dampak Kesiapan (Impact Simulation) | Periksa badge dampak kesiapan pada kartu kursus (misal: *"+8% Kesiapan Karier"*). | Observasi visual | Menampilkan estimasi kenaikan skor karier jika modul tersebut diselesaikan. | [ ] PASS<br>[ ] FAIL |
| **TC-LRN-005** | Tautan Akses Materi Belajar | Klik tombol "Mulai Belajar" / "Kunjungi Kursus". | Klik tautan | Tautan eksternal ke platform penyedia kursus (Coursera, Udemy, Dicoding, dsb.) terbuka di tab baru. | [ ] PASS<br>[ ] FAIL |
| **TC-LRN-006** | Simpan Modul Belajar (Bookmark) | Klik ikon bookmark pada kartu modul belajar. | Klik bookmark | Modul tersimpan ke daftar tersimpan dan dapat diakses kembali melalui modal "Modul Tersimpan". | [ ] PASS<br>[ ] FAIL |

---

## Modul 9: Peluang Karier & Magang (`/opportunities`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-OPP-001** | Skor Kesesuaian Lowongan (Match Score) | Buka `/opportunities`. Periksa badge persentase kecocokan pada setiap lowongan. | Akses halaman | Tiap lowongan menampilkan skor kecocokan (misal: *88% Match*) berdasarkan skill user yang match dengan requirement. | [ ] PASS<br>[ ] FAIL |
| **TC-OPP-002** | Filter Jenis Pekerjaan & Tipe Kerja | Pilih filter: Magang (Internship), Full-time, Remote, Onsite. | Pilih opsi filter | Daftar pekerjaan menyaring hanya posisi yang memenuhi kriteria pilihan. | [ ] PASS<br>[ ] FAIL |
| **TC-OPP-003** | Pencarian Posisi atau Perusahaan | Ketik kata kunci pada kolom pencarian lowongan. | Search: nama perusahaan atau jabatan | Hasil pencarian menampilkan lowongan terkait secara langsung. | [ ] PASS<br>[ ] FAIL |
| **TC-OPP-004** | Modal Rincian Kualifikasi Lowongan | Klik pada salah satu kartu lowongan pekerjaan. | Klik kartu | Modal detail terbuka: menampilkan deskripsi pekerjaan, gaji/stipend (jika ada), requirement skill, serta indikator skill apa saja yang sudah dimiliki vs belum dimiliki user. | [ ] PASS<br>[ ] FAIL |
| **TC-OPP-005** | Simpan Lowongan (Bookmark) | Klik ikon simpan/bookmark lowongan. | Klik simpan | Lowongan masuk ke tab "Lowongan Tersimpan" untuk ditinjau nanti. | [ ] PASS<br>[ ] FAIL |
| **TC-OPP-006** | Tombol "Lamar Sekarang" (Apply CTA) | Klik tombol "Lamar Sekarang" pada detail lowongan. | Klik tombol Lamar | Pengguna diarahkan ke tautan formulir karir resmi perusahaan di tab baru. | [ ] PASS<br>[ ] FAIL |

---

## Modul 10: Portofolio Publik AI (`/portfolio` & `/u/[slug]`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-PORT-001** | Editor & Live Preview Portofolio | Buka `/portfolio`. Periksa panel kiri (Editor) dan panel kanan (Live Preview). | Akses halaman | Editor portofolio memuat data profil. Frame live preview merender simulasi halaman portofolio secara instan. | [ ] PASS<br>[ ] FAIL |
| **TC-PORT-002** | Kustomisasi Slug URL Portofolio | Ubah teks slug portofolio pada form editor (misal: `budi-santoso-uiux`), klik simpan. | Slug: `budi-santoso-uiux` | Slug tersimpan, tautan publik berubah menjadi `/u/budi-santoso-uiux`. | [ ] PASS<br>[ ] FAIL |
| **TC-PORT-003** | Toggle Publikasikan Portofolio | Aktifkan toggle switch "Publikasikan Portofolio". | Switch: `Aktif` | Status portofolio berubah menjadi live/publik. Tombol "Bagikan" dan "Lihat Publik" aktif. | [ ] PASS<br>[ ] FAIL |
| **TC-PORT-004** | Modal Bagikan Portofolio | Klik tombol "Bagikan Tautan". | Klik Bagikan | Modal terbuka menampilkan tautan portofolio dan tombol salin link (copy to clipboard). | [ ] PASS<br>[ ] FAIL |
| **TC-PORT-005** | Akses Portofolio Publik Tanpa Login | Salin link `/u/[slug]`, buka di jendela penyamaran (**Incognito Mode**) tanpa login. | Akses URL `/u/[slug]` | Halaman portofolio publik terbuka dengan desain elegan, menampilkan foto profil, headline, bio, matriks skill terverifikasi, riwayat pengalaman, dan kontak tanpa mewajibkan login. | [ ] PASS<br>[ ] FAIL |
| **TC-PORT-006** | Portofolio Tidak Terbit (Draft Mode) | Nonaktifkan switch publikasi, lalu coba buka URL `/u/[slug]` di Incognito. | Akses URL saat draft | Halaman menampilkan pesan bahwa portofolio bersifat privat atau belum dipublikasikan oleh pemiliknya. | [ ] PASS<br>[ ] FAIL |

---

## Modul 11: Profil Pengguna & Edit Data Diri (`/profile`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-PROF-001** | Load Data Profil Saat Ini | Buka halaman `/profile`. | Akses halaman | Form terisi otomatis dengan data nama, foto, headline, universitas, jurusan, dan bio pengguna saat ini. | [ ] PASS<br>[ ] FAIL |
| **TC-PROF-002** | Upload / Ganti Foto Profil (Avatar) | Klik area upload foto atau drag-and-drop file gambar (JPG/PNG). | File gambar < 2MB | Foto baru terunggah, preview avatar terbarui secara real-time. | [ ] PASS<br>[ ] FAIL |
| **TC-PROF-003** | Searchable Select Kampus & Jurusan | Ketik nama kampus pada dropdown universitas dan jurusan. | Cari nama kampus | Dropdown menampilkan filter pencarian universitas/jurusan Indonesia dengan cepat dan dapat dipilih. | [ ] PASS<br>[ ] FAIL |
| **TC-PROF-004** | Simpan Perubahan Profil | Ubah nama, headline, dan bio singkat, lalu klik tombol **"Simpan Perubahan"**. | Data profil baru | Tombol menampilkan status loading, muncul notifikasi sukses, dan data di header navigasi ikut ter-update. | [ ] PASS<br>[ ] FAIL |

---

## Modul 12: Pengaturan Akun & Keamanan (`/settings`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-SET-001** | Ubah Password — Validasi Password Lama Salah | Pada tab Keamanan, masukkan password lama yang salah, isi password baru, klik simpan. | Pass Lama: `SalahPassword`<br>Pass Baru: `Baru2026!` | Muncul pesan error "Kata sandi saat ini tidak sesuai". Password tidak berubah. | [ ] PASS<br>[ ] FAIL |
| **TC-SET-002** | Ubah Password — Konfirmasi Tidak Cocok | Masukkan password baru yang tidak sama dengan konfirmasi password baru. | Pass Baru: `Baru2026!`<br>Konfirmasi: `BedaLain!` | Muncul pesan error validasi bahwa konfirmasi kata sandi tidak cocok. | [ ] PASS<br>[ ] FAIL |
| **TC-SET-003** | Ubah Password Berhasil | Masukkan password lama yang benar, dan password baru yang valid, klik simpan. | Pass Lama benar<br>Pass Baru: `PassBaruAman2026!` | Password berhasil diubah, muncul toast sukses, form ter-reset. Pengguna bisa login dengan password baru. | [ ] PASS<br>[ ] FAIL |
| **TC-SET-004** | Tab Privasi & Visibilitas Portofolio | Pindah ke tab Privasi, toggle switch publikasi portofolio. | Klik toggle privasi | Status privasi tersimpan, URL portofolio publik aktif/nonaktif sesuai pilihan. | [ ] PASS<br>[ ] FAIL |
| **TC-SET-005** | Tab Danger Zone — Konfirmasi Hapus Akun | Buka tab Danger Zone, klik "Hapus Akun". Pada modal konfirmasi ketik frasa pengaman dan password. | Frasa: `HAPUS AKUN SAYA`<br>Password akun | Sistem memvalidasi ganda. Jika valid, akun dan seluruh relasi data terhapus permanen dari Supabase dan diarahkan ke landing page. | [ ] PASS<br>[ ] FAIL |
| **TC-SET-006** | Logout Pengguna | Klik menu dropdown profil di navbar kanan atas, lalu klik **"Keluar"** (Logout). | Klik Logout | Sesi auth terhapus, cookies dibersihkan, dan pengguna diarahkan kembali ke halaman login. | [ ] PASS<br>[ ] FAIL |

---

## Modul 13: Admin Portal - Login & Dashboard

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-ADM-001** | Akses Halaman Login Admin | Buka URL `/admin/login` pada browser. | URL: `/admin/login` | Halaman login khusus admin terbuka dengan tema eksklusif admin, background ambient, dan proteksi khusus. | [ ] PASS<br>[ ] FAIL |
| **TC-ADM-002** | Login Admin Gagal (Kredensial Salah) | Masukkan email/password admin yang salah. | Email: `admin@growvia.id`<br>Pass: `BukanAdmin123` | Muncul pesan error "Kredensial admin tidak valid". Akses ditolak. | [ ] PASS<br>[ ] FAIL |
| **TC-ADM-003** | Login Admin Berhasil | Masukkan email dan password admin yang sah. | Email: `admin@growvia.id`<br>Pass: `AdminGrowvia2026!` | Login sukses, diarahkan langsung ke `/admin/dashboard`. Cookie admin tersimpan. | [ ] PASS<br>[ ] FAIL |
| **TC-ADM-004** | Proteksi Rute Admin (Route Guarding) | Buka tab Incognito, langsung akses `/admin/dashboard` tanpa login. | Akses URL admin langsung | Sistem menolak akses dan secara otomatis me-redirect ke `/admin/login`. | [ ] PASS<br>[ ] FAIL |
| **TC-ADM-005** | Tampilan Admin Dashboard Overview | Masuk ke `/admin/dashboard`. Periksa kartu metrik ringkasan. | Akses dashboard admin | Menampilkan statistik total pengguna terdaftar, total skill master, lowongan kerja aktif, dan materi pembelajaran. | [ ] PASS<br>[ ] FAIL |

---

## Modul 14: Admin Portal - CRUD Master Data

### A. CRUD Master Skills (`/admin/skills`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CRUD-SKL-01** | Tampilan Tabel Skills & Pencarian | Buka `/admin/skills`, ketik nama skill pada input pencarian. | Search: `React` atau `Figma` | Tabel menyaring daftar master skills sesuai kata kunci secara cepat. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-SKL-02** | Tambah Master Skill Baru | Klik "+ Tambah Skill", masukkan nama skill baru dan pilih kategori (Hard Skill/Soft Skill/Technical/Leadership), klik Simpan. | Nama: `GraphQL`<br>Kategori: `Technical` | Skill baru tersimpan di database Prisma/Supabase dan langsung muncul pada tabel. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-SKL-03** | Edit Master Skill | Klik ikon edit pada salah satu skill, ubah nama atau kategori, simpan. | Ubah nama atau kategori | Data skill ter-update di tabel dan database. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-SKL-04** | Hapus Master Skill (Safe Delete) | Klik ikon hapus (sampah), konfirmasi pada modal SafeDelete. | Konfirmasi Hapus | Skill terhapus dari master database (jika belum tertaut pada relasi wajib) dengan aman. | [ ] PASS<br>[ ] FAIL |

### B. CRUD Career Roles (`/admin/career-roles`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CRUD-ROL-01** | Tampilan Daftar Career Roles | Buka `/admin/career-roles`. | Akses halaman | Menampilkan daftar seluruh peran karier target beserta industri dan jumlah skill yang dipersyaratkan. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-ROL-02** | Tambah Career Role Baru | Klik "+ Tambah Role", isi Nama Role, Industri, Deskripsi, dan pilih skill syarat. | Role: `Cloud Solutions Architect`<br>Industri: `Enterprise SaaS` | Role karier baru berhasil dibuat dan langsung tersedia untuk dipilih pengguna di menu Sasaran Karier. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-ROL-03** | Edit & Atur Bobot Skill Role | Klik edit pada salah satu role, sesuaikan tingkat kepentingan skill (Required / Recommended). | Ubah bobot skill | Syarat peran karier berhasil diperbarui. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-ROL-04** | Hapus Career Role | Klik hapus pada role yang tidak digunakan, konfirmasi modal. | Konfirmasi Hapus | Peran karier terhapus dari sistem. | [ ] PASS<br>[ ] FAIL |

### C. CRUD Learning Resources (`/admin/learning-resources`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CRUD-LRN-01** | Tambah Resource Modul Belajar | Buka `/admin/learning-resources`, klik "+ Tambah Resource", isi judul, platform penyedia, URL kursus, estimasi jam, dan tag skill. | Judul: `Mastering Next.js 15`<br>Platform: `Dicoding`<br>URL: `https://...` | Modul baru tersimpan dan otomatis muncul sebagai rekomendasi belajar bagi user yang memiliki gap skill tersebut. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-LRN-02** | Edit & Hapus Modul Belajar | Ubah data modul belajar atau hapus modul yang sudah usang. | Edit / Hapus | Perubahan tersimpan di database dan daftar modul ter-update. | [ ] PASS<br>[ ] FAIL |

### D. CRUD Career Opportunities (`/admin/opportunities`)

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CRUD-OPP-01** | Tambah Lowongan Pekerjaan Baru | Buka `/admin/opportunities`, klik "+ Tambah Lowongan", isi posisi, nama perusahaan, lokasi, tipe kerja (Remote/Internship), URL lamaran, dan skill syarat. | Posisi: `Junior Backend Engineer`<br>Perusahaan: `Unicorn Tech`<br>Tipe: `Internship` | Lowongan berhasil ditambahkan dan langsung muncul di halaman `/opportunities` pengguna dengan skor kecocokan otomatis. | [ ] PASS<br>[ ] FAIL |
| **TC-CRUD-OPP-02** | Ubah Status Lowongan / Hapus | Edit lowongan untuk mengubah status aktif/tutup, atau hapus lowongan yang telah kedaluwarsa. | Status: Closed atau Hapus | Lowongan yang ditutup tidak lagi muncul pada rekomendasi aktif pengguna. | [ ] PASS<br>[ ] FAIL |

---

## Modul 15: Global UI, Tema Dark/Light & Responsivitas Mobile

| ID Test Case | Skenario Uji | Langkah Pengujian (Steps) | Data Uji (Input) | Hasil yang Diharapkan (Expected Result) | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-UI-001** | Tema Dark Mode Seluruh Halaman | Aktifkan Dark Mode, lalu jelajahi seluruh menu (Dashboard, Pengalaman, Skill, Karier, Belajar, Peluang, Portofolio, Admin). | Mode: `Dark` | Latar belakang berwarna gelap konsisten (`#0B0F19` / `#121B2B`), teks kontras tinggi berwarna terang, sidebar dan kartu tetap jelas tanpa ada elemen putih bocor. | [ ] PASS<br>[ ] FAIL |
| **TC-UI-002** | Tema Light Mode Seluruh Halaman | Aktifkan Light Mode, lalu jelajahi seluruh menu. | Mode: `Light` | Tampilan bersih, kontras teks abu gelap/hitam di atas latar putih/abu muda (`#F5F6F8`) terbaca dengan sangat nyaman. | [ ] PASS<br>[ ] FAIL |
| **TC-UI-003** | Tipografi Poppins Konsisten | Periksa jenis font di seluruh halaman, modal popup, sidebar, dan tombol. | Inspeksi elemen font | Seluruh elemen menggunakan font keluarga **Poppins** tanpa ada fallback font default yang pecah. | [ ] PASS<br>[ ] FAIL |
| **TC-UI-004** | Responsivitas Mobile (Ukuran Layar 360px - 414px) | Buka DevTools, pilih simulasi perangkat (iPhone 14 / Pixel 7 / Samsung Galaxy). Uji seluruh halaman. | Resolusi mobile | Tampilan menyesuaikan ke layout 1 kolom. Tidak ada elemen atau kartu yang overflow horizontal (tidak ada scrollbar horizontal yang bocor ke kanan). | [ ] PASS<br>[ ] FAIL |
| **TC-UI-005** | Sidebar Drawer Mobile | Pada layar mobile, klik tombol burger menu hamburger di pojok kiri atas navbar. | Klik burger menu | Sidebar drawer terbuka mulus dari sisi kiri, menu navigasi dapat diklik, dan drawer otomatis tertutup setelah menu dipilih atau saat backdrop luar disentuh. | [ ] PASS<br>[ ] FAIL |
| **TC-UI-006** | Smooth Touch Scrolling Mobile | Lakukan scrolling cepat menggunakan jari (swipe gesture) di perangkat smartphone pada halaman Dashboard dan Pengalaman. | Gesture sentuh mobile | Scrolling terasa ringan, mulus (*fluid momentum*), dan responsif terhadap sentuhan tanpa lag. | [ ] PASS<br>[ ] FAIL |

---

## 📝 LEMBAR CATATAN TEMUAN BUG (BUG REPORT TEMPLATE)

Apabila ditemukan kendala atau bug selama pengujian, silakan catat menggunakan format berikut:

| No | ID Test Case | Deskripsi Isu / Bug | Tingkat Keparahan (Low / Medium / High / Critical) | Bukti Tangkapan Layar (Screenshot / Video) | Catatan / Status Perbaikan |
| :-: | :--- | :--- | :---: | :---: | :--- |
| 1 | *Contoh: TC-EXP-006* | *AI Extractor timeout saat teks deskripsi melebihi 2000 kata* | *Medium* | `screenshot-bug1.png` | *Dalam Investigasi* |
| 2 | | | | | |
| 3 | | | | | |

---

**Growvia Career Compass Team — 2026**  
*Empowering Students & Fresh Graduates through Verified Skills & AI Career Compass.*
