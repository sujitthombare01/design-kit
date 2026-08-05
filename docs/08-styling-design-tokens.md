# 08 · Styling & Design Tokens (Consumption Rules)

This doc covers how components **consume** design tokens. The token package itself (contents, file layout, publishing) is specced in [[09-css-tokens-library]]. Naming patterns for every variable are defined in [[04-naming-conventions]].

## The one hard rule

**Every color, spacing, radius, typography, shadow, motion, and z-index value in any component stylesheet must be a `var(--design-kit-*)` reference.** No hex codes, no raw `px`/`rem` numbers, no raw `ease-in-out`, no raw `box-shadow` value literals in any `*.component.css` file, anywhere in the library. This is enforced by code review and, where practical, by a Stylelint rule (see below) — it is not optional guidance.

```css
/* ❌ never */
.design-kit-atom-button {
  background-color: #2563eb;
  padding: 8px 16px;
  border-radius: 6px;
}

/* ✅ always */
.design-kit-atom-button {
  background-color: var(--design-kit-color-primary-500);
  padding: var(--design-kit-space-2) var(--design-kit-space-4);
  border-radius: var(--design-kit-radius-md);
}
```

## How a component gets access to the variables

Every level package's build depends on `@design-kit/ux/css-variable` being loaded once, globally, by the consuming application (documented as an installation step in every component's README, see [[14-readme-guidelines]]). Components never `@import` the token CSS file themselves — that would duplicate the token stylesheet into every component's bundle. Instead:

1. The **application** imports `@design-kit/ux/css-variable` once (e.g. in its global styles or root `angular.json` `styles` array).
2. Every `@design-kit/atom/*` component's stylesheet only ever **references** `var(--design-kit-*)` names — it assumes they resolve, exactly like consuming any CSS custom property defined on `:root` elsewhere in the cascade.
3. Storybook's `.storybook/preview.ts` imports the token CSS globally so component stories render correctly in isolation — see [[10-storybook]].

## Fallback values

`var()` fallbacks (`var(--design-kit-color-primary-500, #2563eb)`) are **not** used in component code. A missing token import is a setup error the consumer must fix (documented clearly in the README), not something to silently paper over with a hardcoded fallback that would defeat the entire token system and reintroduce the exact drift this architecture exists to prevent.

## Scoping and encapsulation

- Components use Angular's default `ViewEncapsulation.Emulated` — styles are scoped to the component, but `var()` reads still traverse the cascade up to wherever the tokens are defined (typically `:root`), since custom property resolution is unaffected by Shadow DOM-style encapsulation boundaries in Angular's emulated mode.
- Components must not set/override `--design-kit-*` variables on their own host element for internal use — that would create a second, component-local source of truth for a token that's supposed to be global. If a component needs a derived value, compute it via a component-scoped, non-token-named custom property instead (e.g. `--_button-current-bg: var(--design-kit-color-primary-500);`), keeping the leading underscore convention to visually distinguish "internal computed" properties from real design tokens.

## Theming hook

Because every visual value is a `var()` reference, theming (dark mode, brand overrides, density modes) is entirely a matter of the consuming application re-declaring the `--design-kit-*` custom properties at a different scope (`:root`, `[data-theme="dark"]`, etc.) — no component code changes are ever required to support a new theme. This is the reason the "every value must be a variable" rule is non-negotiable rather than a style preference.

## Linting enforcement

Stylelint (with `stylelint-config-standard` + a custom rule disallowing hex/`rgb()`/raw length literals in `background`, `color`, `border`, `padding`, `margin`, `border-radius`, `box-shadow`, `transition` properties) runs alongside ESLint in the same `npm run lint` command described in [[07-linting-code-quality]] and [[15-build-quality]].

## Responsive and density considerations

Spacing and typography tokens are defined as unitless-scale-driven `rem` values (see [[09-css-tokens-library]]) so consumers can shift the entire library's density by changing the root font size, without any component-level media queries. Components themselves do not contain breakpoints — atoms are size-variant driven (`size="sm"`), not viewport driven; responsive layout is a Molecule/Organism/Template concern (see [[16-future-roadmap]]).
