# GROWVIA — DESIGN SYSTEM
**Version 1.0 · Design Direction: Clean & Layered Professionalism**

---

## 01. Brand Foundation

**Brand Name:** Growvia

**Tagline:** Turn Experience Into Opportunity.

**Positioning:**
AI-powered skill ecosystem yang membantu mahasiswa dan fresh graduate mengubah pengalaman menjadi skill yang terstruktur, memahami skill gap, menemukan peluang karier, mendapatkan rekomendasi pembelajaran, dan membangun portfolio profesional.

**Design Personality:**
Clean · Professional · Modern · Friendly · Trustworthy · Intelligent · Accessible · Future-oriented

**Design Principles:**

| # | Principle | Description |
|---|-----------|-------------|
| 1 | Simple | Interface mudah dipahami tanpa tutorial panjang |
| 2 | Evidence-Based | Setiap skill dapat ditelusuri ke pengalaman/bukti |
| 3 | AI-Assisted | AI membantu, bukan mengambil alih seluruh proses |
| 4 | Interconnected | Experience, Skills, Career, Learning, Portfolio terasa satu ekosistem |
| 5 | Action-Oriented | Setiap halaman memiliki tujuan dan tindakan yang jelas |
| 6 | Human-Centered | Data dan AI ditampilkan dengan bahasa yang mudah dipahami |

---

## 02. Color System

### Primary Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `color-primary` | Deep Navy | `#1E3A8A` | Main heading, primary text, primary CTA, navigation, brand identity |
| `color-accent` | Royal Blue | `#2563EB` | Active state, links, secondary CTA, interactive elements, progress indicator |

### AI Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `color-ai-bg` | Soft Indigo | `#EEF2FF` | AI card background, AI recommendation container, AI analysis section |
| `color-ai` | Vibrant Indigo | `#6366F1` | AI icon, AI badge, AI accent, AI button, AI visualization |

### Background Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `color-bg` | Soft Cool Grey | `#F5F6F8` | Main app background, dashboard background, page sections |
| `color-surface` | Pure White | `#FFFFFF` | Cards, modal, input, navigation, main content containers |

### Text Colors

| Token | Name | Hex |
|-------|------|-----|
| `color-text` | Primary Text | `#1E293B` |
| `color-text-secondary` | Secondary Text | `#64748B` |
| `color-text-muted` | Muted Text | `#94A3B8` |
| `color-text-disabled` | Disabled Text | `#CBD5E1` |

### Status Colors

| State | Foreground | Background |
|-------|-----------|------------|
| Success | `#16A34A` | `#DCFCE7` |
| Warning | `#F59E0B` | `#FEF3C7` |
| Error | `#DC2626` | `#FEE2E2` |
| Info | `#2563EB` | `#DBEAFE` |

---

## 03. Typography

**Primary Font:** Poppins
**Fallback:** Inter, Arial, sans-serif

### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display XL | 56px | 700 | 1.1 | Landing page hero heading |
| Display L | 48px | 700 | 1.15 | — |
| H1 | 36px | 700 | 1.2 | Page titles |
| H2 | 30px | 700 | 1.25 | Section headings |
| H3 | 24px | 600 | 1.3 | Sub-section headings |
| H4 | 20px | 600 | 1.35 | Card headings |
| Body Large | 18px | 400 | 1.6 | Introductory text |
| Body | 16px | 400 | 1.5 | Default body copy |
| Body Small | 14px | 400 | 1.5 | Supporting text |
| Label | 14px | 500 | 1.4 | Form labels, nav items |
| Caption | 12px | 400 | 1.4 | Metadata, timestamps |

**Typography Rules:**
- Maximum 2 font weights per small component
- Heading menggunakan Deep Navy (`#1E3A8A`)
- Body menggunakan Primary Text atau Secondary Text
- Jangan menggunakan terlalu banyak ukuran font dalam satu section
- Gunakan bold hanya untuk informasi penting

---

## 04. Spacing System

**Base Unit:** 4px

| Token | Value | Common Usage |
|-------|-------|-------------|
| `space-xs` | 4px | Micro gaps |
| `space-sm` | 8px | Element inner gaps |
| `space-md` | 12px | Tight groupings |
| `space-lg` | 16px | Default element spacing |
| `space-xl` | 24px | Card padding |
| `space-2xl` | 32px | Large card padding |
| `space-3xl` | 40px | Component sections |
| `space-4xl` | 48px | Layout sections |
| `space-5xl` | 64px | Section spacing |
| `space-6xl` | 80px | Large section spacing |
| `space-7xl` | 96px | Max section spacing |

