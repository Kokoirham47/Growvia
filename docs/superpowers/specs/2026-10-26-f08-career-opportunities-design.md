# Architectural Design Spec: F08 Career Opportunities

**Status:** Proposed  
**Author:** Antigravity & Kokoirham47  
**Date:** 2026-10-26  
**Module:** Feature F08 — Career Opportunities  
**Branch:** `feature/f08-opportunities`  

---

## 1. Executive Summary & Objective

The **Career Opportunities** feature (F08) bridges users from skill analysis and learning into real-world career progression. It provides an intelligent, curated portal for internships, full-time jobs, apprenticeships, and competitions from top Indonesian tech and digital employers.

Instead of generic job boards, Growvia's Career Opportunities calculates an **instant, deterministic Skill Match %** for each user based on their active skills (`UserSkill`), highlights skills they already possess vs. skills they still need to learn, and enables bookmarking and seamless external applications.

---

## 2. Requirements & PRD Alignment

| PRD Code | Requirement | Implementation Plan |
|---|---|---|
| **F08.1** | **Opportunity List** | Curated catalog of opportunities (Internship, Full-time, Part-time, Freelance, Competition). Filterable by type, location, skill requirement, company, and minimum match score. |
| **F08.2** | **Skill Match %** | Backend-calculated match score based on user's `UserSkill` vs. opportunity's `OpportunitySkillTag` (required & preferred weighting). Visually distinguishes mastered skills vs. missing skills. |
| **F08.3** | **Apply & Save** | Save/unsave opportunities with instant UI feedback via `UserSavedOpportunity`. "Lamar Sekarang" opens external application portal safely in a new tab. |

---

## 3. Data Architecture & Schema Mapping

The database models in `prisma/schema.prisma` already define:

```prisma
model CareerOpportunity {
  id          String                 @id @default(uuid()) @db.Uuid
  title       String
  company     String
  location    String?
  sourceUrl   String?                @map("source_url")
  type        OpportunityType        @default(internship)
  description String?                @db.Text
  isActive    Boolean                @default(true) @map("is_active")
  source      ContentSource          @default(admin)
  createdBy   String?                @map("created_by") @db.Uuid
  deadline    DateTime?              @db.Date
  postedAt    DateTime?              @map("posted_at")
  createdAt   DateTime               @default(now()) @map("created_at")
  updatedAt   DateTime               @updatedAt @map("updated_at")

  creator      Admin?                 @relation(fields: [createdBy], references: [id], onDelete: SetNull)
  skillTags    OpportunitySkillTag[]
  savedByUsers UserSavedOpportunity[]

  @@map("career_opportunities")
}

model OpportunitySkillTag {
  id                  String                     @id @default(uuid()) @db.Uuid
  careerOpportunityId String                     @map("career_opportunity_id") @db.Uuid
  skillId             String                     @map("skill_id") @db.Uuid
  importance          OpportunitySkillImportance @default(required)
  createdAt           DateTime                   @default(now()) @map("created_at")

  opportunity CareerOpportunity @relation(fields: [careerOpportunityId], references: [id], onDelete: Cascade)
  skill       Skill             @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@unique([careerOpportunityId, skillId])
  @@map("opportunity_skill_tags")
}

model UserSavedOpportunity {
  id                  String            @id @default(uuid()) @db.Uuid
  userId              String            @map("user_id") @db.Uuid
  careerOpportunityId String            @map("career_opportunity_id") @db.Uuid
  skillMatchScore     Int?              @map("skill_match_score")
  savedAt             DateTime          @default(now()) @map("saved_at")

  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  opportunity CareerOpportunity @relation(fields: [careerOpportunityId], references: [id], onDelete: Cascade)

  @@unique([userId, careerOpportunityId])
  @@map("user_saved_opportunities")
}
```

---

## 4. Backend Matching Engine (`/api/opportunities`)

### 4.1 Skill Match Calculation Algorithm

Each opportunity has a set of skill tags with `importance: 'required' | 'preferred'`.

$$\text{Weight}_{\text{required}} = 2.0, \quad \text{Weight}_{\text{preferred}} = 1.0$$

Let $S_{\text{opp}}$ be the skill tags for an opportunity, and $S_{\text{user}}$ be the user's verified or manual skills in `user_skills`.

For each tagged skill $i$:
- $W_i = 2.0$ if `required`, $1.0$ if `preferred`.
- $\text{Matched}_i = 1$ if skill ID exists in $S_{\text{user}}$, else $0$.

$$\text{Match Percentage} = \min\left(100, \text{round}\left(\frac{\sum W_i \cdot \text{Matched}_i}{\sum W_i} \times 100\right)\right)$$

*If an opportunity has no skill tags attached, match percentage defaults to $100\%$ (open to all backgrounds).*

### 4.2 Endpoint Specifications

#### `GET /api/opportunities`
- **Query Params:**
  - `search` (string): Title, company, location keyword.
  - `type` (`internship` | `fulltime` | `parttime` | `freelance` | `competition` | `all`).
  - `location` (string): e.g. "Jakarta", "Remote", "Bandung", "Surabaya".
  - `minMatch` (number): e.g. `70` for high-match opportunities only.
  - `savedOnly` (`true` | `false`): Filter only bookmarked opportunities.
  - `sort` (`match_desc` | `deadline_asc` | `newest`).
