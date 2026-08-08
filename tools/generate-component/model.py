"""Data model for a generated @design-kit/atom component.

Every value the templates need is computed once, here, in plain Python —
the Jinja templates stay close to pure substitution/looping. This keeps the
"which CSS pattern does variant X get" and "is this name valid" decisions in
one reviewable, unit-testable place instead of scattered across .j2 logic.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

KEBAB_RE = re.compile(r"^[a-z][a-z0-9]*(-[a-z0-9]+)*$")
SUPPORTED_LEVELS = ("atom",)

# Two component "shapes" the generator knows how to produce:
#   interactive — Button-style: hover/active solid-fill variants, padding-based
#                 sizing, optional native-click output. Wrapper host elements only.
#   static      — Label-style: plain typography, text-color-only variants,
#                 font-size-only sizing, never emits an output. Text-bearing
#                 host elements only.
KIND_CHOICES = ("interactive", "static")
ELEMENTS_BY_KIND: dict[str, tuple[str, ...]] = {
    "interactive": ("div", "span", "button"),
    "static": ("span", "label", "p", "div"),
}

# Sizes recognized from the real Button component. Each maps to the same
# (padding-block, padding-inline, font-size) token pair Button already uses,
# so requesting a known size name never needs a design decision.
KNOWN_SIZE_TOKENS: dict[str, tuple[str, str, str]] = {
    "xs": ("space-1", "space-3", "font-size-xs"),
    "sm": ("space-2", "space-4", "font-size-sm"),
    "md": ("space-3", "space-5", "font-size-md"),
    "lg": ("space-4", "space-6", "font-size-lg"),
    "xl": ("space-5", "space-7", "font-size-xl"),
}

# Variant names recognized from the real Button component (7 of Button's own
# variants, verified against projects/ux/css-variable/color.css). Anything
# outside this set gets a TODO-marked neutral fallback instead of an invented
# color — see render_variant_css below.
_SOLID_VARIANTS: dict[str, dict[str, str]] = {
    "primary": {"family": "primary", "base": "500", "hover": "600", "active": "700"},
    "secondary": {"family": "neutral", "base": "700", "hover": "800", "active": "900"},
    "success": {"family": "success", "base": "600", "hover": "700", "active": "800"},
    "danger": {"family": "danger", "base": "500", "hover": "600", "active": "700"},
    "warning": {"family": "warning", "base": "500", "hover": "600", "active": "700"},
    "neutral": {"family": "neutral", "base": "500", "hover": "600", "active": "700"},
}
_STRUCTURAL_VARIANTS = frozenset({"outline", "ghost", "link"})
KNOWN_VARIANTS = frozenset(_SOLID_VARIANTS) | _STRUCTURAL_VARIANTS

# Font-size-only tokens for the "static" kind's sizes — no padding, since a
# plain caption isn't a hit target. Matches the real Label component.
KNOWN_STATIC_SIZE_TOKENS: dict[str, str] = {
    "xs": "font-size-xs",
    "sm": "font-size-sm",
    "md": "font-size-md",
    "lg": "font-size-lg",
    "xl": "font-size-xl",
}

# Text-color-only tokens for the "static" kind's variants — no background,
# hover, or active state, since a plain caption has no interaction. Matches
# the real Label component's default/error variants, extended with the
# same danger/success/warning-600 pattern used elsewhere in this file for
# AA contrast on text.
KNOWN_STATIC_VARIANTS: dict[str, str] = {
    "default": "color-text",
    "muted": "color-text-muted",
    "success": "color-success-600",
    "warning": "color-warning-600",
    "error": "color-danger-600",
}


def known_variants_for(kind: str) -> frozenset[str]:
    return frozenset(KNOWN_STATIC_VARIANTS) if kind == "static" else KNOWN_VARIANTS


def known_sizes_for(kind: str) -> frozenset[str]:
    return (
        frozenset(KNOWN_STATIC_SIZE_TOKENS) if kind == "static" else frozenset(KNOWN_SIZE_TOKENS)
    )


def to_pascal_case(kebab: str) -> str:
    return "".join(part.capitalize() for part in kebab.split("-"))


def to_camel_case(kebab: str) -> str:
    pascal = to_pascal_case(kebab)
    return pascal[:1].lower() + pascal[1:]


@dataclass(frozen=True)
class Flag:
    kebab: str
    camel: str
    pascal: str


def make_flag(kebab: str) -> Flag:
    return Flag(kebab=kebab, camel=to_camel_case(kebab), pascal=to_pascal_case(kebab))


@dataclass(frozen=True)
class Output:
    kebab: str
    camel: str
    pascal: str
    payload: str


def make_output(kebab: str, payload: str) -> Output:
    return Output(kebab=kebab, camel=to_camel_case(kebab), pascal=to_pascal_case(kebab), payload=payload)


@dataclass(frozen=True)
class ComponentSpec:
    name: str
    description: str
    level: str = "atom"
    kind: str = "interactive"
    element: str = "div"
    variants: tuple[str, ...] = field(default_factory=tuple)
    sizes: tuple[str, ...] = field(default_factory=tuple)
    flags: tuple[Flag, ...] = field(default_factory=tuple)
    output: Output | None = None
    icon_slot: bool = False
    for_attribute: bool = False
    required_indicator: bool = False

    # --- derived, single source of truth (mirrors docs/04-naming-conventions.md) ---

    @property
    def class_name(self) -> str:
        return to_pascal_case(self.name)

    @property
    def camel_name(self) -> str:
        return to_camel_case(self.name)

    @property
    def full_class(self) -> str:
        return f"DesignKit{self.level.capitalize()}{self.class_name}Component"

    @property
    def selector(self) -> str:
        return f"design-kit-{self.level}-{self.name}"

    @property
    def base_css_class(self) -> str:
        return f"design-kit-{self.level}-{self.name}"

    @property
    def import_path(self) -> str:
        return f"@design-kit/{self.level}/{self.name}"

    @property
    def default_variant(self) -> str | None:
        return self.variants[0] if self.variants else None

    @property
    def default_size(self) -> str | None:
        return self.sizes[0] if self.sizes else None

    def validate_name_and_level(self) -> None:
        """The minimal check needed for both generation and removal."""
        if not KEBAB_RE.match(self.name):
            raise ValueError(
                f'--name "{self.name}" is not valid kebab-case '
                '(expected e.g. "badge", "status-dot").'
            )
        if self.level not in SUPPORTED_LEVELS:
            raise ValueError(
                f'--level "{self.level}" is not supported yet; only {SUPPORTED_LEVELS} '
                "exist as component-shaped levels today (see docs/16-future-roadmap.md)."
            )

    def validate(self) -> None:
        """Full check, required before generating (not before removing)."""
        self.validate_name_and_level()
        if self.kind not in KIND_CHOICES:
            raise ValueError(f'--kind "{self.kind}" must be one of {KIND_CHOICES}.')
        allowed_elements = ELEMENTS_BY_KIND[self.kind]
        if self.element not in allowed_elements:
            raise ValueError(
                f'--element "{self.element}" must be one of {allowed_elements} '
                f'for --kind {self.kind}.'
            )
        if not self.description.strip():
            raise ValueError("--description must not be empty.")
        for collection, label in ((self.variants, "--variants"), (self.sizes, "--sizes")):
            for value in collection:
                if not KEBAB_RE.match(value):
                    raise ValueError(f'{label} entry "{value}" is not valid kebab-case.')
            if len(set(collection)) != len(collection):
                raise ValueError(f"{label} contains duplicate entries.")
        reserved_field_names = {"variant", "size", "disabled", "for", "required"}
        for f in self.flags:
            if not KEBAB_RE.match(f.kebab):
                raise ValueError(f'--flags entry "{f.kebab}" is not valid kebab-case.')
            if f.camel in reserved_field_names:
                raise ValueError(
                    f'--flags entry "{f.kebab}" collides with the built-in "{f.camel}" '
                    "input — choose a different name."
                )
        if len({f.camel for f in self.flags}) != len(self.flags):
            raise ValueError("--flags contains duplicate entries.")

        if self.kind == "static":
            if self.output is not None:
                raise ValueError(
                    "--output-name is not supported with --kind static — a plain-text "
                    "atom has no interaction to emit an event from."
                )
            if self.for_attribute and self.element != "label":
                raise ValueError("--for-attribute only makes sense with --element label.")
        else:
            if self.for_attribute:
                raise ValueError(
                    "--for-attribute is only supported with --kind static --element label."
                )
            if self.required_indicator:
                raise ValueError("--required-indicator is only supported with --kind static.")


def render_size_css(base_css_class: str, size: str, kind: str) -> str:
    if kind == "static":
        return _render_size_css_static(base_css_class, size)
    return _render_size_css_interactive(base_css_class, size)


def _render_size_css_static(base_css_class: str, size: str) -> str:
    token = KNOWN_STATIC_SIZE_TOKENS.get(size)
    if token is None:
        token = KNOWN_STATIC_SIZE_TOKENS["md"]
        comment = (
            f"  /* TODO(design): \"{size}\" is not a recognized size step; "
            "using md's font-size as a placeholder. */\n"
        )
    else:
        comment = ""
    return f"{comment}.{base_css_class}--{size} {{\n  font-size: var(--design-kit-{token});\n}}"


def _render_size_css_interactive(base_css_class: str, size: str) -> str:
    tokens = KNOWN_SIZE_TOKENS.get(size)
    if tokens is None:
        tokens = KNOWN_SIZE_TOKENS["md"]
        comment = (
            f"  /* TODO(design): \"{size}\" is not a recognized size step; "
            "using md's padding/font-size as a placeholder. */\n"
        )
    else:
        comment = ""
    padding_block, padding_inline, font_size = tokens
    return (
        f"{comment}.{base_css_class}--{size} {{\n"
        f"  padding: var(--design-kit-{padding_block}) var(--design-kit-{padding_inline});\n"
        f"  font-size: var(--design-kit-{font_size});\n"
        f"}}"
    )


def render_variant_css(base_css_class: str, variant: str, kind: str) -> str:
    if kind == "static":
        return _render_variant_css_static(base_css_class, variant)
    return _render_variant_css_interactive(base_css_class, variant)


def _render_variant_css_static(base_css_class: str, variant: str) -> str:
    selector = f"{base_css_class}--{variant}"
    token = KNOWN_STATIC_VARIANTS.get(variant)
    if token is None:
        return (
            f"/* TODO(design): choose a text-color token for the \"{variant}\" variant. */\n"
            f".{selector} {{\n"
            "  color: var(--design-kit-color-text);\n"
            "}"
        )
    return f".{selector} {{\n  color: var(--design-kit-{token});\n}}"


def _render_variant_css_interactive(base_css_class: str, variant: str) -> str:
    selector = f"{base_css_class}--{variant}"
    if variant in _SOLID_VARIANTS:
        v = _SOLID_VARIANTS[variant]
        comment = ""
        if variant == "success":
            comment = (
                "/* success-500 only reaches a 3.3:1 contrast ratio against white text,\n"
                "   short of WCAG AA's 4.5:1 minimum for normal text; success-600 is the\n"
                "   lightest step in the scale that clears it. */\n"
            )
        return (
            f"{comment}.{selector} {{\n"
            f"  background-color: var(--design-kit-color-{v['family']}-{v['base']});\n"
            "  color: var(--design-kit-color-text-inverse);\n"
            "}\n\n"
            f".{selector}:not(:disabled):hover {{\n"
            f"  background-color: var(--design-kit-color-{v['family']}-{v['hover']});\n"
            "}\n\n"
            f".{selector}:not(:disabled):active {{\n"
            f"  background-color: var(--design-kit-color-{v['family']}-{v['active']});\n"
            "}"
        )
    if variant == "outline":
        return (
            f".{selector} {{\n"
            "  background-color: transparent;\n"
            "  border-color: var(--design-kit-color-primary-500);\n"
            "  color: var(--design-kit-color-primary-500);\n"
            "}\n\n"
            f".{selector}:not(:disabled):hover {{\n"
            "  background-color: var(--design-kit-color-primary-50);\n"
            "}\n\n"
            f".{selector}:not(:disabled):active {{\n"
            "  background-color: var(--design-kit-color-primary-100);\n"
            "}"
        )
    if variant == "ghost":
        return (
            f".{selector} {{\n"
            "  background-color: transparent;\n"
            "  color: var(--design-kit-color-text);\n"
            "}\n\n"
            f".{selector}:not(:disabled):hover {{\n"
            "  background-color: var(--design-kit-color-surface-muted);\n"
            "}\n\n"
            f".{selector}:not(:disabled):active {{\n"
            "  background-color: var(--design-kit-color-neutral-200);\n"
            "}"
        )
    if variant == "link":
        return (
            f".{selector} {{\n"
            "  background-color: transparent;\n"
            "  color: var(--design-kit-color-primary-500);\n"
            "  text-decoration: none;\n"
            "}\n\n"
            f".{selector}:not(:disabled):hover {{\n"
            "  text-decoration: underline;\n"
            "}\n\n"
            f".{selector}:not(:disabled):active {{\n"
            "  color: var(--design-kit-color-primary-700);\n"
            "}"
        )
    # Unknown variant name: never invent a color: emit a safe neutral
    # fallback with a TODO so the CSS still lints clean (no raw literals).
    return (
        f"/* TODO(design): choose tokens for the \"{variant}\" variant. */\n"
        f".{selector} {{\n"
        "  background-color: var(--design-kit-color-neutral-500);\n"
        "  color: var(--design-kit-color-text-inverse);\n"
        "}\n\n"
        f".{selector}:not(:disabled):hover {{\n"
        "  background-color: var(--design-kit-color-neutral-600);\n"
        "}\n\n"
        f".{selector}:not(:disabled):active {{\n"
        "  background-color: var(--design-kit-color-neutral-700);\n"
        "}"
    )
