# 05 · Angular Standards

Targets **Angular 21**. Every rule below is mandatory for every component in every package.

## Standalone only

- No `NgModule` exists anywhere in the library. Every component/directive/pipe sets `standalone: true` (or omits it, since standalone is the Angular 21 default — but set it explicitly for clarity and to guard against future default changes).
- Consumers import the class directly; there is no `DesignKitAtomModule` to import.
- Components must declare their own template-only dependencies via the `imports` array on the `@Component` decorator (e.g. `NgClass`, `NgIf`-replacement control flow — see below).

## Change detection

- Every component sets `changeDetection: ChangeDetectionStrategy.OnPush`. No exceptions.
- This means all inputs must be treated as immutable references; never mutate an `@Input`/signal-input object in place — replace it.
- Internal component state that affects the template must be a `signal()`, `computed()`, or come from an `input()`/`model()` — never a plain class field mutated imperatively, since plain fields don't trigger change detection under `OnPush`.

## Component API: signals, not decorators

Use the Angular signal-based component API exclusively:

- `input()` / `input.required()` for inputs (not `@Input()`).
- `output()` for events (not `@Output()` + `EventEmitter`).
- `model()` for two-way-bindable state (e.g. Input's value, if a two-way binding is offered in addition to `ControlValueAccessor`).
- `computed()` for derived template state (e.g. combining `variant` + `size` into a class-list string).
- `signal()` for internal mutable state (e.g. `focused`, `touched`).
- `inject()` for dependency injection — never constructor-parameter injection.

## Template control flow

Use the built-in control flow syntax (`@if`, `@for`, `@switch`) — never the legacy `*ngIf` / `*ngFor` structural directive syntax. This removes the need to import `CommonModule` for control flow in most templates.

## Host bindings

Prefer the `host` metadata object on `@Component`/`@Directive` over `@HostBinding`/`@HostListener` decorators, e.g.:

```ts
host: {
  '[class.is-disabled]': 'disabled()',
  '[attr.aria-disabled]': 'disabled()',
  '(click)': 'handleClick($event)',
}
```

## Forms integration (Input, and any future form-associated Atom)

- Implement `ControlValueAccessor` and register via the `NG_VALUE_ACCESSOR` provider so the component works in both Template-driven and Reactive forms without a wrapper.
- Also implement `Validator`/`NG_VALIDATORS` when the component has intrinsic validation semantics (e.g. `required`, `pattern`) so form-level `errors` reflect component state.
- Never require consumers to use `[(ngModel)]` exclusively — reactive `formControl`/`formControlName` binding must work identically.

## Accessibility (non-negotiable, WCAG 2.1 AA baseline)

- Every interactive Atom is keyboard-operable without a mouse (Tab to focus, Enter/Space to activate).
- Every focusable element has a visible focus indicator driven by a `--design-kit-*` token (see [[08-styling-design-tokens]]) — never `outline: none` without a replacement.
- Use native elements first (`<button>`, `<input>`) instead of re-implementing semantics with `<div>` + ARIA where a native element suffices.
- Associate labels, helper text, and error text via `aria-describedby`/`aria-labelledby`/`for`+`id` — see [[13-components-input]] for the exact pattern.
- Disabled state uses the native `disabled` attribute (via host binding), not merely a CSS class, so assistive tech and pointer-events both respect it.
- Every component ships an `addon-a11y` clean pass in Storybook — see [[10-storybook]].

## Public API surface discipline

- A component folder exposes exactly what `public-api.ts` re-exports: the component class and its `*.types.ts` unions/interfaces. No internal helper functions, no internal directives, no internal constants are exported.
- Inputs and outputs are the only contract. Do not expose `@ViewChild`-queried internals or public methods beyond what's strictly necessary (e.g. a `focus()` method is acceptable and common; exposing internal signals is not).

## Change detection & zoneless readiness

Write components so they work correctly whether or not zone.js is present (Angular's zoneless change detection path). This falls out naturally from using signals + `OnPush` correctly — avoid any code that relies on zone.js patching (e.g. assuming a `setTimeout` inside the component will trigger CD; explicitly update a signal instead).

## What NOT to do

- ❌ No `NgModule`.
- ❌ No `ChangeDetectionStrategy.Default`.
- ❌ No `@Input()`/`@Output()` decorators on new code.
- ❌ No `*ngIf`/`*ngFor`.
- ❌ No direct DOM manipulation outside `host` bindings/`Renderer2` when unavoidable.
- ❌ No component-to-component imports across Atoms (see [[02-architecture]]).
