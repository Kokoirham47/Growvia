# GROWVIA — Penjelasan Entity Relationship Diagram (ERD)
**Version 1.0**

---

## Gambaran Umum

ERD Growvia terdiri dari **20 entitas** yang dikelompokkan dalam **7 domain** sesuai dengan fitur utama platform. Setiap domain merepresentasikan satu area fungsional dari ekosistem Growvia.

| # | Domain | Entitas | Deskripsi Singkat |
|---|--------|---------|-------------------|
| 1 | Auth & User | `USER`, `EMAIL_VERIFICATION`, `SESSION` | Identitas dan autentikasi pengguna |
| 2 | Profile | `PROFILE`, `CAREER_INTEREST`, `CAREER_FIELD` | Data profil dan minat karier |
| 3 | Experience | `EXPERIENCE` | Rekam jejak pengalaman pengguna |
| 4 | Skill | `SKILL`, `USER_SKILL`, `SKILL_EVIDENCE` | Skill pengguna beserta bukti |
| 5 | AI Analysis | `AI_ANALYSIS_JOB`, `AI_SKILL_SUGGESTION` | Proses dan hasil ekstraksi skill oleh AI |
| 6 | Career Target | `CAREER_ROLE`, `CAREER_ROLE_SKILL`, `USER_CAREER_TARGET`, `SKILL_GAP_RESULT` | Target karier dan analisis gap |
| 7 | Learning | `LEARNING_RESOURCE`, `RESOURCE_SKILL_TAG`, `LEARNING_RECOMMENDATION`, `USER_SAVED_RESOURCE` | Resource belajar dan rekomendasi |
| 8 | Opportunity | `CAREER_OPPORTUNITY`, `OPPORTUNITY_SKILL_TAG`, `USER_SAVED_OPPORTUNITY` | Peluang karier |
| 9 | Notification | `NOTIFICATION` | Notifikasi in-app |

---

## Domain 1 — Auth & User

### USER
Entitas inti dari seluruh sistem. Semua data di Growvia berakar dari `USER`.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary key |
| `name` | string | Nama lengkap pengguna |
| `email` | string | Unik, digunakan untuk login dan verifikasi |
| `password_hash` | string | Password di-hash dengan bcrypt |
| `status` | enum | `active` / `unverified` / `suspended` / `deleted` |
| `email_verified_at` | timestamp | Null jika belum terverifikasi |
| `deleted_at` | timestamp | Soft delete — data retained 30 hari |

> **Catatan desain:** `deleted_at` menggunakan pola soft delete sehingga data user tidak langsung hilang. Ini penting untuk recovery dan audit trail.

---

### EMAIL_VERIFICATION
Menyimpan token verifikasi email yang dikirimkan saat register.

| Kolom | Keterangan |
|-------|------------|
| `token` | String unik, expire dalam 24 jam |
| `used` | Boolean — token hanya bisa dipakai sekali |

**Relasi:** `USER` `1 → N` `EMAIL_VERIFICATION`
Seorang user bisa punya beberapa record jika request resend berkali-kali, namun hanya token terbaru yang valid.

---

### SESSION
Menyimpan sesi login aktif pengguna (refresh token).

| Kolom | Keterangan |
|-------|------------|
| `refresh_token` | String unik per sesi |
| `device_info` | Browser/OS info untuk keamanan |
| `expires_at` | Sesi expire dalam 30 hari |

**Relasi:** `USER` `1 → N` `SESSION`
Satu user bisa punya beberapa sesi aktif (login dari beberapa perangkat).

---

## Domain 2 — Profile

### PROFILE
Data profil akademik dan publik pengguna. Relasi 1-to-1 dengan `USER`.

| Kolom | Keterangan |
|-------|------------|
| `portfolio_slug` | URL publik portfolio, contoh: `growvia.app/u/haddi` |
| `portfolio_published` | Boolean — apakah portfolio sudah dipublikasikan |
| `bio` | Teks bebas tentang diri sendiri |

**Relasi:** `USER` `1 → 1` `PROFILE`

---

### CAREER_INTEREST & CAREER_FIELD
Menyimpan minat karier yang dipilih saat onboarding.

