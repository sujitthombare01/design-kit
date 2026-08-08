#!/usr/bin/env python3
"""Deterministic scaffolder for a new @design-kit/atom component, in one of
two shapes ("kinds"). Same input -> byte-identical output; no LLM in this loop.

Usage (interactive kind — Button-style: hover/active fill variants,
padding-based sizing, optional click output):
    python3 tools/generate-component/generate.py \\
        --name badge --description "Small status/label indicator" \\
        --kind interactive --element span \\
        --variants neutral,primary,success,danger --sizes sm,md,lg \\
        [--flags full-width,...] \\
        [--output-name clicked --output-payload MouseEvent] [--icon-slot] \\
        [--force] --yes

Usage (static kind — Label-style: plain typography, text-color-only
variants, font-size-only sizing, never emits an output):
    python3 tools/generate-component/generate.py \\
        --name caption --description "Small muted helper text" \\
        --kind static --element span \\
        --variants default,muted,error --sizes sm,md,lg \\
        [--for-attribute] [--required-indicator] [--icon-slot] \\
        [--force] --yes

    python3 tools/generate-component/generate.py --remove --name badge --yes

Without --yes, prints the full plan (new files + seam-file diffs) and exits
without writing anything.
"""

from __future__ import annotations

import argparse
import difflib
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
TOOL_DIR = Path(__file__).resolve().parent

sys.path.insert(0, str(TOOL_DIR))

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    print(
        "error: the 'jinja2' package is required but not installed.\n"
        "        Install it with:\n"
        "            pip3 install -r tools/generate-component/requirements.txt\n",
        file=sys.stderr,
    )
    sys.exit(1)

from model import (  # noqa: E402
    KIND_CHOICES,
    ComponentSpec,
    make_flag,
    make_output,
    render_size_css,
    render_variant_css,
    to_pascal_case,
)
from seams import seams_for  # noqa: E402

# template filename -> rendered output filename, relative to the component dir
TEMPLATE_TO_OUTPUT = {
    "component.ts.j2": "{name}.component.ts",
    "component.html.j2": "{name}.component.html",
    "component.css.j2": "{name}.component.css",
    "component.spec.ts.j2": "{name}.component.spec.ts",
    "stories.ts.j2": "{name}.stories.ts",
    "types.ts.j2": "{name}.types.ts",
    "public-api.ts.j2": "public-api.ts",
    "README.md.j2": "README.md",
    "ng-package.json.j2": "ng-package.json",
    "package.json.j2": "package.json",
}


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--name", required=True, help="kebab-case component name, e.g. 'badge'")
    parser.add_argument("--description", default="", help="one-line description (required to generate)")
    parser.add_argument("--level", default="atom", help="Atomic Design level (only 'atom' supported today)")
    parser.add_argument(
        "--kind",
        default="interactive",
        choices=KIND_CHOICES,
        help=(
            "'interactive' (Button-style: hover/active fill variants, padding-based "
            "sizing, optional click output) or 'static' (Label-style: plain "
            "typography, text-color-only variants, font-size-only sizing, never "
            "emits an output)"
        ),
    )
    parser.add_argument(
        "--element",
        default="div",
        help="host element — allowed values depend on --kind (div/span/button for "
        "interactive; span/label/p/div for static)",
    )
    parser.add_argument("--variants", default="", help="comma-separated, first is the default")
    parser.add_argument("--sizes", default="", help="comma-separated, first is the default")
    parser.add_argument("--flags", default="", help="comma-separated extra boolean inputs")
    parser.add_argument("--output-name", default=None, help="kebab-case output name, e.g. 'dismissed' (--kind interactive only)")
    parser.add_argument("--output-payload", default="MouseEvent", help="TS type of the output payload")
    parser.add_argument("--icon-slot", action="store_true", help="add an [slot=icon] projection slot")
    parser.add_argument(
        "--for-attribute",
        action="store_true",
        help="add a required 'for' input reflected as the native for= attribute "
        "(--kind static --element label only)",
    )
    parser.add_argument(
        "--required-indicator",
        action="store_true",
        help="add a 'required' boolean input that renders an aria-hidden asterisk "
        "(--kind static only)",
    )
    parser.add_argument("--force", action="store_true", help="delete and regenerate if the component already exists")
    parser.add_argument("--yes", action="store_true", help="actually write; omit for a dry run")
    parser.add_argument("--remove", action="store_true", help="reverse-generate: remove the component and seam edits")
    return parser.parse_args(argv)


def build_spec(args: argparse.Namespace) -> ComponentSpec:
    variants = tuple(v.strip() for v in args.variants.split(",") if v.strip())
    sizes = tuple(s.strip() for s in args.sizes.split(",") if s.strip())
    flags = tuple(make_flag(f.strip()) for f in args.flags.split(",") if f.strip())
    output = make_output(args.output_name, args.output_payload) if args.output_name else None
    return ComponentSpec(
        name=args.name,
        description=args.description,
        level=args.level,
        kind=args.kind,
        element=args.element,
        variants=variants,
        sizes=sizes,
        flags=flags,
        output=output,
        icon_slot=args.icon_slot,
        for_attribute=args.for_attribute,
        required_indicator=args.required_indicator,
    )


