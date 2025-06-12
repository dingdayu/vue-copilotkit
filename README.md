# Vue Copilotkit

*This project is forked from https://github.com/fe-51shebao/vue-copilotkit*

> A Vue implementation based on the React UI library of <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a>

Both `@dingdayu/vue-copilotkit-core` and `@dingdayu/vue-copilotkit-ui` have been published to the NPM registry and can be added to your project using:

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

## Example 例子

安装依赖

```bash
pnpm add @dingdayu/vue-copilotkit-core @dingdayu/vue-copilotkit-ui
```

### Server

```ts
import { createServer } from 'node:http';
import {
    CopilotRuntime,
    OpenAIAdapter,
    copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "sk-xxx", // 或从环境变量读取密钥 process.env["OPENAI_API_KEY"]
    baseURL: "https://api.deepseek.com", // 可选: 相关平台的 baseURL， 百炼: https://dashscope.aliyuncs.com/compatible-mode/v1
});

// 在测试中发现，在 CopilotKit 1.8.14 中使用的是 this.openai.beta.chat.completions.stream 
// 实际使用时会报错，需要赋值一下
openai.beta = openai;

// 注意此处的 model 设置，千问: qwen-max-latest
const serviceAdapter = new OpenAIAdapter({ openai, model: "deepseek-chat", keepSystemRole: true, });

const server = createServer((req, res) => {
    const runtime = new CopilotRuntime({
        // 这里是远程 Agent 使用，如果一定要在其他语言中实现可以参考 CopilotKit 中的 sdk-python
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

### Client

```vue
// app.vue
<script lang="ts" setup>
import { computed } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

import { CopilotKit } from '@dingdayu/vue-copilotkit-core';
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
    <CopilotKit
      runtime-url="http://10.0.7.105:4000/copilotkit"
      show-dev-console
    >
      <App>
        <RouterView />
      </App>
    </CopilotKit>
  </ConfigProvider>
</template>
```

页面中使用，这里使用的是 CopilotPopup，也可以考虑 CopilotChat/CopilotSidebar。
文档: https://docs.copilotkit.ai/reference/components/chat/CopilotChat

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { CopilotPopup } from '@dingdayu/vue-copilotkit-ui';

// CSS 可以考虑全局引入，如果有必要的话
import '@dingdayu/vue-copilotkit-ui/style.css';
</script>

<template>
  <div>
    <Page>
      <CopilotPopup />
    </Page>
  </div>
</template>

```

## Changes from Upstream

1. Renamed packages for NPM registry publication

    "@copilotkit/vue-core" > "@dingdayu/vue-copilotkit-core"
    "@copilotkit/vue-ui" > "@dingdayu/vue-copilotkit-ui"

2. Upgraded @copilotkit/shared and related packages to `1.8.14`
3. Fixed `Window` for build errors
4. Updated `vite.config.ts` to resolve `injection "Symbol()" not found` issue caused by vite inlining
5. Fixed `asStream` not found issue caused by incorrect `CopilotRuntimeClient` usage
6. Fixed `view.docView.domFromPos` related issues
7. Added repository information to `package.json`
