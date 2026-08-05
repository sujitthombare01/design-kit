# 13 · Input Component (`@design-kit/atom/input`)

## Identity

| | |
|---|---|
| Import path | `@design-kit/atom/input` |
| Selector | `design-kit-atom-input` |
| Class | `DesignKitAtomInputComponent` |
| Change detection | `OnPush` |
| Standalone | Yes |
| Native host element | wraps a native `<input>` internally (component template owns the `<input>`; the component's own host tag is the outer field wrapper) |
| Forms | Implements `ControlValueAccessor` + `NG_VALUE_ACCESSOR`, and `Validator` + `NG_VALIDATORS` when `required`/`pattern` inputs are set |

## Input types (`InputType`)

`'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'`

Each maps directly to the native `<input type="...">` value — no custom masking/formatting logic lives in this Atom; formatting concerns belong to a future Molecule (e.g. a phone-number or currency field composed from this Input), tracked in [[16-future-roadmap]].

## Sizes (`InputSize`)

`'sm' | 'md' | 'lg'` — `md` default, same token-driven height/padding/font-size approach as Button (see [[12-components-button]] and [[04-naming-conventions]]) so a Button and an Input of the same `size` value align visually when placed side by side in a form row — this cross-component size alignment is a deliberate design constraint, not a coincidence.

## Inputs

| Input | Type | Default | Notes |
|---|---|---|---|
| `type` | `InputType` | `'text'` | |
| `size` | `InputSize` | `'md'` | |
| `value` (via CVA) | `string` | `''` | Set through `writeValue`, not a plain `@Input`/`input()` — see Forms integration below |
| `placeholder` | `string` | `''` | |
| `disabled` (via CVA) | `boolean` | `false` | Set through `setDisabledState`, not a plain input, so it stays in sync whether the consumer disables via the FormControl or would otherwise try to set it directly |
| `readonly` | `boolean` | `false` | Distinct from `disabled`: value is still submitted with the form and still focusable/selectable, per native `readonly` semantics |
| `required` | `boolean` | `false` | Also registers a `Validators.required`-equivalent via `Validator`/`NG_VALIDATORS` |
| `invalid` | `boolean` | `false` | Explicit visual error state, settable independently of Angular Forms validity so the component works even outside a `FormControl` context |
| `helperText` | `string \| undefined` | `undefined` | Rendered below the field when no error is showing |
| `errorText` | `string \| undefined` | `undefined` | Rendered instead of `helperText` when `invalid` is `true`; also drives `aria-describedby` |
| `label` | `string` | *(required — `input.required()`)* | Every Input **must** have a programmatic label; there is no label-less variant, since an unlabeled form field is a baseline accessibility failure this library refuses to make possible |
| `prefixContent` / `suffixContent` | content projection (`<ng-content select="[slot=prefix]">` / `[slot=suffix]`) | — | For icons/adornments; not a typed `@Input`, since projected content is arbitrary markup, not a data value |

## Outputs

| Output | Payload | Fires |
|---|---|---|
| `valueChange` | `string` | On every native `input` event — this is what powers `[(value)]` two-way binding via `model()` in addition to full `ControlValueAccessor` support, so the component works both inside and outside Reactive/Template-driven Forms |
| `blurred` | `FocusEvent` | On native blur — also internally calls `onTouched()` for CVA |

## Forms integration detail

- `writeValue(value: string | null)` — updates the internal signal driving the native input's value; never mutates a consumer-passed object.
- `registerOnChange` / `registerOnTouched` — standard CVA wiring; `onChange` is invoked from the native `(input)` handler, `onTouched` from `(blur)`.
- `setDisabledState(isDisabled: boolean)` — the *only* way `disabled` state is set when the component is bound via `formControlName`/`[formControl]`; the component also accepts a plain `disabled` input for non-Forms usage, and CVA's `setDisabledState` takes precedence whenever a `FormControl` is bound.
- `validate(control: AbstractControl)` (via `Validator`) — returns a `required`-shaped `ValidationErrors` object when `required` is `true` and the value is empty, so `form.get('field')?.errors` reflects the component's own intrinsic constraint without the consumer redundantly re-adding `Validators.required`.

## States

- **Default / Focus / Disabled / Readonly** — standard token-driven treatments per [[08-styling-design-tokens]], focus-visible ring shared with Button via the same `--design-kit-shadow-focus-ring` token.
- **Error (`invalid`)** — border color switches to `--design-kit-color-danger-500`-derived token, `errorText` replaces `helperText`, `aria-invalid="true"` is set on the native `<input>`.
- **Success** — not a separate boolean input; a `success` visual state (if ever needed) is expressed by the consumer choosing not to set `invalid` and optionally supplying `helperText` with success-toned content — kept out of the component's own state machine to avoid an input matrix explosion (`invalid` × `success` combinations) for a state that isn't a hard accessibility requirement the way error state is.

## Accessibility requirements

- `label` renders as a real `<label for="...">` bound to the native `<input>`'s generated `id` (auto-generated per instance, e.g. via Angular's injectable ID generation utilities, never hardcoded, so multiple instances of the same Input never collide).
- `aria-describedby` points at the currently-visible helper/error text's `id`; when neither is present, `aria-describedby` is omitted entirely rather than pointing at an empty element.
- `aria-invalid` mirrors `invalid` exactly (`"true"` or absent — never `"false"` as a literal string, since some assistive tech treats the mere presence of `aria-invalid="false"` inconsistently versus its absence).
- `aria-required` mirrors the `required` input.
- Placeholder text is **never** used as a substitute for `label` or `helperText` — this is called out explicitly in the component's README (see [[14-readme-guidelines]]) as a common anti-pattern the component's API is designed to make hard to fall into (since `label` is `input.required()`, you cannot compile a `design-kit-atom-input` without one).

## Storybook coverage required

Default, one story per `type`, one story per `size`, Disabled, Readonly, Required, WithHelperText, WithError, WithPrefixIcon, WithSuffixIcon, Focus (via `play` function typing a value and asserting `valueChange`), and the all-sizes matrix — see [[10-storybook]].

## Test coverage required

Per [[11-testing]]: full CVA round-trip test (`writeValue` → rendered value; native input → `onChange` callback → `valueChange` output), `Validator` returns correct `ValidationErrors` shape for `required`, `aria-describedby`/`aria-invalid` wiring asserted directly against rendered DOM attributes for every combination of `helperText`/`errorText`/`invalid`.
