# 12 · Button Component (`@design-kit/atom/button`)

## Identity

| | |
|---|---|
| Import path | `@design-kit/atom/button` |
| Selector | `design-kit-atom-button` |
| Class | `DesignKitAtomButtonComponent` |
| Change detection | `OnPush` |
| Standalone | Yes |
| Native host element | `<button>` |

## Variants (`ButtonVariant`)

`'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'success' | 'danger'`

| Variant | Intent |
|---|---|
| `primary` | The single default call-to-action per view; solid fill using `--design-kit-color-primary-*` |
| `secondary` | A secondary action alongside a primary one; lower visual weight, still solid |
| `outline` | Bordered, transparent background; de-emphasized action |
| `ghost` | No border, no background until hover/focus; lowest-emphasis action |
| `link` | Renders as inline text with underline-on-hover; used where a button must look like a link but retain button semantics/keyboard behavior |
| `success` | Confirms a positive, often destructive-adjacent action (e.g. "Approve") |
| `danger` | Destructive or irreversible action (e.g. "Delete") |

## Sizes (`ButtonSize`)

`'xs' | 'sm' | 'md' | 'lg' | 'xl'` — `md` is the default. Each size maps to a fixed combination of `--design-kit-space-*` (padding), `--design-kit-font-size-*`, and a minimum height token so all sizes maintain a consistent, accessible hit-target (44×44px minimum at `md` and above; `xs`/`sm` are documented as non-touch, desktop-dense-UI-only in the README per [[14-readme-guidelines]]).

## Inputs

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `ButtonVariant` | `'primary'` | |
| `size` | `ButtonSize` | `'md'` | |
| `disabled` | `boolean` | `false` | Reflected to native `disabled` attribute, not just a class |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy="true"`, and implicitly disables interaction (loading implies disabled, but the `disabled` input itself is not mutated) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Explicit default matters — an unset native `<button>` inside a `<form>` defaults to `submit`, which is almost never the intended behavior for a design-system component used freely inside forms |
| `fullWidth` | `boolean` | `false` | Stretches to 100% of container width |
| `iconPosition` | `'start' \| 'end'` | `'start'` | Only relevant when an icon is projected via content projection; Button does not own an icon input itself — icons are projected content, keeping Button icon-library-agnostic |

## Outputs

| Output | Payload | Fires |
|---|---|---|
| `clicked` | `MouseEvent` | On native click, **only when not `disabled` and not `loading`** |

Button intentionally does not wrap `(focus)`/`(blur)` as custom outputs — consumers needing those bind directly to the host element's native events, since Angular allows binding native DOM events on any component host without the component needing to re-expose them.

## States

- **Default** — variant's base visual treatment.
- **Hover** — via `:hover` pseudo-class in CSS, token-driven background shift (e.g. `--design-kit-color-primary-600` on hover for `primary`).
- **Focus-visible** — a token-driven ring (`--design-kit-shadow-focus-ring`, see [[09-css-tokens-library]]) using the `:focus-visible` pseudo-class so mouse clicks don't show a focus ring but keyboard navigation does.
- **Active/pressed** — a further token-driven shift while the pointer/key is held down.
- **Disabled** — native `disabled` attribute set (host binding `[attr.disabled]`), reduced-opacity token-driven treatment, `cursor: not-allowed` is **not** relied upon alone — `pointer-events` naturally becomes moot once the element is truly `disabled`.
- **Loading** — spinner replaces or accompanies label per a `loadingLabel`-less design (spinner is purely visual + `aria-busy`; the accessible name doesn't change, avoiding screen-reader announcement churn on every loading toggle).

## Accessibility requirements

- Renders a real `<button>` — never a styled `<div>`/`<a>` for button semantics (an `<a>`-based "link-styled" affordance belongs to a future `LinkButton`/anchor variant tracked in [[16-future-roadmap]] if ever needed, not to this component).
- `aria-busy="true"` while `loading`.
- `aria-disabled` is not used as a substitute for the native `disabled` attribute — native `disabled` is always used so both mouse and assistive-tech interaction are correctly blocked.
- Icon-only usage (content projection with no visible text) requires the consumer to supply an accessible name; the component's README documents the `aria-label` pattern for this case explicitly (see [[14-readme-guidelines]]) since Button cannot know at compile time whether projected content included visible text.
- Color contrast for every variant/state combination meets WCAG AA (4.5:1 for text, 3:1 for the focus indicator against adjacent colors) — verified via the Storybook `addon-a11y` gate in [[10-storybook]].

## Storybook coverage required

Default, one story per variant, one story per size, Disabled, Loading, Focus (via `play` function), FullWidth, IconStart/IconEnd (content-projection examples), and the all-variants/all-sizes matrix story — see [[10-storybook]] for the general per-component minimum bar this satisfies.

## Test coverage required

Per the general contract in [[11-testing]]: every variant/size produces correct host class output; `disabled` and `loading` both correctly suppress `clicked` emission; native `type` attribute reflects the `type` input; keyboard Enter/Space activates the button and fires `clicked` identically to a mouse click.
