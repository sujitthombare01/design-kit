# `@design-kit/ux`

Shared UX layer for design-kit — foundational, non-component assets consumed by every Atom (and, in future phases, every Molecule/Organism/Template). Currently ships one entry point: the CSS design-token layer.

## Install

```
npm install @design-kit/ux
```

## Entry points

| Entry point | Import path | Description |
|---|---|---|
| CSS Variables | [`@design-kit/ux/css-variable`](./css-variable/README.md) | Every design token in the system, as CSS custom properties. Required by every `@design-kit/atom/*` component. |

## Peer dependencies

None. This package ships CSS assets only in the current phase — see [`css-variable/README.md`](./css-variable/README.md).

## Versioning policy

Semver, versioned independently from `@design-kit/atom`. See [docs/15-build-quality.md](../../docs/15-build-quality.md) for the full policy, and [docs/09-css-tokens-library.md](../../docs/09-css-tokens-library.md) for token-specific rename/deprecation rules.
