# 02 · Architecture

## Design methodology: Atomic Design

The library is organized by Brad Frost's Atomic Design levels. Each level is its own published npm package (a "family" package) containing one **secondary entry point per component** — never one package per component. This is the mechanism that satisfies the "single importable" requirement; see [[04-naming-conventions]] for the full rationale and Angular Material precedent.

| Level | Package | Status |
|---|---|---|
| Atoms | `@design-kit/atom` | **Current scope** — Button, Input |
| Molecules | `@design-kit/molecule` | Planned, see [[16-future-roadmap]] |
| Organisms | `@design-kit/organism` | Planned |
| Templates | `@design-kit/template` | Planned |
| Shared UX / tokens | `@design-kit/ux` | **Current scope** — `css-variable` entry point |

Higher levels are allowed to depend on lower levels (a Molecule may compose Atoms), but never the reverse, and siblings at the same level must never depend on each other (Button must never import Input).

## Why one package per level, not one package per component

A naive approach would publish `@design-kit/button` and `@design-kit/input` as fully separate npm packages. This project deliberately does **not** do that. Instead:

- Each Atomic Design level is a single Angular library workspace project (`projects/atom`, `projects/molecule`, `projects/ux`, ...).
- Each component within that level is a **secondary entry point** built by `ng-packagr`, producing its own `package.json`, its own typings, and its own ES module output under the parent package's `node_modules/@design-kit/atom/button/` resolution path.
- Consumers install one package (`npm i @design-kit/atom`) and import only what they use (`import { DesignKitAtomButtonComponent } from '@design-kit/atom/button'`), and bundlers tree-shake away everything else because each entry point is a fully independent ES module graph.

This gives independent importability without the operational overhead of publishing, versioning, and cross-linking dozens of tiny npm packages.

## Dependency rules

1. **No cross-component imports within a level.** `atom/button` and `atom/input` must not import from one another.
2. **Tokens flow one direction only.** All components consume CSS custom properties from `@design-kit/ux/css-variable`. Nothing in `ux` may import from `atom`, `molecule`, etc.
3. **No app-level concerns in the library.** No routing, no HTTP calls, no global state management inside any `@design-kit/*` package. Components are presentational/UI-only.
4. **Standalone-only.** No `NgModule` is declared anywhere in the library. Every component, directive, and pipe is `standalone: true` (Angular 21 default) and consumed directly.
5. **Storybook and tests live beside the code they cover**, not in a parallel tree — see [[03-folder-structure]].

## Workspace shape

The repository is a single Angular CLI multi-project workspace (`angular.json` with multiple `projects` entries), not a separate monorepo tool (Nx, Lerna, Turborepo). This keeps the toolchain minimal while the library is small (Atoms + tokens). Revisit this decision in [[16-future-roadmap]] once Molecules/Organisms land and build-graph orchestration becomes valuable.

## Build output shape

Each library project builds independently via `ng build <project>`, using `ng-packagr`, producing:

- FESM2022 ES module bundles
- `.d.ts` type declarations
- Per-entry-point `package.json` with correct `"exports"` map so `@design-kit/atom/button` resolves without a bundler needing special configuration
- Ivy partial compilation output for downstream AOT compilation

No UMD/CommonJS output is produced — the library targets modern ESM consumers only.

## Storybook's relationship to the workspace

Storybook is a single root-level app (`.storybook/`) that imports stories from every library project's `src/lib/**/*.stories.ts`. It is a documentation/dev-time surface only — it is never published and never part of any `@design-kit/*` package's build output. See [[10-storybook]].
