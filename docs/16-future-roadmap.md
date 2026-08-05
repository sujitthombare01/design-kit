# 16 · Future Roadmap

This is a living list of scoped-out concerns explicitly deferred by [[01-project-overview]]'s non-goals section. Nothing here is committed to a timeline; each item exists so today's architecture decisions can be checked against tomorrow's likely needs without over-building now.

## Phase 2 — Molecules

- `@design-kit/molecule` package: composed components built from Atoms — e.g. a `FormField` (Label + Input + helper/error text as a single unit, formalizing the pattern Input already implements internally), a `SearchBar` (Input + Button), a `ButtonGroup`.
- Same secondary-entry-point-per-component architecture as [[02-architecture]], same folder shape as [[03-folder-structure]], same naming scheme extended to `design-kit-molecule-*` selectors per [[04-naming-conventions]].
- Dependency rule to preserve: Molecules may import Atoms; Atoms must never import Molecules; sibling Molecules must not import each other.

## Phase 2 — JS/TS token exports

- Publish the same values currently only in `@design-kit/ux/css-variable`'s CSS files (see [[09-css-tokens-library]]) as a frozen TypeScript `const` object (e.g. `@design-kit/ux/tokens`), for consumers needing a token value in JS logic (canvas/chart rendering, dynamic inline styles).
- Likely introduces a token transformation pipeline (e.g. Style Dictionary) so CSS and JS outputs are generated from one authored source instead of hand-kept in sync.

## Phase 3 — Organisms & Templates

- `@design-kit/organism` (e.g. a full form composed of multiple `FormField` Molecules with submit/cancel Buttons) and `@design-kit/template` (page-level layout scaffolding) following the same architectural pattern.
- This is the point at which a heavier monorepo tool (Nx) may earn its cost, since cross-package build-graph orchestration and affected-project detection become genuinely valuable at 4+ interdependent levels — revisit the "no Nx yet" decision in [[02-architecture]] here, not before.

## Theming

- Formal light/dark theme package or documented `[data-theme]` token override sets, building on the theming hook already designed into [[08-styling-design-tokens]] (every value is a `var()`, so no component code changes are needed — only a token-value override set needs to be authored and shipped).
- Density modes (compact/comfortable) via the same override mechanism applied to spacing/typography tokens.
- Brand theming guide for downstream teams who need to reskin the library for a specific product surface without forking components.

## Internationalization / RTL

- Logical CSS properties audit (`margin-inline-start` instead of `margin-left`, etc.) across all component stylesheets so the library works correctly under `dir="rtl"` without component-level branching.
- No component currently contains hardcoded copy (all text is consumer-supplied via inputs like `label`/`helperText`), which keeps translation entirely an application concern — preserve this constraint as new components are added.

## Visual regression testing

- Chromatic (or a self-hosted equivalent such as Loki/BackstopJS) wired against the Storybook build from [[10-storybook]], gating PRs on pixel-diff review for every story — a stronger guarantee than the current `addon-a11y` + interaction-test gate, which catches behavioral/accessibility regressions but not purely visual ones (e.g. a token value change producing unintended contrast shifts).

## CI/CD maturity

- Formal changesets-based release automation replacing the current manual `npm version` step in [[15-build-quality]], once release cadence and team size justify it.
- Automated dependency-update PRs (Renovate/Dependabot) with the full [[15-build-quality]] gate suite required to pass before merge, given how sensitive this library's Angular/Storybook/Vitest toolchain versions are to each other.
- Pre-commit hook (Husky + lint-staged) running a fast subset of [[07-linting-code-quality]]'s checks, once contributor count makes CI-only feedback too slow a loop.

## SSR / hydration

- Explicit Angular SSR (`@angular/ssr`) compatibility verification pass for every Atom (no direct `window`/`document` access outside `afterNextRender`/platform checks) once a consuming application requires server-rendering — not yet a confirmed requirement, so not yet implemented, but the "no direct DOM globals" discipline from [[05-angular-standards]]'s host-binding guidance should already make this a low-effort audit rather than a rewrite when the need arises.

## Documentation site

- A dedicated, deployed documentation site (beyond the deployed static Storybook build) aggregating this `docs/` folder's architectural content for human readers who aren't operating inside an AI-agent-driven workflow — this `docs/` folder remains the source of truth either way; a doc site would only be a rendered view of it.
