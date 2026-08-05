# 07 · Linting & Code Quality

## Tooling

- **ESLint** with the **flat config** format (`eslint.config.mjs` at the workspace root — no legacy `.eslintrc`).
- **typescript-eslint** in type-checked mode (`strictTypeChecked` + `stylisticTypeChecked` presets), since type-aware lint rules catch a class of bugs `tsc` alone doesn't flag (e.g. floating promises, unnecessary conditionals).
- **angular-eslint** for template and component-class rules, including its accessibility rule set.
- **Prettier** for formatting only — Prettier never participates in linting logic; `eslint-config-prettier` is included last in the flat config array to turn off any ESLint stylistic rule that would conflict with Prettier's output.
- **eslint-plugin-storybook** for stories files, so CSF structure and story hygiene are linted the same as component code.

## Required rule sets (in order of application)

```
js.configs.recommended
tseslint.configs.strictTypeChecked
tseslint.configs.stylisticTypeChecked
angular.configs.tsRecommended
angular.configs.tsAccessibility   // template a11y rules on the TS side (e.g. attribute bindings)
angular.configs.templateRecommended  // for *.html
angular.configs.templateAccessibility
storybook.configs['flat/recommended']
eslintConfigPrettier               // must be last
```

## Non-negotiable rules beyond the presets

| Rule | Setting | Why |
|---|---|---|
| `@typescript-eslint/no-explicit-any` | `error` | Enforces [[06-typescript-standards]] |
| `@typescript-eslint/explicit-function-return-type` | `error` (exported/public members) | Public API surfaces must have explicit, reviewable return types |
| `@typescript-eslint/no-floating-promises` | `error` | Type-aware; catches unhandled async in lifecycle hooks |
| `@typescript-eslint/consistent-type-imports` | `error` | Forces `import type { X }`, keeping `verbatimModuleSyntax` output clean |
| `@angular-eslint/prefer-standalone` | `error` | Enforces [[05-angular-standards]] standalone-only rule |
| `@angular-eslint/prefer-on-push-component-change-detection` | `error` | Enforces `OnPush` everywhere |
| `@angular-eslint/no-input-rename` / `no-output-rename` | `error` | Prevents surprising public-API name drift |
| `@angular-eslint/component-selector` | `error`, prefix `design-kit`, style `kebab-case`, type `element` | Enforces [[04-naming-conventions]] |
| `@angular-eslint/no-empty-lifecycle-method` | `error` | No dead lifecycle stubs |
| `@angular-eslint/template/no-any` | `error` | Templates can't smuggle `any` past strict TS |
| `@angular-eslint/template/prefer-control-flow` | `error` | Forces `@if`/`@for` over structural directives |
| `import/order` | `error`, groups: builtin → external → internal → relative, alphabetized | Deterministic, reviewable import blocks |
| `import/no-cycle` | `error` | Enforces the one-directional dependency rule in [[02-architecture]] |
| `no-restricted-imports` | `error`, blocks deep imports into a sibling component's internals (only `public-api.ts` may be imported) | Enforces entry-point encapsulation from [[03-folder-structure]] |
| `@typescript-eslint/no-unused-vars` | `error` | Redundant with `tsc` but keeps IDE feedback immediate |

## Severity policy

- Everything above is `error`, not `warn`. A build with lint warnings still fails CI — see [[15-build-quality]]'s zero-warning policy. There is no "acceptable" warning count.
- Disabling a rule inline (`eslint-disable-next-line`) requires a trailing comment naming the reason. A bare disable comment is itself flagged in code review.

## Scope

- `eslint.config.mjs` applies workspace-wide with per-glob overrides:
  - `**/*.ts` → full type-checked TS + Angular rule sets
  - `**/*.html` → Angular template rule sets
  - `**/*.stories.ts` → adds Storybook rules, relaxes `explicit-function-return-type` for `Meta`/`StoryObj` const exports (their types are inferred from CSF generics)
  - `**/*.spec.ts` → relaxes `@typescript-eslint/no-explicit-any` is **not** granted; test code holds the same bar as library code.

## Commands

- `npm run lint` — lints the whole workspace, no autofix, used in CI.
- `npm run lint:fix` — local convenience, autofixes what's safe to autofix.
- `npm run format` / `npm run format:check` — Prettier write / check, run independently of ESLint.

## Editor integration

Contributors are expected to have ESLint + Prettier editor integration enabled so violations surface before commit; CI is the enforcement backstop, not the primary feedback loop. Optional (tracked in [[16-future-roadmap]]): Husky + lint-staged pre-commit hook once the team is large enough to warrant it.
