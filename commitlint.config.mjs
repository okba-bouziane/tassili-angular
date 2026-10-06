/**
 * Conventional commits. Scopes are free-form but lowercase, e.g.
 * feat(ui/button): …, fix(tokens): …, chore(ci): …
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'body-max-line-length': [1, 'always', 100],
  },
};
