[English](./README.md) | [中文](./README.zh.md)

| Package                         | NPM Version                                                                                                                                                                 |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@dingdayu/vue-copilotkit-core` | [![NPM version for @dingdayu/vue-copilotkit-core](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-core)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-core) |
| `@dingdayu/vue-copilotkit-ui`   | [![NPM version for @dingdayu/vue-copilotkit-ui](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-ui)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-ui)       |

---

# Vue Copilotkit

_This project is forked from https://github.com/fe-51shebao/vue-copilotkit_

> A Vue implementation based on the React UI library of <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a>

Both `@dingdayu/vue-copilotkit-core` and `@dingdayu/vue-copilotkit-ui` have been published to the NPM registry and can be added to your project using:

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## Example

### Server

Install dependencies

```bash
pnpm add @copilotkit/runtime @ai-sdk/openai-compatible
```

Create `index.js` file.

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

Run `node index.js`.

## CopilotKit v2 API Reference Notes

Official reference: https://docs.copilotkit.ai/reference/v2

This repo now follows the v2 single-route protocol shape used by the runtime endpoint:

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

Supported single-route `method` values in v2 runtime are:

- `agent/run`
- `agent/connect`
- `agent/stop`
- `info`
- `transcribe`

Important: the endpoint accepts JSON envelopes only (`Content-Type: application/json`), otherwise it returns `invalid_request`.

### Client

Install dependencies

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

```diff
// app.vue
<script lang="ts" setup>
import { computed } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

+import { CopilotKit } from '@dingdayu/vue-copilotkit-core';
import { App, ConfigProvider, theme } from 'ant-design-vue';

import { antdLocale } from '#/locales';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();
const { tokens } = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd compact mode algorithm
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: tokens,
  };
});
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
+    <CopilotKit
+      runtime-url="http://10.0.7.105:4000/copilotkit"
+      show-dev-console
+    >
      <App>
        <RouterView />
      </App>
+    </CopilotKit>
  </ConfigProvider>
</template>
```

Usage in a page. This example uses `CopilotPopup`, but `CopilotChat` or `CopilotSidebar` can also be considered.  
Documentation: https://docs.copilotkit.ai/reference/components/chat/CopilotChat

```diff
<script setup lang="ts">
import { Page } from '@vben/common-ui';

+import { CopilotPopup } from '@dingdayu/vue-copilotkit-ui';

// CSS can be imported globally if necessary
+import '@dingdayu/vue-copilotkit-ui/style.css';
</script>

<template>
  <div>
    <Page>
+      <CopilotPopup />
    </Page>
  </div>
</template>

```

**Popup Example:**

![Copilot Popup](./popup.png)

## Changes from Upstream

1. Renamed packages for NPM registry publication
   - `@copilotkit/vue-core` → `@dingdayu/vue-copilotkit-core`
   - `@copilotkit/vue-ui` → `@dingdayu/vue-copilotkit-ui`
   - `@copilotkit/vite-config` → `@dingdayu/vue-copilotkit-vite-config`
2. Upgraded CopilotKit runtime/client-related packages to `1.53.0` (v2 protocol-compatible)
3. Fixed `Window` for build errors
4. Updated `vite.config.ts` to resolve `injection "Symbol()" not found` issue caused by vite inlining
5. Migrated chat and textarea data paths to the v2 single-route protocol (`method: agent/run`)
6. Fixed `view.docView.domFromPos` related issues
7. Added repository information to `package.json`

## Publish

This repo is a pnpm monorepo. The packages are published from `packages/*`.

```bash
pnpm install
pnpm build
pnpm publish:packages
```

Notes:

- Make sure you are logged in: `npm login`
- Update package versions in `packages/*/package.json` before publishing
