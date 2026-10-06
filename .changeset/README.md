# Changesets

Every change to a published package (`@tassili/ui`, `@tassili/tokens`) needs a changeset:

```bash
pnpm changeset
```

Pick the bump type by the effect on consumers:

- **patch**: bug fix, no API change
- **minor**: new component, input or token, backwards compatible
- **major**: removed or renamed API, changed default, token renamed

Both packages are versioned together (`fixed` in `config.json`).
