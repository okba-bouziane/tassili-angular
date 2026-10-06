import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  test: {
    name: 'tokens',
    environment: 'node',
    include: ['test/**/*.spec.ts'],
  },
});
