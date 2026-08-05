# 14 · README Guidelines

Every level package (`@design-kit/atom`, `@design-kit/ux`) and every individual component/entry-point folder (`button/`, `input/`, `css-variable/`) has its own `README.md`, colocated per [[03-folder-structure]]. There is no single monolithic docs README standing in for these — npm renders whichever `README.md` sits at the root of the package/entry point being viewed, so each one must be self-sufficient.

## Root repository README (workspace root, not a package)

Sections, in order:

1. **Title + one-line description** of the whole `design-kit` system.
2. **Packages table** — every published package, its import path, and a one-line description (mirrors [[04-naming-conventions]]'s summary table).
3. **Getting started** — install, global token import step, minimal usage snippet combining a Button and an Input.
4. **Development** — clone, install, `npm run storybook`, `npm run test`, `npm run lint` (mirrors [[15-build-quality]] commands).
5. **Architecture** — one paragraph plus a link into `docs/02-architecture.md` for anyone who wants the full picture.
6. **Contributing** — link to any contribution doc; coding standards pointer into this `docs/` folder.
7. **License**.

## Level-package README (`projects/atom/README.md`, `projects/ux/README.md`)

1. **Title + description** of the level (e.g. "Atoms — foundational, unstyled-by-default building blocks").
2. **Install** (`npm install @design-kit/atom`).
3. **Entry points table** — every component/asset available under this package, with its import path, linking to that entry point's own README.
4. **Peer dependencies** (Angular version range).
5. **Versioning policy** note — link to [[15-build-quality]]'s semver policy.

## Component README (`projects/atom/src/lib/button/README.md`, etc.) — required sections

1. **Title** — component name and one-line description.
2. **Import**
   ```
   import { DesignKitAtomButtonComponent } from '@design-kit/atom/button';
   ```
3. **Setup prerequisite** — explicit callout that `@design-kit/ux/css-variable` must be imported globally by the consuming app (per [[08-styling-design-tokens]]), since the component will render unstyled/incorrectly without it.
4. **Selector** — `design-kit-atom-button`.
5. **Usage example** — one minimal template snippet showing the selector with its most common inputs bound.
6. **API reference** — three tables: Inputs, Outputs, and (where applicable) content-projection slots — mirroring exactly the tables defined for that component in [[12-components-button]] or [[13-components-input]]. This README table is the version that ships to npm and must never drift from the architecture doc; when a component's API changes, both are updated in the same PR.
7. **Variants / Sizes** — visual/textual description of each allowed value (not just the type union — a one-line description of intended use per variant, as in [[12-components-button]]'s variant table).
8. **Accessibility** — the specific requirements from [[05-angular-standards]] and the component's own doc that a consumer must uphold on their end (e.g. Button's icon-only `aria-label` requirement, Input's "never use placeholder as a label substitute" warning).
9. **Theming note** — one line confirming the component has zero hardcoded visual values and is fully controlled by `--design-kit-*` tokens, linking to [[09-css-tokens-library]].
10. **Changelog** — either inline (for a young package) or a link to the package's `CHANGELOG.md`, called out especially for any deprecated-token or breaking-API entries per the versioning policy in [[09-css-tokens-library]] and [[15-build-quality]].

## Token-package README (`projects/ux/src/lib/css-variable/README.md`)

1. **Title + description**.
2. **Import** — both the CSS `@import` form and the `angular.json` `styles` array form.
3. **Full token catalogue table** — every variable name, its category, and its current value, generated/kept in sync with [[09-css-tokens-library]] (source of truth for the *list*; this README is the source of truth for the *published, npm-visible copy* of that same list — again, updated together in one PR whenever tokens change).
4. **Theming guide** — how to override tokens at `:root` or a `[data-theme]` scope to re-theme every consuming component.
5. **Deprecation policy** — link to [[09-css-tokens-library]]'s versioning section.

## Style rules for all READMEs

- Written in plain, direct language — no marketing tone.
- Every code sample must be copy-paste-runnable as shown (correct import path, correct selector, correct casing) — a README with a wrong import path is treated as a documentation bug with the same severity as a code bug.
- Tables over prose wherever there are more than two parallel facts to convey (inputs, outputs, variants) — matches the format already used throughout this `docs/` folder.
- Every README links back to the relevant file(s) in this `docs/` folder for anyone who wants the full rationale, rather than duplicating architectural reasoning inline.
