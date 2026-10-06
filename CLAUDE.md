# CLAUDE.md

**Tassili** is a personal design system (the owner's "fingerprint") plus a starter template, in one Nx monorepo. Quality, consistency and maintainability come before speed. `PLAN.md` is the source of truth for progress: read it first, and update its checklist as work lands.

- Brand: **Tassili** · npm scope **`@tassili`** · component prefix **`tsl`** (`<tsl-button>`, `[tslButton]`, `TslButton`) · CSS variables `--tsl-*`
- Visual direction: Tuareg indigo (`primary`), red ochre (`brand`, used sparingly), sandstone neutrals; dark theme "desert night". Bricolage Grotesque (display), Instrument Sans (text), JetBrains Mono (code only), Noto Sans/Kufi Arabic fallbacks. Compact density, tight radii (controls 6px, cards 10px), crisp motion (120–240ms, no bounce).
- Avoid generic AI/shadcn tells: no cream + serif + terracotta, no all-caps eyebrows, no gradient washes, no identical cards with the same shadow.

## Stack (pinned majors)

- Angular 22 (standalone, signals, signal inputs/outputs/model, OnPush everywhere, **zoneless**), TypeScript **6.0.x** (Angular 22 requires `<6.1`; do not upgrade to TS 7)
- Nx 23 + pnpm 10 (pnpm workspace = `libs/*` only; apps resolve libs through tsconfig paths)
- `@spartan-ng/brain` (headless) with our own styles in `libs/ui` (helm patterns, owned code); Angular CDK for gaps
- Tailwind CSS v4 with token preset from `@tassili/tokens`; OKLCH colors
- class-variance-authority + tailwind-merge (+ clsx) via `cn()` from `@tassili/ui/core`
- Lucide icons via `@lucide/angular`, always through our own `Icon` component
- Storybook 10 (`apps/docs`, webpack builder), Vitest 5 via Angular's `unit-test` builder + Angular Testing Library + axe-core, Playwright (e2e + axe)
- ESLint 10 flat config (angular-eslint, typescript-eslint), Prettier, Changesets 3, commitlint, GitHub Actions
- Charts: Chart.js (template only, lazy-loaded)

## Repo layout

- `libs/tokens` (`@tassili/tokens`): `tokens.css` (all variables, light + dark + system fallback), `tailwind.css` (theme mapping + custom utilities), `base.css`, `fonts.css`, `preset.css`, `themes/*.css`, `test/` (contrast/gamut/parity checks)
- `libs/ui` (`@tassili/ui`): one **secondary entry point per component** (`libs/ui/<name>/ng-package.json` + `src/index.ts`, imported as `@tassili/ui/<name>`). `core` = `cn()` + shared types; `theme` = `TslTheme` service. `styles.css` is exported for consumers.
- `apps/docs`: Storybook config + foundation MDX pages; stories live next to components (`libs/ui/**/*.stories.ts`)
- `apps/template`: starter app, built **only** with the library
- `apps/template-e2e`: Playwright against the production build (desktop + 360px)
- `tools/scripts`: `check-styles.mjs` (RTL + token guard), `licenses.mjs` (policy + THIRD_PARTY_LICENSES.md)

## License rule (hard constraint)

- Runtime deps: MIT, Apache-2.0, ISC, BSD-2/3-Clause (and 0BSD for tslib). Fonts: OFL-1.1 only.
- Dev-only tools may also be MPL-2.0 (plus the permissive set documented in `tools/scripts/licenses.mjs`).
- Never: GPL/AGPL/LGPL, "source available", paid or freemium components.
- Check the license (`npm view <pkg> license`) **before** adding any dependency. Run `pnpm license:write` after dependency changes; CI fails if `THIRD_PARTY_LICENSES.md` is stale.
- Our own code: MIT.

## Component conventions

- Every component: typed signal-input API, variants/sizes via `cva`, sensible defaults, `ChangeDetectionStrategy.OnPush`, host `class` merged via `cn()` so consumers can extend.
- Accessibility: full keyboard support, correct ARIA roles/states, visible focus ring (`focus-ring` utility or base `:focus-visible`), WCAG 2.2 AA contrast, target size ≥ 24px.
- **Tokens only.** Use the token-backed utilities (`bg-primary`, `text-muted-foreground`, `rounded-md`, `shadow-sm`, `duration-fast`, `ease-out`, `z-popover`, `h-control-md`). Tailwind's default palette is removed. Arbitrary values only via variables: `w-(--tsl-sidebar-width)`.
- **RTL:** logical utilities only (`ms-*`, `pe-*`, `start-*`, `border-s`, `text-start`, `rounded-s`). `pnpm lint:styles` enforces this; justified exceptions need `tsl-allow-style: <reason>` on the line.
- Motion: duration/ease tokens only; `prefers-reduced-motion` zeroes them automatically.
- Theming: themes override CSS variables only (`[data-theme="…"]`). Components never branch on theme.
- Each component ships: implementation, `*.stories.ts` (all variants + states + usage docs), `*.spec.ts` (behaviour + axe a11y), its entry point. Add a dependency to `libs/ui/package.json` only when code first uses it (`@nx/dependency-checks` enforces this).
- Public API changes: **ask the user first** (once released). Add a changeset for any change to a published package.

## Code rules

- No `any` (use `unknown` + narrowing), no non-null assertions. Every `eslint-disable` needs a `-- reason`.
- Prefer `inject()`, `input()`, `output()`, `model()`, `computed()`; `effect()` sparingly; built-in control flow (`@if`, `@for`).
- Template app: no one-off styles; if something is missing, add it to the library.
- Mock data behind injectable interfaces (repository pattern) so a real API can be swapped in.

## Workflow

- Small conventional commits, one per component/feature (`feat(ui/button): …`, `chore(tokens): …`); commitlint runs on commit-msg.
- Before declaring any phase done: `pnpm validate` (format, lint + style guard, typecheck, tests, build, license check, Storybook build) and `pnpm e2e`. Fix failures; never skip them.
- At the end of each phase: summarize what was built, what is left, and the decisions that need input.

## Commands

| Task                      | Command                                                                                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Template dev server       | `pnpm start` (http://localhost:4200)                                                                                                                                                    |
| Storybook                 | `pnpm storybook` (http://localhost:6006)                                                                                                                                                |
| Everything CI runs        | `pnpm validate`                                                                                                                                                                         |
| Unit tests                | `pnpm test` · one project: `pnpm nx test ui` / `pnpm nx test tokens`                                                                                                                    |
| Lint + RTL/token guard    | `pnpm lint` (style guard only: `pnpm lint:styles`)                                                                                                                                      |
| Typecheck                 | `pnpm typecheck`                                                                                                                                                                        |
| Build                     | `pnpm build` (library output: `dist/libs/ui`)                                                                                                                                           |
| E2E (prod build, axe)     | `pnpm e2e`                                                                                                                                                                              |
| Licenses                  | `pnpm license:check` · regenerate: `pnpm license:write`                                                                                                                                 |
| New component entry point | `pnpm nx g @nx/angular:library-secondary-entry-point --library=ui --name=<name> --skipModule` (then delete its README and keep `libs/ui/tsconfig.lib.json` include as `**/src/**/*.ts`) |
| Changeset                 | `pnpm changeset`                                                                                                                                                                        |

## Distribution (no npm registry)

- Releases are GitHub Releases tagged `v<version>` with `tassili-tokens-<v>.tgz` and `tassili-ui-<v>.tgz` attached (`.github/workflows/release.yml` + `tools/scripts/github-release.mjs`).
- Consumers install by URL: `pnpm add https://github.com/okba-bouziane/tassili-angular/releases/download/v<v>/tassili-ui-<v>.tgz` (and the tokens tarball).
- Do not publish to npm unless the owner asks.

## Gotchas

- Storybook (webpack) needs `apps/docs/.postcssrc.json` with `transformAssetUrls: false` and fonts loaded as a separate style entry; the esbuild apps use the root `.postcssrc.json`.
- Angular's unit-test builder discovers specs under `sourceRoot`; `libs/ui` uses `sourceRoot: libs/ui` so secondary entry points are included.
- jsdom has no `matchMedia`; define it in specs that need it. axe's `color-contrast` rule does not work in jsdom (contrast is covered by `libs/tokens/test`).
- Keep `@angular/*` peer ranges in `libs/ui/package.json` in sync with the root version, or pnpm installs a second Angular copy and TestBed breaks.
