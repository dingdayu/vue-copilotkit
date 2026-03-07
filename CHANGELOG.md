ChangeLog

### 20260307

- 合并 `@dingdayu/vue-copilotkit-core` `@dingdayu/vue-copilotkit-ui` 为 `@dingdayu/vue-copilotkit`


### 20260306

- 从上游更新代码
- Remove @dingdayu/vue-copilotkit-vite-config package and inline Vite config in each package
- Merge standalone vue-textarea package into @dingdayu/vue-copilotkit-ui
- Migration: import `CopilotTextarea` from `@dingdayu/vue-copilotkit-ui` and keep using `@dingdayu/vue-copilotkit-ui/style.css`
- Migration: run the demo with `pnpm -C examples dev:runtime` and `pnpm dev` in separate terminals
- Refresh root/examples/package README files to match the new package layout and example app flow
- 增加 publish packages to package.json

## Changes from Upstream

1. Renamed packages for NPM registry publication
   - `@copilotkit/vue-core` → `@dingdayu/vue-copilotkit-core`
   - `@copilotkit/vue-ui` → `@dingdayu/vue-copilotkit-ui`
2. Upgraded CopilotKit runtime/client-related packages to `1.53.0` (v2 protocol-compatible)
3. Fixed `Window` for build errors
4. Removed the former shared `vite-config` package and inlined the required Vite config per package to resolve `injection "Symbol()" not found`
5. Migrated chat and textarea data paths to the v2 single-route protocol (`method: agent/run`)
6. Fixed `view.docView.domFromPos` related issues
7. Added repository information to `package.json`
8. Merged the former standalone `vue-textarea` package into `@dingdayu/vue-copilotkit-ui` (single UI package import)
9. Reworked the example app with bilingual navigation, shared runtime configuration, and richer scenario pages