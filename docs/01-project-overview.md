# 01 · Project Overview

## What this is

`design-kit` is an enterprise-grade Angular component library delivered as a set of independently importable, tree-shakable packages under the `@design-kit` npm scope. It follows Atomic Design principles, starting with **Atoms** (Button, Input) and a shared **CSS variable / design-token layer**, with Molecules, Organisms and Templates planned as future phases (see [[16-future-roadmap]]).

The library is built for consumption by multiple downstream Angular applications that need a consistent, accessible, themeable UI kit without pulling in components they don't use.

## Core goals

1. **Consistency** — every component looks and behaves the same everywhere it's used, governed by a single design-token source of truth.
2. **Tree-shakability / "single importable"** — consumers can `import` one component (e.g. Button) without bundling Input, Molecules, or any other package. See [[04-naming-conventions]] for how this is achieved via Angular secondary entry points.
3. **Accessibility by default** — WCAG 2.1 AA is a baseline requirement, not an afterthought, verified in both unit tests and Storybook (`addon-a11y`).
4. **Strict engineering quality** — strict TypeScript, strict linting, high test coverage, and zero-warning builds are release gates, not aspirations. See [[15-build-quality]].
5. **Documentation-first** — every package and every component ships with its own README; every architectural decision lives in this `docs/` folder so both humans and AI agents can reason about the system without reading source first.

## Tech stack summary

| Concern | Choice |
|---|---|
| Framework | Angular 21, standalone APIs only (no NgModules) |
| Change detection | `OnPush` everywhere |
| Component API | Signal-based `input()` / `output()` / `model()` |
| Language | TypeScript, strict mode (see [[06-typescript-standards]]) |
| Styling | Component-scoped CSS consuming shared design tokens (see [[08-styling-design-tokens]], [[09-css-tokens-library]]) |
| Documentation / visual testing | Storybook (see [[10-storybook]]) |
| Unit testing | Vitest (see [[11-testing]]) |
| Linting | ESLint flat config + typescript-eslint + angular-eslint (see [[07-linting-code-quality]]) |
| Package build | Angular CLI library build (`ng-packagr`) with secondary entry points |
| Distribution | npm, scoped packages under `@design-kit` |

## Audience for this documentation set

This `docs/` folder is written for two readers at once:

- **Human engineers** joining the project who need the full architectural picture before writing code.
- **AI coding agents** (including Claude) operating under the root [[../CLAUDE.md]] instruction set, which imports every file in this folder. Each file is scoped to one concern so an agent can load only what's relevant to the task at hand.

## Non-goals (for now)

- No JavaScript/TypeScript token exports yet — tokens are CSS custom properties only until [[16-future-roadmap]] Phase 2.
- No Molecules, Organisms, or Templates yet — architecture must anticipate them (see [[02-architecture]]) but none are implemented in this phase.
- No server-side framework integrations (React/Vue wrappers) are in scope.
- No visual regression tooling is wired up yet (planned, see [[16-future-roadmap]]).
