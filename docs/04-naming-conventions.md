# 04 · Naming Conventions

This is the single source of truth for every name in the system. If any other doc appears to conflict with this file, this file wins.

## npm scope and package structure

- Root npm scope: **`@design-kit`**
- Level packages (published units): `@design-kit/atom`, `@design-kit/ux`, and — in future phases — `@design-kit/molecule`, `@design-kit/organism`, `@design-kit/template` (see [[16-future-roadmap]]).
- Components are **secondary entry points** inside a level package, not separate npm packages. A consumer installs the level package once and imports per-component:

```
npm install @design-kit/atom @design-kit/ux

import { DesignKitAtomButtonComponent } from '@design-kit/atom/button';
import { DesignKitAtomInputComponent }  from '@design-kit/atom/input';
```

```
import '@design-kit/ux/css-variable';
```

This mirrors how `@angular/material/button` and `@angular/material/input` work inside the single `@angular/material` package — proven, tree-shakable, and it keeps versioning to one number per level instead of dozens of independently-versioned micro-packages.

## Selector convention

Pattern: `design-kit-<level>-<component>`

| Component | Selector |
|---|---|
| Button | `design-kit-atom-button` |
| Input | `design-kit-atom-input` |

Selectors are always element selectors (never attribute selectors), always fully lowercase, kebab-case, and always include the level segment so DOM output is self-describing regardless of which package it came from.

## Component class naming

Pattern: PascalCase mirror of the selector, suffixed `Component`.

| Selector | Class |
|---|---|
| `design-kit-atom-button` | `DesignKitAtomButtonComponent` |
| `design-kit-atom-input` | `DesignKitAtomInputComponent` |

Directives (if introduced later) follow the same pattern with suffix `Directive`; pipes with suffix `Pipe`.

## File naming

Inside a component's own folder, do **not** repeat the full prefix — the folder and the entry point already scope it:

```
projects/atom/src/lib/button/button.component.ts        ✅
projects/atom/src/lib/button/design-kit-atom-button.component.ts   ❌ redundant
```

Standard Angular suffixes apply: `.component.ts`, `.component.html`, `.component.css`, `.component.spec.ts`, `.stories.ts`, `.types.ts`.

## Type / interface naming

- Prop shape interfaces: `ButtonProps`, `InputProps` (not prefixed — they're internal to the entry point and re-exported through `public-api.ts` under their plain name).
- Variant/size/state unions live in `<component>.types.ts`:

```
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'success' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

- Exported type names are **not** prefixed with `DesignKit` — only the component class is, since the class is the thing that collides in the global Angular component registry; types live in module scope and collision is a non-issue.

## CSS custom property (design token) naming

Pattern: `--design-kit-<category>-<token>[-<step>]`

| Category | Examples |
|---|---|
| Color | `--design-kit-color-primary-500`, `--design-kit-color-danger-500`, `--design-kit-color-surface` |
| Spacing | `--design-kit-space-1` … `--design-kit-space-12` |
| Typography | `--design-kit-font-size-md`, `--design-kit-font-weight-bold`, `--design-kit-line-height-tight` |
| Radius | `--design-kit-radius-sm`, `--design-kit-radius-full` |
| Shadow | `--design-kit-shadow-sm`, `--design-kit-shadow-lg` |
| Motion | `--design-kit-motion-duration-fast`, `--design-kit-motion-ease-standard` |
| Z-index | `--design-kit-z-index-modal` |

Full catalogue and file layout in [[09-css-tokens-library]]; consumption rules in [[08-styling-design-tokens]].

## Storybook naming

Story titles follow the atomic level in the sidebar hierarchy: `Atoms/Button`, `Atoms/Input`. Story export names are PascalCase states: `Primary`, `Disabled`, `WithError`. Full conventions in [[10-storybook]].

## Test naming

Spec files are colocated and named `<component>.component.spec.ts`. `describe` blocks use the class name (`describe('DesignKitAtomButtonComponent', ...)`). Full conventions in [[11-testing]].

## Summary table

| Concept | Convention | Example |
|---|---|---|
| npm level package | `@design-kit/<level>` | `@design-kit/atom` |
| Component import path | `@design-kit/<level>/<component>` | `@design-kit/atom/button` |
| Tokens import path | `@design-kit/ux/css-variable` | `@design-kit/ux/css-variable` |
| Selector | `design-kit-<level>-<component>` | `design-kit-atom-input` |
| Class | `DesignKit<Level><Component>Component` | `DesignKitAtomInputComponent` |
| CSS variable | `--design-kit-<category>-<token>` | `--design-kit-color-primary-500` |