**Page Horizontal Padding:**
- Desktop: 64px
- Tablet: 32px
- Mobile: 20px

---

## 05. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8px | Small components |
| `radius-md` | 12px | Inputs, buttons |
| `radius-lg` | 16px | Default card |
| `radius-xl` | 20px | Feature card |
| `radius-pill` | 999px | Badge, tag, pill button |

---

## 06. Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-xs` | `0 1px 2px rgba(15,23,42,0.04)` | Subtle lift |
| `shadow-sm` | `0 2px 8px rgba(15,23,42,0.06)` | Default card |
| `shadow-md` | `0 4px 16px rgba(15,23,42,0.08)` | Floating element |
| `shadow-lg` | `0 8px 24px rgba(15,23,42,0.10)` | Modal, dropdown |

**Rules:** Gunakan shadow secara subtle. Hindari heavy shadow.

---

## 07. Button System

### Primary Button
```
Background: #2563EB  |  Text: #FFFFFF  |  Radius: 12px  |  Height: 44px  |  Font: 14px/600
Hover: Darken background  |  Active: scale(0.97)  |  Disabled: bg #CBD5E1, text #FFFFFF
```

### Secondary Button
```
Background: #FFFFFF  |  Border: #DCE3EF  |  Text: #1E3A8A  |  Radius: 12px
```

### AI Button
```
Background: #6366F1  |  Text: #FFFFFF  |  Icon: Sparkle/Wand
Usage: Analyze with AI, Generate, Extract Skills, Get Recommendation
```

### Text Button
```
Background: transparent  |  Text: #2563EB
Usage: View Details, Learn More, See All
```

---

## 08. Input System

| Property | Value |
|----------|-------|
| Height | 44px |
| Background | `#FFFFFF` |
| Border | `#DCE3EF` |
| Radius | 12px |
| Text | `#1E293B` |
| Placeholder | `#94A3B8` |
| Focus Border | `#2563EB` |
| Error Border | `#DC2626` |

**Input Types:** Text Input, Search Input, Text Area, Select, Multi Select, Date Picker, Number Input, File Upload

**Rules:**
- Label selalu berada di atas input
- Placeholder bukan pengganti label
- Error message harus menjelaskan masalah

---

## 09. Card System

### Default Card
```
Background: #FFFFFF  |  Radius: 16px  |  Padding: 24px
Border: #E8ECF2  |  Shadow: shadow-sm
```

### Feature Card
```
Background: #FFFFFF  |  Radius: 20px  |  Padding: 32px  |  Shadow: shadow-md
```

### AI Card
```
Background: #EEF2FF  |  Border: #E0E7FF  |  Radius: 16px  |  Icon: #6366F1
```

### Stat Card
```
Background: #FFFFFF  |  Radius: 16px  |  Padding: 20px
```

**Card Rules:**
- Satu card memiliki satu tujuan utama
- Jangan memasukkan terlalu banyak informasi
- Gunakan hierarchy yang jelas
- Action utama berada di area yang mudah ditemukan

---

## 10. Badge & Tag

| Type | Background | Text | Radius |
|------|-----------|------|--------|
| Skill Tag | `#EEF2FF` | `#3730A3` | 999px |
| Success Badge | `#DCFCE7` | `#15803D` | 999px |
| Warning Badge | `#FEF3C7` | `#B45309` | 999px |
| AI Badge | `#EEF2FF` | `#6366F1` | 999px |

**Padding:** 6px 12px

---

## 11. Navigation

### Desktop Sidebar
```
Width: 240px  |  Background: #FFFFFF  |  Border: #E8ECF2
```

**Nav Items:** Dashboard · Experience · Skills · Career · Learning · Portfolio

```
Active:  Background #EEF2FF  |  Text #2563EB  |  Icon #2563EB  |  Radius 10px
Hover:   Background #F5F6F8
```

### Top Navigation
```
Left:  Growvia logo
Right: Search · Notifications · Profile
```

---

## 12. Iconography

**Style:** Minimal / Outline
**Library:** Lucide Icons