- `CAREER_FIELD` adalah master data bidang karier (Product, Engineering, Design, dll.)
- `CAREER_INTEREST` adalah junction table antara `PROFILE` dan `CAREER_FIELD`

**Relasi:**
- `PROFILE` `1 → N` `CAREER_INTEREST`
- `CAREER_INTEREST` `N → 1` `CAREER_FIELD`

Satu profil bisa memilih 1–3 bidang karier.

---

## Domain 3 — Experience

### EXPERIENCE
Merekam semua pengalaman yang diinput pengguna.

| Kolom | Keterangan |
|-------|------------|
| `type` | Enum: `organisation`, `committee`, `internship`, `freelance`, `project`, `competition`, `other` |
| `is_ongoing` | Jika `true`, kolom `end_date` boleh null |
| `description` | Deskripsi bebas, minimum 50 karakter |
| `proof_url` | Link bukti eksternal (sertifikat, GitHub, dll.) |

**Relasi:** `USER` `1 → N` `EXPERIENCE`

Satu pengalaman bisa menjadi sumber dari banyak `SKILL_EVIDENCE` (satu experience bisa membuktikan beberapa skill).

---

## Domain 4 — Skill

### SKILL
Master data skill yang dinormalisasi. Ini adalah referensi global untuk nama skill yang valid.

| Kolom | Keterangan |
|-------|------------|
| `name` | Nama skill, unik di level global (contoh: "Machine Learning") |
| `normalized_name` | Versi lowercase tanpa spasi untuk matching |
| `category` | `hard_skill`, `soft_skill`, `technical`, `leadership` |

---

### USER_SKILL
Hubungan antara user dan skill yang dimilikinya. Ini adalah "kepemilikan" skill.

| Kolom | Keterangan |
|-------|------------|
| `level` | `beginner`, `intermediate`, `advanced`, `expert` — bisa diatur manual |
| `score` | Skor 0–100 yang dikombinasikan dari AI confidence dan jumlah evidence |
| `source` | `ai_extracted` (dari AI) atau `manual` (ditambah sendiri) |
| `ai_confidence` | Nilai kepercayaan AI saat mengekstrak skill ini (0.0–1.0) |

**Relasi:** `USER` `1 → N` `USER_SKILL`, dan `USER_SKILL` `N → 1` `SKILL`

---

### SKILL_EVIDENCE
Junction table yang menghubungkan `USER_SKILL` dengan `EXPERIENCE` sebagai bukti.

| Kolom | Keterangan |
|-------|------------|
| `note` | Konteks spesifik dari pengalaman ini kenapa relevan dengan skill tersebut |

**Relasi:**
- `USER_SKILL` `1 → N` `SKILL_EVIDENCE`
- `SKILL_EVIDENCE` `N → 1` `EXPERIENCE`

Ini adalah implementasi dari prinsip **Evidence-Based** Growvia — setiap skill punya sumber yang bisa ditelusuri.

---

## Domain 5 — AI Analysis

### AI_ANALYSIS_JOB
Merekam setiap pekerjaan analisis AI yang dipicu saat user menyimpan experience.

| Kolom | Keterangan |
|-------|------------|
| `status` | `queued` → `processing` → `completed` / `failed` |
| `raw_input` | Teks deskripsi experience yang dikirim ke AI |
| `raw_output` | Respons mentah dari AI dalam format JSON |

**Relasi:** `EXPERIENCE` `1 → N` `AI_ANALYSIS_JOB`
Satu experience bisa dianalisis ulang (re-analyze) menghasilkan job baru.

---

### AI_SKILL_SUGGESTION
Menyimpan setiap saran skill individual dari hasil AI, beserta status review pengguna.

| Kolom | Keterangan |
|-------|------------|
| `suggested_name` | Nama skill mentah dari AI sebelum normalisasi |
| `confidence_score` | Seberapa yakin AI bahwa ini adalah skill yang valid (0.0–1.0) |
| `review_status` | `pending` → `accepted` / `edited` / `rejected` |
| `final_name` | Nama akhir jika user mengedit nama dari AI |
| `mapped_skill_id` | FK ke `SKILL` — diisi setelah user accept |

**Relasi:** `AI_ANALYSIS_JOB` `1 → N` `AI_SKILL_SUGGESTION`

