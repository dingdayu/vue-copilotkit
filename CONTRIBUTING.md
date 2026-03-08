# Contributing

Thanks for contributing to `vue-copilotkit`.

## Project Layout

- `packages/vue-copilotkit`: recommended unified package for new integrations
- `packages/vue-core`: deprecated compatibility package
- `packages/vue-ui`: deprecated compatibility package
- `examples/`: Vue 3 demo app and local runtime integration reference

## Local Development

```bash
pnpm install

# terminal 1: local runtime
pnpm -C examples dev:runtime

# terminal 2: demo app
pnpm dev
```

Useful checks:

```bash
pnpm typecheck
pnpm build
pnpm format:check
```

## Coding Guidelines

- Use concise TypeScript and Vue Composition API.
- Avoid classes and mutable global state.
- Reuse existing utilities/components instead of duplicating logic.
- Use PascalCase for component names and camelCase for functions/variables.

## Documentation

- Keep `README.md` and `README.zh.md` in sync for public-facing changes.
- Prefer documenting `@dingdayu/vue-copilotkit` as the primary path.
- Keep commands aligned with workspace scripts.

## Commit Style

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
- Keep commit messages concise and in English.
- If publishing-related changes are made, update package versions in `packages/*/package.json` as needed.

## Before Opening a PR

Run at least:

```bash
pnpm typecheck
pnpm build
```

If docs changed, ensure both language READMEs are updated.
