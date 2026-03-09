# @dingdayu/vue-copilotkit-core

Core runtime integration for Vue CopilotKit.

## Install

```bash
pnpm add @dingdayu/vue-copilotkit-core
```

## Exports

- `CopilotKit`
- `useCopilotAction`
- `useCopilotReadable`
- `useCopilotChat`
- `useAgent`
- `useAgentContext`
- `useConfigureSuggestions`
- `useHumanInTheLoop`

## Basic usage

```ts
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@dingdayu/vue-copilotkit-core'
```

Wrap your app with `CopilotKit`, then expose state and actions through the hooks.

## Notes

- Pair this package with `@dingdayu/vue-copilotkit-ui` when you want prebuilt chat or popup UI.
- This repository targets the CopilotKit v2 single-route runtime protocol.
