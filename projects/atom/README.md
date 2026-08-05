# `@design-kit/atom`

Atoms — foundational, unstyled-by-default building blocks. Every visual value is a `var(--design-kit-*)` token reference; see [`@design-kit/ux/css-variable`](../ux/css-variable/README.md) for the token catalogue this package depends on.

## Install

```bash
npm install @design-kit/atom
```

## Entry points

| Entry point | Import path | Description |
|---|---|---|
| Button | [`@design-kit/atom/button`](button/README.md) | Seven-variant, five-size call-to-action button |
| Input | [`@design-kit/atom/input`](input/README.md) | Text input with full `ControlValueAccessor`/`Validator` Forms integration |

## Peer dependencies

`@angular/common`, `@angular/core`, `@angular/forms` — `^21.2.0`.

## Versioning policy

Semver, versioned independently from `@design-kit/ux`. See [docs/15-build-quality.md](../../docs/15-build-quality.md) for the full policy.
