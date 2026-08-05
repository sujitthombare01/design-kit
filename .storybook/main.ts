import { angular } from '@analogjs/vite-plugin-angular';
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.mdx', '../projects/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(viteConfig) {
    return {
      ...viteConfig,
      // @storybook/builder-vite only strips TypeScript syntax for Angular files;
      // it doesn't run the real Angular compiler (ngtsc), so signal-based
      // input()/output()/model() metadata never reaches Ivy's JIT compiler and
      // templateUrl/styleUrl are never inlined. This plugin runs the actual
      // Angular compiler-cli pipeline, same as `@angular/build` does.
      plugins: [
        ...angular({
          tsconfig: 'tsconfig.base.json',
          jit: true,
          // Scope Angular compilation to our library source only, so Vite's own
          // esbuild-based TS stripping still handles .storybook/*.ts (and any
          // other plain, non-Angular TypeScript) exactly as it did before.
          transformFilter: (_code, id) => id.includes('/projects/'),
        }),
        ...(viteConfig.plugins ?? []),
      ],
      define: {
        ...viteConfig.define,
        // The webpack builder's preset defines this via DefinePlugin; the Vite
        // builder never does, leaving a bare, unresolved identifier reference
        // in @storybook/angular's renderer that throws at runtime otherwise.
        STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: false }),
      },
    };
  },
};

export default config;
