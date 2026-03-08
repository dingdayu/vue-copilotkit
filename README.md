[English](./README.md) | [中文](./README.zh.md)

| Package                         | Status        | NPM Version                                                                                                                                                                 |
| :------------------------------ | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@dingdayu/vue-copilotkit`      | 🟢 Active     | [![NPM version for @dingdayu/vue-copilotkit](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit)                |
| `@dingdayu/vue-copilotkit-core` | 🔴 Deprecated | [![NPM version for @dingdayu/vue-copilotkit-core](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-core)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-core) |
| `@dingdayu/vue-copilotkit-ui`   | 🔴 Deprecated | [![NPM version for @dingdayu/vue-copilotkit-ui](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-ui)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-ui)       |

---

# Vue CopilotKit

Vue CopilotKit is a Vue 3 implementation inspired by the React UI layer of [CopilotKit](https://github.com/CopilotKit/CopilotKit). This repository ships a unified package for new projects and keeps the older split packages available for compatibility.

> Recommended for new projects: `@dingdayu/vue-copilotkit`

## Why use this repository?

- Unified package with provider, composables, chat UI, popup/sidebar UI, and `CopilotTextarea`
- Vue 3 + Vite demo app with bilingual routes and practical scenarios
- CopilotKit v2 single-route runtime compatibility
- pnpm monorepo with package-level builds and demo runtime examples

## Install

```bash
pnpm add @dingdayu/vue-copilotkit
```

If you still need the legacy split packages, they remain available but are deprecated:

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## Quick Start

### Run the local demo

```bash
pnpm install

# terminal 1: start the local runtime
pnpm -C examples dev:runtime

# terminal 2: start the Vue demo app
pnpm dev
```

Useful workspace commands:

- `pnpm dev` — starts the Vite demo app from the workspace root
- `pnpm -C examples dev:runtime` — starts the local CopilotKit runtime used by the demo
- `pnpm typecheck` — runs the root TypeScript check
- `pnpm build` — builds all workspace packages with Turbo

Default local runtime endpoint: `http://localhost:4000/copilotkit`

## Repository Structure

| Path                         | Purpose                                                               |
| :--------------------------- | :-------------------------------------------------------------------- |
| `packages/vue-copilotkit`    | Recommended unified package: provider, composables, chat UI, textarea |
| `packages/vue-core`          | Deprecated core-only package for runtime integration and composables  |
| `packages/vue-ui`            | Deprecated UI-only package for chat, popup/sidebar, and textarea      |
| `examples`                   | Vue 3 + Vite demo app with bilingual navigation and scenario pages    |
| `README.md` / `README.zh.md` | Public project documentation in English and Chinese                   |

## Package Guide

- `@dingdayu/vue-copilotkit` — recommended entry point for provider, composables, chat UI, popup, sidebar, and `CopilotTextarea`
- `@dingdayu/vue-copilotkit-core` — legacy low-level provider and runtime hooks package
- `@dingdayu/vue-copilotkit-ui` — legacy prebuilt UI package

See also:

- [`packages/vue-copilotkit/README.md`](./packages/vue-copilotkit/README.md)
- [`packages/vue-core/README.md`](./packages/vue-core/README.md)
- [`packages/vue-ui/README.md`](./packages/vue-ui/README.md)
- [`examples/README.md`](./examples/README.md)

## Example Integration

### 1. Server runtime

Install the runtime dependencies:

```bash
pnpm add @copilotkit/runtime @ai-sdk/openai-compatible
```

Create an `index.mjs` file (or enable ESM with `"type": "module"` in `package.json`):

```ts
import { createServer } from 'node:http'
import { CopilotRuntime, copilotRuntimeNodeHttpEndpoint } from '@copilotkit/runtime'
import { BuiltInAgent } from '@copilotkit/runtime/v2'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const provider = createOpenAICompatible({
  name: 'openai-compatible',
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
})

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model: provider.chatModel(process.env.OPENAI_MODEL || 'deepseek-chat'),
      forwardSystemMessages: true
    })
  }
})

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint: '/copilotkit',
  runtime
})

const server = createServer((req, res) => handler(req, res))
server.listen(4000, () => {
  console.log('Listening at http://localhost:4000/copilotkit')
})
```

