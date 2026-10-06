# CLAUDE.md

Personal design system (the "fingerprint") + starter template, in one Nx monorepo. Quality, consistency, and maintainability come before speed. `PLAN.md` is the source of truth for progress: read it first, and update its checklist as work lands.

> Placeholders until decided: `<scope>` = npm scope, `<Brand>` = brand name, visual direction = TBD. See PLAN.md → Open decisions.

## Stack (pinned majors)

- Angular 22 (standalone, signals, signal inputs/outputs/model, OnPush everywhere, **zoneless**), TypeScript **6.0.x** (Angular 22 requires `<6.1`; do not upgrade to TS 7)
- Nx 23 + pnpm 10
- spartan/ui: `@spartan-ng/brain` (headless) + helm styles **copied into and owned by** `libs/ui`; Angular CDK for gaps
- Tailwind CSS v4, CSS-variable tokens, OKLCH colors
- class-variance-authority + tailwind-merge (+ clsx) via a `cn()` helper
- Lucide icons via `@lucide/angular`, always through our own `Icon` component
- Storybook 10 (docs), Vitest via Angular CLI `unit-test` builder + Angular Testing Library, Playwright (e2e + visual)
- ESLint (flat config, angular-eslint, typescript-eslint), Prettier, Changesets, GitHub Actions
- Charts: Chart.js (template only, lazy-loaded)

## Repo layout

- `libs/tokens`: design tokens as CSS variables + Tailwind v4 theme preset (`@<scope>/tokens`)
- `libs/ui`: publishable library (`@<scope>/ui`), one **secondary entry point per component** (`@<scope>/ui/button`, …)
- `apps/docs`: Storybook
- `apps/template`: starter app, built **only** with the library

## License rule (hard constraint)

- Runtime deps: MIT, Apache-2.0, ISC, BSD-2/3-Clause only. Fonts: OFL-1.1 only.
- Dev-only tools may also be MPL-2.0.
- Never: GPL/AGPL/LGPL, "source available", paid or freemium components.
- Check the license (`npm view <pkg> license`) **before** adding any dependency. `pnpm license:check` must pass; regenerate `THIRD_PARTY_LICENSES.md` when deps change.
- Our own code: MIT.

## Component conventions

- Every component: typed signal-input API, variants/sizes via `cva`, sensible defaults, `ChangeDetectionStrategy.OnPush`, host `class` merged via `cn()` so consumers can extend.
- Accessibility: full keyboard support, correct ARIA roles/states, visible `:focus-visible` ring (token), WCAG 2.2 AA contrast, target size ≥ 24px.
- **No hardcoded colors, spacing, radius, shadows, durations or z-indexes.** Use tokens/Tailwind theme utilities only. No arbitrary values (`[#fff]`, `[13px]`) unless they reference a variable.
- **RTL:** logical properties/utilities only (`ms-*`, `pe-*`, `start-*`, `border-s`, `text-start`). Never `left/right`, `ml/mr`, `pl/pr`.
- Motion: use motion tokens; everything must respect `prefers-reduced-motion`.
- Theming: themes override CSS variables only (`:root`, `.dark`, `[data-theme="…"]`). Components never branch on theme.
- Each component ships: implementation, `*.stories.ts` (all variants + states + usage docs), `*.spec.ts` (behaviour + a11y), its entry point `ng-package.json` + `index.ts`.
- Selector prefix: TBD with brand (e.g. `<prefix>-button`, directive `[<prefix>Button]`).
- Public API changes: **ask the user first**.

## Code rules

- No `any` (use `unknown` + narrowing). No disabled lint rules without a written reason in a comment.
- Prefer `inject()`, `input()`, `output()`, `model()`, `computed()`, `effect()` sparingly; built-in control flow (`@if`, `@for`).
- Template app: no one-off styles; if something is missing, add it to the library.
- Mock data behind injectable interfaces (repository pattern) so a real API can be swapped in.

## Workflow

- Small conventional commits, one per component/feature (`feat(ui/button): …`, `chore(tokens): …`).
- Before declaring any phase done, run lint, typecheck, tests, and build. Fix failures; never skip them.
- At the end of each phase: summarize what was built, what is left, and the decisions that need input.
- If something is ambiguous or affects the public API, ask instead of guessing.

## Commands

_Filled in during Phase 1 once the workspace exists._
