# sprint-08-professional-ui-polish.md

## Goal

Make MSS feel like a professional course-selling platform while keeping the existing architecture, routes, data flow, and design tokens stable.

## Sprint 8A Plan

- [x] Improve typography with a modern system-first font stack
- [x] Add liquid-glass surface variables
- [x] Add premium background treatment
- [x] Polish public navbar/header
- [x] Polish primary/secondary buttons
- [x] Polish shared course cards
- [x] Preserve existing layout and functionality
- [x] Avoid external font dependency for now

## Sprint 8A Notes

The UI polish is intentionally layered on top of the existing MSS design system.

We are not replacing the full theme. We are extending it with glass surfaces, softer shadows, stronger typography, and more polished interactions.

## Sprint 8A Completed

- [x] Added professional system-first font stack
- [x] Added liquid-glass design variables
- [x] Added premium page background treatment
- [x] Polished sticky public navbar
- [x] Polished primary and secondary buttons
- [x] Added glass surfaces across existing public sections
- [x] Rebuilt shared course card styling with glass surface, richer hover, and better visual hierarchy
- [x] Preserved all existing components and routes

## Sprint 8A Notes

This sprint only changes presentation styling. It does not change Supabase logic, auth, catalog loading, or enrollment behavior.

## Sprint 8B-2 Completed

- [x] Refactored layout components into component-named folders
- [x] Split PublicLayoutComponent into TS, HTML, and SCSS files
- [x] Split DashboardLayoutComponent into TS, HTML, and SCSS files
- [x] Updated route lazy imports to the new component paths
- [x] Removed old flat inline-template layout component files

## Sprint 8B-2 Convention

For maintainability, MSS components should follow this structure:

component-name/
- component-name.component.ts
- component-name.component.html
- component-name.component.scss
- component-name.component.spec.ts, optional

Inline templates should be avoided except for very small temporary components.

## Sprint 8B-3 Batch 1 Completed

- [x] Moved PublicHomePageComponent into a component-named folder
- [x] Split public home page into TS, HTML, and SCSS files
- [x] Moved CourseCatalogPageComponent into a component-named folder
- [x] Split course catalog page into TS, HTML, and SCSS files
- [x] Moved PackagesPageComponent into a component-named folder
- [x] Split packages page into TS, HTML, and SCSS files
- [x] Updated lazy route imports
- [x] Removed old flat public page files

## Sprint 8B-3 Notes

This is a structure-only refactor. Public course, package, and homepage Supabase loading behavior should remain unchanged.

## Sprint 8B-3 Batch 2 Completed

- [x] Moved CourseDetailPageComponent into a component-named folder
- [x] Split course detail page into TS, HTML, and SCSS files
- [x] Moved EnrollPageComponent into a component-named folder
- [x] Split enrollment page into TS, HTML, and SCSS files
- [x] Updated lazy route imports
- [x] Removed old flat course detail and enrollment files

## Sprint 8B-3 Batch 2 Notes

This is a structure-only refactor. Course detail loading, enrollment option loading, and pending enrollment submission behavior should remain unchanged.

## Sprint 8B-3 Batch 3 Completed

- [x] Moved LoginPageComponent into a component-named folder
- [x] Split login page into TS, HTML, and SCSS files
- [x] Moved RegisterPageComponent into a component-named folder
- [x] Split register page into TS, HTML, and SCSS files
- [x] Updated lazy route imports
- [x] Removed old flat auth page files

## Sprint 8B-3 Batch 3 Notes

This is a structure-only refactor. Supabase login, registration, validation, and role redirect behavior should remain unchanged.

## Sprint 8B-3 Batch 4 Completed

- [x] Moved StudentDashboardPageComponent into a component-named folder
- [x] Split student dashboard page into TS, HTML, and SCSS files
- [x] Moved TeacherDashboardPageComponent into a component-named folder
- [x] Split teacher dashboard page into TS, HTML, and SCSS files
- [x] Moved AdminDashboardPageComponent into a component-named folder
- [x] Split admin dashboard page into TS, HTML, and SCSS files
- [x] Updated lazy route imports
- [x] Removed old flat dashboard page files

## Sprint 8B-3 Batch 4 Notes

All current app page components now follow the component-named folder convention.

## Sprint 8C Started

- [x] Reworked homepage from developer-demo messaging into student-facing course-selling messaging
- [x] Added Bangla/English academic positioning
- [x] Added conversion-focused hero section
- [x] Added trust cards for course plan, practice, support, and dashboard access
- [x] Preserved Supabase-powered featured course loading
- [x] Added Bangladesh-friendly enrollment process section
- [x] Added bKash/Nagad/Rocket payment trust strip
- [x] Added final conversion CTA
- [x] Kept homepage styling inside public-home.page.scss

## Sprint 8C Notes

The homepage is now closer to a real coaching/course-selling landing page. It avoids developer-facing language and focuses on student outcomes, enrollment, and trust.