Run the server with:

```bash
node index.mjs
```

### 2. Client integration

Install the unified package:

```bash
pnpm add @dingdayu/vue-copilotkit
```

Wrap your app with `CopilotKit` and point it to your runtime endpoint:

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { App, ConfigProvider, theme } from 'ant-design-vue'
import { CopilotKit } from '@dingdayu/vue-copilotkit'

const tokenTheme = computed(() => ({
  algorithm: [theme.defaultAlgorithm]
}))
</script>

<template>
  <ConfigProvider :theme="tokenTheme">
    <CopilotKit runtime-url="http://localhost:4000/copilotkit" show-dev-console>
      <App>
        <RouterView />
      </App>
    </CopilotKit>
  </ConfigProvider>
</template>
```

Render a ready-made UI component where needed:

```vue
<script setup lang="ts">
import { CopilotPopup } from '@dingdayu/vue-copilotkit'
</script>

<template>
  <CopilotPopup />
</template>
```

If you import from the package root, styles are already included. If you only use subpath imports, add:

```ts
import '@dingdayu/vue-copilotkit/style.css'
```

**Popup example:**

![Copilot Popup](./popup.png)

## CopilotKit v2 Protocol Notes

Official reference: https://docs.copilotkit.ai/reference/v2

This repository follows the v2 single-route request envelope used by the runtime endpoint:

```json
{
  "method": "agent/run",
  "params": { "agentId": "default" },
  "body": {
    "threadId": "...",
    "runId": "...",
    "messages": [],
    "tools": [],
    "context": [],
    "state": {},
    "forwardedProps": {}
  }
}
```

Supported single-route `method` values:

- `agent/run`
- `agent/connect`
- `agent/stop`
- `info`
- `transcribe`

The endpoint accepts JSON envelopes only (`Content-Type: application/json`). Non-JSON requests return `invalid_request`.

## Example App Notes

The demo app in `examples/` includes:

- bilingual UI (`en` / `zh`)
- runtime URL and API key configuration in the top toolbar
- scenario routes such as todo, form, textarea, table, spreadsheet, presentation, and SDK demos

For route-level details, see [`examples/README.md`](./examples/README.md).

## Changes from Upstream

_This project is forked from https://github.com/fe-51shebao/vue-copilotkit_

1. Renamed packages for npm publication
   - `@copilotkit/vue-core` → `@dingdayu/vue-copilotkit-core`
   - `@copilotkit/vue-ui` → `@dingdayu/vue-copilotkit-ui`
2. Added the unified `@dingdayu/vue-copilotkit` package for the recommended integration path
3. Upgraded CopilotKit runtime/client-related packages to `1.53.0` for v2 protocol compatibility
4. Fixed `Window`-related build issues
5. Removed the former shared `vite-config` package and inlined the required Vite config into each package
6. Migrated chat and textarea data flows to the v2 single-route protocol (`method: agent/run`)
7. Fixed `view.docView.domFromPos`-related issues
8. Added repository metadata to package manifests
9. Reworked the example app with bilingual navigation, shared runtime configuration, and richer scenario pages

## Migration Notes

- Prefer `@dingdayu/vue-copilotkit` for all new integrations
- If you previously used a standalone textarea package, import `CopilotTextarea` from `@dingdayu/vue-copilotkit` or `@dingdayu/vue-copilotkit-ui`
- Shared chat and textarea styles remain available at `@dingdayu/vue-copilotkit/style.css`
- If you depended on the removed shared Vite config package, copy the needed build settings into your own package config

## Publishing

This repository is a pnpm monorepo and publishes packages from `packages/*`.

```bash
pnpm install
pnpm build
pnpm publish:packages
```

Before publishing:

- log in with `npm login`
- update versions in the relevant `packages/*/package.json` files
- verify the workspace builds cleanly