def render_component_files(spec: ComponentSpec) -> dict[str, str]:
    env = Environment(
        loader=FileSystemLoader(str(TOOL_DIR / "templates")),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["to_pascal"] = to_pascal_case

    context = {
        "spec": spec,
        "size_css_blocks": [render_size_css(spec.base_css_class, s, spec.kind) for s in spec.sizes],
        "variant_css_blocks": [
            render_variant_css(spec.base_css_class, v, spec.kind) for v in spec.variants
        ],
        "sizes_union": " | ".join(f"'{s}'" for s in spec.sizes),
    }

    rendered: dict[str, str] = {}
    for template_name, output_pattern in TEMPLATE_TO_OUTPUT.items():
        template = env.get_template(template_name)
        text = template.render(**context)
        if not text.endswith("\n"):
            text += "\n"
        output_name = output_pattern.format(name=spec.name)
        rendered[output_name] = text
    return rendered


def print_plan(new_files: dict[str, str], seam_changes: list[tuple[str, str, str]]) -> None:
    print("\nThe following NEW files would be created:")
    for relpath in sorted(new_files):
        print(f"  + {relpath}")

    print("\nThe following EXISTING files would be modified:")
    if not seam_changes:
        print("  (none — all seam entries already present)")
    for relpath, old_text, new_text in seam_changes:
        print(f"\n--- {relpath}")
        diff = difflib.unified_diff(
            old_text.splitlines(keepends=True),
            new_text.splitlines(keepends=True),
            lineterm="",
        )
        sys.stdout.writelines(diff)
    print()


def run_formatters(paths: list[Path]) -> None:
    """Prettier owns general formatting; Stylelint additionally owns CSS
    conventions (blank-line-before-rule/comment, property order) that
    Prettier doesn't touch. Both are idempotent --fix passes, so running
    them here means the Jinja templates never have to hand-replicate either
    tool's exact output.
    """
    if not paths:
        return
    rel = [str(p.relative_to(REPO_ROOT)) for p in paths]
    subprocess.run(["npx", "prettier", "--write", *rel], cwd=REPO_ROOT, check=True)
    css_rel = [p for p in rel if p.endswith(".css")]
    if css_rel:
        subprocess.run(
            ["npx", "stylelint", "--fix", *css_rel], cwd=REPO_ROOT, check=True
        )


def do_generate(spec: ComponentSpec, force: bool, apply: bool) -> int:
    spec.validate()
    component_dir = REPO_ROOT / "projects" / spec.level / spec.name

    if component_dir.exists():
        if not force:
            print(
                f"error: {component_dir.relative_to(REPO_ROOT)} already exists. "
                "Pass --force to delete and regenerate it.",
                file=sys.stderr,
            )
            return 1
        if apply:
            shutil.rmtree(component_dir)

    rendered = render_component_files(spec)
    new_files = {str(Path("projects", spec.level, spec.name, name)): text for name, text in rendered.items()}

    seam_changes: list[tuple[str, str, str]] = []
    seam_writes: list[tuple[Path, str]] = []
    for seam in seams_for(spec):
        path = REPO_ROOT / seam.relpath
        old_text = path.read_text()
        new_text, changed = seam.add(old_text, spec)
        if changed:
            seam_changes.append((seam.relpath, old_text, new_text))
            seam_writes.append((path, new_text))

    print_plan(new_files, seam_changes)

    if not apply:
        print("Dry run only — no files were written. Re-run with --yes to apply.")
        return 0

    component_dir.mkdir(parents=True, exist_ok=True)
    written_paths: list[Path] = []
    for name, text in rendered.items():
        out_path = component_dir / name
        out_path.write_text(text)
        written_paths.append(out_path)

    for path, text in seam_writes:
        path.write_text(text)
        written_paths.append(path)

    run_formatters(written_paths)

    print(f"Created {len(rendered)} files in {component_dir.relative_to(REPO_ROOT)}/")
    print(f"Updated {len(seam_writes)} seam file(s).")
    return 0


def do_remove(spec: ComponentSpec, apply: bool) -> int:
    spec.validate_name_and_level()
    component_dir = REPO_ROOT / "projects" / spec.level / spec.name

    seam_changes: list[tuple[str, str, str]] = []
    seam_writes: list[tuple[Path, str]] = []
    for seam in seams_for(spec):
        path = REPO_ROOT / seam.relpath
        old_text = path.read_text()
        new_text, changed = seam.remove(old_text, spec)
        if changed:
            seam_changes.append((seam.relpath, old_text, new_text))
            seam_writes.append((path, new_text))

    if not component_dir.exists() and not seam_changes:
        print(f"Nothing to remove for '{spec.name}' — no component folder and no seam entries found.")
        return 0

    print(f"\nThe component folder would be DELETED: {component_dir.relative_to(REPO_ROOT)}/")
    print("\nThe following EXISTING files would be modified:")
    if not seam_changes:
        print("  (none — no seam entries found)")
    for relpath, old_text, new_text in seam_changes:
        print(f"\n--- {relpath}")
        diff = difflib.unified_diff(
            old_text.splitlines(keepends=True),
            new_text.splitlines(keepends=True),
            lineterm="",
        )
        sys.stdout.writelines(diff)
    print()

    if not apply:
        print("Dry run only — no files were changed. Re-run with --yes to apply.")
        return 0

    written_paths: list[Path] = []
    for path, text in seam_writes:
        path.write_text(text)
        written_paths.append(path)
    run_formatters(written_paths)

    if component_dir.exists():
        shutil.rmtree(component_dir)

    print(f"Removed {component_dir.relative_to(REPO_ROOT)}/ and reverted {len(seam_writes)} seam file(s).")
    return 0


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    spec = build_spec(args)
    try:
        if args.remove:
            return do_remove(spec, apply=args.yes)
        return do_generate(spec, force=args.force, apply=args.yes)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
