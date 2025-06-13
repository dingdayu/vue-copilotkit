[English](./README.md) | [中文](./README.zh.md)

---
# Vue Copilotkit

*This project is forked from https://github.com/fe-51shebao/vue-copilotkit*

> A Vue implementation based on the React UI library of <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a>

Both `@dingdayu/vue-copilotkit-core` and `@dingdayu/vue-copilotkit-ui` have been published to the NPM registry and can be added to your project using:

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## Example

### Server

Install dependencies

```bash
pnpm add @copilotkit/runtime openai
```

Create `index.js` file.

```ts
import { createServer } from 'node:http';
import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "sk-xxx", // Or read the API key from environment variables process.env["OPENAI_API_KEY"]
    baseURL: "https://api.deepseek.com", // Optional: baseURL for relevant platforms, e.g., Bailian (阿里云百炼): https://dashscope.aliyuncs.com/compatible-mode/v1
});

// During testing, it was found that CopilotKit 1.8.14 uses this.openai.beta.chat.completions.stream
// This will cause an error in actual use, so an assignment is needed.
openai.beta = openai;

// Note the model setting here, e.g., for Qwen: qwen-max-latest
const serviceAdapter = new OpenAIAdapter({ openai, model: "deepseek-chat", keepSystemRole: true, });

const server = createServer((req, res) => {
    const runtime = new CopilotRuntime({
        // This is for remote Agent usage. If you need to implement it in other languages,
        // you can refer to the sdk-python in CopilotKit.
        // "remoteEndpoints": [
        //     {
        //         "url": "http://10.0.7.105:8005/copilotkit_remote",
        //     }
        // ]
    });
    const handler = copilotRuntimeNodeHttpEndpoint({
        endpoint: '/copilotkit',
        runtime,
        serviceAdapter,
    });

    return handler(req, res);
});

server.listen(4000, () => {
    console.log('Listening at http://localhost:4000/copilotkit');
});
```

Run `node index.js`.

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

2. Upgraded @copilotkit/shared and related packages to `1.8.14`
3. Fixed `Window` for build errors
4. Updated `vite.config.ts` to resolve `injection "Symbol()" not found` issue caused by vite inlining
5. Fixed `asStream` not found issue caused by incorrect `CopilotRuntimeClient` usage
6. Fixed `view.docView.domFromPos` related issues
7. Added repository information to `package.json`
