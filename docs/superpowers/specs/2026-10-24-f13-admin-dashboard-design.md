# Design Specification: F13 Admin Dashboard & Master Data Management

**Document Status:** Approved for Implementation Planning  
**Target Release:** Sprint 6 (Feature F13)  
**Author:** Antigravity AI Pair Programmer & Kokoirham47  
**Date:** 2026-10-24  
**PRD Reference:** [`plan-md/prd.md`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/plan-md/prd.md#L392-L494)

---

## 1. Executive Summary & Goals

Admin Dashboard adalah antarmuka internal terisolasi bagi tim pengelola Growvia untuk memelihara seluruh *master data* taksonomi yang menjadi fondasi utama sistem kecerdasan karier Growvia (AI Skill Extraction F04, Skill Profile F05, Career Gap F06, dan Learning Recommendation F07).

### Tujuan Utama:
1. **Autentikasi Terpisah & Aman (F13.1):** Portal login admin independen dengan masa aktif sesi 8 jam (`growvia_admin_token`), tanpa registrasi publik.
2. **Dashboard Overview (F13.2):** Metrik statistik *live* jumlah master skills, peran karier, materi belajar, dan lowongan karier.
3. **Skill Taxonomy Management (F13.3):** CRUD master skill lengkap dengan normalisasi otomatis (*normalized name*) dan mekanisme *safe-delete* yang memvalidasi dependensi relasi data.
4. **Career Roles & Paths Management (F13.4):** CRUD peran karier dengan dukungan penonaktifan (*soft-delete*) agar tidak merusak target pengguna eksisting.
5. **Career Required Skills Mapping (F13.5):** Matriks pemetaan keahlian yang dibutuhkan per peran karier beserta level minimum dan tingkat kepentingan (*importance*).
6. **Learning Resources Management (F13.6):** CRUD materi belajar dengan penandaan tag skill multi-select dan validasi minimal 1 tag.
7. **Career Opportunities Management (F13.7):** CRUD peluang karier/magang dengan penandaan tenggat waktu (*deadline*) dan status aktif/kedaluwarsa.

---

## 2. Arsitektur Keamanan & Autentikasi

### 2.1 Model Token & Session
- **Cookie Name:** `growvia_admin_token` (HTTP-only, Secure in production, SameSite=Lax).
- **JWT Payload:**
  ```json
  {
    "adminId": "uuid-string",
    "email": "admin@growvia.id",
    "name": "Super Admin Growvia",
    "role": "admin",
    "exp": 1730000000
  }
  ```
- **Masa Berlaku:** 8 Jam (28,800 detik) sesuai spesifikasi PRD F13.1.
- **Penyimpanan Password:** Hash menggunakan `bcryptjs` (salt rounds: 10).
- **Entitas Database:** Tabel `admins` pada schema Prisma:
  ```prisma
  model Admin {
    id            String    @id @default(uuid()) @db.Uuid
    name          String
    email         String    @unique
    passwordHash  String    @map("password_hash")
    lastLoginAt   DateTime? @map("last_login_at")
    createdAt     DateTime  @default(now()) @map("created_at")
    ...
  }
  ```

### 2.2 Middleware Protection Pipeline
Alur kerja proteksi rute di [`src/middleware.ts`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/src/middleware.ts):
1. **Rute Publik Admin:**
   - `/admin/login`: Jika sudah memiliki cookie `growvia_admin_token` valid, diarahkan langsung (*redirect*) ke `/admin/dashboard`.
   - `/api/admin/auth/login`: Endpoint publik untuk proses autentikasi admin.
2. **Rute Terproteksi Admin:**
   - Seluruh rute `/admin/(dashboard|skills|career-roles|learning-resources|opportunities)` wajib memiliki cookie `growvia_admin_token` valid. Jika tidak valid/tiada, dialihkan ke `/admin/login`.
   - Seluruh endpoint API `/api/admin/*` (selain login) memverifikasi token admin dan meneruskan header internal `x-admin-id` dan `x-admin-email`. Jika tidak valid, mengembalikan respon `401 Unauthorized`.
3. **Isolasi Mutlak dari User Biasa:**
   - Token user (`growvia_token`) tidak dapat digunakan untuk mengakses `/admin/*`.
   - Token admin (`growvia_admin_token`) tidak mencampuri sesi user di `/home` atau dashboard biasa.

---

## 3. Rute Halaman & Struktur Antarmuka (UI/UX)

Admin Dashboard menggunakan tata letak terpisah khusus admin: [`src/app/(admin)/admin/layout.tsx`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/src/app/(admin)/admin/layout.tsx).

```text
src/
├── app/
│   └── (admin)/
│       └── admin/
│           ├── layout.tsx                     # Layout khusus Admin Portal (Sidebar + Topbar)
│           ├── login/
│           │   └── page.tsx                   # F13.1: Form Login Admin
│           ├── dashboard/
│           │   └── page.tsx                   # F13.2: Overview Metrik Master Data
│           ├── skills/
│           │   └── page.tsx                   # F13.3: Master Data Skill Taxonomy
│           ├── career-roles/
│           │   ├── page.tsx                   # F13.4: Master Data Career Roles
│           │   └── [id]/
│           │       └── skills/
│           │           └── page.tsx           # F13.5: Required Skills per Career Role
│           ├── learning-resources/
│           │   └── page.tsx                   # F13.6: Master Data Learning Resources
│           └── opportunities/
│               └── page.tsx                   # F13.7: Master Data Career Opportunities
```

### 3.1 Komponen Tata Letak Admin
- **`AdminSidebar`**:
  - Logo Growvia dengan badge penanda `ADMIN CONSOLE`.
  - Menu Navigasi:
    1. Overview (`/admin/dashboard`)
    2. Skill Taxonomy (`/admin/skills`)
    3. Career Paths (`/admin/career-roles`)
    4. Learning Resources (`/admin/learning-resources`)
    5. Career Opportunities (`/admin/opportunities`)
  - Profil admin aktif & tombol Cepat Keluar (*Sign Out*).
- **`AdminTopbar`**:
  - Breadcrumbs navigasi modul saat ini.
  - Tombol toggle Tema (Dark / Light mode).
  - Quick link kembali ke Landing Page / Portal Utama.
- **Komponen Shared Admin**:
  - `AdminDataTable`: Tabel data responsif dengan sorting, pagination, search bar real-time, dan status badge.
  - `AdminStatCard`: Kartu indikator ringkasan dengan ikon modern dan animasi aksen angka.
  - `SafeDeleteModal`: Dialog konfirmasi penghapusan aman yang memeriksa apakah data memiliki relasi sebelum diizinkan dihapus.
  - `AdminCRUDModal`: Dialog modal formulir input yang bersih dengan validasi form berbasis state.

---

## 4. Spesifikasi Kontrak API Admin (`/api/admin/*`)

| Endpoint | Method | Deskripsi | Request Body / Params | Response |
|---|---|---|---|---|
| `/api/admin/auth/login` | `POST` | Login admin & set cookie | `{ email, password }` | `{ success: true, admin: { id, name, email } }` |
| `/api/admin/auth/logout` | `POST` | Logout admin & hapus cookie | - | `{ success: true }` |
| `/api/admin/auth/me` | `GET` | Cek status sesi admin saat ini | - | `{ success: true, admin: { id, name, email } }` |
| `/api/admin/overview` | `GET` | Total count 4 master data | - | `{ counts: { skills, careerRoles, learningResources, opportunities } }` |
| `/api/admin/skills` | `GET` | List skills (filter kategori, search, paginasi) | Query: `?page=1&limit=20&search=react&category=technical` | `{ data: Skill[], total, page, totalPages }` |
| `/api/admin/skills` | `POST` | Buat skill baru | `{ name, category, normalizedName? }` | `{ success: true, data: Skill }` |
| `/api/admin/skills/[id]` | `PUT` | Edit nama & kategori skill | `{ name, category, normalizedName? }` | `{ success: true, data: Skill }` |
| `/api/admin/skills/[id]` | `DELETE`| Hapus skill (dengan validasi dependensi) | - | `{ success: true }` atau `400 { message, usageCount }` |
| `/api/admin/career-roles` | `GET` | List career roles | Query: `?search=designer&industry=all` | `{ data: CareerRole[], total }` |
| `/api/admin/career-roles` | `POST` | Buat peran karier baru | `{ name, slug?, industry, description }` | `{ success: true, data: CareerRole }` |
| `/api/admin/career-roles/[id]` | `PUT` | Edit peran karier | `{ name, slug?, industry, description }` | `{ success: true, data: CareerRole }` |
| `/api/admin/career-roles/[id]` | `DELETE`| Soft delete / hapus peran karier | - | `{ success: true }` |
| `/api/admin/career-roles/[id]/skills` | `GET` | Daftar required skill peran ini | - | `{ data: CareerRoleSkill[] }` |
| `/api/admin/career-roles/[id]/skills` | `POST` | Tambah mapping skill ke peran | `{ skillId, importance, minLevel }` | `{ success: true, data: CareerRoleSkill }` |
| `/api/admin/career-roles/[id]/skills/[skillId]` | `PUT` | Ubah importance & minLevel | `{ importance, minLevel }` | `{ success: true, data: CareerRoleSkill }` |
| `/api/admin/career-roles/[id]/skills/[skillId]` | `DELETE`| Cabut skill dari peran karier | - | `{ success: true }` |
| `/api/admin/learning-resources` | `GET` | List learning resources | Query: `?search=...&type=...&difficulty=...` | `{ data: LearningResource[], total }` |
| `/api/admin/learning-resources` | `POST` | Tambah materi belajar baru | `{ title, platform, url, type, difficulty, durationMinutes, rating, description, skillIds: string[] }` | `{ success: true, data: LearningResource }` |
| `/api/admin/learning-resources/[id]` | `PUT` | Edit materi belajar & skill tags | `{ title, platform, url, type, difficulty, durationMinutes, rating, description, skillIds: string[], isActive?: boolean }` | `{ success: true, data: LearningResource }` |
| `/api/admin/learning-resources/[id]` | `DELETE`| Nonaktifkan materi belajar | - | `{ success: true }` |
| `/api/admin/opportunities` | `GET` | List lowongan karier | Query: `?search=...&type=...` | `{ data: CareerOpportunity[], total }` |
| `/api/admin/opportunities` | `POST` | Tambah lowongan baru | `{ title, company, location, sourceUrl, type, description, deadline, skillIds: string[] }` | `{ success: true, data: CareerOpportunity }` |
| `/api/admin/opportunities/[id]` | `PUT` | Edit lowongan & skill tags | `{ title, company, location, sourceUrl, type, description, deadline, skillIds: string[], isActive?: boolean }` | `{ success: true, data: CareerOpportunity }` |
| `/api/admin/opportunities/[id]` | `DELETE`| Nonaktifkan lowongan karier | - | `{ success: true }` |

---

## 5. Logika Bisnis & Validasi Khusus

### 5.1 Safe-Delete pada Master Skill (F13.3)
Sesuai aturan PRD F13.3, admin dilarang menghapus skill yang sedang memiliki keterkaitan data:
```typescript
const [userSkillsCount, roleSkillsCount, resourceTagsCount, oppTagsCount] = await Promise.all([
  prisma.userSkill.count({ where: { skillId } }),
  prisma.careerRoleSkill.count({ where: { skillId } }),
  prisma.resourceSkillTag.count({ where: { skillId } }),
  prisma.opportunitySkillTag.count({ where: { skillId } })
])

const totalDependencies = userSkillsCount + roleSkillsCount + resourceTagsCount + oppTagsCount
if (totalDependencies > 0) {
  return errorResponse(
    `Skill ini tidak dapat dihapus karena sedang digunakan oleh: ${userSkillsCount} pengguna, ${roleSkillsCount} peran karier, ${resourceTagsCount} materi belajar, dan ${oppTagsCount} lowongan.`,
    400
  )
}
```

### 5.2 Auto-Normalized Name Generator (F13.3)
Ketika admin menginputkan nama skill (misal: `"React.js Native & Redux"`), sistem otomatis meng-generate normalized name jika tidak diisi manual:
```typescript
function generateNormalizedName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
// Hasil: "react-js-native-redux"
```

### 5.3 Validasi Minimal 1 Skill Tag pada Resources & Opportunities (F13.6 & F13.7)
Setiap penambahan atau pembaruan `LearningResource` dan `CareerOpportunity` wajib menyertakan minimal 1 `skillId` yang valid agar sistem rekomendasi relevansi dapat bekerja.

---

## 6. Seed Data & Akun Awal Admin

Script [`prisma/seed_admin.ts`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/prisma/seed_admin.ts) disiapkan untuk meng-upsert akun admin default:
- **Email:** `admin@growvia.id`
- **Password:** `AdminGrowvia2026!`
- **Nama:** `Super Admin Growvia`
- **Password Hash:** Terenkripsi via `bcryptjs.hash('AdminGrowvia2026!', 10)`.

---

## 7. Rencana Verifikasi & Uji Terima (Acceptance Criteria)

- [ ] **Auth Independen:** Login dengan akun admin berhasil dan menyimpan cookie `growvia_admin_token`.
- [ ] **Proteksi Akses:** Mengakses `/admin/dashboard` tanpa login langsung me-redirect ke `/admin/login`.
- [ ] **Overview Counts:** Halaman overview menampilkan total hitungan real-time dari database.
- [ ] **CRUD Skill & Safe-Delete:**
  - Tambah skill baru berhasil dengan normalized name otomatis.
  - Menghapus skill yang dipakai oleh user/role/resource diblokir dengan pesan peringatan detail.
  - Menghapus skill tanpa dependensi berhasil.
- [ ] **CRUD Career Role & Mapping:**
  - Tambah peran karier baru dan kelola required skills beserta level minimumnya.
- [ ] **CRUD Learning Resources & Tagging:**
  - Tambah materi belajar dengan multi-select skill tags dan verifikasi relasi `resource_skill_tags`.
- [ ] **CRUD Opportunities & Status:**
  - Tambah lowongan karier dengan tanggal deadline dan verifikasi status aktif.
- [ ] **Responsif & Paritas Desain:** Tampilan tabel dan formulir modal bekerja responsif di desktop maupun mobile.
