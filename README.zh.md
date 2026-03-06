[English](./README.md) | [中文](./README.zh.md)

| Package                         | NPM Version                                                                                                                                                                 |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@dingdayu/vue-copilotkit-core` | [![NPM version for @dingdayu/vue-copilotkit-core](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-core)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-core) |
| `@dingdayu/vue-copilotkit-ui`   | [![NPM version for @dingdayu/vue-copilotkit-ui](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-ui)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-ui)       |

---

# Vue Copilotkit

_此项目 fork 自 https://github.com/fe-51shebao/vue-copilotkit_

> 一个基于 <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a> React UI 库的 Vue 实现。

`@dingdayu/vue-copilotkit-core` 和 `@dingdayu/vue-copilotkit-ui` 均已发布到 NPM 仓库，你可以使用以下命令将其添加到你的项目中：

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## 示例

### 服务端

安装依赖

```bash
pnpm add @copilotkit/runtime @ai-sdk/openai-compatible
```

创建 `index.js` 文件。

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
  console.log('监听地址 http://localhost:4000/copilotkit')
})
```

运行 `node index.js`。

## CopilotKit v2 API Reference 速览

官方文档：https://docs.copilotkit.ai/reference/v2

本项目当前使用 v2 的 single-route 协议，运行时请求包格式如下：

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

v2 single-route 支持的 `method`：

- `agent/run`
- `agent/connect`
- `agent/stop`
- `info`
- `transcribe`

注意：该端点只接受 JSON envelope（`Content-Type: application/json`），否则会返回 `invalid_request`。

### 客户端

安装依赖

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

  // antd 紧凑模式算法
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

在页面中使用。此示例使用 `CopilotPopup`，但也可以考虑使用 `CopilotChat` 或 `CopilotSidebar`。  
文档：https://docs.copilotkit.ai/reference/components/chat/CopilotChat

```diff
<script setup lang="ts">
import { Page } from '@vben/common-ui';

+import { CopilotPopup } from '@dingdayu/vue-copilotkit-ui';

// 如果需要，可以全局导入 CSS
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

**Popup 效果:**

![Copilot Popup](./popup.png)

## 与上游版本的差异

1.  为 NPM 仓库发布重命名了包名
    - `@copilotkit/vue-core` → `@dingdayu/vue-copilotkit-core`
    - `@copilotkit/vue-ui` → `@dingdayu/vue-copilotkit-ui`
    - `@copilotkit/vite-config` → `@dingdayu/vue-copilotkit-vite-config`
2.  将 CopilotKit runtime/client 相关包升级到 `1.53.0`（兼容 v2 协议）
3.  修复了 `Window` 组件导致的构建错误
4.  更新了 `vite.config.ts` 以解决由 vite 内联导致的 `injection "Symbol()" not found` 问题
5.  将 chat 与 textarea 的请求链路迁移到 v2 single-route 协议（`method: agent/run`）
6.  修复了与 `view.docView.domFromPos` 相关的问题
7.  在 `package.json` 中添加了仓库信息

## 发布

这是一个 pnpm monorepo，包发布于 `packages/*`。

```bash
pnpm install
pnpm build
pnpm publish:packages
```

注意事项：

- 确保已登录：`npm login`
- 发布前请更新 `packages/*/package.json` 中的版本号
