"""Deterministic, idempotent edits to the 6 files that wire a new component
into the workspace but aren't auto-discovered by any existing glob:

  1. tsconfig.base.json                     -> compilerOptions.paths
  2. projects/<level>/tsconfig.lib.json      -> include
  3. projects/<level>/tsconfig.spec.json     -> include
  4. angular.json                            -> projects.<level>.architect.test.options.include
  5. eslint.config.mjs                       -> no-restricted-imports group
  6. projects/<level>/README.md              -> Entry points table

Every `add_*` / `remove_*` function is pure: (text, spec) -> (new_text, changed).
`changed=False` means "already applied" / "nothing to remove" — callers rely
on this for idempotency, never duplicating or double-removing an entry.

JSON edits deliberately don't try to hand-match Prettier's exact formatting;
`generate.py` runs `npx prettier --write` on every touched file afterward, so
these functions only need to produce *valid* output.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from model import ComponentSpec

EditFn = Callable[[str, ComponentSpec], tuple[str, bool]]


@dataclass(frozen=True)
class SeamFile:
    relpath: str
    add: EditFn
    remove: EditFn


def _get_in(data: dict, pointer: list[str]) -> dict:
    node = data
    for key in pointer:
        node = node[key]
    return node


# Angular CLI-generated tsconfig*.json files carry a leading block-comment
# header (e.g. tsconfig.lib.json / tsconfig.spec.json) that the stdlib `json`
# module can't parse. No comments appear anywhere else in these files, so it
# is enough to peel off any leading `//...` / `/*...*/` comment lines, parse
# the remainder as strict JSON, and glue the same header back on when writing.
_LEADING_COMMENT_RE = re.compile(r"^(?:[ \t]*(?://[^\n]*\n|/\*.*?\*/[ \t]*\n))*", re.DOTALL)


def _split_leading_comments(text: str) -> tuple[str, str]:
    match = _LEADING_COMMENT_RE.match(text)
    prefix = match.group(0) if match else ""
    return prefix, text[len(prefix) :]


def _loads_jsonc(text: str) -> tuple[str, dict]:
    prefix, body = _split_leading_comments(text)
    return prefix, json.loads(body)


def _dumps_jsonc(prefix: str, data: dict) -> str:
    return prefix + json.dumps(data, indent=2) + "\n"


def _json_add_dict_key(pointer: list[str], key_fn, value_fn) -> EditFn:
    def add(text: str, spec: ComponentSpec) -> tuple[str, bool]:
        prefix, data = _loads_jsonc(text)
        node = _get_in(data, pointer)
        key = key_fn(spec)
        if key in node:
            return text, False
        node[key] = value_fn(spec)
        return _dumps_jsonc(prefix, data), True

    return add


def _json_remove_dict_key(pointer: list[str], key_fn) -> EditFn:
    def remove(text: str, spec: ComponentSpec) -> tuple[str, bool]:
        prefix, data = _loads_jsonc(text)
        node = _get_in(data, pointer)
        key = key_fn(spec)
        if key not in node:
            return text, False
        del node[key]
        return _dumps_jsonc(prefix, data), True

    return remove


def _json_add_to_array(pointer: list[str], value_fn) -> EditFn:
    def add(text: str, spec: ComponentSpec) -> tuple[str, bool]:
        prefix, data = _loads_jsonc(text)
        node = _get_in(data, pointer[:-1])
        arr = node[pointer[-1]]
        value = value_fn(spec)
        if value in arr:
            return text, False
        arr.append(value)
        return _dumps_jsonc(prefix, data), True

    return add


def _json_remove_from_array(pointer: list[str], value_fn) -> EditFn:
    def remove(text: str, spec: ComponentSpec) -> tuple[str, bool]:
        prefix, data = _loads_jsonc(text)
        node = _get_in(data, pointer[:-1])
        arr = node[pointer[-1]]
        value = value_fn(spec)
        if value not in arr:
            return text, False
        arr.remove(value)
        return _dumps_jsonc(prefix, data), True

    return remove


# --- 5. eslint.config.mjs -----------------------------------------------
# Anchored on the (single, in this file) `group: [ ... ]` array inside the
# no-restricted-imports rule. Insertion reuses the indentation of the
# closing bracket + 2 spaces, matching every existing entry's indentation.

_GROUP_RE = re.compile(r"(group:\s*\[\n)([\s\S]*?)(\n(?P<indent>[ \t]*)\])")


def _add_eslint_group_entries(text: str, spec: ComponentSpec) -> tuple[str, bool]:
    marker = f"'**/{spec.name}/*'"
    if marker in text:
        return text, False
    match = _GROUP_RE.search(text)
    if not match:
        raise RuntimeError(
            "Could not locate the no-restricted-imports 'group' array in eslint.config.mjs."
        )
    prefix, body, suffix = match.group(1), match.group(2), match.group(3)
    entry_indent = match.group("indent") + "  "
    new_body = (
        f"{body}\n{entry_indent}'**/{spec.name}/*',\n{entry_indent}'!**/{spec.name}/public-api',"
    )
    new_text = text[: match.start()] + prefix + new_body + suffix + text[match.end() :]
    return new_text, True


def _remove_eslint_group_entries(text: str, spec: ComponentSpec) -> tuple[str, bool]:
    pattern = re.compile(
        rf"\n[ \t]*'\*\*/{re.escape(spec.name)}/\*',\n[ \t]*'!\*\*/{re.escape(spec.name)}/public-api',"
    )
    new_text, count = pattern.subn("", text)
    return new_text, count > 0


# --- 6. projects/<level>/README.md ---------------------------------------
# Anchored on the "Entry points" table header row. Matched structurally (by
# the first cell's text), not by exact string — Prettier pads a markdown
# table's columns to align them, and that padding changes every time a row
# with a different-width cell is added, so an exact-string match breaks
# after the very first edit.


def _is_entry_table_header(line: str) -> bool:
    cells = line.split("|")
    return len(cells) > 1 and cells[1].strip() == "Entry point"


def _add_readme_row(text: str, spec: ComponentSpec) -> tuple[str, bool]:
    marker = spec.import_path
    if marker in text:
        return text, False
    lines = text.splitlines()
    header_idx = next((i for i, line in enumerate(lines) if _is_entry_table_header(line)), None)
    if header_idx is None:
        raise RuntimeError(
            f"Could not find the Entry points table header in {spec.level} README.md."
        )
    insert_idx = header_idx + 2  # skip header + separator row
    while insert_idx < len(lines) and lines[insert_idx].startswith("|"):
        insert_idx += 1
    new_row = (
        f"| {spec.class_name} | [`{spec.import_path}`]({spec.name}/README.md) | "
        f"{spec.description} |"
    )
    lines.insert(insert_idx, new_row)
    return "\n".join(lines) + "\n", True


def _remove_readme_row(text: str, spec: ComponentSpec) -> tuple[str, bool]:
    marker = spec.import_path
    lines = text.splitlines()
    new_lines = [line for line in lines if marker not in line]
    if len(new_lines) == len(lines):
        return text, False
    return "\n".join(new_lines) + "\n", True


def seams_for(spec: ComponentSpec) -> list[SeamFile]:
    level = spec.level
    return [
        SeamFile(
            relpath="tsconfig.base.json",
            add=_json_add_dict_key(
                pointer=["compilerOptions", "paths"],
                key_fn=lambda s: s.import_path,
                value_fn=lambda s: [f"./projects/{s.level}/{s.name}/public-api.ts"],
            ),
            remove=_json_remove_dict_key(
                pointer=["compilerOptions", "paths"],
                key_fn=lambda s: s.import_path,
            ),
        ),
        SeamFile(
            relpath=f"projects/{level}/tsconfig.lib.json",
            add=_json_add_to_array(
                pointer=["include"],
                value_fn=lambda s: f"{s.name}/**/*.ts",
            ),
            remove=_json_remove_from_array(
                pointer=["include"],
                value_fn=lambda s: f"{s.name}/**/*.ts",
            ),
        ),
        SeamFile(
            relpath=f"projects/{level}/tsconfig.spec.json",
            add=_json_add_to_array(
                pointer=["include"],
                value_fn=lambda s: f"{s.name}/**/*.spec.ts",
            ),
            remove=_json_remove_from_array(
                pointer=["include"],
                value_fn=lambda s: f"{s.name}/**/*.spec.ts",
            ),
        ),
        SeamFile(
            relpath="angular.json",
            add=_json_add_to_array(
                pointer=["projects", level, "architect", "test", "options", "include"],
                value_fn=lambda s: f"../{s.name}/**/*.spec.ts",
            ),
            remove=_json_remove_from_array(
                pointer=["projects", level, "architect", "test", "options", "include"],
                value_fn=lambda s: f"../{s.name}/**/*.spec.ts",
            ),
        ),
        SeamFile(
            relpath="eslint.config.mjs",
            add=_add_eslint_group_entries,
            remove=_remove_eslint_group_entries,
        ),
        SeamFile(
            relpath=f"projects/{level}/README.md",
            add=_add_readme_row,
            remove=_remove_readme_row,
        ),
    ]
