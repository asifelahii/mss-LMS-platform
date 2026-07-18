# sprint-02-public-site-course-catalog.md

## Goal

Build the public MSS course-selling website foundation with course catalog, packages, course details, enrollment checkout skeleton, and optimized public routing.

## Completed

- [x] Added public course catalog model
- [x] Added reusable course card component
- [x] Added mock course data
- [x] Added /courses catalog page
- [x] Added course filtering and search skeleton
- [x] Added /courses/:slug course detail page
- [x] Added course detail learning outcomes
- [x] Added course content preview section
- [x] Added teacher and enrollment process cards
- [x] Added course package model
- [x] Added package mock data
- [x] Added /packages pricing/package page
- [x] Added enrollment flow preview
- [x] Added /enroll checkout/enrollment skeleton
- [x] Added student information form skeleton
- [x] Added guardian/contact fields
- [x] Added bKash/Nagad/Rocket payment method skeleton
- [x] Added transaction ID and payment note fields
- [x] Added payment proof upload placeholder
- [x] Updated navbar public links
- [x] Updated homepage with featured courses, stats, and role-based feature sections
- [x] Fixed Unicode encoding issues for taka symbol and check icons
- [x] Added hover and interaction polish
- [x] Refactored routes to lazy-load route components
- [x] Reduced initial production bundle below Angular budget
- [x] Verified public pages visually
- [x] Verified production build

## Public Routes

- /
- /courses
- /courses/:slug
- /packages
- /enroll
- /login
- /register

## Notes

Course, package, and enrollment data are currently static/mock data. This is intentional for Sprint 2. Real dynamic data will be connected after Supabase schema, RLS, admin course management, and teacher content management are implemented.

Route components are now lazy-loaded, so the first production bundle stays lighter and page-specific code loads only when needed.

## Acceptance Criteria

- [x] Public homepage loads correctly
- [x] Course catalog loads correctly
- [x] Course detail pages load correctly
- [x] Packages page loads correctly
- [x] Enrollment page loads correctly
- [x] Public CTAs route to the correct pages
- [x] App builds successfully
- [x] Initial bundle stays under the configured production budget
