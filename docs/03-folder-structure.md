# 03 · Folder Structure

## Top-level layout

```
design-kit/
├── CLAUDE.md
├── docs/                          # this folder — imported by CLAUDE.md
├── angular.json                   # multi-project workspace definition
├── package.json                   # single root package.json, workspace-wide devDependencies
├── tsconfig.base.json             # shared strict compiler options, see 06-typescript-standards.md
├── eslint.config.mjs              # flat ESLint config, see 07-linting-code-quality.md
├── vitest.workspace.ts            # Vitest workspace config, see 11-testing.md
├── .storybook/                    # root Storybook app config, see 10-storybook.md
└── projects/
    ├── atom/                      # @design-kit/atom
    │   ├── ng-package.json        # primary entry point manifest
    │   ├── package.json
    │   ├── README.md              # package-level README, see 14-readme-guidelines.md
    │   └── src/
    │       └── lib/
    │           ├── button/
    │           │   ├── ng-package.json      # secondary entry point manifest
    │           │   ├── package.json         # { "ngPackage": { "lib": { "entryFile": "public-api.ts" } } }
    │           │   ├── public-api.ts        # barrel: exports component + types only
    │           │   ├── README.md            # component-level README
    │           │   ├── button.component.ts
    │           │   ├── button.component.html
    │           │   ├── button.component.css
    │           │   ├── button.component.spec.ts
    │           │   ├── button.stories.ts
    │           │   └── button.types.ts      # variant/size/state unions
    │           └── input/
    │               ├── ng-package.json
    │               ├── package.json
    │               ├── public-api.ts
    │               ├── README.md
    │               ├── input.component.ts
    │               ├── input.component.html
    │               ├── input.component.css
    │               ├── input.component.spec.ts
    │               ├── input.stories.ts
    │               └── input.types.ts
    └── ux/                         # @design-kit/ux
        ├── ng-package.json
        ├── package.json
        ├── README.md
        └── src/
            └── lib/
                └── css-variable/           # @design-kit/ux/css-variable
                    ├── ng-package.json
                    ├── package.json
                    ├── public-api.ts       # re-exports nothing runtime; ships raw .css assets
                    ├── README.md
                    ├── index.css           # imports every token file below
                    ├── color.css
                    ├── spacing.css
                    ├── typography.css
                    ├── radius.css
                    ├── shadow.css
                    ├── motion.css
                    └── z-index.css
```

## Rules this structure encodes

1. **Colocation over separation.** A component's implementation, styles, tests, stories, types, and README all live in the same folder. There is no parallel `tests/` or `stories/` tree at the repo root.
2. **One `public-api.ts` per entry point.** This is the only file allowed to be imported from outside the folder; it re-exports the component class, its `*.types.ts` unions/interfaces, and nothing else (no internal helpers).
3. **`*.types.ts` holds shared shape.** Variant/size/state string-union types and any prop interfaces live in a dedicated types file so Storybook, the component, and consumers all reference one definition.
4. **Every folder that maps to an npm entry point has its own `README.md`.** See [[14-readme-guidelines]] for required sections.
5. **Future levels slot in identically.** When Molecules ship (see [[16-future-roadmap]]), `projects/molecule/src/lib/<component>/` follows this exact same internal shape.

## Naming the folders themselves

Folder names are the plain component name (`button`, `input`), never repeating the `design-kit-atom-` prefix — the prefix is applied only at the selector/class/package-path level. Full rationale in [[04-naming-conventions]].
