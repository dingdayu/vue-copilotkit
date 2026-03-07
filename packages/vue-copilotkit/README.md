# @dingdayu/vue-copilotkit

A Vue implementation based on the React UI library of <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a>.

## Install

```bash
pnpm add @dingdayu/vue-copilotkit
```

## Quick usage

```ts
import { CopilotKit, CopilotPopup } from '@dingdayu/vue-copilotkit'
```

Wrap your app with `CopilotKit`, then render components like `CopilotPopup`, `CopilotChat`, `CopilotSidebar`, or `CopilotTextarea` where needed.

## Styles

- If you import from the package root (`@dingdayu/vue-copilotkit`), styles are already loaded by the entry (`src/index.ts` imports `./style.css`).
- If you only use subpath imports, manually add:

```ts
import '@dingdayu/vue-copilotkit/style.css'
```

## Exports

- Root exports (recommended): `CopilotKit`, `CopilotChat`, `CopilotPopup`, `CopilotSidebar`, `CopilotTextarea`, and common `useXxx` composables.
- Subpath exports:
  - `@dingdayu/vue-copilotkit/components`
  - `@dingdayu/vue-copilotkit/composables`
  - `@dingdayu/vue-copilotkit/types`
  - `@dingdayu/vue-copilotkit/style.css`

## Notes

- This repository targets the CopilotKit v2 single-route runtime protocol.
