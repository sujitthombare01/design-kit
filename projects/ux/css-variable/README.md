# `@design-kit/ux/css-variable`

Every design token in design-kit, shipped as CSS custom properties. This is the single common location for tokens in the system — every Atom (and every future Molecule/Organism/Template) consumes tokens from here and nowhere else.

## Import

Import this once, globally, in the consuming application. Never import it from within a component's own stylesheet — that would duplicate the token stylesheet into every component's bundle.

CSS `@import` form:

```css
@import '@design-kit/ux/css-variable/index.css';
```

`angular.json` `styles` array form:

```json
{
  "styles": ["node_modules/@design-kit/ux/css-variable/index.css"]
}
```

## Full token catalogue

### Color

| Variable | Value |
|---|---|
| `--design-kit-color-primary-50` … `-900` | 10-step blue scale, `#eff6ff` → `#172554` |
| `--design-kit-color-danger-50` … `-900` | 10-step red scale, `#fef2f2` → `#450a0a` |
| `--design-kit-color-success-50` … `-900` | 10-step green scale, `#f0fdf4` → `#052e16` |
| `--design-kit-color-warning-50` … `-900` | 10-step amber scale, `#fffbeb` → `#451a03` |
| `--design-kit-color-neutral-50` … `-900` | 10-step gray scale, `#f8fafc` → `#0f172a` |
| `--design-kit-color-surface` | `#ffffff` |
| `--design-kit-color-surface-muted` | `var(--design-kit-color-neutral-50)` |
| `--design-kit-color-border` | `var(--design-kit-color-neutral-300)` |
| `--design-kit-color-text` | `var(--design-kit-color-neutral-900)` |
| `--design-kit-color-text-muted` | `var(--design-kit-color-neutral-500)` |
| `--design-kit-color-text-inverse` | `#ffffff` |
| `--design-kit-color-focus-ring` | `var(--design-kit-color-primary-500)` |

### Spacing

4px base grid, `rem`-based (1rem = 16px).

| Variable | Value | Variable | Value |
|---|---|---|---|
| `--design-kit-space-0` | `0rem` | `--design-kit-space-7` | `2rem` |
| `--design-kit-space-1` | `0.25rem` | `--design-kit-space-8` | `2.5rem` |
| `--design-kit-space-2` | `0.5rem` | `--design-kit-space-9` | `3rem` |
| `--design-kit-space-3` | `0.75rem` | `--design-kit-space-10` | `4rem` |
| `--design-kit-space-4` | `1rem` | `--design-kit-space-11` | `5rem` |
| `--design-kit-space-5` | `1.25rem` | `--design-kit-space-12` | `6rem` |
| `--design-kit-space-6` | `1.5rem` | | |

### Typography

| Variable | Value |
|---|---|
| `--design-kit-font-family-base` | `system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` |
| `--design-kit-font-family-mono` | `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace` |
| `--design-kit-font-size-xs` … `-2xl` | `0.75rem` → `1.5rem` |
| `--design-kit-font-weight-regular` / `-medium` / `-semibold` / `-bold` | `400` / `500` / `600` / `700` |
| `--design-kit-line-height-tight` / `-normal` / `-relaxed` | `1.25` / `1.5` / `1.75` |

### Radius

| Variable | Value |
|---|---|
| `--design-kit-radius-none` | `0rem` |
| `--design-kit-radius-sm` | `0.25rem` |
| `--design-kit-radius-md` | `0.375rem` |
| `--design-kit-radius-lg` | `0.5rem` |
| `--design-kit-radius-full` | `9999px` |

### Shadow

| Variable | Value |
|---|---|
| `--design-kit-shadow-sm` | `0 1px 2px 0 rgb(15 23 42 / 0.06)` |
| `--design-kit-shadow-md` | `0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.06)` |
| `--design-kit-shadow-lg` | `0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.05)` |
| `--design-kit-shadow-focus-ring` | `0 0 0 3px rgb(37 99 235 / 0.45)` |

### Motion

| Variable | Value |
|---|---|
| `--design-kit-motion-duration-fast` / `-base` / `-slow` | `100ms` / `200ms` / `320ms` |
| `--design-kit-motion-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--design-kit-motion-ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--design-kit-motion-ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |

### Z-index

| Variable | Value |
|---|---|
| `--design-kit-z-index-dropdown` | `1000` |
| `--design-kit-z-index-sticky` | `1100` |
| `--design-kit-z-index-overlay` | `1200` |
| `--design-kit-z-index-modal` | `1300` |
| `--design-kit-z-index-toast` | `1400` |

## Theming guide

Every component in design-kit reads these variables at render time via `var()`, so re-theming never requires touching component code — only re-declaring the variables at a different cascade scope:

```css
/* Dark theme example */
[data-theme='dark'] {
  --design-kit-color-surface: var(--design-kit-color-neutral-900);
  --design-kit-color-text: var(--design-kit-color-neutral-50);
  --design-kit-color-border: var(--design-kit-color-neutral-700);
}
```

Apply `[data-theme='dark']` to any ancestor element (typically `<html>` or `<body>`) to re-theme every design-kit component beneath it.

## Deprecation policy

See [docs/09-css-tokens-library.md](../../../docs/09-css-tokens-library.md#versioning-and-change-policy) — adding a token is a minor bump; renaming/removing a token is a breaking change that ships a deprecation-alias period.
