import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  comments.recommended,
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/storybook-static',
      '**/.angular',
      '**/vite.config.*.timestamp*',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // Every eslint-disable must explain why (project rule: no silent rule disabling).
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:ui', 'type:tokens'] },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:ui', 'type:tokens'] },
            { sourceTag: 'type:tokens', onlyDependOnLibsWithTags: [] },
            { sourceTag: 'type:e2e', onlyDependOnLibsWithTags: ['type:app'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/*.stories.ts', '**/vitest.config.*', '**/playwright.config.*'],
    plugins: { '@angular-eslint': angular.tsPlugin },
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/consistent-component-styles': 'error',
      // `class` is aliased on purpose: components accept consumer classes and merge them with cn().
      '@angular-eslint/no-input-rename': ['error', { allowedNames: ['class'] }],
    },
  },
  ...angular.configs.templateAccessibility.map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
];
