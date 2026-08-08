// @ts-check
import js from '@eslint/js';
import angular from 'angular-eslint';
import importX from 'eslint-plugin-import-x';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.angular/**',
      'storybook-static/**',
      '.npm-cache/**',
      'out-tsc/**',
      '.storybook/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './projects/atom/tsconfig.lib.json',
          './projects/ux/tsconfig.lib.json',
          './projects/atom/tsconfig.spec.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importX,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'design-kit', style: 'kebab-case' },
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-cycle': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/button/*',
                '!**/button/public-api',
                '**/input/*',
                '!**/input/public-api',
                '**/css-variable/*',
                '!**/css-variable/public-api',
                '**/label/*',
                '!**/label/public-api',
                '**/date-picker/*',
                '!**/date-picker/public-api',
              ],
              message: 'Only import another entry point through its public-api.ts.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
  {
    files: ['**/*.stories.ts'],
    extends: [...storybook.configs['flat/recommended']],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  eslintConfigPrettier,
);
