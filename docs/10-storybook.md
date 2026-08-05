# 10 · Storybook

## Purpose

Storybook is the library's living documentation, visual QA surface, and manual/automated accessibility gate. Every Atom must be fully explorable and documented in Storybook before it is considered done — a component without stories is not shippable.

## Setup

- Framework integration: `@storybook/angular`, builder `@storybook/builder-vite` (Vite-based build for fast HMR and to match the Vitest toolchain's underlying bundler — see [[11-testing]]).
- Single root-level Storybook instance at `.storybook/` consuming stories from every `projects/*/src/lib/**/*.stories.ts` glob — there is one Storybook for the whole workspace, not one per package, so cross-Atom consistency is reviewable in one place.
- `.storybook/preview.ts` globally imports `@design-kit/ux/css-variable` (see [[08-styling-design-tokens]]) so every story renders with real tokens resolved, plus a global `parameters.backgrounds` set (light/dark surface tokens) so components can be previewed against both.

## Required addons

| Addon | Purpose |
|---|---|
| `@storybook/addon-docs` | Auto-generated docs page per component (props table from Angular metadata + JSDoc, description, usage) |
| `@storybook/addon-a11y` | Runs axe-core against every story; violations fail CI in `test-storybook` mode (see [[15-build-quality]]) |
| `@storybook/addon-interactions` | Powers `play` functions and their step-by-step debugger for interaction tests |
| `@storybook/addon-controls` | Live-editable args mapped to component inputs |
| `@storybook/addon-viewport` | Preview across common breakpoints |
| `@storybook/addon-themes` | Toggle light/dark token scope (`data-theme` attribute) live in the toolbar, exercising the theming hook from [[08-styling-design-tokens]] |

## Story file conventions

- Colocated: `button.stories.ts` lives beside `button.component.ts` (see [[03-folder-structure]]).
- CSF3 format only (object-based `Meta`/`StoryObj`, no legacy CSF2 render functions).
- `title` follows the atomic hierarchy: `'Atoms/Button'`, `'Atoms/Input'`.
- `argTypes` are derived from the component's `*.types.ts` unions so the Controls panel's dropdown options can never drift from the actual allowed values.
- `tags: ['autodocs']` is set on every component's `Meta` so the docs page generates without a hand-maintained MDX file.

### Required stories per component (minimum bar)

Every interactive Atom ships at minimum:

1. **Default** — baseline args.
2. One story per **variant** (see [[12-components-button]] / [[13-components-input]]).
3. One story per **size**.
4. **Disabled**.
5. **Focus** (via a `play` function that focuses the element, so focus-ring styling is visually reviewable and screenshot-testable).
6. Any component-specific state (Button: `Loading`; Input: `WithError`, `WithHelperText`, `WithPrefixIcon`/`WithSuffixIcon`).
7. **All variants/sizes matrix** — a single composite story rendering every combination in a grid, used for fast visual diffing of the whole component at once.

## Interaction testing (`play` functions)

Every story exercising a user action (typing into Input, clicking Button, tabbing to focus) includes a `play` function using `@storybook/test`'s `userEvent`/`within`/`expect` utilities. This gives Storybook a second, browser-real testing surface distinct from Vitest's component tests (see [[11-testing]]) — Vitest verifies logic and output in a headless/jsdom-or-browser-mode environment, Storybook interaction tests verify the real rendered, styled component responds correctly to real user interaction sequences.

## Accessibility gate

`addon-a11y` findings at the "violation" level are treated as build failures, not warnings, enforced via `test-storybook --ci` in CI (see [[15-build-quality]]). "Needs review" level findings are triaged manually but tracked, never silently ignored.

## Documentation page content

The auto-generated docs page (`addon-docs`) is supplemented, not replaced, by the component's own `README.md` (see [[14-readme-guidelines]]) — Storybook shows *interactive* API exploration; the README is the durable, version-controlled, npm-visible reference. A "Design Tokens" MDX page (not autodocs — hand-authored) renders the full token catalogue from [[09-css-tokens-library]] visually.

## What Storybook is not

- Not a build artifact of any `@design-kit/*` package — `build-storybook` output is a separate static site, deployed independently (hosting target tracked in [[16-future-roadmap]]), never published to npm.
- Not a substitute for unit tests — coverage thresholds in [[11-testing]] are measured on Vitest runs, not Storybook interaction tests.

## Commands

- `npm run storybook` — local dev server with HMR.
- `npm run build-storybook` — static production build, used both for deployment and as the target of `test-storybook --ci` in the build-quality gate.
