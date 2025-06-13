# Guidelines for Contributors

This repository is a pnpm monorepo containing several packages under the `packages` folder and a demo project in `examples`.

## Local setup

- Use **pnpm** (`pnpm@9.5.0`) as the package manager.
- Install dependencies with `pnpm install`.
- Build all packages with `pnpm build` before committing to verify that the packages compile.

## Formatting

- Format all changed files using **Prettier**. The configuration is defined in `.prettierrc.cjs`.
- A typical command is `npx prettier --write .`.

## Documentation

- Keep both `README.md` and `README.zh.md` updated when making documentation changes.

## Commit style

- Follow the **Conventional Commits** style used in this repository (e.g. `feat:`, `fix:`, `chore:`).
