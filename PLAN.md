# PLAN

Living plan for the UI library + starter template monorepo. Update the checklist as work lands.

**Status:** Phase 1 complete (2026-10-06). Next: Phase 2, starting with Button.

## Decisions

- [x] Brand **Tassili**, npm scope **`@tassili`** (`@okba` and `@oka` were taken), component prefix **`tsl`**
- [x] Visual direction A, refined to avoid the cream/serif/terracotta cliché: Tuareg indigo primary, red ochre brand accent, sandstone neutrals, "desert night" dark theme; Bricolage Grotesque + Instrument Sans + JetBrains Mono, Noto Sans/Kufi Arabic fallbacks
- [x] All six stack deviations approved (below)

## Open questions for the owner

- [x] No npm for now: packages ship as `.tgz` assets on GitHub Releases (`v<version>`), installed by URL
- [x] Repository: https://github.com/okba-bouziane/tassili-angular (public)

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

## Approved deviations

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
- [x] Decisions: scope, brand, direction, deviations

### Phase 1: Foundation

- [x] `git init`, Nx 23 integrated workspace (pnpm, Angular 22, no Nx Cloud, no AI-agent boilerplate)
- [x] TypeScript strict, ESLint 10 flat config (no `any`, OnPush, signals, template a11y, described disables), Prettier, EditorConfig
- [x] Commitlint + commit-msg hook (simple-git-hooks)
- [x] `libs/tokens`: color (OKLCH), type, spacing unit, control heights, radius, shadow, motion, z-index, layout tokens as CSS variables
- [x] Tailwind v4 preset: default palettes removed, token-backed utilities, custom `dark` variant, `duration-*`, `z-*`, `h-control-*`, `focus-ring`
- [x] Light + dark themes, `prefers-color-scheme` fallback, extra themes by variable overrides (`themes/oasis.css` example)
- [x] RTL: logical utilities enforced by `pnpm lint:styles`; Arabic font fallbacks; direction toolbar in Storybook
- [x] `prefers-reduced-motion`: duration tokens zeroed + global animation guard
- [x] Token tests: WCAG 2.2 AA contrast (96 checks), sRGB gamut, dark/system parity, Tailwind mapping completeness
- [x] `libs/ui` publishable skeleton: ng-packagr, secondary entry points (`core`, `theme`), `cn()`, `styles.css` export
- [x] `TslTheme` service (`@tassili/ui/theme`): system/explicit themes, persistence, pre-paint bootstrap script
- [x] `apps/docs` Storybook 10: theme + direction toolbars, a11y addon (errors on violations), foundation pages (colors, typography, theming/RTL)
- [x] `apps/template` skeleton: zoneless, lazy routes, theme wired
- [x] Unit tests (Vitest 5 via Angular builder, Testing Library, axe-core) and Playwright (prod build, desktop + 360px, axe WCAG 2.2 AA, no horizontal scroll)
- [x] License policy script + THIRD_PARTY_LICENSES.md, MIT LICENSE
- [x] Changesets (fixed versioning for ui + tokens) with GitHub-linked changelogs
- [x] GitHub Actions: CI (format, license, lint, typecheck, test, build, pack dry run, Storybook) + e2e job + release workflow (GitHub Releases, no npm)
- [x] Phase summary

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
- [ ] Changesets release flow → GitHub Release with tarballs; verify install by URL in a fresh Angular app
- [ ] Copy-source option (shadcn-style): `tassili add <component>` script that copies a component's source into another project
- [ ] CI complete
- [ ] Lighthouse: a11y ≥ 95, perf ≥ 90 on the template
- [ ] Phase summary
