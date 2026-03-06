# Agent.md

This document defines how coding agents should work in this repository.

## 1) Repository Snapshot

- Type: `pnpm` monorepo
- Package manager: `pnpm@9.5.0`
- Runtime baseline: Node.js 18+
- Workspace layout:
  - `packages/vue-core` -> `@dingdayu/vue-copilotkit-core`
  - `packages/vue-ui` -> `@dingdayu/vue-copilotkit-ui`
  - `packages/vue-textarea` -> `@dingdayu/vue-textarea`
  - `packages/vite-config` -> shared Vite config package
  - `examples` -> Vue 3 + TypeScript + Vite demo

## 2) Goals for Agent Work

- Preserve existing API behavior and package export structure.
- Follow current TypeScript/Vue conventions used in `packages/*/src`.
- Keep changes minimal, targeted, and easy to review.
- Ensure modified code builds with monorepo scripts.

## 3) Required Workflow

1. Install deps (if not installed):

```bash
pnpm install
```

2. Implement the smallest correct change.
3. Format changed files:

```bash
pnpm format
```

4. Run type checks:

```bash
pnpm typecheck
```

5. Build all packages:

```bash
pnpm build
```

6. If the change affects the demo app, verify locally:

```bash
pnpm dev
```

## 4) Coding Conventions

- Use functional TypeScript and Vue 3 Composition API.
- Avoid classes and mutable global state.
- Prefer extending existing hooks/components over duplicate logic.
- Naming:
  - Components: PascalCase
  - Variables/functions: camelCase
  - Folders: dash-case
- Keep module entrypoints simple (`src/index.ts` re-export pattern).
- Keep imports/exports consistent with surrounding file style.

## 5) Style and Formatting

- Prettier is the source of truth (`.prettierrc.cjs`).
- Run formatter after edits; do not hand-format against Prettier.
- Do not add comments unless a block is genuinely non-obvious.

## 6) Package-Specific Notes

- `vue-core` and `vue-ui` are the public integration surface.
- `vue-ui` and `vue-textarea` both ship `./style.css` export targets; do not break style entry output.
- `vite-config` is consumed by other packages; changes here can affect every package build.
- Keep dependency versions compatible with existing CopilotKit stack (`@copilotkit/*` around `1.8.14` in this repo).

## 7) Documentation Rules

- When documentation is changed, update both:
  - `README.md`
  - `README.zh.md`
- Public package changes should include package-level README updates when API or usage changes.

## 8) Release and Versioning

- Publishing command:

```bash
pnpm publish:packages
```

- Before publish:
  - ensure `pnpm build` passes,
  - ensure `npm login` is valid,
  - update target package versions in `packages/*/package.json` if needed.

## 9) Git and Commit Expectations

- Use Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- Keep commit messages concise and in English.
- Do not mix unrelated refactors into feature/bugfix commits.

## 10) Agent Guardrails

- Do not introduce breaking API changes unless explicitly requested.
- Do not modify lockfiles or dependency versions unless required by the task.
- Do not rename packages or exports without updating all affected references.
- Prefer small, reviewable diffs with clear intent.

## 11) Quick Command Reference

```bash
pnpm install
pnpm dev
pnpm format
pnpm format:check
pnpm typecheck
pnpm build
pnpm publish:packages
```

If there is any conflict between this file and project source-of-truth config/scripts, follow actual repository config and scripts first.
