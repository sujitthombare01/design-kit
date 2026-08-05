# design-kit

An Angular component library providing foundational Atoms (Button, Input) and a shared CSS design-token layer, built with standalone components, `OnPush` change detection, and strict TypeScript.

## Packages

| Package | Import path | Description |
|---|---|---|
| Atoms | [`@design-kit/atom/button`](projects/atom/button/README.md) | Foundational button component |
| Atoms | [`@design-kit/atom/input`](projects/atom/input/README.md) | Foundational text-input component with full Forms integration |
| Tokens | [`@design-kit/ux/css-variable`](projects/ux/css-variable/README.md) | Every design token in the system, as CSS custom properties |

See [`projects/atom/README.md`](projects/atom/README.md) and [`projects/ux/README.md`](projects/ux/README.md) for the level-package overviews.

## Getting started

```bash
npm install @design-kit/atom @design-kit/ux
```

Import the token stylesheet once, globally, in your application:

```css
@import '@design-kit/ux/css-variable/index.css';
```

Then use the components:

```html
<design-kit-atom-input label="Email address" type="email" [(value)]="email" />
<design-kit-atom-button variant="primary" (clicked)="submit()">Submit</design-kit-atom-button>
```

```ts
import { DesignKitAtomButtonComponent } from '@design-kit/atom/button';
import { DesignKitAtomInputComponent } from '@design-kit/atom/input';
```

## Development

```bash
npm install
npm run storybook      # local Storybook dev server with HMR
npm run test           # Vitest, one-shot, coverage-threshold enforced
npm run lint            # ESLint + Stylelint
npm run build           # builds @design-kit/atom and @design-kit/ux
```

## Architecture

Components are organized by Atomic Design level, each level a single npm package (`@design-kit/atom`, `@design-kit/ux`) with every component/asset shipped as an independently tree-shakable secondary entry point. See [`docs/02-architecture.md`](docs/02-architecture.md) for the full picture.

## Contributing

Coding standards, naming conventions, and quality gates are documented in [`docs/`](docs/) — start with [`docs/01-project-overview.md`](docs/01-project-overview.md). Every PR must pass the six CI gates described in [`docs/15-build-quality.md`](docs/15-build-quality.md).

## License

Unlicensed — internal package.
