# Changelog

All notable changes to this repository are documented in this file.

## 2026-03-07

### Changed

- Promoted `@dingdayu/vue-copilotkit` as the unified package for new integrations.
- Aligned root documentation (`README.md`, `README.zh.md`, `AGENTS.md`) with the current package and demo workflow.

### Maintained Upstream Differences

1. Renamed packages for npm publication.
   - `@copilotkit/vue-core` -> `@dingdayu/vue-copilotkit-core`
   - `@copilotkit/vue-ui` -> `@dingdayu/vue-copilotkit-ui`
2. Upgraded CopilotKit runtime/client-related packages to `1.53.0` (v2 protocol compatible).
3. Fixed `Window`-related build errors.
4. Removed the former shared `vite-config` package and inlined required Vite config per package.
5. Migrated chat and textarea data flows to the v2 single-route protocol (`method: agent/run`).
6. Fixed `view.docView.domFromPos`-related issues.
7. Added repository metadata to package manifests.
8. Merged the former standalone `vue-textarea` package into `@dingdayu/vue-copilotkit-ui`.
9. Reworked the example app with bilingual navigation, shared runtime configuration, and richer scenario pages.

## 2026-03-06

### Changed

- Synced fork with upstream updates.
- Removed `@dingdayu/vue-copilotkit-vite-config` and inlined Vite config into each package.
- Merged standalone `vue-textarea` into `@dingdayu/vue-copilotkit-ui`.
- Updated migration notes for `CopilotTextarea` and runtime startup commands.
- Refreshed root, examples, and package-level README files.
- Added `publish:packages` script in root `package.json`.
