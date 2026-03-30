# Implementation Plan: UI/UX for Seniors (Mobile-First)

## Completed Tasks
- [x] Define mobile-first CSS variables (viewport units, large base spacing).
- [x] Implement a bottom navigation bar using Next.js Link and App Router.
- [x] Create a "Big Button" component system for touch interactions.
- [x] Design and implement a mobile-optimized FIFO restock/shipment form with dropdowns.
- [x] Implement the Supplier Management interface.

## Current Tasks (Style Guide v1.2 Review & Refinement)
- [x] **Audit & Foundation Sync**
    - [x] Audit all existing pages against `conductor/style-guide.md` v1.2.
    - [x] Synchronize `src/app/globals.css` variables with the style guide colors (#2563eb, #c2410c, #f8fafc).
    - [x] Define standardized CSS utility classes for `border-senior-idle` and `border-senior-hover`.
- [x] **Component & Page Refinement**
    - [x] **Homepage (`src/app/page.tsx`):** Update card borders, hover states, and data visualization colors to match v1.2.
    - [x] **Restock Page (`src/app/restock/page.tsx`):** Refine "Restock Cards" with prominent orange borders for cost fields and unified hover effects.
    - [x] **Ship Page (`src/app/ship/page.tsx`):** Ensure consistent large touch targets (52px+) and clear red "Danger" visual cues for destructive actions.
    - [x] **History Page (`src/app/history/page.tsx`):** Implement "Monthly Summary" statistics card and "One-Click Export" button.
    - [x] **Global Iconography Audit:** Ensure all Lucide icons use `strokeWidth={2}` or `3` and are sized appropriately (28px for primary, 20px for secondary).
- [ ] **PWA & Final Polish**
    - [ ] Setup PWA manifest and service worker in Next.js for mobile home-screen installation.
    - [ ] Final usability test on mobile device simulator focusing on "No Hidden Gestures" and "Physical Feedback" (`active:scale-95`).
