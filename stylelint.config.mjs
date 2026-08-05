/** @type {import('stylelint').Config} */
const hexPattern = '/#[0-9a-fA-F]{3,8}\\b/';
const colorFnPattern = '/\\b(rgb|rgba|hsl|hsla)\\(/';
const lengthPattern = '/\\b\\d+(\\.\\d+)?(px|rem|em|vh|vw|pt|ch|ex)\\b/';
const easePattern = '/\\b(ease-in-out|ease-in|ease-out|linear|cubic-bezier)\\(?\\b/';

export default {
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      // Every color/spacing/radius/typography/shadow/motion value in a
      // component stylesheet must be a var(--design-kit-*) reference — see
      // docs/08-styling-design-tokens.md. Border/outline *width* (e.g.
      // `1px`) isn't a spec'd token category, so those properties are only
      // checked for raw colors, not raw lengths.
      files: ['projects/*/*/*.component.css'],
      rules: {
        'declaration-property-value-disallowed-list': {
          '/^(background|background-color|color|padding|padding-.*|margin|margin-.*|border-radius|box-shadow|transition|transition-.*|outline-color|fill|stroke)$/':
            [hexPattern, colorFnPattern, lengthPattern, easePattern],
          '/^(border|border-color|border-top-color|border-right-color|border-bottom-color|border-left-color|outline)$/':
            [hexPattern, colorFnPattern],
        },
      },
    },
  ],
  rules: {
    'custom-property-pattern': '^design-kit-.+$',
    'selector-class-pattern': '^design-kit-[a-z0-9-]+$',
  },
};
