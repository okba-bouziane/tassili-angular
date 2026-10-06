# PLAN

Living plan for the UI library + starter template monorepo. Update the checklist as work lands.

**Status:** Phase 0 — waiting for decisions (see "Open decisions").

## Open decisions

- [ ] npm scope (`@<scope>/ui`, `@<scope>/tokens`)
- [ ] Brand name
- [ ] Visual direction (A / B / C, see Phase 0 summary)
- [ ] Stack deviations (see "Proposed deviations"): TypeScript 6.0 pin, Angular CLI Vitest builder, `@lucide/angular`, Chart.js, `pnpm licenses` check

## Verified environment (2026-10-06)

| Tool        | Version |
| ----------- | ------- |
| Node        | 26.9.0  |
| pnpm        | 10.28.0 |
| Nx (global) | 23.2.1  |
| git         | 2.54.0  |

## Verified stack (latest stable, license)

| Package                                     | Version             | License    | Notes                                                                                     |
| ------------------------------------------- | ------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| @angular/* (core, cdk, forms, build, cli)   | 22.2.1              | MIT        | Zoneless is the default; signal forms are stable (only the WebMCP helper is experimental) |
| typescript                                  | **6.0.x**           | Apache-2.0 | Angular 22 requires `>=6.0 <6.1`; TS 7.0.2 is **not** supported                           |
| nx, @nx/angular, @nx/storybook              | 23.2.1              | MIT        | `@nx/angular` peers `<23` Angular: OK                                                     |
| @spartan-ng/brain / cli                     | 1.6.1               | MIT        | Peers Angular `>=21 <23`; runtime deps: tslib only; luxon optional                        |
| tw-animate-css                              | 1.4.0               | MIT        | spartan brain peer                                                                        |
| tailwindcss, @tailwindcss/postcss           | 4.3.3               | MIT        |                                                                                           |
| class-variance-authority                    | 0.7.1               | Apache-2.0 |                                                                                           |
| tailwind-merge / clsx                       | 3.7.0 / 2.1.1       | MIT        |                                                                                           |
| @lucide/angular                             | 1.52.0              | ISC        | Official Lucide binding (proposed)                                                        |
| storybook, @storybook/angular               | 10.6.1              | MIT        | zone.js is an optional peer; zoneless supported                                           |
| vitest                                      | 5.0.3               | MIT        | Angular CLI `unit-test` builder supports `^4.0.8 \|\| ^5`                                 |
| @testing-library/angular                    | 19.5.0              | MIT        |                                                                                           |
| @playwright/test                            | 1.63.0              | Apache-2.0 |                                                                                           |
| eslint / angular-eslint / typescript-eslint | 10.12 / 22.5 / 8.71 | MIT        | typescript-eslint supports TS `<6.1`: OK                                                  |
| prettier                                    | 3.9.9               | MIT        |                                                                                           |
| @changesets/cli                             | 3.0.3               | MIT        |                                                                                           |
| ng-packagr                                  | 22.2.4              | MIT        |                                                                                           |
| chart.js                                    | 4.5.1               | MIT        | Proposed chart lib                                                                        |
| @fontsource-variable/*                      | 5.3.x               | OFL-1.1    | Self-hosted fonts                                                                         |

## Proposed deviations (need approval)

1. **TypeScript 6.0.x pinned** instead of latest (7.0.2): this is a hard Angular 22 constraint.
2. **Unit tests via Angular CLI `@angular/build:unit-test` (Vitest 5)** instead of `@analogjs/vitest-angular` or `@nx/vitest` (which caps at Vitest 4). It is first-party with fewer moving parts. Testing Library stays.
3. **`@lucide/angular` (official)** instead of `@ng-icons/lucide` (the spartan default). `@ng-icons/core` declares peer deps on `@schematics/angular` and `@angular-devkit/schematics`, which would leak build tooling into consumers. Wrapped behind our own `Icon` component, so it can be swapped later.
4. **Chart.js 4 + thin in-house directive** instead of ECharts (much smaller bundle, which helps the 90+ performance target) or ng2-charts (one less dependency). Lazy-loaded on the dashboard route only.
5. **License check with `pnpm licenses list --json` + a small Node script** instead of `license-checker` (no extra dependency, and it understands the pnpm store).
6. **Headless layer:** spartan brain is the primary layer, with Angular CDK for gaps (e.g. Context Menu via `@angular/cdk/menu`). `@angular/aria` (first-party, stable in v22) overlaps for accordion/combobox/listbox/menu/tabs/tree. It stays as a fallback per component if brain falls short, but is not mixed in by default.

## Phases

### Phase 0: Plan

- [x] Inspect environment, verify versions and licenses
- [x] Propose 3 visual directions
- [x] Write PLAN.md
- [x] Write CLAUDE.md
- [ ] Decisions: scope, brand, direction, deviations

### Phase 1: Foundation

- [ ] `git init`, Nx workspace (pnpm, Angular preset, no default app)
- [ ] TypeScript strict, ESLint (flat config, angular-eslint, no `any`), Prettier, EditorConfig
- [ ] Commitlint/conventional commits (lightweight hook)
- [ ] `libs/tokens`: primitive + semantic tokens (color OKLCH, type, spacing, radius, shadow, motion, z-index) as CSS variables
- [ ] Tailwind v4 theme preset (`@theme inline` mapping to tokens)
- [ ] Light + dark themes; extra themes = a CSS file that overrides variables only (`[data-theme="x"]`)
- [ ] RTL via logical properties (lint rule / review checklist), `dir` support verified in Storybook
- [ ] `prefers-reduced-motion` handling in motion tokens
- [ ] Automated contrast check of token pairs (WCAG 2.2 AA) as a unit test
- [ ] `libs/ui` publishable lib skeleton (ng-packagr, secondary entry points, `cn()` helper)
- [ ] `apps/docs` Storybook (theme + direction toolbar, a11y addon)
- [ ] `apps/template` skeleton (zoneless, lazy routes)
- [ ] Unit test setup (Vitest + Testing Library), Playwright setup
- [ ] License-check script + THIRD_PARTY_LICENSES.md generation, MIT LICENSE
- [ ] Changesets
- [ ] GitHub Actions CI: lint, typecheck, test, build, license check, Storybook build
- [ ] Phase summary

### Phase 2: Components

Each component needs: cva variants/sizes, keyboard + ARIA, focus-visible, AA contrast, tokens only, stories + docs, unit tests (behaviour + a11y), its own secondary entry point.

- Primitives: [ ] Button [ ] Icon [ ] Input [ ] Textarea [ ] Label [ ] Checkbox [ ] Radio [ ] Switch [ ] Select [ ] Combobox [ ] Slider [ ] Badge [ ] Avatar [ ] Separator [ ] Skeleton [ ] Spinner
- Overlays: [ ] Dialog [ ] Sheet/Drawer [ ] Popover [ ] Tooltip [ ] Dropdown Menu [ ] Context Menu [ ] Command palette [ ] Toast
- Navigation: [ ] Tabs [ ] Breadcrumb [ ] Pagination [ ] Sidebar [ ] Navbar [ ] Stepper
- Data: [ ] Card [ ] Table (sort, paginate, select) [ ] Accordion [ ] Alert [ ] Progress [ ] Empty State [ ] Calendar/Date Picker
- Forms: [ ] Form Field (reactive + signal forms, validation messages)
- Layout: [ ] Container [ ] Stack [ ] Grid [ ] App Shell
- [ ] Phase summary

### Phase 3: Template app

- [ ] App shell: collapsible sidebar, top bar, theme switcher, command palette
- [ ] Auth: sign in, sign up, forgot password
- [ ] Dashboard: stat cards, table, chart
- [ ] Settings: profile, appearance, notifications
- [ ] Landing, 404, error pages
- [ ] Mock data layer behind injectable repository interfaces
- [ ] Responsive from 360px, lazy routes
- [ ] Phase summary

### Phase 4: Release readiness

- [ ] README: install, theming, contributing
- [ ] Changesets release flow, ng-packagr build, `npm pack --dry-run`
- [ ] CI complete
- [ ] Lighthouse: a11y ≥ 95, perf ≥ 90 on the template
- [ ] Phase summary