- **Response Format:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "Junior Frontend Engineer",
        "company": "GoTo Financial",
        "location": "Jakarta / Hybrid",
        "type": "fulltime",
        "deadline": "2026-11-30T00:00:00.000Z",
        "sourceUrl": "https://careers.goto.com/...",
        "description": "...",
        "matchScore": 85,
        "isSaved": true,
        "matchedSkills": [
          { "id": "s-1", "name": "React.js", "category": "technical", "importance": "required" },
          { "id": "s-2", "name": "TypeScript", "category": "technical", "importance": "required" }
        ],
        "missingSkills": [
          { "id": "s-3", "name": "Next.js & SSR", "category": "technical", "importance": "preferred" }
        ]
      }
    ],
    "meta": {
      "total": 12,
      "userSkillsCount": 8,
      "averageMatchScore": 76
    }
  }
  ```

#### `POST /api/opportunities/[id]/save`
- Toggles/creates `UserSavedOpportunity` entry with current `skillMatchScore`.

#### `DELETE /api/opportunities/[id]/save`
- Removes `UserSavedOpportunity` entry.

---

## 5. Frontend UI/UX Architecture

### 5.1 Route & Navigation
- **Page Route:** `src/app/(dashboard)/opportunities/page.tsx`
- **Navigation Menu:** Added to `src/components/layout/vertical/VerticalMenu.tsx` with `<Compass className="w-5 h-5" />` icon, labeled **"Peluang Karier"**.

### 5.2 Component Breakdown (`src/views/opportunities/`)
1. **`OpportunitiesHeader.tsx`**:
   - Hero banner displaying user's current target career, average match score across opportunities, and quick action to review career gap.
2. **`OpportunitiesFilterBar.tsx`**:
   - Search bar with instant debounced query.
   - Quick pill tabs: *Semua*, *Match Tinggi (≥70%)*, *Tersimpan*, *Internship*, *Full-time*, *Remote*.
   - Filter dropdowns: Location, Employment Type, Sort order.
3. **`OpportunityCard.tsx`**:
   - Modern glassmorphism/card design with hover micro-interactions.
   - Company initial monogram or brand indicator.
   - Circular/pill match badge with dynamic colors:
     - Emerald ($\ge 75\%$): "Match Tinggi"
     - Amber ($50\% - 74\%$): "Match Sedang"
     - Slate ($< 50\%$): "Potensi Berkembang"
   - Chips for matched skills (green/blue with checkmark) and missing skills (slate with plus/target icon).
   - Bookmark toggle button with optimistic UI state.
   - "Lamar" (External link) and "Detail" buttons.
4. **`OpportunityDetailModal.tsx`**:
   - Full job description, requirements list, deadline countdown timer, company details.
   - Detailed Skill Analysis Breakdown (Skills you have vs Skills to learn).
   - "Buka Portal Lamaran" button opening external URL with security `rel="noopener noreferrer"`.
5. **`OpportunitiesEmptyState.tsx`**:
   - Elegant empty state illustration when search or filters return 0 results, with "Reset Filter" button.

---

## 6. Seed Data (`prisma/seed_opportunities.ts`)

Curated seed dataset covering leading Indonesian tech companies & digital initiatives:
1. **GoTo (Gojek Tokopedia)** - Associate Product Designer (Internship)
2. **Traveloka** - Junior Frontend Engineer (Full-time)
3. **Bank Central Asia (BCA)** - IT Trainee - Fullstack Engineering (Full-time)
4. **Shopee Indonesia** - Quality Assurance Engineer (Full-time)
5. **Dicoding Indonesia** - Curriculum Developer & Tech Mentor (Part-time / Remote)
6. **Blibli** - UI/UX Research Intern (Internship)
7. **Astra Digital** - Junior Machine Learning Engineer (Full-time)
8. **Google Bangkit Academy** - Tech Cohort Capstone Apprenticeship (Competition / Internship)
9. **Kredivo** - Data Analyst Intern (Internship / Hybrid)
10. **Telkom Indonesia** - Digital Talent Incubator (Apprenticeship)

Each seeded opportunity is automatically linked to master skills (`React.js`, `TypeScript`, `Figma & Auto-layout`, `Wireframing & Prototyping`, `Python`, `Machine Learning`, `Problem Solving & Logic`, `Agile / Scrum Methodology`).

---

## 7. Verification & Testing Strategy

1. **Unit & Calculation Logic Testing:**
   - Verify weighted skill match calculation handles 0 skills, 100% match, partial match, and empty requirements.
2. **API Endpoint Testing:**
   - Test `GET /api/opportunities` with various filter combinations (`type`, `search`, `minMatch`, `savedOnly`).
   - Test `POST` and `DELETE` on `/api/opportunities/[id]/save` ensuring authentication and data integrity.
3. **UI & Accessibility Testing:**
   - Verify responsive behavior across Mobile (375px), Tablet (768px), and Desktop (1280px+).
   - Validate Dark Mode and Light Mode contrast and button stylings.
   - Run `npx tsc --noEmit` and `npx eslint`.
