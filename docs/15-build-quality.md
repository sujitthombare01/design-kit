# 15 · Build Quality & CI Gates

## Zero-warning policy

Every command below must complete with **zero errors and zero warnings** to be considered passing. A "passing build with warnings" does not exist in this project — a warning is a failing build that hasn't been fixed yet. This applies equally to `tsc`, ESLint, Stylelint, `ng build`, and `build-storybook` output.

## Required local/CI commands, in gate order

1. `npm run type-check` — `tsc --noEmit` across the workspace (see [[06-typescript-standards]]). Fastest gate; fails first to save CI time.
2. `npm run lint` — ESLint + Stylelint, no autofix (see [[07-linting-code-quality]], [[08-styling-design-tokens]]).
3. `npm run test` — Vitest, all packages, coverage thresholds enforced (see [[11-testing]]).
4. `npm run build` — builds every library project (`@design-kit/atom`, `@design-kit/ux`) via `ng-packagr`, verifying every secondary entry point resolves and produces correct `package.json`/`exports` output (see [[02-architecture]]).
5. `npm run build-storybook` — static Storybook build must succeed with no broken stories.
6. `npx test-storybook --ci` — runs Storybook's interaction tests and the `addon-a11y` accessibility gate headlessly against the built Storybook (see [[10-storybook]]); any accessibility violation fails this gate.

CI runs all six on every pull request, in the order above, failing fast at the first red gate.

## Coverage gate

Per [[11-testing]]: minimum 95% line/branch/function coverage per package, enforced by Vitest's coverage thresholds configuration (`vitest.config.ts` → `test.coverage.thresholds`), not by a separate manual check — a PR dropping coverage below threshold fails step 3 above automatically.

## Bundle size discipline

Each secondary entry point's built output is checked against a size budget (tracked via `ng build`'s built-in budget warnings, configured per entry point in `angular.json`). A Button or Input entry point exceeding its budget fails the build step, not just logs a warning — consistent with the zero-warning policy above. Budgets are deliberately tight (a handful of KB per Atom) since the entire point of the secondary-entry-point architecture in [[02-architecture]] is that importing one component should cost close to nothing.

## Versioning

- Semantic Versioning (semver) per level package (`@design-kit/atom`, `@design-kit/ux`), each versioned independently since they change at different rates.
- **Patch** — bug fixes, visual token value tweaks that don't change a variable's name or a component's API.
- **Minor** — new variant/size/input/output added in a backward-compatible way; new token added.
- **Major** — any renamed/removed selector, class, input, output, or token name; any change to default visual behavior significant enough to break a consuming app's visual regression baseline.
- A `CHANGELOG.md` per level package records every release, cross-referenced from that package's README (see [[14-readme-guidelines]]).

## Publishing flow

1. Merge to main only after all six CI gates pass.
2. Version bump via a single, deliberate release step (manual `npm version` + tag, or a changesets-style tool once the team scales — tracked as an open decision in [[16-future-roadmap]]) — never an automatic publish on every merge to main while the library is young and every release should be a deliberate, reviewed action.
3. `npm publish` runs against the `ng-packagr` build output directory (`dist/atom`, `dist/ux`), never against the source `projects/` tree, so published packages never accidentally include `.stories.ts`, `.spec.ts`, or source-only tsconfig files.

## Definition of Done for any component or token change

A change is not done until:

- [ ] All six CI gates pass.
- [ ] Coverage ≥95% maintained for the touched package.
- [ ] The component's/token's own README updated in the same PR (see [[14-readme-guidelines]]).
- [ ] The relevant architecture doc in this `docs/` folder updated in the same PR if the change affects naming, API shape, or token catalogue (this folder must never drift from actual code).
- [ ] Storybook stories updated to cover any new variant/size/state (see [[10-storybook]]).
- [ ] `addon-a11y` clean pass for any new/changed story.
