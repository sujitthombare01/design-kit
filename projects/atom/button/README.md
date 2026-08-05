# Button

A standalone, `OnPush` button Atom covering every common call-to-action need: seven visual variants, five sizes, loading and disabled states, and icon-agnostic content projection.

## Import

```ts
import { DesignKitAtomButtonComponent } from '@design-kit/atom/button';
```

## Setup prerequisite

`@design-kit/ux/css-variable` must be imported once, globally, by the consuming application before this component is used. Without it, Button renders with no color, spacing, radius, shadow, or motion — every visual value on this component is a `var(--design-kit-*)` reference and resolves to nothing until the token stylesheet is loaded. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md).

## Selector

`design-kit-atom-button`

## Usage example

```html
<design-kit-atom-button variant="primary" size="md" (clicked)="onSave()"> Save changes </design-kit-atom-button>
```

## API reference

### Inputs

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `ButtonVariant` | `'primary'` | |
| `size` | `ButtonSize` | `'md'` | |
| `disabled` | `boolean` | `false` | Reflected to the native `disabled` attribute |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy="true"`, implicitly blocks interaction |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Always set explicitly to avoid the native `<button>` in `<form>` default of `submit` |
| `fullWidth` | `boolean` | `false` | Stretches the button (and its host) to 100% of the container width |
| `iconPosition` | `'start' \| 'end'` | `'start'` | Only relevant when content is projected into `[slot=icon]` |

### Outputs

| Output | Payload | Fires |
|---|---|---|
| `clicked` | `MouseEvent` | On native click, only when not `disabled` and not `loading` |

### Content-projection slots

| Slot | Purpose |
|---|---|
| `[slot=icon]` | An icon, positioned per `iconPosition`. Button owns no icon input — it is icon-library-agnostic. |
| *(default)* | The button's label content. |

## Variants

| Variant | Intent |
|---|---|
| `primary` | The single default call-to-action per view |
| `secondary` | A secondary action alongside a primary one |
| `outline` | Bordered, transparent background; de-emphasized action |
| `ghost` | No border, no background until hover/focus; lowest-emphasis action |
| `link` | Renders as inline text with underline-on-hover, retaining button semantics/keyboard behavior |
| `success` | Confirms a positive, often destructive-adjacent action |
| `danger` | Destructive or irreversible action |

## Sizes

`'xs' | 'sm' | 'md' | 'lg' | 'xl'` — `md` is the default. `xs`/`sm` are dense, desktop-only affordances: their padding does not guarantee the 44×44px minimum accessible hit-target, so avoid them on touch surfaces. `md` and above do.

## Accessibility

- Renders a real `<button>` — never a styled `<div>`/`<a>`.
- `aria-busy="true"` is set while `loading`; the accessible name does not change on loading toggles.
- The native `disabled` attribute is always used — `aria-disabled` is never a substitute.
- **Icon-only usage**: if you project only an icon into `[slot=icon]` with no visible text, you must supply an accessible name yourself, e.g.:

  ```html
  <design-kit-atom-button aria-label="Delete item" variant="danger">
    <span slot="icon" aria-hidden="true">🗑</span>
  </design-kit-atom-button>
  ```

  Button cannot know at compile time whether your projected content includes visible text, so it cannot generate this label for you.

## Theming

Every color, spacing, radius, shadow, and motion value on this component is a `var(--design-kit-*)` reference — there are no hardcoded visual values. Re-theme it entirely by re-declaring tokens at `:root` or a `[data-theme]` scope. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md) for the full token catalogue.

## Changelog

- `0.0.1` — initial release: 7 variants, 5 sizes, disabled/loading states, icon projection.
