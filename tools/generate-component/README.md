# Component generator

A deterministic scaffolder for a new `@design-kit/atom` component, in one of
two shapes ("kinds"). Same input always produces byte-identical output;
there is no LLM in this loop.

- **`interactive`** (default) — Button-style: hover/active solid-fill
  variants, padding-based sizing, an optional native-click output. Host
  element is `div`, `span`, or `button`.
- **`static`** — Label-style: plain typography, text-color-only variants,
  font-size-only sizing, never emits an output. Host element is `span`,
  `label`, `p`, or `div`. Optionally adds a `for` input (`--for-attribute`,
  `--element label` only) and/or a visual required-asterisk input
  (`--required-indicator`).

Anything that needs `ControlValueAccessor`/`Validator` forms integration
(an Input-like form control) is still out of scope — that stays hand-authored.

It is documented in [docs/03-folder-structure.md](../../docs/03-folder-structure.md)
and [docs/04-naming-conventions.md](../../docs/04-naming-conventions.md) as the
tool of record for scaffolding new Atoms — read those first if you're unsure
what shape a component should take.

## Using it through Claude Code

Rather than running the CLI directly, you can hand the whole thing to the
[`component-generator`](../../.claude/agents/component-generator.md) agent —
it interviews you for the spec (including which kind fits what you're
describing), shows you the dry-run plan, and only runs the script for real
once you confirm. It never writes component code itself; it's a
conversational front end over the exact same deterministic command described
below.

## Setup (one-time)

```bash
pip3 install -r tools/generate-component/requirements.txt
```

## Generate an interactive (Button-style) component

```bash
npm run generate:component -- \
  --name badge \
  --description "Small status/label indicator" \
  --kind interactive --element span \
  --variants neutral,primary,success,danger \
  --sizes sm,md,lg \
  --yes
```

## Generate a static (Label-style) component

```bash
npm run generate:component -- \
  --name caption \
  --description "Small muted helper text" \
  --kind static --element span \
  --variants default,muted,error \
  --sizes sm,md,lg \
  --yes
```

Add `--element label --for-attribute` if it needs to associate with a form
control (like Label does), and `--required-indicator` if it needs a visual
required-asterisk input.

Run without `--yes` first to see the full plan (every file it will create,
and a diff of every file it will modify) without writing anything.

### Flags

| Flag | Required | Notes |
|---|---|---|
| `--name` | yes | kebab-case, e.g. `badge` |
| `--description` | yes | one-line description, used in the README and the level README's entry-points table |
| `--level` | no | defaults to `atom` — the only level with this folder shape today |
| `--kind` | no | `interactive` (default) or `static` — see above |
| `--element` | no | defaults to `div`. Allowed values depend on `--kind`: `div`/`span`/`button` for `interactive`; `span`/`label`/`p`/`div` for `static` |
| `--variants` | no | comma-separated, first one is the default. Recognized names depend on `--kind`: interactive gets `primary`, `secondary`, `success`, `danger`, `warning`, `neutral`, `outline`, `ghost`, `link` (solid-fill tokens); static gets `default`, `muted`, `success`, `warning`, `error` (text-color tokens). Anything else gets a `TODO(design)`-marked fallback instead of an invented color |
| `--sizes` | no | comma-separated, first one is the default. Recognized names (`xs`, `sm`, `md`, `lg`, `xl`) reuse Button's padding/font-size tokens for `interactive`, or font-size-only tokens for `static` |
| `--flags` | no | comma-separated extra boolean inputs beyond the always-present `disabled`. Cannot reuse a built-in name (`disabled`, `variant`, `size`, `for`, `required`) |
| `--output-name` / `--output-payload` | no | `interactive` only — at most one output, bound to native `(click)`, guarded by `disabled()` |
| `--icon-slot` | no | adds an `[slot=icon]` content-projection slot |
| `--for-attribute` | no | `static` + `--element label` only — adds a required `for` input reflected as the native `for=` attribute |
| `--required-indicator` | no | `static` only — adds a `required` boolean input that renders an `aria-hidden` visual asterisk |
| `--force` | no | delete and fully regenerate if the component already exists (never merges) |
| `--yes` | no | actually write; omit for a dry run |

Invalid combinations (e.g. `--output-name` with `--kind static`, or
`--for-attribute` without `--element label`) are rejected with a clear error
before anything is written.

## Remove a component

```bash
npm run remove:component -- --name badge --yes
```

Reverses exactly the seam-file edits this tool made and deletes the
component folder. Safe to run twice — a second run reports nothing to do.

## What you still have to do by hand

- Any variant name outside the recognized set (see the `--variants` row
  above) needs real token choices in place of the generated `TODO(design)`
  placeholder.
- Any extra boolean flag (`--flags`) needs its visual effect designed —
  the generator only wires up the class, not what it does.
- Visual review in Storybook — the generator gets you to "compiles, lints,
  and tests pass," not "looks right."
- Anything structurally beyond a single wrapper element (e.g. a component
  rendering an `<svg>`, composing multiple native elements, or needing
  `ControlValueAccessor`/`Validator` forms integration like Input) — hand-author
  it instead, following Button/Input/Label as the closest reference.
- A dedicated `docs/1x-components-<name>.md` architecture doc, if you want
  one — optional, human-authored, not generated.

## How it works

- `model.py` — the `ComponentSpec` data model, validation (including which
  `--element`/flags are valid for which `--kind`), and the
  known-variant/known-size token lookups for both kinds.
- `templates/*.j2` — one Jinja2 template per generated file, each branching
  internally on `spec.kind` where the two shapes diverge. Based on the real
  `projects/atom/button/` (interactive) and `projects/atom/label/` (static)
  source.
- `seams.py` — the 6 file edits needed outside the component's own folder
  (`tsconfig.base.json`, both `projects/atom/tsconfig.*.json` include
  arrays, `angular.json`'s test include array, the ESLint
  `no-restricted-imports` group, and the level README's entry-points
  table, matched structurally rather than by exact text so Prettier's
  table-column reformatting doesn't break it). Every edit checks whether
  it's already applied before writing, so re-running is always safe.
- `generate.py` — the CLI: builds the spec, renders templates, computes the
  seam diffs, prints a plan, and only writes when `--yes` is passed. Every
  file it touches gets `npx prettier --write` (and, for `.css` files,
  `npx stylelint --fix`) run on it as the last step, so the Python code
  never has to hand-replicate either tool's exact formatting.
