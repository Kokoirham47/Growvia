# Implementation Plan: F08 Career Opportunities

**Branch:** `feature/f08-opportunities`  
**Prerequisites:** Completed F01 - F13 master schema, database models, user session auth  
**Spec Document:** [2026-10-26-f08-career-opportunities-design.md](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/docs/superpowers/specs/2026-10-26-f08-career-opportunities-design.md)  

---

## Task Breakdown & Execution Order

### Phase 1: Database Seeding & Types
- [ ] **Task 1.1:** Create `prisma/seed_opportunities.ts` with 10 Indonesian tech opportunities and skill tags.
- [ ] **Task 1.2:** Execute seed script (`npx tsx prisma/seed_opportunities.ts`) to populate PostgreSQL database.
- [ ] **Task 1.3:** Create TypeScript interfaces in `src/types/opportunities.ts`.

### Phase 2: Backend API & Skill Match Calculation
- [ ] **Task 2.1:** Implement `GET /api/opportunities`:
  - Fetch active opportunities with tags and save status.
  - Fetch authenticated user's `user_skills`.
  - Calculate weighted match score (`W_required=2.0`, `W_preferred=1.0`).
  - Separate `matchedSkills` and `missingSkills`.
  - Support search, type, location, minMatch, and savedOnly filtering.
- [ ] **Task 2.2:** Implement `POST /api/opportunities/[id]/save` and `DELETE /api/opportunities/[id]/save` for bookmarking.

### Phase 3: Frontend Views & Components
- [ ] **Task 3.1:** Create `src/views/opportunities/OpportunitiesHeader.tsx` (Target career banner & summary insight).
- [ ] **Task 3.2:** Create `src/views/opportunities/OpportunitiesFilterBar.tsx` (Search bar, quick pill tabs, location & sort dropdowns).
- [ ] **Task 3.3:** Create `src/views/opportunities/OpportunityCard.tsx` (Card UI, company badge, circular match score, matched vs missing skill chips, bookmark toggle, apply button).
- [ ] **Task 3.4:** Create `src/views/opportunities/OpportunityDetailModal.tsx` (Full modal details, job description, requirements breakdown, external apply link).
- [ ] **Task 3.5:** Create `src/views/opportunities/OpportunitiesEmptyState.tsx`.
- [ ] **Task 3.6:** Assemble `src/views/opportunities/OpportunitiesView.tsx` with responsive layout and state management.
- [ ] **Task 3.7:** Create page route `src/app/(dashboard)/opportunities/page.tsx`.

### Phase 4: Navigation & Polish
- [ ] **Task 4.1:** Add "Peluang Karier" menu item to `src/components/layout/vertical/VerticalMenu.tsx`.
- [ ] **Task 4.2:** Test light mode & dark mode rendering, hover states, bookmarking reactivity, and filtering.
- [ ] **Task 4.3:** Run `npx tsc --noEmit` and `npx eslint`.
