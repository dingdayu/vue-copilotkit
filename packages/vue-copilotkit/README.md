# @dingdayu/vue-copilotkit

Unified Vue CopilotKit package that includes both runtime hooks and UI components.

## Install

```bash
pnpm add @dingdayu/vue-copilotkit
```

## Exports

- Root exports (recommended): `CopilotKit`, `CopilotChat`, `CopilotPopup`, `CopilotSidebar`, `CopilotTextarea`, and common `useXxx` composables.
- Optional subpaths:
  - `@dingdayu/vue-copilotkit/components`
  - `@dingdayu/vue-copilotkit/composables`
  - `@dingdayu/vue-copilotkit/types`
  - `@dingdayu/vue-copilotkit/style.css`

## Basic usage

```ts
import { CopilotKit, CopilotPopup } from '@dingdayu/vue-copilotkit'
import '@dingdayu/vue-copilotkit/style.css'
```

Wrap your app with `CopilotKit`, then use either core hooks or prebuilt UI components.

## Notes

- This repository targets the CopilotKit v2 single-route runtime protocol.
