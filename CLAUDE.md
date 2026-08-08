# CLAUDE.md

> Master instruction file for the **design-kit** Angular component library.

## What this project is

An Angular 21 component library, published under the `@design-kit` npm scope, built with standalone components, `OnPush` change detection, strict TypeScript, strict linting, Vitest for unit testing, and Storybook for documentation and visual/accessibility QA. Current scope is **Atoms** (Button, Input, Label, Date Picker) plus a shared **CSS design-token layer**. See [[docs/01-project-overview]] for the full picture.

## Imports

The following documents are part of this specification and MUST be treated as one unified instruction set. Read the referenced document(s) relevant to the current task before generating or modifying any code, config, or documentation — do not rely on this summary alone for anything beyond a quick orientation.

1. docs/01-project-overview.md — what this library is, goals, tech stack, non-goals
2. docs/02-architecture.md — Atomic Design levels, package-per-level + secondary-entry-point model, dependency rules
3. docs/03-folder-structure.md — exact workspace/folder layout, colocation rules
4. docs/04-naming-conventions.md — **single source of truth** for every package path, selector, class, and CSS variable name
5. docs/05-angular-standards.md — standalone/OnPush/signals/inject()/forms/accessibility rules for every component
6. docs/06-typescript-standards.md — required tsconfig strictness, path mapping, type-safety rules
7. docs/07-linting-code-quality.md — ESLint flat config, required rule sets, zero-warning policy
8. docs/08-styling-design-tokens.md — how components must consume CSS variables (never hardcode values)
9. docs/09-css-tokens-library.md — the `@design-kit/ux/css-variable` package: full token catalogue and file layout
10. docs/10-storybook.md — Storybook setup, required addons, story conventions, accessibility gate
11. docs/11-testing.md — Vitest configuration and required test coverage per component
12. docs/12-components-button.md — Button component spec: variants, sizes, states, API, accessibility
13. docs/13-components-input.md — Input component spec: types, states, forms integration, API, accessibility
14. docs/14-readme-guidelines.md — required README structure for the repo root, each level package, and each component
15. docs/15-build-quality.md — CI gates, coverage/bundle-size thresholds, versioning and publishing policy
16. docs/16-future-roadmap.md — explicitly deferred scope (Molecules, Organisms, theming, SSR, i18n, visual regression, etc.)

## Naming quick reference

(Full rationale and complete table in [[docs/04-naming-conventions]] — this is a summary, not the source of truth.)

- npm scope: `@design-kit`
- Level packages: `@design-kit/atom`, `@design-kit/ux` (future: `@design-kit/molecule`, `@design-kit/organism`, `@design-kit/template`)
- Component import paths (secondary entry points, independently tree-shakable — "single importable"): `@design-kit/atom/button`, `@design-kit/atom/input`, `@design-kit/atom/label`, `@design-kit/atom/date-picker`
- Shared design tokens (one common location for every CSS variable): `@design-kit/ux/css-variable`
- Selectors: `design-kit-atom-button`, `design-kit-atom-input`
- Component classes: `DesignKitAtomButtonComponent`, `DesignKitAtomInputComponent`
- CSS custom properties: `--design-kit-<category>-<token>`, e.g. `--design-kit-color-primary-500`, `--design-kit-space-4`, `--design-kit-radius-md`

## Non-negotiable rules (apply to every file, every PR)

- Standalone components only — no `NgModule`, anywhere.
- `ChangeDetectionStrategy.OnPush` on every component, no exceptions.
- Signal-based component API (`input()`, `output()`, `model()`, `computed()`, `signal()`, `inject()`) — no `@Input()`/`@Output()` decorators, no constructor injection.
- Every component folder is independently importable and ships its own `README.md` (see [[docs/03-folder-structure]], [[docs/14-readme-guidelines]]).
- Every color, spacing, radius, typography, shadow, and motion value in any stylesheet is a `var(--design-kit-*)` reference — never a hardcoded literal (see [[docs/08-styling-design-tokens]]).
- Strict TypeScript (`strict: true` + `strictTemplates: true` and the full flag set in [[docs/06-typescript-standards]]) and the full ESLint rule set in [[docs/07-linting-code-quality]] — zero warnings, not just zero errors.
- Every component has Storybook stories covering every variant/size/state and a clean `addon-a11y` pass (see [[docs/10-storybook]]).
- Every component has Vitest specs at ≥95% coverage, including full accessibility and forms-integration behavior (see [[docs/11-testing]]).
- WCAG 2.1 AA accessibility is a baseline requirement on every interactive component, not optional polish.

## Scope discipline

Current implementation scope is **Atoms (Button, Input, Label, Date Picker) + the CSS token layer only**. Do not build Molecules, Organisms, Templates, JS/TS token exports, theming packages, or CI/release automation beyond what [[docs/15-build-quality]] describes — those are intentionally deferred and catalogued in [[docs/16-future-roadmap]] so the architecture stays anticipatory without being prematurely built.