Alur data: AI Job selesai → menghasilkan beberapa `AI_SKILL_SUGGESTION` → user review satu per satu → yang di-accept membuat record baru di `USER_SKILL` dan `SKILL_EVIDENCE`.

---

## Domain 6 — Career Target

### CAREER_ROLE
Master data peran karier yang tersedia di library Growvia.

| Kolom | Keterangan |
|-------|------------|
| `name` | Nama peran, contoh: "AI Engineer", "Product Manager" |
| `industry` | Industri terkait |

---

### CAREER_ROLE_SKILL
Mendefinisikan skill apa saja yang dibutuhkan untuk setiap peran karier.

| Kolom | Keterangan |
|-------|------------|
| `importance` | `required` (wajib), `important` (penting), `nice_to_have` |
| `min_level` | Level minimum skill yang dibutuhkan |

**Relasi:** `CAREER_ROLE` `1 → N` `CAREER_ROLE_SKILL` `N → 1` `SKILL`

---

### USER_CAREER_TARGET
Menyimpan target karier aktif pengguna.

| Kolom | Keterangan |
|-------|------------|
| `career_role_id` | Nullable — jika pengguna memilih dari library |
| `custom_career_name` | Diisi jika pengguna input manual (custom career) |
| `is_active` | Hanya satu career target yang bisa aktif dalam satu waktu |
| `readiness_score` | Skor 0–100, diperbarui otomatis setiap kali skill berubah |
| `last_analyzed_at` | Kapan terakhir gap analysis dijalankan |

**Relasi:** `USER` `1 → N` `USER_CAREER_TARGET`

> Satu user bisa punya beberapa career target (history), tapi hanya satu yang `is_active = true`.

---

### SKILL_GAP_RESULT
Output dari analisis gap antara skill user dan kebutuhan career target.

| Kolom | Keterangan |
|-------|------------|
| `gap_category` | `strong` / `develop` / `missing` |
| `user_score` | Skor skill user saat analisis dilakukan |
| `required_score` | Skor minimum yang dibutuhkan career role |
| `gap_score` | `required_score - user_score` (bisa 0 jika strong) |

**Relasi:** `USER_CAREER_TARGET` `1 → N` `SKILL_GAP_RESULT` `N → 1` `SKILL`

---

## Domain 7 — Learning

### LEARNING_RESOURCE
Master data resource belajar.

| Kolom | Keterangan |
|-------|------------|
| `type` | `course`, `article`, `video`, `bootcamp`, `book` |
| `duration_minutes` | Estimasi durasi belajar |
| `rating` | Nilai rata-rata (0.0–5.0) |

---

### RESOURCE_SKILL_TAG
Menghubungkan resource dengan skill yang diajarkan. Satu resource bisa mengajarkan beberapa skill.

**Relasi:** `LEARNING_RESOURCE` `1 → N` `RESOURCE_SKILL_TAG` `N → 1` `SKILL`

---

### LEARNING_RECOMMENDATION
Rekomendasi yang dipersonalisasi oleh AI untuk pengguna.

| Kolom | Keterangan |
|-------|------------|
| `skill_gap_result_id` | FK nullable — jika rekomendasi dipicu dari gap analysis |
| `relevance_score` | Seberapa relevan resource ini untuk mengisi gap pengguna |

---

### USER_SAVED_RESOURCE
Resource yang disimpan atau diselesaikan pengguna.

| Kolom | Keterangan |
|-------|------------|
| `is_completed` | Boolean — apakah resource sudah diselesaikan |
| `completed_at` | Timestamp penyelesaian, trigger update skill progress |

---

## Domain 8 — Career Opportunity

### CAREER_OPPORTUNITY
Data peluang karier (job/internship/kompetisi) yang diagregasi dari berbagai sumber.

| Kolom | Keterangan |
|-------|------------|
| `source_url` | URL asli lowongan di platform luar |
| `is_active` | Boolean — apakah masih aktif/belum expired |
| `deadline` | Batas waktu apply |

---

### OPPORTUNITY_SKILL_TAG & USER_SAVED_OPPORTUNITY
- `OPPORTUNITY_SKILL_TAG` menandai skill apa yang dibutuhkan oleh opportunity
- `USER_SAVED_OPPORTUNITY` menyimpan opportunity favorit pengguna beserta `skill_match_score`