| Size | Value |
|------|-------|
| Small | 16px |
| Default | 20px |
| Medium | 24px |
| Large | 32px |

**Rules:**
- Gunakan icon yang mudah dikenali
- Jangan mencampur banyak gaya icon
- Icon harus mendukung informasi, bukan menjadi dekorasi utama

---

## 13. AI Component

AI component memiliki visual identity yang berbeda, tetapi tetap menjadi bagian dari interface utama.

```
Container:  Background #EEF2FF  |  Border #E0E7FF  |  Radius 16px
Header Icon: Sparkles / Wand / Brain
Title: "Growvia AI"  |  Subtitle: "AI-powered insight"
```

**AI Actions:** Analyze Experience · Extract Skills · Normalize Skills · Find Skill Gap · Recommend Learning · Generate Summary

**AI Output Rule:** User harus bisa → Melihat · Mengedit · Menerima · Menolak — hasil AI. User tetap memiliki kontrol penuh.

---

## 14. Skill Visualization

### Skill Card Structure
```
Name · Level (Beginner/Intermediate/Advanced/Expert) · Score (%) · Evidence (linked experience)
```

### Color Logic

| State | Color |
|-------|-------|
| Primary Skill | `#2563EB` |
| AI Detected | `#6366F1` |
| Strong | `#16A34A` |
| Develop | `#F59E0B` |
| Missing | `#DC2626` |

**Primary Visualization:** Skill Pattern Map (node-based graph)

---

## 15. Career Gap Component

Always display:
1. Current skill
2. Required skill
3. Gap
4. Recommended action

**Readiness Score:** Visual progress bar + percentage. Jangan hanya angka saja.

---

## 16. Responsive Design

| Breakpoint | Width | Layout | Nav |
|-----------|-------|--------|-----|
| Desktop | 1440px+ | Multi-column | Sidebar |
| Tablet | 768–1439px | Reduced columns | Sidebar (collapsed) |
| Mobile | <768px | Single column | Bottom nav / hamburger |

**Mobile Rules:**
- Card width 100%
- Heading scale down
- Buttons dapat menjadi full width
- Graph scrollable atau disederhanakan
- Hindari horizontal scrolling

---

## 17. Accessibility

- Minimum touch target: 44px
- Sufficient text contrast (WCAG AA)
- Clear focus state
- Keyboard accessible
- Meaningful button labels
- Form labels selalu visible
- Jangan hanya mengandalkan warna
- Error messages bersifat deskriptif

---

## 18. UX Writing

**Tone:** Friendly · Clear · Professional · Encouraging

| ❌ Avoid | ✅ Use |
|---------|--------|
| "Error occurred." | "Data belum dapat disimpan. Periksa kembali informasi yang kamu masukkan." |
| "AI Processing." | "Growvia sedang menganalisis pengalamanmu..." |
| "No data." | "Belum ada pengalaman yang ditambahkan." |

**Button Copy Examples:**
Mulai Sekarang · Tambah Pengalaman · Analisis dengan AI · Lihat Skill · Temukan Skill Gap · Lihat Rekomendasi · Mulai Belajar · Lihat Peluang · Bangun Portfolio

---

## 19. Design Token Summary

```
color-primary:     #1E3A8A   — Deep Navy
color-accent:      #2563EB   — Royal Blue
color-ai:          #6366F1   — Vibrant Indigo
color-ai-bg:       #EEF2FF   — Soft Indigo
color-bg:          #F5F6F8   — Soft Cool Grey
color-surface:     #FFFFFF   — Pure White
color-text:        #1E293B   — Primary Text
color-text-sec:    #64748B   — Secondary Text
color-text-muted:  #94A3B8   — Muted Text
color-success:     #16A34A
color-warning:     #F59E0B
color-error:       #DC2626

font-primary:      Poppins, Inter, Arial, sans-serif
space-base:        4px
radius-card:       16px
radius-button:     12px
radius-pill:       999px
```

---

## 20. Core UI Philosophy

> *"Professional career platform, but approachable enough for students."*

The interface should communicate one story:

**Experience → Skills → Growth → Opportunity**

- AI is the **intelligence layer**
- User's experience is the **source**
- Skills are the **structured data**
- Career is the **destination**
- Learning is the **growth path**
- Portfolio is the **proof**
