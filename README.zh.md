[English](./README.md) | [中文](./README.zh.md)

| Package                         | 状态    | NPM Version                                                                                                                                                                 |
| :------------------------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@dingdayu/vue-copilotkit`      | 🟢 活跃 | [![NPM version for @dingdayu/vue-copilotkit](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit)                |
| `@dingdayu/vue-copilotkit-core` | 🔴 弃用 | [![NPM version for @dingdayu/vue-copilotkit-core](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-core)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-core) |
| `@dingdayu/vue-copilotkit-ui`   | 🔴 弃用 | [![NPM version for @dingdayu/vue-copilotkit-ui](https://img.shields.io/npm/v/@dingdayu/vue-copilotkit-ui)](https://www.npmjs.com/package/@dingdayu/vue-copilotkit-ui)       |

---

# Vue Copilotkit

_此项目 fork 自 https://github.com/fe-51shebao/vue-copilotkit_

> 一个基于 <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a> React UI 库的 Vue 实现。

推荐新项目优先使用统一包 `@dingdayu/vue-copilotkit`：

```bash
pnpm add @dingdayu/vue-copilotkit
```

如果你希望分包使用，也可以继续安装 `@dingdayu/vue-copilotkit-core` 和 `@dingdayu/vue-copilotkit-ui`：

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## 快速开始

```bash
pnpm install
pnpm dev
pnpm build
```

- `pnpm dev`：从仓库根目录启动 Vue 示例应用
- `pnpm -C examples dev:runtime`：启动示例应用默认使用的本地 CopilotKit runtime
- `pnpm typecheck`：检查整个 TypeScript workspace

## 仓库结构

| 路径                         | 说明                                            |
| :--------------------------- | :---------------------------------------------- |
| `packages/vue-core`          | Provider、上下文与面向 runtime 的核心 hooks     |
| `packages/vue-ui`            | Chat UI、Popup/Sidebar 组件，以及 textarea 导出 |
| `examples`                   | Vue 3 + Vite 示例应用，覆盖多个典型场景         |
| `README.md` / `README.zh.md` | 项目对外文档（中英文）                          |

### 包说明

- `@dingdayu/vue-copilotkit-core`：提供 `CopilotKit`、action/readable 等底层能力。
- `@dingdayu/vue-copilotkit-ui`：提供 `CopilotPopup`、`CopilotSidebar`、`CopilotChat`、`CopilotTextarea` 等现成 UI。
- 原独立的 `@dingdayu/vue-textarea` 已并入 `@dingdayu/vue-copilotkit-ui`。
- 之前的共享 `vite-config` 包已移除，改为各个包自行维护本地 Vite 构建配置。

## 示例

### 服务端

安装依赖

```bash
pnpm add @copilotkit/runtime @ai-sdk/openai-compatible
```

创建 `index.mjs` 文件（或在 `package.json` 中声明 `"type": "module"`）。

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

运行 `node index.mjs`。

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
pnpm add @dingdayu/vue-copilotkit
```

统一包同时包含 Provider/hooks 与聊天 UI 组件。

```diff
// app.vue
<script lang="ts" setup>
import { computed } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

+import { CopilotKit } from '@dingdayu/vue-copilotkit';
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
+      runtime-url="http://localhost:4000/copilotkit"
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

+import { CopilotPopup } from '@dingdayu/vue-copilotkit';
</script>

<template>
  <div>
    <Page>
+      <CopilotPopup />
    </Page>
  </div>
</template>
```

如果你是从 `@dingdayu/vue-copilotkit` 根入口导入组件，则**无需**额外手动导入 CSS，因为包入口已自动引入 `style.css`。只有在仅使用子路径导入时，才需要手动引入 `@dingdayu/vue-copilotkit/style.css`。

**Popup 效果:**

![Copilot Popup](./popup.png)

## 与上游版本的差异

1.  为 NPM 仓库发布重命名了包名
    - `@copilotkit/vue-core` → `@dingdayu/vue-copilotkit-core`
    - `@copilotkit/vue-ui` → `@dingdayu/vue-copilotkit-ui`
2.  将 CopilotKit runtime/client 相关包升级到 `1.53.0`（兼容 v2 协议）
3.  修复了 `Window` 组件导致的构建错误
4.  移除了原共享 `vite-config` 包，并将所需 Vite 配置内联到各个包中，以解决 `injection "Symbol()" not found` 问题
5.  将 chat 与 textarea 的请求链路迁移到 v2 single-route 协议（`method: agent/run`）
6.  修复了与 `view.docView.domFromPos` 相关的问题
7.  在 `package.json` 中添加了仓库信息
8.  原独立 `vue-textarea` 包已并入 `@dingdayu/vue-copilotkit-ui`（统一从 UI 包导入）
9.  重做了示例应用：加入双语导航、共享运行时配置和更完整的场景页面

## 文档说明

- 对外改动请同步更新 `README.md` 与 `README.zh.md`。
- 包级使用说明见 `packages/vue-core/README.md` 与 `packages/vue-ui/README.md`。
- 示例应用的运行方式、路由和配置入口见 `examples/README.md`。

## 迁移提示

- 如果你之前依赖独立的 textarea 包，请改为从 `@dingdayu/vue-copilotkit-ui` 导入 `CopilotTextarea`。
- 聊天与 textarea 的共享样式仍统一从 `@dingdayu/vue-copilotkit-ui/style.css` 引入。
- 如果你之前依赖已移除的共享 Vite 配置包，请将需要的构建配置复制到你自己的包内配置中。

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
