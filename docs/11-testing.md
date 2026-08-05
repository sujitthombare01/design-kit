# 11 · Testing (Vitest)

## Runner

**Vitest** is the only unit test runner in this workspace — there is no Karma/Jasmine anywhere, including in scaffolding defaults. Angular 21's CLI test builder (`@angular/build:unit-test`) is configured with its Vitest runner integration, so `ng test` (aliased to `npm run test`) drives Vitest under the hood while still respecting Angular's TestBed compilation pipeline.

Rendering environment: Vitest **browser mode** (Playwright provider, headless Chromium) is the default for component specs, since it exercises real layout, real CSS cascade (important for verifying [[08-styling-design-tokens]] resolution), and real focus/keyboard behavior needed to test the accessibility requirements in [[05-angular-standards]]. Vitest's `jsdom` environment is acceptable only for pure logic specs that render nothing (e.g. a standalone pipe/util, none of which exist yet in this Atoms-only phase).

## Configuration shape

- `vitest.workspace.ts` at the root defines one Vitest "project" per library (`atom`, `ux`), each pointing at that project's `vitest.config.ts`, mirroring the Angular CLI's multi-project `angular.json` structure from [[03-folder-structure]].
- Each library's `tsconfig.spec.json` extends `tsconfig.base.json` (see [[06-typescript-standards]]) and adds `"types": ["vitest/globals"]` so `describe`/`it`/`expect` are available without explicit imports — but explicit imports (`import { describe, it, expect } from 'vitest'`) are nonetheless the house style, since `no-undef`-style implicit globals fight the explicit-import lint rules in [[07-linting-code-quality]].

## File and naming conventions

- Spec files are colocated: `button.component.spec.ts` beside `button.component.ts` (see [[03-folder-structure]]).
- `describe(ClassName, () => { ... })` — the outer `describe` block name is always the exported class name (`DesignKitAtomButtonComponent`), matching [[04-naming-conventions]].
- Nested `describe` blocks group by concern: `'rendering'`, `'variants'`, `'sizes'`, `'states'`, `'accessibility'`, `'events'`, `'forms integration'` (Input only).

## What every component spec must cover

1. **Rendering** — renders with default inputs, correct host selector/class output.
2. **Every variant and size** — each produces the expected host class/attribute, not just "doesn't throw."
3. **Every documented state** — disabled, loading (Button), error/readonly (Input) — both visual class output and the corresponding native attribute (`disabled`, `aria-invalid`, `aria-disabled`) are asserted together, since a class without the matching attribute is a real accessibility bug this suite exists to catch.
4. **Outputs fire correctly and don't fire when disabled** — e.g. a disabled Button's `(clicked)` output must not emit on a native click event.
5. **Forms integration (Input)** — `ControlValueAccessor` round-trip: `writeValue`, `registerOnChange`, `registerOnTouched`, and behavior when bound via both `formControl` and `ngModel` in a small host-test-component harness.
6. **Keyboard interaction** — Tab reaches the control, Enter/Space activates a Button, focus-visible styling class/attribute is present after keyboard focus.
7. **No `OnPush` regressions** — a targeted test that changes a signal input and asserts the view updates without manually calling `detectChanges()` twice, catching accidental reliance on default change detection timing.

## Coverage requirements

- **Minimum 95% line, branch, and function coverage per package**, measured via Vitest's built-in coverage (`@vitest/coverage-v8`).
- Coverage is a **CI gate**, not a report — a PR that drops any package below 95% fails the pipeline (see [[15-build-quality]]).
- 100% of the public API surface (every input, every output, every documented variant/size/state value) must be exercised by at least one assertion — coverage percentage alone is necessary but not sufficient; a code-review checklist item confirms API-surface coverage explicitly, since line coverage can hit 95% while skipping an entire variant branch that happens to share lines with another.

## Test doubles and isolation

- No mocking of Angular's own APIs (`TestBed`, DI) — tests use real `TestBed.configureTestingModule` with the real standalone component, not a shallow/stub render, since these are leaf UI components with no heavy dependencies to isolate from.
- No snapshot testing — snapshot diffs on HTML output are low-signal for a component library where you want assertions tied to *meaning* (an attribute, a class, an emitted value), not incidental markup shape.

## Commands

- `npm run test` — one-shot run, used in CI, fails on any failure or coverage-threshold breach.
- `npm run test:watch` — local watch mode.
- `npm run test:coverage` — explicit coverage report generation (HTML + text summary) for local inspection.

## Relationship to Storybook interaction tests

Vitest specs verify component *logic and contract* in a controlled harness; Storybook `play`-function interaction tests (see [[10-storybook]]) verify the *fully styled, fully composed* component behaves correctly under real user interaction sequences. Both are required; neither substitutes for the other.
