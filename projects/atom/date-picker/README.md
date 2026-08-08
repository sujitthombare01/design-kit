# Date Picker

A standalone, `OnPush` date/date-time input Atom with full `ControlValueAccessor` and `Validator` support, so it works identically inside Reactive Forms, Template-driven Forms, or with no forms at all. It wraps the native `<input type="date">`/`<input type="datetime-local">` control, so date selection uses the browser's own accessible picker UI rather than a custom-built calendar widget.

## Import

```ts
import { DesignKitAtomDatePickerComponent } from '@design-kit/atom/date-picker';
```

## Setup prerequisite

`@design-kit/ux/css-variable` must be imported once, globally, by the consuming application before this component is used — every visual value on this component is a `var(--design-kit-*)` reference. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md).

## Selector

`design-kit-atom-date-picker`

## Usage example

### Standalone (no forms)

```html
<design-kit-atom-date-picker label="Appointment date" [(value)]="appointmentDate" />
```

### Date and time

```html
<design-kit-atom-date-picker
  label="Appointment date and time"
  type="datetime-local"
  [(value)]="appointmentDateTime"
/>
```

### Reactive Forms

```html
<design-kit-atom-date-picker label="Appointment date" [formControl]="dateControl" />
```

### Template-driven Forms

```html
<design-kit-atom-date-picker label="Appointment date" [(ngModel)]="date" name="date" />
```

## API reference

### Inputs

| Input        | Type                                            | Default      | Notes                                                                                                                                                                                                  |
| ------------ | ----------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`       | `DatePickerType` (`'date' \| 'datetime-local'`) | `'date'`     | Maps directly to the native `<input type="...">` value                                                                                                                                                 |
| `size`       | `DatePickerSize` (`'sm' \| 'md' \| 'lg'`)       | `'md'`       | Same token-driven height/padding/font-size steps as Button and Input, for visual alignment in a form row                                                                                               |
| `value`      | `string`                                        | `''`         | ISO 8601 value string (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm`), matching the native input's own value format. Two-way bindable via `[(value)]`; also settable through `writeValue`/`formControl`/`ngModel` |
| `disabled`   | `boolean`                                       | `false`      | Also settable via CVA `setDisabledState`, which takes precedence when bound to a `FormControl`                                                                                                         |
| `readonly`   | `boolean`                                       | `false`      | Value still submits with the form and remains focusable/selectable, unlike `disabled`                                                                                                                  |
| `required`   | `boolean`                                       | `false`      | Also registers an intrinsic `Validator` producing a `{ required: true }` error                                                                                                                         |
| `invalid`    | `boolean`                                       | `false`      | Explicit visual error state, independent of Angular Forms validity                                                                                                                                     |
| `min`        | `string \| undefined`                           | `undefined`  | ISO 8601 lower bound, reflected as the native `min` attribute; also registers a `{ min: { min, actual } }` `Validator` error                                                                           |
| `max`        | `string \| undefined`                           | `undefined`  | ISO 8601 upper bound, reflected as the native `max` attribute; also registers a `{ max: { max, actual } }` `Validator` error                                                                           |
| `helperText` | `string \| undefined`                           | `undefined`  | Rendered below the field when not showing an error                                                                                                                                                     |
| `errorText`  | `string \| undefined`                           | `undefined`  | Rendered instead of `helperText` when `invalid` is `true`; drives `aria-describedby`                                                                                                                   |
| `label`      | `string`                                        | _(required)_ | There is no label-less variant — this component cannot compile without one                                                                                                                             |

### Outputs

| Output        | Payload      | Fires                                                             |
| ------------- | ------------ | ----------------------------------------------------------------- |
| `valueChange` | `string`     | On every native `input` event (paired with `value` via `model()`) |
| `blurred`     | `FocusEvent` | On native blur                                                    |

No content-projection slots are exposed — the native picker affordance is provided by the browser itself.

## Sizes

`'sm' | 'md' | 'lg'` — `md` is the default. Sizes use the same token-driven steps as [Input](../input/README.md), so components of the same `size` align visually in a form row.

## Accessibility

- `label` renders as a real `<label for="...">` bound to the native input's auto-generated, per-instance `id`.
- `aria-describedby` points at whichever of `errorText`/`helperText` is currently visible; it is omitted entirely when neither is present.
- `aria-invalid` mirrors `invalid` exactly (`"true"` or absent — never the literal string `"false"`).
- `aria-required` mirrors `required`.
- Date/time selection UI (the browser's native picker affordance, keyboard segment navigation, and screen-reader labeling of each date segment) is provided by the platform's native `<input type="date">`/`<input type="datetime-local">` implementation, which has broader assistive-technology support than a hand-built calendar widget.

## Theming

Every color, spacing, radius, typography, shadow, and motion value on this component is a `var(--design-kit-*)` reference — there are no hardcoded visual values. See [`@design-kit/ux/css-variable`](../../ux/css-variable/README.md) for the full token catalogue.

## Changelog

- `0.0.1` — initial release: `date`/`datetime-local` types, 3 sizes, CVA + Validator forms integration (`required`, `min`, `max`), error/helper text.
