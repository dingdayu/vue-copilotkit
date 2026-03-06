# @dingdayu/vue-copilotkit-ui

Prebuilt Vue CopilotKit UI components and textarea exports.

## Install

```bash
pnpm add @dingdayu/vue-copilotkit-ui
```

## Exports

- Chat UI: `CopilotChat`, `CopilotPopup`, `CopilotSidebar`
- View primitives: `CopilotChatInput`, `CopilotChatView`
- Suggestions hook: `useCopilotChatSuggestions`
- Textarea UI: `CopilotTextarea`

## Basic usage

```ts
import { CopilotPopup, CopilotTextarea } from '@dingdayu/vue-copilotkit-ui'
import '@dingdayu/vue-copilotkit-ui/style.css'
```

## Notes

- The former standalone `@dingdayu/vue-textarea` package now lives inside this package.
- Use this package together with `@dingdayu/vue-copilotkit-core` for provider setup and runtime hooks.
