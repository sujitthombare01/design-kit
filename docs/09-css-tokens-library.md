# 09 · CSS Tokens Library (`@design-kit/ux/css-variable`)

This is the single common location for every design token in the system, exactly as required: **`@design-kit/ux/css-variable`**. Every Atom (and every future Molecule/Organism/Template) consumes tokens from here and nowhere else. Consumption rules are in [[08-styling-design-tokens]]; naming patterns are in [[04-naming-conventions]].

## What this package is

`@design-kit/ux` is a level package like `@design-kit/atom`, but instead of shipping components it ships **CSS assets** through a secondary entry point, `css-variable`. There is no TypeScript runtime code in this entry point in the current phase — it is pure `.css`, distributed as static assets via `ng-packagr`'s asset-copying so consumers can either:

- `@import '@design-kit/ux/css-variable/index.css';` in their global stylesheet, or
- add the resolved path to their `angular.json` `styles` array.

A future phase (see [[16-future-roadmap]]) adds a parallel TypeScript export of the same values (as a frozen `const` object) for JS-side consumers (e.g. charting libraries that need a color programmatically) — out of scope today.

## File layout

```
projects/ux/src/lib/css-variable/
├── index.css        # imports every file below, in this order
├── color.css
├── spacing.css
├── typography.css
├── radius.css
├── shadow.css
├── motion.css
└── z-index.css
```

`index.css` is the only file consumers are told to import (see per-component README guidance in [[14-readme-guidelines]]); the split files exist for maintainability and are import-order-dependent internally (color before shadow, since shadow tokens may reference color tokens' alpha-blended values).

## Token catalogue (Phase 1 — current scope)

### Color (`color.css`)

- Base palette scales, 50–900, per semantic hue: `--design-kit-color-primary-{50..900}`, `--design-kit-color-danger-*`, `--design-kit-color-success-*`, `--design-kit-color-warning-*`, `--design-kit-color-neutral-*`.
- Semantic aliases that components should prefer over raw scale steps where one exists: `--design-kit-color-surface`, `--design-kit-color-surface-muted`, `--design-kit-color-border`, `--design-kit-color-text`, `--design-kit-color-text-muted`, `--design-kit-color-text-inverse`, `--design-kit-color-focus-ring`.
- Every semantic alias resolves to a scale step (`--design-kit-color-text: var(--design-kit-color-neutral-900);`) so themes can be built by re-pointing aliases without touching the base scale.

### Spacing (`spacing.css`)

- A unitless numeric scale on a 4px base grid, exposed in `rem`: `--design-kit-space-0` through `--design-kit-space-12` (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px equivalents).

### Typography (`typography.css`)

- `--design-kit-font-family-base`, `--design-kit-font-family-mono`.
- `--design-kit-font-size-{xs,sm,md,lg,xl,2xl}`.
- `--design-kit-font-weight-{regular,medium,semibold,bold}`.
- `--design-kit-line-height-{tight,normal,relaxed}`.

### Radius (`radius.css`)

- `--design-kit-radius-{none,sm,md,lg,full}`.

### Shadow (`shadow.css`)

- `--design-kit-shadow-{sm,md,lg}` and `--design-kit-shadow-focus-ring` (used for the accessible focus indicator required by [[05-angular-standards]]).

### Motion (`motion.css`)

- `--design-kit-motion-duration-{fast,base,slow}`.
- `--design-kit-motion-ease-{standard,accelerate,decelerate}`.

### Z-index (`z-index.css`)

- A small, explicit stacking scale for future overlay-producing Molecules/Organisms: `--design-kit-z-index-{dropdown,sticky,overlay,modal,toast}`. Atoms in the current phase don't need this, but it lives here now so no component ever invents an ad hoc `z-index` value later.

## Source of truth vs. output format

Token **values** (the actual hex codes, px scale, etc.) are authored directly as CSS custom properties in this phase — there is no separate JSON/YAML token source feeding a build step yet. If a token transformation pipeline (e.g. Style Dictionary) is introduced later to also emit the JS/TS export mentioned above, these `.css` files become generated output rather than hand-authored source, but the **public contract** (the variable names in [[04-naming-conventions]]) does not change.

## Versioning and change policy

- Adding a new token is a minor version bump for `@design-kit/ux`.
- Renaming or removing a token is a breaking (major) change — because it's a public CSS API surface consumed by application code directly, not just by this library's own components, a rename must ship a deprecation period: keep the old variable as an alias of the new one for at least one minor release, noted in the package's `README.md` changelog section (see [[14-readme-guidelines]]).
- Changing a token's *value* (e.g. retuning `--design-kit-color-primary-500`) is a visual change but not a breaking API change — still called out prominently in release notes since it repaints every consuming app.

## Testing

CSS-only entry points have no unit tests in the Vitest sense (see [[11-testing]]), but are covered by:

- A Stylelint pass (see [[08-styling-design-tokens]]) validating the token files themselves are well-formed and free of accidental hardcoded values sneaking into a token *definition* referencing another raw literal where a reference was intended.
- A Storybook "Design Tokens" documentation page (see [[10-storybook]]) that renders every token visually (color swatches, spacing rulers, type scale, radius/shadow previews) so a human can visually diff token changes in review.
