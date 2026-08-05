# 06 · TypeScript Standards

## Baseline

All packages compile under one shared `tsconfig.base.json` at the workspace root; each project's `tsconfig.lib.json`/`tsconfig.spec.json` extends it and only adds `rootDir`/`outDir`/`types` overrides. No project is allowed to loosen a strict flag.

## Required compiler options

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noPropertyAccessFromIndexSignature": true,
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "target": "ES2022",
    "module": "preserve",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictAttributeTypes": true,
    "strictContextGenerics": true,
    "extendedDiagnostics": {
      "checks": { "all": "error" }
    }
  }
}
```

`strictTemplates` (and the rest of `angularCompilerOptions`) is as important as `strict` in `compilerOptions` — a template that isn't type-checked is a hole in every other guarantee this doc makes.

## Rules of use

1. **No `any`.** Use `unknown` at boundaries and narrow explicitly. If a third-party type is genuinely untyped, isolate the `any` behind a single, named, documented adapter function rather than letting it spread.
2. **No non-null assertions (`!`) as a habit.** A `!` is allowed only with a one-line comment explaining the invariant that makes it safe (e.g. right after an `@ViewChild` that is guaranteed present post-`AfterViewInit`). Prefer narrowing or `input.required()` (which is non-nullable by construction) instead.
3. **Prefer `type` unions for variant/size/state props** (`type ButtonVariant = 'primary' | 'secondary' | ...`) over `enum`. Enums produce runtime JS output and don't tree-shake as cleanly in a library meant to be as small as possible per entry point.
4. **`readonly` by default.** Interface/type properties and array types (`readonly string[]`) are `readonly` unless the field is genuinely mutated after construction.
5. **No barrel re-exports beyond `public-api.ts`.** Internal files import each other directly (`./button.types`), never through an internal index file, to keep dependency graphs and tree-shaking analysis simple.
6. **Exhaustiveness checking.** Any `switch` over a variant/size/state union must have a `default: assertNever(value)`-style exhaustiveness guard so adding a new variant is a compile error everywhere it isn't handled.
7. **Project references** are used between library projects that depend on each other in the dependency graph described in [[02-architecture]] (currently none — Atoms don't depend on each other — but `ux` conceptually underlies everything, wired via `paths` for local dev, not `tsconfig` project references, since CSS-only packages have no `.d.ts` graph to reference).

## Path mapping (local development only)

`tsconfig.base.json` maps `@design-kit/*` to source (`projects/*/src/public-api.ts`) purely so Storybook and local demo consumption resolve against source during development without a build step:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@design-kit/atom/button": ["projects/atom/src/lib/button/public-api.ts"],
      "@design-kit/atom/input": ["projects/atom/src/lib/input/public-api.ts"],
      "@design-kit/ux/css-variable": ["projects/ux/src/lib/css-variable/public-api.ts"]
    }
  }
}
```

These path mappings are **stripped from published output** — they exist only in `tsconfig.base.json` at the workspace root, never in the individual library `package.json`/`tsconfig.lib.json` files, so published consumers resolve through real npm package `exports`, not workspace-relative paths.

## Editor/CI enforcement

- `tsc --noEmit -p tsconfig.base.json` (or per-project) runs in CI as a distinct, fast-failing step before lint and test — see [[15-build-quality]].
- Type-checking is also wired into ESLint via `typescript-eslint`'s type-aware rule sets — see [[07-linting-code-quality]] — so type errors surface at the same time as style errors in-editor.
