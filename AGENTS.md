# Guidelines for Contributors

This repository is a pnpm monorepo containing several packages under the `packages` folder and a demo project in `examples`.
Each package is written in TypeScript and built with Vite. The `examples` folder shows how to integrate the packages in a Vue 3 application.

## Local setup

- Use **pnpm** (`pnpm@9.5.0`) as the package manager.
- Install dependencies with `pnpm install`.
- Build all packages with `pnpm build` before committing to verify that the packages compile.
- Node.js 18+ is recommended. Other versions may lead to type or build errors.
- The example project under `examples/` can be started with `pnpm dev`.

## Coding conventions

- Write concise, functional TypeScript. Prefer the Composition API over Options API.
- Avoid classes and mutable global state.
- Reuse utilities and components instead of duplicating code.
- Keep file structures simple: the default export at the top, then helper functions and types.

## Formatting

- Format all changed files using **Prettier**. The configuration is defined in `.prettierrc.cjs`.
- A typical command is `npx prettier --write .`.
- Ensure source files are valid TypeScript and prefer the Composition API for Vue components.
- Use PascalCase for component names and camelCase for functions and variables.
- Folder names should use dash-case.

## Documentation

- Keep both `README.md` and `README.zh.md` updated when making documentation changes.
- Public packages should include a `README.md` describing usage and exported APIs.

## Commit style

- Follow the **Conventional Commits** style used in this repository (e.g. `feat:`, `fix:`, `chore:`).
- Commit messages should be in English and concise.
- When adding features or fixes, update the corresponding `packages/*/package.json` version if publishing is needed.
