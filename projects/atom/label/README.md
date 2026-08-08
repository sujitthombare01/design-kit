# Label

A standalone, `OnPush` caption Atom for form fields — plain typography with no click behavior of its own. It exists so a `<label>` can be composed next to [Input](../input/README.md) (or any future form-control Atom) as an independent, reusable piece, rather than only living inside Input's own internal template.

## Import

```ts
import { DesignKitAtomLabelComponent } from '@design-kit/atom/label';
```

## Setup prerequisite

`@design-kit/ux/css-variable` must be imported once, globally, by the consuming application before this component is used — every visual value on this component is a `var(--design-kit-*)` reference. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md).

## Selector

`design-kit-atom-label`

## Usage example

```html
<design-kit-atom-label for="email-input" [required]="true">Email address</design-kit-atom-label>
<input id="email-input" type="email" />
```

Clicking the label focuses the associated control natively (standard `<label for>` browser behavior) — no Angular event handling is involved.

## API reference

### Inputs

| Input      | Type           | Default      | Notes                                                                                                                                           |
| ---------- | -------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `for`      | `string`       | _(required)_ | The `id` of the associated form control. There is no unlabelled-and-unassociated variant — this input cannot compile without one                |
| `size`     | `LabelSize`    | `'md'`       | Matches Input's own `size` scale — set both to the same value so a Label and its Input align visually                                           |
| `variant`  | `LabelVariant` | `'default'`  | `'error'` recolors the text to match a field currently showing a validation error                                                               |
| `required` | `boolean`      | `false`      | Renders a visual asterisk only — see Accessibility below                                                                                        |
| `disabled` | `boolean`      | `false`      | A purely visual, presentational flag — set the associated control's own `disabled` input too; Label has no native disabled semantics of its own |

### Outputs

_None._ Label has no interactive behavior beyond the browser's native `for` association.

## Sizes

`'sm' | 'md' | 'lg'` — `md` is the default, using the same font-size tokens as [Input](../input/README.md)'s control text at each size.

## Accessibility

- Renders a real `<label for="...">` — never a styled `<span>`/`<div>` pretending to be one.
- The `required` input renders a visual asterisk marked `aria-hidden="true"`. **It does not make the field accessibly required on its own** — that announcement comes from the associated control's own `required`/`aria-required` attribute (e.g. Input's `required` input, which registers an intrinsic `Validator`). Always set `required` on both Label and its associated control together.
- The `disabled` input is visual only, for the same reason: assistive tech takes its cues from the control's real `disabled` state, not the label's styling.

## Theming

Every color, spacing, typography, and font-weight value on this component is a `var(--design-kit-*)` reference — there are no hardcoded visual values. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md) for the full token catalogue.

## Changelog

- `0.0.1` — initial release: 3 sizes, default/error variants, required/disabled visual flags.
