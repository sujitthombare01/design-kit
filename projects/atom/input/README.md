# Input

A standalone, `OnPush` text-input Atom with full `ControlValueAccessor` and `Validator` support, so it works identically inside Reactive Forms, Template-driven Forms, or with no forms at all.

## Import

```ts
import { DesignKitAtomInputComponent } from '@design-kit/atom/input';
```

## Setup prerequisite

`@design-kit/ux/css-variable` must be imported once, globally, by the consuming application before this component is used — every visual value on this component is a `var(--design-kit-*)` reference. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md).

## Selector

`design-kit-atom-input`

## Usage example

### Standalone (no forms)

```html
<design-kit-atom-input label="Email address" type="email" [(value)]="email" />
```

### Reactive Forms

```html
<design-kit-atom-input label="Email address" type="email" [formControl]="emailControl" />
```

### Template-driven Forms

```html
<design-kit-atom-input label="Email address" type="email" [(ngModel)]="email" name="email" />
```

## API reference

### Inputs

| Input | Type | Default | Notes |
|---|---|---|---|
| `type` | `InputType` | `'text'` | |
| `size` | `InputSize` | `'md'` | Aligns visually with Button's `size` values |
| `value` | `string` | `''` | Two-way bindable via `[(value)]`; also settable through `writeValue`/`formControl`/`ngModel` |
| `placeholder` | `string` | `''` | Never a substitute for `label` or `helperText` |
| `disabled` | `boolean` | `false` | Also settable via CVA `setDisabledState`, which takes precedence when bound to a `FormControl` |
| `readonly` | `boolean` | `false` | Value still submits with the form and remains focusable/selectable, unlike `disabled` |
| `required` | `boolean` | `false` | Also registers an intrinsic `Validator` producing a `{ required: true }` error |
| `invalid` | `boolean` | `false` | Explicit visual error state, independent of Angular Forms validity |
| `helperText` | `string \| undefined` | `undefined` | Rendered below the field when not showing an error |
| `errorText` | `string \| undefined` | `undefined` | Rendered instead of `helperText` when `invalid` is `true`; drives `aria-describedby` |
| `label` | `string` | *(required)* | There is no label-less variant — this input cannot compile without one |

### Outputs

| Output | Payload | Fires |
|---|---|---|
| `valueChange` | `string` | On every native `input` event (paired with `value` via `model()`) |
| `blurred` | `FocusEvent` | On native blur |

### Content-projection slots

| Slot | Purpose |
|---|---|
| `[slot=prefix]` | An icon/adornment rendered before the native input |
| `[slot=suffix]` | An icon/adornment rendered after the native input |

## Sizes

`'sm' | 'md' | 'lg'` — `md` is the default. Sizes use the same token-driven height/padding/font-size steps as [Button](../button/README.md), so a Button and an Input of the same `size` align visually in a form row.

## Accessibility

- `label` renders as a real `<label for="...">` bound to the native input's auto-generated, per-instance `id`.
- `aria-describedby` points at whichever of `errorText`/`helperText` is currently visible; it is omitted entirely when neither is present.
- `aria-invalid` mirrors `invalid` exactly (`"true"` or absent — never the literal string `"false"`).
- `aria-required` mirrors `required`.
- **Never use `placeholder` as a substitute for `label` or `helperText`.** Placeholder text disappears on input and is not a reliable accessible name — `label` is a required input specifically to make this mistake impossible to compile.

## Theming

Every color, spacing, radius, typography, shadow, and motion value on this component is a `var(--design-kit-*)` reference — there are no hardcoded visual values. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md) for the full token catalogue.

## Changelog

- `0.0.1` — initial release: 7 types, 3 sizes, CVA + Validator forms integration, error/helper text, prefix/suffix slots.
