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
pnpm format
```

## Coding Guidelines

- Use concise TypeScript and Vue Composition API.
- Avoid classes and mutable global state.
- Reuse existing utilities/components instead of duplicating logic.
- Use PascalCase for component names and camelCase for functions/variables.

## Documentation

- Keep `README.md` and `README.zh.md` in sync for public-facing changes.
- Prefer documenting `@dingdayu/vue-copilotkit` as the primary path.

## Commit Style

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
- Keep commit messages concise and in English.

## Development & Release Workflow

This project uses **Changesets** to manage versions and changelogs.

### 1. For Contributors

You can focus on your code. If you want to help with the changelog, you can optionally run `pnpm changeset` and follow the prompts. If you don't, a maintainer will add a changeset before merging your PR.

### 2. Automated Release (for maintainers)

The release process is automated via GitHub Actions:

1. When changes are merged into `main`, a "Version Packages" PR is automatically created/updated if changesets exist.
2. If a contributor didn't provide a changeset, maintainers should add a relevant one (e.g., via `pnpm changeset`) before or during the merge process.
3. When the "Version Packages" PR is merged into `main`, the GitHub Action will automatically:
   - Build all packages using **Turborepo**.
   - Publish the new versions to npm using **pnpm**.
   - Create a GitHub Release with the changelog.

**Manual Release (emergency only):**

```bash
pnpm version:packages
pnpm publish:packages
```

## Before Opening a PR

Run at least:

```bash
pnpm typecheck
pnpm build
pnpm changeset
```

If docs changed, ensure both language READMEs are updated.