| Kolom | Keterangan |
|-------|------------|
| `skill_match_score` | % kecocokan skill user saat opportunity disimpan |

---

## Domain 9 — Notification

### NOTIFICATION
Notifikasi in-app untuk setiap event penting.

| Kolom | Keterangan |
|-------|------------|
| `type` | `skill_update`, `learning_reminder`, `career_opportunity`, `portfolio_view` |
| `action_url` | Deep link ke halaman terkait |
| `is_read` | Boolean — status baca |

---

## Ringkasan Relasi Kunci

```
USER
 ├── 1:1  → PROFILE → CAREER_INTEREST → CAREER_FIELD
 ├── 1:N  → EXPERIENCE
 │              └── 1:N → AI_ANALYSIS_JOB → AI_SKILL_SUGGESTION
 ├── 1:N  → USER_SKILL → SKILL
 │              └── 1:N → SKILL_EVIDENCE → EXPERIENCE  (bukti)
 ├── 1:N  → USER_CAREER_TARGET → CAREER_ROLE
 │              └── 1:N → SKILL_GAP_RESULT → SKILL
 ├── 1:N  → LEARNING_RECOMMENDATION → LEARNING_RESOURCE
 ├── 1:N  → USER_SAVED_RESOURCE → LEARNING_RESOURCE
 ├── 1:N  → USER_SAVED_OPPORTUNITY → CAREER_OPPORTUNITY
 └── 1:N  → NOTIFICATION
```

---

## Alur Data Utama (Data Flow)

### Alur 1 — Experience → Skill
```
User input experience
    → AI_ANALYSIS_JOB dibuat (status: queued)
    → AI memproses deskripsi
    → AI_SKILL_SUGGESTION terbentuk (N suggestions)
    → User review: accept / edit / reject
    → Jika accepted:
        - SKILL dibuat atau dicocokkan (normalisasi)
        - USER_SKILL dibuat atau diperbarui
        - SKILL_EVIDENCE dibuat (link skill ↔ experience)
```

### Alur 2 — Career Target → Gap Analysis
```
User set USER_CAREER_TARGET
    → System ambil CAREER_ROLE_SKILL (required skills)
    → Bandingkan dengan USER_SKILL milik user
    → Generate SKILL_GAP_RESULT per skill:
        - strong: user_score >= required_score
        - develop: user_score > 0 tapi < required_score
        - missing: user_score = 0
    → Hitung readiness_score → update USER_CAREER_TARGET
```

### Alur 3 — Gap → Learning Recommendation
```
SKILL_GAP_RESULT (develop + missing)
    → AI match dengan LEARNING_RESOURCE via RESOURCE_SKILL_TAG
    → LEARNING_RECOMMENDATION dibuat per user per resource
    → User bisa save ke USER_SAVED_RESOURCE
    → Jika completed → trigger update USER_SKILL score
```

### Alur 4 — Portfolio Generation
```
PROFILE (bio, headline, slug)
    + USER_SKILL (semua skill + level)
    + SKILL_EVIDENCE → EXPERIENCE
    + PROFILE (education)
    → Render public portfolio di /u/{portfolio_slug}
    → Jika ada view → buat NOTIFICATION (portfolio_view)
```

---

## Catatan Teknis

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Primary Key | UUID untuk semua tabel | Menghindari sequential ID exposure, aman untuk distributed system |
| Soft Delete | Hanya pada `USER` | User minta hapus akun → data disimpan 30 hari sebelum benar-benar dihapus |
| Normalisasi Skill | Tabel `SKILL` global | Menghindari duplikasi ("public speaking" ≠ "Public Speaking" ≠ "Public-Speaking") |
| AI Job Queue | Tabel `AI_ANALYSIS_JOB` | Memungkinkan async processing dan retry jika gagal |
| Custom Career | `custom_career_name` di `USER_CAREER_TARGET` | User tetap bisa input karier yang tidak ada di library |
| Skill Match Score | Disimpan di `USER_SAVED_OPPORTUNITY` | Skor dihitung saat user save — snapshot agar tidak berubah jika skill user berubah nanti |
