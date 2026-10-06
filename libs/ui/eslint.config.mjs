import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/**/*.spec.ts',
            '{projectRoot}/**/*.stories.ts',
            '{projectRoot}/**/testing/**',
          ],
          // Consumed from styles.css / emitted code, not from TypeScript imports.
          // @angular/cdk and @angular/forms are required peers of @spartan-ng/brain.
          ignoredDependencies: [
            '@tassili/tokens',
            'tailwindcss',
            'tw-animate-css',
            'tslib',
            '@angular/cdk',
            '@angular/forms',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'tsl',
          style: 'camelCase',
        },
      ],
      // Components are elements (tsl-dialog) or attributes on native elements (button[tslDropdownMenuCheckbox])
      // so interactive parts keep native semantics.
      '@angular-eslint/component-selector': [
        'error',
        [
          { type: 'element', prefix: 'tsl', style: 'kebab-case' },
          { type: 'attribute', prefix: 'tsl', style: 'camelCase' },
        ],
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
