# Implementation Plan: F13 Admin Dashboard & Master Data Management

**Branch:** `feature/f13-admin`  
**Spec Document:** [`docs/superpowers/specs/2026-10-24-f13-admin-dashboard-design.md`](file:///d:/Tugas/Lomba%20Web%20Dev%20UINIC%208.0/Growvia/docs/superpowers/specs/2026-10-24-f13-admin-dashboard-design.md)  
**Date:** 2026-10-24  

---

## Task Breakdown

### Phase 1: Database Seed & Auth Infrastructure (F13.1)
- [ ] Task 1.1: Create `prisma/seed_admin.ts` to seed default admin (`admin@growvia.id` / `AdminGrowvia2026!`) with bcrypt hash.
- [ ] Task 1.2: Execute `seed_admin.ts` to ensure database has admin credentials.
- [ ] Task 1.3: Create `src/server/utils/adminAuth.ts` with `signAdminToken`, `verifyAdminToken`, and `getAdminSession` (8-hour JWT).
- [ ] Task 1.4: Create API route `src/app/api/admin/auth/login/route.ts` (set `growvia_admin_token` HTTP-only cookie).
- [ ] Task 1.5: Create API route `src/app/api/admin/auth/logout/route.ts` (clear cookie) and `src/app/api/admin/auth/me/route.ts`.
- [ ] Task 1.6: Update `src/middleware.ts` to strictly protect `/admin/*` and `/api/admin/*` while allowing `/admin/login`.

### Phase 2: Dedicated Layout & Overview Dashboard (F13.1 & F13.2)
- [ ] Task 2.1: Create Admin Layout `src/app/(admin)/admin/layout.tsx` with dedicated `AdminSidebar` and `AdminTopbar`.
- [ ] Task 2.2: Create Admin Login Page `src/app/(admin)/admin/login/page.tsx`.
- [ ] Task 2.3: Create reusable admin components:
  - `AdminDataTable.tsx` (Search, pagination, filter, actions)
  - `AdminStatCard.tsx` (Metric card with icon & accent color)
  - `SafeDeleteModal.tsx` (Confirmation dialog with dependency check)
- [ ] Task 2.4: Create API route `src/app/api/admin/overview/route.ts` (live counts of skills, roles, resources, opportunities).
- [ ] Task 2.5: Create Dashboard View `src/app/(admin)/admin/dashboard/page.tsx` with live stat cards and quick actions.

### Phase 3: Master Data CRUD Modules (F13.3 - F13.7)
- [ ] Task 3.1: **F13.3 Skills Taxonomy**
  - Create `src/app/api/admin/skills/route.ts` (GET paginated/filtered, POST).
  - Create `src/app/api/admin/skills/[id]/route.ts` (PUT, DELETE with safe-delete validation).
  - Create view `src/app/(admin)/admin/skills/page.tsx` with Category filter, Search, Add/Edit modal, Safe-delete dialog.
- [ ] Task 3.2: **F13.4 & F13.5 Career Roles & Required Skills**
  - Create `src/app/api/admin/career-roles/route.ts` (GET, POST).
  - Create `src/app/api/admin/career-roles/[id]/route.ts` (PUT, DELETE).
  - Create `src/app/api/admin/career-roles/[id]/skills/route.ts` (GET, POST mapping).
  - Create `src/app/api/admin/career-roles/[id]/skills/[skillId]/route.ts` (PUT, DELETE mapping).
  - Create view `src/app/(admin)/admin/career-roles/page.tsx`.
  - Create view `src/app/(admin)/admin/career-roles/[id]/skills/page.tsx`.
- [ ] Task 3.3: **F13.6 Learning Resources**
  - Create `src/app/api/admin/learning-resources/route.ts` (GET, POST with skill tags).
  - Create `src/app/api/admin/learning-resources/[id]/route.ts` (PUT, DELETE).
  - Create view `src/app/(admin)/admin/learning-resources/page.tsx` with multi-select skill tags.
- [ ] Task 3.4: **F13.7 Career Opportunities**
  - Create `src/app/api/admin/opportunities/route.ts` (GET, POST with deadline & skill tags).
  - Create `src/app/api/admin/opportunities/[id]/route.ts` (PUT, DELETE).
  - Create view `src/app/(admin)/admin/opportunities/page.tsx` with deadline picker & active/expired badge.

### Phase 4: Integration Verification & Final Commit
- [ ] Task 4.1: Run verification on all admin API routes.
- [ ] Task 4.2: Verify responsive design and theme switching in admin pages.
- [ ] Task 4.3: Commit and push changes to `feature/f13-admin`.
